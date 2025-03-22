import { Server } from 'socket.io';
import { verifyToken } from './auth';
import { trace } from '@opentelemetry/api';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
    transports: ['websocket'],
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// 分布式会话管理
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

io.on('connection', (socket) => {
    // 实时消息广播
    socket.on('notification', (data) => {
        socket.broadcast.emit('update', data);
    });

    // 连接状态监控
    socket.on('heartbeat', () => {
        socket.emit('ack', Date.now());
    });
});

// 在原有代码基础上增强
import { Server } from 'socket.io';
import { verifyToken } from './auth';
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('websocket-tracer');

// 添加接口路由功能
io.of('/api/ws').use(async (socket, next) => {
    try {
        // JWT 认证
        const decoded = await verifyToken(socket.handshake.auth.token);
        socket.user = decoded;
        next();
    } catch (e) {
        next(new Error('认证失败'));
    }
}).on('connection', (socket) => {
    // 分布式追踪
    const span = tracer.startSpan('websocket-connection');

    // 接口式请求处理
    socket.on('request', async (payload, callback) => {
        const { method, path, data } = payload;
        const childSpan = tracer.startSpan('ws-request', {
            attributes: { method, path }
        });

        try {
            // 路由分发
            const result = await handleRequest(method, path, data, socket.user);
            callback({ code: 200, data: result });
            childSpan.setStatus({ code: SpanStatusCode.OK });
        } catch (e) {
            callback({ code: e.code || 500, message: e.message });
            childSpan.recordException(e);
            childSpan.setStatus({ code: SpanStatusCode.ERROR });
        } finally {
            childSpan.end();
        }
    });

    // 心跳监控增强
    socket.on('heartbeat', () => {
        socket.emit('ack', {
            timestamp: Date.now(),
            latency: Date.now() - socket.handshake.time
        });
    });

    socket.on('disconnect', () => {
        span.end();
    });
});

// 请求处理器映射
const routers = {
    '/users': {
        GET: async (data, user) => {
            if (!user.isAdmin) throw new Error('权限不足');
            return User.find({});
        },
        POST: async (data) => {
            return User.create(data);
        }
    }
};

async function handleRequest(method, path, data, user) {
    const [basePath] = path.split('/');
    const handler = routers[basePath]?.[method];
    if (!handler) throw new Error('无效的接口路径');
    return handler(data, user);
}

httpServer.listen(3001);