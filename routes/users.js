import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

import jwt from 'jsonwebtoken';
import User from '../models/user.js';



// 用户注册
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // 验证用户名是否存在
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(409).json({ code: 409, message: '用户名已存在' });
        }

        const userId = await User.create({ username, password, email });

        res.status(201).json({
            code: 201,
            data: { id: userId },
            message: '注册成功'
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: '注册失败',
            error: error.message
        });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsername(username);

        if (!user || !(await User.verify(password, user.password_hash))) {
            return res.status(401).json({
                code: 401,
                message: '无效的用户名或密码'
            });
        }

        // 生成JWT令牌
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.is_admin
            },
            process.env.JWT_SECRET || "0dcee6920b6ecbf86fe2fde406ffc2dd47ff024419f9654995b8b251cbbf4967",
            { expiresIn: '2h' }
        );

        res.json({
            code: 200,
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: '登录失败',
            error: error.message
        });
    }
});

// 获取用户列表
router.get('/', async (req, res) => {
    try {
        const users = await User.getAllUsers(); // 使用模型方法

        res.json({
            code: 200,
            data: users.map(u => ({
                id: u._id,
                username: u.username,
                email: u.email,
                created_at: u.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});

// 删除用户
router.delete('/:id', async (req, res) => {
    try {
        await User.deleteUser(req.params.id); // 使用模型方法
        res.json({ code: 200, message: '用户已删除' });
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message });
    }
});
export default router;