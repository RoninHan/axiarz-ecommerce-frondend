import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  Snackbar, 
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Search,
  FilterList,
  Visibility,
  VisibilityOff,
  Block,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { DataTable, DataItem, ColumnConfig, FilterCondition } from '../components/DataTable';
import { userApi } from '../api/services';
import moment from 'moment';


// 列配置
const columns: ColumnConfig[] = [

  {
    field: 'name',
    label: '用户名',
    required: true,
    filterable: true,
    filterType: 'text',
    filterPlaceholder: '搜索用户名',
    validation: (value) => {
      if (!value) return '用户名不能为空';
      if (value.length < 3) return '用户名至少3个字符';
      return null;
    }
  },
  {
    field: 'email',
    label: '邮箱',
    required: true,
    filterable: true,
    filterType: 'text',
    filterPlaceholder: '搜索邮箱',
    validation: (value) => {
      if (!value) return '邮箱不能为空';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '邮箱格式不正确';
      return null;
    }
  },
  {
    field: 'phone',
    label: '手机号',
    required: true,
    filterable: true,
    filterType: 'text',
    filterPlaceholder: '搜索手机号',
    validation: (value) => {
      if (!value) return '手机号不能为空';
      if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式不正确';
      return null;
    }
  },
  {
    field: 'department',
    label: '部门',
    type: 'select',
    required: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { value: '技术部', label: '技术部' },
      { value: '销售部', label: '销售部' },
      { value: '市场部', label: '市场部' },
      { value: '管理部', label: '管理部' },
      { value: '财务部', label: '财务部' },
      { value: '人事部', label: '人事部' }
    ],
    options: [
      { value: '技术部', label: '技术部' },
      { value: '销售部', label: '销售部' },
      { value: '市场部', label: '市场部' },
      { value: '管理部', label: '管理部' },
      { value: '财务部', label: '财务部' },
      { value: '人事部', label: '人事部' }
    ]
  },
  {
    field: 'role',
    label: '角色',
    type: 'select',
    required: true,
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { value: 'admin', label: '管理员' },
      { value: 'manager', label: '经理' },
      { value: 'user', label: '普通用户' }
    ],
    options: [
      { value: 'admin', label: '管理员' },
      { value: 'manager', label: '经理' },
      { value: 'user', label: '普通用户' }
    ]
  },
  {
    field: 'birthday',
    label: '生日',
    type: 'date',
    editable: true,
    filterable: true,
    filterType: 'dateRange',
    render: (value) => value ? moment(value).format('YYYY-MM-DD') : ''
  },
  {
    field: 'status',
    label: '状态',
    type: 'switch',
    editable: false,
    filterable: true,
    filterType: 'boolean',
    render: (value, row) => (
      <Chip
        label={value ? '启用' : '禁用'}
        color={value ? 'success' : 'default'}
        size="small"
        icon={value ? <CheckCircle /> : <Block />}
      />
    )
  },

  {
    field: 'created_at',
    label: '创建时间',
    editable: false,
    filterable: true,
    filterType: 'dateRange',
    render: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : ''
  }
];

export const UserManagement: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);

    // 分页处理
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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
  const simulateApiCall = async (action: string = '', delay: number = 1000) => {
    setLoading(true);
    const {data} = await userApi.getUsers({
      page:page,
      posts_per_page:pageSize
    })
    setData(data.rows)
    setFilteredData(data.rows)
    setLoading(false);
  };

  useEffect(()=>{
    simulateApiCall()
  },[])

  // 添加用户
  const handleAdd = async (userData: Partial<DataItem>) => {
    try {
      await simulateApiCall('添加用户');
      const newUser = {
        ...userData,
      };
      
      setMessage('用户添加成功');
      setMessageType('success');
    } catch (error) {
      setMessage('用户添加失败');
      setMessageType('error');
    }
  };

  // 编辑用户
  const handleEdit = async (id: string | number, userData: Partial<DataItem>) => {
    try {
      await simulateApiCall('编辑用户');
      setData(prev => prev.map(user => 
        user.id === id ? { 
          ...user, 
          ...userData,
          avatar: userData.username?.charAt(0).toUpperCase() || user.avatar
        } : user
      ));
      setMessage('用户编辑成功');
      setMessageType('success');
    } catch (error) {
      setMessage('用户编辑失败');
      setMessageType('error');
    }
  };

  // 删除用户
  const handleDelete = async (id: string | number) => {
    try {
      await simulateApiCall('删除用户');
      setData(prev => prev.filter(user => user.id !== id));
      setMessage('用户删除成功');
      setMessageType('success');
    } catch (error) {
      setMessage('用户删除失败');
      setMessageType('error');
    }
  };

  // 批量删除用户
  const handleBulkDelete = async () => {
    try {
      await simulateApiCall('批量删除用户');
      setData(prev => prev.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      setBulkActionDialog(false);
      setMessage(`成功删除 ${selectedUsers.length} 个用户`);
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



  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
  };

  // 选择处理
  const handleSelectionChange = (selectedIds: (string | number)[]) => {
    setSelectedUsers(selectedIds);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            用户管理
          </Typography>
          <Typography variant="body1" color="textSecondary">
            管理系统用户，包括添加、编辑、删除和权限管理
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {selectedUsers.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => setBulkActionDialog(true)}
              startIcon={<Delete />}
            >
              批量删除 ({selectedUsers.length})
            </Button>
          )}
        </Box>
      </Box>
      
      <DataTable
        title="用户列表"
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
        formType="drawer"
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
            确定要删除选中的 {selectedUsers.length} 个用户吗？此操作不可撤销。
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