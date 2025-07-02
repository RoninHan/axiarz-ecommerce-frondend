import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  Snackbar, 
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Delete,
  Inventory,
  Category,
  AttachMoney,
  Star,
  LocalOffer
} from '@mui/icons-material';
import { DataTable, DataItem, ColumnConfig, FilterCondition } from '../components/DataTable';
import moment from 'moment';

// 模拟商品数据
const mockProducts: DataItem[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    category: '手机',
    price: 7999,
    stock: 50,
    status: true,
    image: '📱',
    brand: 'Apple',
    rating: 4.8,
    sales: 1200,
    createdAt: '2024-01-01',
    description: '最新款iPhone，搭载A17 Pro芯片'
  },
  {
    id: 2,
    name: 'MacBook Pro 14',
    category: '电脑',
    price: 14999,
    stock: 25,
    status: true,
    image: '💻',
    brand: 'Apple',
    rating: 4.9,
    sales: 800,
    createdAt: '2024-01-02',
    description: '专业级笔记本电脑'
  },
  {
    id: 3,
    name: 'AirPods Pro',
    category: '耳机',
    price: 1999,
    stock: 100,
    status: true,
    image: '🎧',
    brand: 'Apple',
    rating: 4.7,
    sales: 2500,
    createdAt: '2024-01-03',
    description: '主动降噪无线耳机'
  },
  {
    id: 4,
    name: 'iPad Air',
    category: '平板',
    price: 4399,
    stock: 30,
    status: false,
    image: '📱',
    brand: 'Apple',
    rating: 4.6,
    sales: 600,
    createdAt: '2024-01-04',
    description: '轻薄便携的平板电脑'
  }
];

// 列配置
const columns: ColumnConfig[] = [
  {
    field: 'image',
    label: '图片',
    width: 80,
    type: 'custom',
    editable: false,
    filterable: false,
    render: (value, row) => (
      <Avatar sx={{ bgcolor: row.status ? 'primary.main' : 'grey.500', fontSize: '1.5rem' }}>
        {value}
      </Avatar>
    )
  },
  {
    field: 'name',
    label: '商品名称',
    required: true,
    filterable: true,
    filterType: 'text',
    filterPlaceholder: '搜索商品名称',
    validation: (value) => {
      if (!value) return '商品名称不能为空';
      if (value.length < 2) return '商品名称至少2个字符';
      return null;
    }
  },
  {
    field: 'category',
    label: '分类',
    type: 'select',
    required: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { value: '手机', label: '手机' },
      { value: '电脑', label: '电脑' },
      { value: '耳机', label: '耳机' },
      { value: '平板', label: '平板' },
      { value: '配件', label: '配件' },
      { value: '其他', label: '其他' }
    ],
    options: [
      { value: '手机', label: '手机' },
      { value: '电脑', label: '电脑' },
      { value: '耳机', label: '耳机' },
      { value: '平板', label: '平板' },
      { value: '配件', label: '配件' },
      { value: '其他', label: '其他' }
    ]
  },
  {
    field: 'brand',
    label: '品牌',
    type: 'select',
    required: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { value: 'Apple', label: 'Apple' },
      { value: 'Samsung', label: 'Samsung' },
      { value: 'Huawei', label: 'Huawei' },
      { value: 'Xiaomi', label: 'Xiaomi' },
      { value: 'OPPO', label: 'OPPO' },
      { value: 'Vivo', label: 'Vivo' }
    ],
    options: [
      { value: 'Apple', label: 'Apple' },
      { value: 'Samsung', label: 'Samsung' },
      { value: 'Huawei', label: 'Huawei' },
      { value: 'Xiaomi', label: 'Xiaomi' },
      { value: 'OPPO', label: 'OPPO' },
      { value: 'Vivo', label: 'Vivo' }
    ]
  },
  {
    field: 'price',
    label: '价格',
    type: 'number',
    required: true,
    filterable: true,
    filterType: 'numberRange',
    validation: (value) => {
      if (!value) return '价格不能为空';
      if (value <= 0) return '价格必须大于0';
      return null;
    },
    render: (value) => (
      <Chip
        label={`¥${value.toLocaleString()}`}
        color="primary"
        size="small"
        icon={<AttachMoney />}
      />
    )
  },
  {
    field: 'stock',
    label: '库存',
    type: 'number',
    required: true,
    filterable: true,
    filterType: 'numberRange',
    validation: (value) => {
      if (!value) return '库存不能为空';
      if (value < 0) return '库存不能为负数';
      return null;
    },
    render: (value) => (
      <Chip
        label={value}
        color={value > 10 ? 'success' : value > 0 ? 'warning' : 'error'}
        size="small"
        variant="outlined"
      />
    )
  },
  {
    field: 'rating',
    label: '评分',
    type: 'number',
    editable: false,
    filterable: true,
    filterType: 'numberRange',
    render: (value) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Star sx={{ fontSize: 16, color: 'warning.main' }} />
        <Typography variant="body2">{value}</Typography>
      </Box>
    )
  },
  {
    field: 'sales',
    label: '销量',
    type: 'number',
    editable: false,
    filterable: true,
    filterType: 'numberRange',
    render: (value) => (
      <Chip
        label={value.toLocaleString()}
        size="small"
        variant="outlined"
        color="secondary"
      />
    )
  },
  {
    field: 'status',
    label: '状态',
    type: 'switch',
    editable: false,
    filterable: true,
    filterType: 'boolean',
    render: (value) => (
      <Chip
        label={value ? '上架' : '下架'}
        color={value ? 'success' : 'default'}
        size="small"
      />
    )
  },
  {
    field: 'createdAt',
    label: '创建时间',
    editable: false,
    filterable: true,
    filterType: 'dateRange',
    render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''
  }
];

