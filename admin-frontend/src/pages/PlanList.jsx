import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, message, Spin, Button, Descriptions, Space, Form, Input, Select, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { getPlans } from '../api';

const PlanList = () => {
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [viewMode, setViewMode] = useState(null); // 'view' or 'edit'

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await getPlans();
            if (res.data.success) {
                setPlans(res.data.data);
            }
        } catch (error) {
            message.error('获取方案列表失败');
        } finally {
            setLoading(false);
        }
    };

    const handleExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.id]);
            setViewMode('view');
        } else {
            setExpandedRowKeys([]);
            setViewMode(null);
        }
    };

    const handleApprove = (record) => {
        message.success(`方案「${record.plan_name}」已通过`);
        // TODO: 调用后端API
    };

    const handleReject = (record) => {
        message.warning(`方案「${record.plan_name}」已驳回`);
        // TODO: 调用后端API
    };

    const statusMap = {
        pending: { color: 'orange', text: '待审核' },
        approved: { color: 'green', text: '已通过' },
        rejected: { color: 'red', text: '已驳回' },
        published: { color: 'blue', text: '已发布' }
    };

    const renderDetailView = (record) => {
        const isView = viewMode === 'view';
        
        // 解析 AI 输出
        let aiOutput = {};
        try {
            aiOutput = JSON.parse(record.ai_output || '{}');
        } catch (e) {
            aiOutput = { content: record.ai_output };
        }

        return (
            <div>
                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                    <Space>
                        {record.status === 'pending' && (
                            <>
                                <Button 
                                    type="primary" 
                                    icon={<CheckOutlined />} 
                                    onClick={() => handleApprove(record)}
                                >
                                    审核通过
                                </Button>
                                <Button 
                                    danger 
                                    icon={<CloseOutlined />} 
                                    onClick={() => handleReject(record)}
                                >
                                    驳回
                                </Button>
                            </>
                        )}
                        {record.status === 'approved' && <Tag color="green">已通过，等待农场主发布</Tag>}
                        {record.status === 'rejected' && <Tag color="red">已驳回，需重新生成</Tag>}
                        {record.status === 'published' && <Tag color="blue">已发布到C端</Tag>}
                    </Space>
                </div>
                
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="方案名称" span={1}>{record.plan_name}</Descriptions.Item>
                    <Descriptions.Item label="所属农场">{record.farm_name}</Descriptions.Item>
                    <Descriptions.Item label="方案天数">{record.days} 天</Descriptions.Item>
                    <Descriptions.Item label="是否含餐">{record.has_meal ? '是' : '否'}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{new Date(record.created_at).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Token消耗">{record.token_usage || '-'}</Descriptions.Item>
                </Descriptions>

                <Card title="AI 生成的活动方案" size="small" style={{ marginTop: 16 }}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {aiOutput.theme && <div><strong>主题：</strong>{aiOutput.theme}</div>}
                        {aiOutput.activities && (
                            <div style={{ marginTop: 12 }}>
                                <strong>活动环节：</strong>
                                <ul>
                                    {aiOutput.activities.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {!aiOutput.theme && !aiOutput.activities && (
                            <div style={{ color: '#999' }}>{record.ai_output || '暂无详细内容'}</div>
                        )}
                    </div>
                </Card>

                {record.cost_estimate && (
                    <Card title="成本估算（内部参考）" size="small" style={{ marginTop: 16 }}>
                        <pre style={{ margin: 0, fontSize: 12, background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                            {record.cost_estimate}
                        </pre>
                    </Card>
                )}

                {record.user_input && (
                    <Card title="农场主原始需求" size="small" style={{ marginTop: 16 }}>
                        <div style={{ color: '#666', fontStyle: 'italic' }}>"{record.user_input}"</div>
                    </Card>
                )}
            </div>
        );
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: '方案名称', dataIndex: 'plan_name', key: 'plan_name' },
        { title: '所属农场', dataIndex: 'farm_name', key: 'farm_name' },
        { title: '天数', dataIndex: 'days', key: 'days', width: 60 },
        { title: '含餐', dataIndex: 'has_meal', key: 'has_meal', width: 60, render: (v) => v ? '是' : '否' },
        { 
            title: '状态', 
            dataIndex: 'status', 
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={statusMap[status]?.color || 'default'}>
                    {statusMap[status]?.text || status}
                </Tag>
            )
        },
        { title: '创建时间', dataIndex: 'created_at', key: 'created_at', width: 160, render: (v) => new Date(v).toLocaleString() },
    ];

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;

    return (
        <div style={{ height: '100%', background: '#fff', padding: 24 }}>
            <Card title="方案审核" bordered={false} style={{ height: '100%' }}>
                <Table
                    columns={columns}
                    dataSource={plans}
                    rowKey="id"
                    expandable={{
                        expandedRowKeys: expandedRowKeys,
                        onExpand: handleExpand,
                        expandedRowRender: renderDetailView,
                        rowExpandable: () => true,
                    }}
                />
            </Card>
        </div>
    );
};

export default PlanList;