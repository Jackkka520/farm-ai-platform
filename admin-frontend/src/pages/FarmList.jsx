import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, message, Spin, Button, Descriptions, Space, Input, Form, Select, Popconfirm } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { getFarms } from '../api';

const FarmList = () => {
    const [loading, setLoading] = useState(true);
    const [farms, setFarms] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [editingFarm, setEditingFarm] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchFarms();
    }, []);

    const fetchFarms = async () => {
        setLoading(true);
        try {
            const res = await getFarms();
            if (res.data.success) {
                setFarms(res.data.data);
            }
        } catch (error) {
            message.error('获取农场列表失败');
        } finally {
            setLoading(false);
        }
    };

    // 展开行
    const handleExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([record.id]);
        } else {
            setExpandedRowKeys([]);
            setEditingFarm(null);
            form.resetFields();
        }
    };

    // 编辑
    const handleEdit = (record) => {
        setEditingFarm(record.id);
        form.setFieldsValue({
            name: record.name,
            location: record.location,
            description: record.description,
            features: record.features,
            status: record.status,
        });
    };

    // 取消编辑
    const handleCancelEdit = () => {
        setEditingFarm(null);
        form.resetFields();
    };

    // 保存编辑
    const handleSaveEdit = async (record) => {
        try {
            const values = await form.validateFields();
            message.loading('保存中...', 0.5);
            // TODO: 调用后端API更新农场信息
            console.log('保存数据:', { id: record.id, ...values });
            
            // 模拟更新本地数据
            setFarms(prev => prev.map(farm => 
                farm.id === record.id ? { ...farm, ...values } : farm
            ));
            
            setEditingFarm(null);
            form.resetFields();
            message.success('保存成功');
        } catch (error) {
            message.error('请检查表单填写');
        }
    };

    // 查看详情（只读模式）
    const renderDetailView = (record) => {
        if (editingFarm === record.id) {
            return (
                <Form form={form} layout="vertical">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="name" label="农场名称" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="location" label="位置">
                            <Input />
                        </Form.Item>
                        <Form.Item name="features" label="特色标签">
                            <Input placeholder="用逗号分隔，如：采摘,亲子,露营" />
                        </Form.Item>
                        <Form.Item name="status" label="状态">
                            <Select>
                                <Select.Option value="pending">待审核</Select.Option>
                                <Select.Option value="active">已启用</Select.Option>
                                <Select.Option value="disabled">已禁用</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="description" label="农场介绍" style={{ gridColumn: '1 / -1' }}>
                            <Input.TextArea rows={3} />
                        </Form.Item>
                    </div>
                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                        <Space>
                            <Button onClick={handleCancelEdit} icon={<CloseOutlined />}>取消</Button>
                            <Button type="primary" onClick={() => handleSaveEdit(record)} icon={<SaveOutlined />}>保存</Button>
                        </Space>
                    </div>
                </Form>
            );
        }

        return (
            <Descriptions column={2} bordered size="small">
                <Descriptions.Item label="农场名称" span={1}>{record.name}</Descriptions.Item>
                <Descriptions.Item label="负责人">{record.owner_name}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{record.phone_number}</Descriptions.Item>
                <Descriptions.Item label="位置">{record.location || '-'}</Descriptions.Item>
                <Descriptions.Item label="特色标签" span={2}>
                    {record.features ? (
                        record.features.split(',').map(tag => (
                            <Tag key={tag} color="green" style={{ marginRight: 4 }}>{tag}</Tag>
                        ))
                    ) : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="农场介绍" span={2}>{record.description || '-'}</Descriptions.Item>
                <Descriptions.Item label="状态">
                    <Tag color={record.status === 'active' ? 'green' : record.status === 'pending' ? 'orange' : 'red'}>
                        {record.status === 'active' ? '已启用' : record.status === 'pending' ? '待审核' : '已禁用'}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">{new Date(record.created_at).toLocaleString()}</Descriptions.Item>
            </Descriptions>
        );
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: '农场名称', dataIndex: 'name', key: 'name' },
        { title: '负责人', dataIndex: 'owner_name', key: 'owner_name' },
        { title: '联系电话', dataIndex: 'phone_number', key: 'phone_number' },
        { title: '位置', dataIndex: 'location', key: 'location', ellipsis: true },
        { 
            title: '状态', 
            dataIndex: 'status', 
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
                    {status === 'active' ? '已启用' : status === 'pending' ? '待审核' : '已禁用'}
                </Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button 
                        type="link" 
                        size="small" 
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                </Space>
            )
        }
    ];

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}><Spin size="large" /></div>;

    return (
        <div style={{ height: '100%', background: '#fff', padding: 24 }}>
            <Card title="农场管理" bordered={false} style={{ height: '100%' }}>
                <Table
                    columns={columns}
                    dataSource={farms}
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

export default FarmList;