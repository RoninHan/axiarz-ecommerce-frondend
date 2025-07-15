import { useEffect, useState } from "react";
import { ColumnConfig, DataTable } from "../components/DataTable";
import { productApi } from "../api/services";

const columns: ColumnConfig[] = [
    {
        field: 'name', label: '类型名称', required: true, filterable: true,
        filterType: 'text',
      },
      {
        field: 'name', label: '详细', required: true, filterable: true,
        filterType: 'text',
      }
]

export const CategoryManagement = () =>{

    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);


    const fetchData  = async () =>{
        setLoading(true);
        const {data} = await productApi.getCategories()
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

    return (
        <DataTable columns={columns} data={data} loading={loading} onAdd={handleAdd} />
    )
}