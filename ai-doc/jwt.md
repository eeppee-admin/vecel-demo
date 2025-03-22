

这个错误是因为JWT_SECRET环境变量未配置。需要在`.env`文件中添加密钥：

```plaintext:c:\Users\etcix\Desktop\backend-learn\nodejs-icon-gen\.env
JWT_SECRET=your_jwt_super_secret_key_here
```

然后在代码中使用该密钥生成令牌：

```javascript:c:\Users\etcix\Desktop\backend-learn\nodejs-icon-gen\routes\users.js
// 修改登录路由中的jwt.sign调用
const token = jwt.sign(
    {
        userId: user.id,
        isAdmin: user.is_admin
    },
    process.env.JWT_SECRET || 'fallback_secret_key', // 添加默认值
    { expiresIn: '2h' }
);
```

安全建议：
1. 使用强密钥（至少32位随机字符）
2. 生产环境不要使用默认值
3. 不要将密钥提交到git仓库

可以使用以下命令生成随机密钥：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

如果已配置.env文件但仍有问题，请确保文件在项目根目录，并重启服务：
```bash
yarn start
```