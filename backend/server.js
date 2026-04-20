const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// 中间件
app.use(cors({
    origin: '*'
}));
app.use(express.json());

// 导入路由
const adminRoutes = require('./routes/admin');

// 注册路由
app.use('/api/admin', adminRoutes);

// 测试路由
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '服务器运行正常' });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 后端服务已启动: http://localhost:${PORT}`);
    console.log(`📡 健康检查: http://localhost:${PORT}/api/health`);
});