export const ProductManagement: React.FC = () => {
  const [data, setData] = useState<DataItem[]>(mockProducts);
  const [filteredData, setFilteredData] = useState<DataItem[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [selectedProducts, setSelectedProducts] = useState<(string | number)[]>([]);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);

  // 处理筛选
  const handleFilter = (filters: FilterCondition[]) => {
    let result = [...data];
    
    filters.forEach(filter => {
      result = result.filter(item => {
        const value = item[filter.field];
        
        switch (filter.operator) {
          case 'equals':
            return value === filter.value;
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
          case 'greaterThan':
            return Number(value) > Number(filter.value);
          case 'lessThan':
            return Number(value) < Number(filter.value);
          case 'between':
            if (filter.value2 !== undefined) {
              return Number(value) >= Number(filter.value) && Number(value) <= Number(filter.value2);
            }
            return true;
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(value);
          case 'notIn':
            return Array.isArray(filter.value) && !filter.value.includes(value);
          case 'isNull':
            return value === null || value === undefined;
          case 'isNotNull':
            return value !== null && value !== undefined;
          default:
            return true;
        }
      });
    });
    
    setFilteredData(result);
  };

  // 模拟API调用
  const simulateApiCall = async (action: string, delay: number = 1000) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setLoading(false);
  };

  // 添加商品
  const handleAdd = async (productData: Partial<DataItem>) => {
    try {
      await simulateApiCall('添加商品');
      const newProduct = {
        ...productData,
        id: Date.now(),
        image: '📦',
        rating: 0,
        sales: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setData(prev => [...prev, newProduct]);
      setMessage('商品添加成功');
      setMessageType('success');
    } catch (error) {
      setMessage('商品添加失败');
      setMessageType('error');
    }
  };

  // 编辑商品
  const handleEdit = async (id: string | number, productData: Partial<DataItem>) => {
    try {
      await simulateApiCall('编辑商品');
      setData(prev => prev.map(product => 
        product.id === id ? { ...product, ...productData } : product
      ));
      setMessage('商品编辑成功');
      setMessageType('success');
    } catch (error) {
      setMessage('商品编辑失败');
      setMessageType('error');
    }
  };

  // 删除商品
  const handleDelete = async (id: string | number) => {
    try {
      await simulateApiCall('删除商品');
      setData(prev => prev.filter(product => product.id !== id));
      setMessage('商品删除成功');
      setMessageType('success');
    } catch (error) {
      setMessage('商品删除失败');
      setMessageType('error');
    }
  };

  // 批量删除商品
  const handleBulkDelete = async () => {
    try {
      await simulateApiCall('批量删除商品');
      setData(prev => prev.filter(product => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
      setBulkActionDialog(false);
      setMessage(`成功删除 ${selectedProducts.length} 个商品`);
      setMessageType('success');
    } catch (error) {
      setMessage('批量删除失败');
      setMessageType('error');
    }
  };

  // 刷新数据
  const handleRefresh = async () => {
    try {
      await simulateApiCall('刷新数据', 500);
      setMessage('数据刷新成功');
      setMessageType('success');
    } catch (error) {
      setMessage('数据刷新失败');
      setMessageType('error');
    }
  };

  // 分页处理
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
  };

  // 选择处理
  const handleSelectionChange = (selectedIds: (string | number)[]) => {
    setSelectedProducts(selectedIds);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            商品管理
          </Typography>
          <Typography variant="body1" color="textSecondary">
            管理系统商品，包括添加、编辑、删除和库存管理
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {selectedProducts.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setBulkActionDialog(true)}
              startIcon={<Delete />}
            >
              批量删除 ({selectedProducts.length})
            </Button>
          )}
        </Box>
      </Box>
      
      <DataTable
        title="商品列表"
        columns={columns}
        data={filteredData}
        loading={loading}
        total={filteredData.length}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        onFilter={handleFilter}
        formType="dialog"
        searchable={true}
        filterable={true}
        selectable={true}
        onSelectionChange={handleSelectionChange}
      />

      {/* 批量删除确认对话框 */}
      <Dialog open={bulkActionDialog} onClose={() => setBulkActionDialog(false)}>
        <DialogTitle>确认批量删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除选中的 {selectedProducts.length} 个商品吗？此操作不可撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>取消</Button>
          <Button onClick={handleBulkDelete} color="error" variant="contained">
            确认删除
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage('')}
      >
        <Alert 
          onClose={() => setMessage('')} 
          severity={messageType}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 