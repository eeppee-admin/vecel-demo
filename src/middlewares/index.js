import session from 'express-session';
import passport from 'passport';
import morgan from 'morgan';
import helmet from 'helmet';

export const applyMiddlewares = (app) => {
  // 安全中间件
  app.use(helmet());
  
  // 会话管理
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));
  
  // 认证系统
  app.use(passport.initialize());
  app.use(passport.session());
  
  // 日志记录
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(':method :url :status - :response-time ms'));
  }
  
  // 请求解析
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};