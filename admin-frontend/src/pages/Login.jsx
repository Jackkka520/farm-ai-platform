import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        
        // 模拟登录验证
        if (values.username === 'admin' && values.password === 'admin123') {
            localStorage.setItem('admin_token', 'mock_token_' + Date.now());
            localStorage.setItem('admin_user', JSON.stringify({
                username: 'admin',
                real_name: '系统管理员',
                role: 'admin'
            }));
            message.success('登录成功');
            navigate('/dashboard', { replace: true });
        } else {
            message.error('用户名或密码错误');
        }
        setLoading(false);
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            background: '#f0f2f5'
        }}>
            <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Title level={2}>🚜 农场AI平台</Title>
                    <Title level={5} style={{ color: '#888', marginTop: 8 }}>运营后台登录</Title>
                </div>
                <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
                    <Form.Item 
                        name="username" 
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item 
                        name="password" 
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;