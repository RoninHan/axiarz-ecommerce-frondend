import { useEffect, useState } from 'react';
import { DataTable, ColumnConfig, DataItem } from '../components/DataTable';
import { productApi } from '../api/services';

const columns: ColumnConfig[] = [
  {
    field: 'name', label: '名称', required: true, filterable: true,
    filterType: 'text',
  },
  {
    field: 'description', label: '描述', required: true, filterable: false,
    filterType: 'text',
  },
  {
    field: 'product_type_id', label: '顯示在首頁的產品類型', required: true, filterable: true,type: 'select',
    options: [],
    filterType: 'select',hidden: true, 
  },
  {
    field: 'image_url',
    label: '图片',
    type: 'upload',
    required: false,
    filterable: false,
    filterType: 'text',
    hidden: true, // 新增 hidden 字段，控制是否在表格中显示
    render: (value: any, row: DataItem) => {
      const api = import.meta.env.VITE_API_BASE_URL;
      // console.log(value);
      return (
        <div className='w-20'>
          {value ? (
            <img src={typeof value === 'string' ? api + value : api + URL.createObjectURL(value)} alt="商品图片" style={{ width: 120, objectFit: 'cover', borderRadius: 4 }} />
          ) : null}
        </div>
      );
    }
  },
];

export const HomeProductManagement = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 分页处理
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  useEffect(() => {
    getCategories();
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
    const { data } = await productApi.getHomeProducts()
    setData(data);
    setLoading(false);
  };

  const handleAdd = async (item: Partial<DataItem>) => {
    console.log('添加商品:', item);
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

  const getCategories = async () => {
    const { data } = await productApi.getCategories();
    columns.forEach(col => {
      if (col.field === 'product_type_id') {
        col.options = data.rows.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
      }
    });
  };

  return (
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
  );
} 