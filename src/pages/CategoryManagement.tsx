import { useEffect, useState } from "react";
import { ColumnConfig, DataTable } from "../components/DataTable";
import { productApi } from "../api/services";

const columns: ColumnConfig[] = [
    {
        field: 'name', label: '类型名称', required: true, filterable: true,
        filterType: 'text',
      },
      {
        field: 'description', label: '详细', required: true, filterable: false,
        filterType: 'text',
      }
]

export const CategoryManagement = () =>{

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    const fetchData  = async () =>{
        setLoading(true);
        const {data} = await productApi.getCategories({
            page: page,
            posts_per_page: pageSize,
        })
        setData(data.rows);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (data: Partial<any>): Promise<void> => {
        // Implement add logic here, e.g., call an API to add a category
        // await productApi.addCategory(data);
        // Optionally refetch data after adding
        // await fetchData();
        await productApi.createCategory(data);
        fetchData();
    }

    const handleDelete = async (id: string | number): Promise<void> => {
        await productApi.deleteCategory(id.toString());
        fetchData();
    }

    const handleEdit = async (id: string | number, data: Partial<any>): Promise<void> => {
        await productApi.updateCategory(id.toString(), data);
        fetchData();
    }

    return (
        <DataTable columns={columns} data={data} loading={loading} onAdd={handleAdd} onDelete={handleDelete} onEdit={handleEdit} onPageChange={setPage} onPageSizeChange={setPageSize} page={page} pageSize={pageSize} />
    )
}