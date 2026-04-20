import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, message } from 'antd';
import { DollarOutlined, ShoppingOutlined, ShopOutlined, RiseOutlined } from '@ant-design/icons';
import { getDashboardStats } from '../api';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_gmv: 0,
        total_orders: 0,
        active_farms: 0,
        monthly_orders: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await getDashboardStats();
            if (res.data && res.data.success) {
                setStats(res.data.data);
            } else {
                // 如果后端没返回数据，使用默认值
                setStats({
                    total_gmv: 0,
                    total_orders: 0,
                    active_farms: 0,
                    monthly_orders: 0
                });
            }
        } catch (error) {
            console.error('获取数据失败:', error);
            message.warning('后端未启动，使用模拟数据');
            // 使用模拟数据让页面能显示
            setStats({
                total_gmv: 12580,
                total_orders: 156,
                active_farms: 8,
                monthly_orders: 23
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;
    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总GMV"
                            value={stats.total_gmv}
                            precision={2}
                            prefix="¥"
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="总订单数"
                            value={stats.total_orders}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="活跃农场"
                            value={stats.active_farms}
                            prefix={<ShopOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="本月订单"
                            value={stats.monthly_orders}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
            <Card title="最近订单" style={{ marginTop: 16 }}>
                <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                    暂无订单数据
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;