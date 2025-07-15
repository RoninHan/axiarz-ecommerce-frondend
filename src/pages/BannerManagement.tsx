import React, { useEffect, useState } from "react";
import { ColumnConfig, DataTable } from "../components/DataTable";

const columns: ColumnConfig[] = [
  {
    field: 'image',
    label: '图片',
    type: 'custom',
    required: true,
    render: (value) =>
      value ? (
        <img src={typeof value === 'string' ? value : URL.createObjectURL(value)} alt="banner" style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 4 }} />
      ) : null,
    formRender: (value, onChange) => (
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            if (e.target.files && e.target.files[0]) {
              onChange(e.target.files[0]);
            }
          }}
        />
        {value && (
          <img src={typeof value === 'string' ? value : URL.createObjectURL(value)} alt="预览" style={{ width: 80, height: 40, marginTop: 8, borderRadius: 4 }} />
        )}
      </div>
    )
  },
  { field: 'title', label: '标题', required: true },
  { field: 'link', label: '链接', required: true }
];

export const BannerManagement = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 示例：可对接真实API
  const fetchData = async () => {
    setLoading(true);
    // const res = await bannerApi.getBanners();
    // setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 新增/编辑时如需form-data，可在此处理
  const handleAdd = async (item: Partial<any>) => {
    // const formData = new FormData();
    // Object.entries(item).forEach(([k, v]) => formData.append(k, v));
    // await bannerApi.createBanner(formData);
    setData(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const handleEdit = async (id: string | number, item: Partial<any>) => {
    setData(prev => prev.map(row => row.id === id ? { ...row, ...item } : row));
  };

  const handleDelete = async (id: string | number) => {
    setData(prev => prev.filter(row => row.id !== id));
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