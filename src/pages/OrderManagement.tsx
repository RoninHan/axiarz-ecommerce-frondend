import React, { useEffect, useState } from "react";
import { ColumnConfig, DataItem, DataTable } from "../components/DataTable";
import { orderApi } from "../api/services";
import moment from "moment";

const columns: ColumnConfig[] = [
  { field: 'id', label: '订单ID' },
  { field: 'total_price', label: '总价' },
  { field: 'status', label: '状态',filterable: true },
  { field: 'payment_status', label: '支付状态',filterable: true },
  { field: 'shipping_status', label: '发货状态' },
  { field: 'billing_address', label: '账单地址' },
  { field: 'shipping_address', label: '收货地址' },
  { field: 'shipping_company', label: '快递公司' },
  { field: 'tracking_number', label: '快递单号' },
  { field: 'coupon_code', label: '优惠码' },
  { field: 'gift_card_code', label: '礼品卡码' },
  { field: 'discount', label: '折扣' },
  { field: 'notes', label: '备注' },
  { field: 'created_at', label: '创建时间', render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '',filterable: true },
  { field: 'updated_at', label: '更新时间', render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : '',filterable: true },
];

export const OrderManagement = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [posts_per_page, setPostsPerPage] = useState(10);

  // 示例：可对接真实API
  const fetchData = async () => {
    setLoading(true);
    const { data } = await orderApi.getOrders({
      page,
      posts_per_page
    });
    setData(data.rows);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      page={page}
      pageSize={posts_per_page}
      onPageChange={setPage}
      onPageSizeChange={setPostsPerPage}
    />
  );
};