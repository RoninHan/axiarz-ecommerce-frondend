import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Avatar, TextField, Typography } from '@mui/material';
import { DataTable, ColumnConfig, DataItem } from '../components/DataTable';
import { productApi } from '../api/services';

const columns: ColumnConfig[] = [
  {
    field: 'name', label: '名称', required: true, filterable: true,
    filterType: 'text',
  },
  {
    field: 'category_id', label: '分类ID', type: 'number', required: true, filterable: true,
    filterType: 'text',
  },
  {
    field: 'status', label: '状态', type: 'boolean', required: true, filterable: true,
    filterType: 'boolean',
  },
  {
    field: 'description', label: '描述', type: 'text', required: true, filterable: true,
    filterType: 'text',
  },
  {
    field: 'stock_quantity', label: '库存', type: 'number', required: true, filterable: true,
    filterType: 'text',
  },
  {
    field: 'price', label: '价格', type: 'number', required: true, filterable: true,
    filterType: 'text',
  },
  {
    field: 'image',
    label: '图片',
    type: 'custom',
    required: false,
    filterable: true,
    filterType: 'text',
    render: (value) => value ? (
      <Avatar src={typeof value === 'string' ? value : URL.createObjectURL(value)} variant="rounded" sx={{ width: 56, height: 56 }} />
    ) : null
  },
  {
    field: 'sku', label: 'SKU', required: true, filterable: true,
    filterType: 'text',
  },
  {
    field: 'type_name', label: '型号', required: true, filterable: true,
    filterType: 'text',
  },
  {
    field: 'brand', label: '品牌', required: true, filterable: true,
    filterType: 'text',
  },
  {
    field: 'product_details', label: '详情', type: 'text', required: false, filterable: true,
    filterType: 'text',
  },
  {
    field: 'product_information', label: '信息', type: 'text', required: false, filterable: true,
    filterType: 'text',
  },
  {
    field: 'configuration_list', label: '配置', type: 'text', required: false, filterable: true,
    filterType: 'text',
  },
  {
    field: 'wass', label: '备注', type: 'text', required: false, filterable: true,
    filterType: 'text',
  },
  {
    field: 'is_new', label: '是否新品', type: 'boolean', required: false, filterable: true,
    filterType: 'boolean',
  },
];

export const ProductManagement = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 分页处理
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // 初始化数据
    fetchData();
  }, []);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  // 示例：可用productApi.getProducts等真实接口
  const fetchData = async () => {
    setLoading(true);
    const { data } = await productApi.getProducts({
      page: page,
      posts_per_page: pageSize,
    });

    setData(data.rows);
    setLoading(false);
  };

  const handleAdd = async (item: Partial<DataItem>) => {
    setLoading(true);
    await productApi.createProduct(item);
    setLoading(false);
    fetchData();
  };

  const handleEdit = async (id: string | number, data: Partial<DataItem>) => {
    setLoading(true);
    await productApi.updateProduct(String(id), data);
    setLoading(false);
    fetchData();
  };

  const handleDelete = async (id: string | number) => {
    setLoading(true);
    await productApi.deleteProduct(String(id));
    setLoading(false);
    fetchData();
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleFilter = (filter: any) => {
    console.log(filter);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>产品管理</Typography>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        pageSize={pageSize}
        formType="drawer"
        searchable={true}
        filterable={true}
        selectable={true}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={handleRefresh}
        onFilter={handleFilter}
      />
    </Box>
  );
} 