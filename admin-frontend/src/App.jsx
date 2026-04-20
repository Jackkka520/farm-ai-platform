import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FarmList from './pages/FarmList';
import PlanList from './pages/PlanList';

// 检查是否已登录
const isAuthenticated = () => {
    return localStorage.getItem('admin_token') !== null;
};

// 路由守卫：未登录跳转登录页
const PrivateRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// 登录后访问登录页自动跳转仪表盘
const PublicRoute = ({ children }) => {
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    
                    <Route path="/" element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="farms" element={<FarmList />} />
                        <Route path="plans" element={<PlanList />} />
                        <Route path="orders" element={<div style={{ padding: 24 }}>订单管理（开发中）</div>} />
                        <Route path="quote" element={<div style={{ padding: 24 }}>报价工具（开发中）</div>} />
                        <Route path="templates" element={<div style={{ padding: 24 }}>模板管理（开发中）</div>} />
                        <Route path="staff" element={<div style={{ padding: 24 }}>员工管理（开发中）</div>} />
                    </Route>
                    
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;