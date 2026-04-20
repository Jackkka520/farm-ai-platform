import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Typography } from 'antd';
import {
    DashboardOutlined,
    ShopOutlined,
    FileSearchOutlined,
    OrderedListOutlined,
    CalculatorOutlined,
    AppstoreOutlined,
    UserOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
        { key: '/farms', icon: <ShopOutlined />, label: '农场管理' },
        { key: '/plans', icon: <FileSearchOutlined />, label: '方案审核' },
        { key: '/orders', icon: <OrderedListOutlined />, label: '订单管理' },
        { key: '/quote', icon: <CalculatorOutlined />, label: '报价工具' },
        { key: '/templates', icon: <AppstoreOutlined />, label: '模板管理' },
        { key: '/staff', icon: <UserOutlined />, label: '员工管理' },
    ];

    const userMenuItems = [
        { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' },
    ];

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            navigate('/login');
        } else {
            navigate(key);
        }
    };

    const handleUserMenuClick = ({ key }) => {
        if (key === 'logout') {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            navigate('/login');
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="dark" collapsible>
                <div style={{ height: 64, margin: 16, color: '#fff', textAlign: 'center' }}>
                    <Title level={4} style={{ color: '#fff', margin: 0 }}>🚜 农场AI平台</Title>
                    <div style={{ fontSize: 12, color: '#aaa' }}>运营后台</div>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>欢迎回来，管理员</div>
                    <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
                        <Avatar style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}>管</Avatar>
                    </Dropdown>
                </Header>
                <Content style={{ 
                    background: '#f0f2f5', 
                    margin: 0,           // 移除 margin
                    padding: 0,          // 移除 padding，让子组件自己控制
                    minHeight: 280,
                    overflow: 'auto'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;