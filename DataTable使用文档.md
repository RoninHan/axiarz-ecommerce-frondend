# DataTable 组件使用文档

## 简介

`DataTable` 是一个基于 MUI、TailwindCSS 封装的通用表格组件，支持分页、增删改查、弹窗/抽屉表单、多字段类型、表单校验、多条件筛选等后台常用功能。适用于用户管理、商品管理等多种业务场景。

---

## 基本用法

### 1. 引入组件

```tsx
import DataTable from '@/components/DataTable';
```

### 2. 基本配置

```tsx
<DataTable
  columns={[
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: '用户名', width: 120, type: 'string' },
    { field: 'role', headerName: '角色', width: 100, type: 'select', options: ['管理员', '用户'] },
    { field: 'createdAt', headerName: '注册时间', width: 180, type: 'date' },
    { field: 'active', headerName: '状态', width: 80, type: 'boolean' },
  ]}
  fetchData={fetchUserList} // (params) => Promise<{ data, total }>
  onAdd={handleAdd}
  onEdit={handleEdit}
  onDelete={handleDelete}
  formFields={[
    { name: 'name', label: '用户名', type: 'string', required: true },
    { name: 'role', label: '角色', type: 'select', options: ['管理员', '用户'], required: true },
    { name: 'active', label: '状态', type: 'boolean' },
  ]}
  filterFields={[
    { name: 'name', label: '用户名', type: 'string' },
    { name: 'role', label: '角色', type: 'select', options: ['管理员', '用户'] },
    { name: 'createdAt', label: '注册时间', type: 'date' },
    { name: 'active', label: '状态', type: 'boolean' },
  ]}
/>
```

---

## 属性说明

| 属性名         | 类型                | 说明                                                         |
| -------------- | ------------------- | ------------------------------------------------------------ |
| columns        | array               | 表格列配置，支持 type: string/number/select/date/boolean     |
| fetchData      | function            | 数据获取函数，参数为分页/筛选条件，返回 Promise<{data, total}> |
| onAdd          | function            | 新增数据回调（可选）                                         |
| onEdit         | function            | 编辑数据回调（可选）                                         |
| onDelete       | function            | 删除数据回调（可选）                                         |
| formFields     | array               | 表单字段配置，支持校验、下拉、日期、布尔等                   |
| filterFields   | array               | 筛选字段配置，支持多条件筛选                                 |
| rowKey         | string              | 行唯一标识字段，默认 'id'                                    |
| pageSize       | number              | 每页条数，默认 10                                            |
| ...            | ...                 | 其他 MUI DataGrid 支持的属性                                 |

---

## 表单字段类型

- `string`：文本输入
- `number`：数字输入
- `select`：下拉选择，需配置 `options`
- `date`：日期选择
- `boolean`：开关/勾选

---

## 多条件筛选

- 支持文本、下拉、日期、布尔等多类型筛选
- 支持筛选条件 Chip 展示与一键清除
- 支持抽屉式筛选面板，适合字段较多场景

---

## 示例：用户管理页面

```tsx
import DataTable from '@/components/DataTable';

const fetchUserList = async (params) => {
  // 调用接口，返回 { data: [], total: 100 }
};

export default function UserManagement() {
  return (
    <DataTable
      columns={[
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: '用户名', width: 120 },
        { field: 'role', headerName: '角色', width: 100 },
        { field: 'createdAt', headerName: '注册时间', width: 180, type: 'date' },
        { field: 'active', headerName: '状态', width: 80, type: 'boolean' },
      ]}
      fetchData={fetchUserList}
      formFields={[
        { name: 'name', label: '用户名', type: 'string', required: true },
        { name: 'role', label: '角色', type: 'select', options: ['管理员', '用户'], required: true },
        { name: 'active', label: '状态', type: 'boolean' },
      ]}
      filterFields={[
        { name: 'name', label: '用户名', type: 'string' },
        { name: 'role', label: '角色', type: 'select', options: ['管理员', '用户'] },
        { name: 'createdAt', label: '注册时间', type: 'date' },
        { name: 'active', label: '状态', type: 'boolean' },
      ]}
    />
  );
}
```

---

## 常见问题

### 1. 如何自定义操作按钮？
- 可通过 `columns` 添加自定义渲染列，或通过 `onAdd`、`onEdit`、`onDelete` 回调自定义逻辑。

### 2. 如何适配不同业务表单？
- 通过 `formFields` 配置表单字段，支持多类型、校验、下拉、日期等。

### 3. 数据接口格式要求？
- `fetchData` 返回 Promise，格式为 `{ data: [], total: number }`，支持分页和筛选参数。

### 4. 如何处理宽度/布局问题？
- 组件默认 100% 宽度，建议外层容器无 maxWidth/margin，确保自适应。

---

## 依赖说明

- 依赖 MUI v6、@mui/x-date-pickers、date-fns、TailwindCSS、React 18
- 如遇依赖缺失，请先安装相关依赖

---

## 版本与维护

- 当前版本：见 package.json
- 如需扩展功能或修复 bug，请联系开发者或提交 issue

---

如有更多问题，欢迎随时反馈！ 