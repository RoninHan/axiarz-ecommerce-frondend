import React, { useRef, useState } from 'react';
import { Box, Button, Avatar, TextField, Typography } from '@mui/material';
import { DataTable, ColumnConfig, DataItem } from '../components/DataTable';
import { productApi } from '../api/services';

const columns: ColumnConfig[] = [
  { field: 'name', label: '名称', required: true },
  { field: 'category_id', label: '分类ID', type: 'number', required: true },
  { field: 'status', label: '状态', type: 'boolean', required: true },
  { field: 'description', label: '描述', type: 'text', required: true },
  { field: 'stock_quantity', label: '库存', type: 'number', required: true },
  { field: 'price', label: '价格', type: 'number', required: true },
  {
    field: 'image',
    label: '图片',
    type: 'custom',
    required: false,
    render: (value) => value ? (
      <Avatar src={typeof value === 'string' ? value : URL.createObjectURL(value)} variant="rounded" sx={{ width: 56, height: 56 }} />
    ) : null,
    formRender: (value, onChange) => (
      <Box>
        <Button variant="outlined" component="label">
          上传图片
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                onChange(e.target.files[0]);
              }
            }}
          />
        </Button>
        {value && (
          <Avatar src={typeof value === 'string' ? value : URL.createObjectURL(value)} variant="rounded" sx={{ width: 56, height: 56, ml: 2 }} />
        )}
      </Box>
    )
  },
  { field: 'sku', label: 'SKU', required: true },
  { field: 'type_name', label: '型号', required: true },
  { field: 'brand', label: '品牌', required: true },
  { field: 'product_details', label: '详情', type: 'text', required: false, formRender: (value, onChange) => (
    <TextField fullWidth multiline minRows={3} value={value || ''} onChange={e => onChange(e.target.value)} label="详情" />
  ) },
  { field: 'product_information', label: '信息', type: 'text', required: false, formRender: (value, onChange) => (
    <TextField fullWidth multiline minRows={3} value={value || ''} onChange={e => onChange(e.target.value)} label="信息" />
  ) },
  { field: 'configuration_list', label: '配置', type: 'text', required: false, formRender: (value, onChange) => (
    <TextField fullWidth multiline minRows={3} value={value || ''} onChange={e => onChange(e.target.value)} label="配置" />
  ) },
  { field: 'wass', label: '备注', type: 'text', required: false },
  { field: 'is_new', label: '是否新品', type: 'boolean', required: false },
];

export default function ProductCRUD() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 示例：可用productApi.getProducts等真实接口
  const fetchData = async () => {
    setLoading(true);
    // const res = await productApi.getProducts();
    // setData(res.data);
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>产品管理</Typography>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        formType="dialog"
        onAdd={async (item) => setData(prev => [...prev, { ...item, id: Date.now() }])}
        onEdit={async (id, item) => setData(prev => prev.map(row => row.id === id ? { ...row, ...item } : row))}
        onDelete={async (id) => setData(prev => prev.filter(row => row.id !== id))}
      />
    </Box>
  );
} 