import React, { useEffect, useState } from "react";
import { ColumnConfig, DataItem, DataTable } from "../components/DataTable";
import { bannerApi } from "../api/services";

const columns: ColumnConfig[] = [
  { field: 'title', label: '标题', required: true,filterable: true, filterType: 'text' },
  { field: 'link', label: '链接', required: true,filterable: false },
  {
    field: 'image',
    label: '图片',
    type: 'upload',
    required: false,
    filterType: 'text',
    render: (value: any, row: DataItem) => {
      const api = import.meta.env.VITE_API_BASE_URL;
      console.log(value);
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

export const BannerManagement = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 示例：可对接真实API
  const fetchData = async () => {
    setLoading(true);
    const res = await bannerApi.getBanners();
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 新增/编辑时如需form-data，可在此处理
  const handleAdd = async (item: Partial<any>) => {
    setLoading(true);
    await bannerApi.createBanner(item);
    setLoading(false);
    fetchData();
  };

  const handleEdit = async (id: string | number, item: Partial<any>) => {
    setLoading(true);
    await bannerApi.updateBanner(id.toString(), item);
    setLoading(false);
    fetchData();
  };

  const handleDelete = async (id: string | number) => {
    setLoading(true);
    await bannerApi.deleteBanner(id.toString());
    setLoading(false);
    fetchData();
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};