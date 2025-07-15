import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Slider,
  FormGroup,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Divider,
  Collapse
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  FilterList,
  Refresh,
  Visibility,
  VisibilityOff,
  Close,
  Save,
  Cancel,
  ExpandMore,
  Clear,
  Tune,
  DateRange
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';

// 通用数据类型
export interface DataItem {
  id: string | number;
  [key: string]: any;
}

// 筛选条件类型
export interface FilterCondition {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in' | 'notIn' | 'isNull' | 'isNotNull';
  value: any;
  value2?: any; // 用于范围查询
}

// 列配置类型
export interface ColumnConfig {
  field: string;
  label: string;
  width?: number | string;
  type?: 'text' | 'number' | 'date' | 'select' | 'switch' | 'chip' | 'custom' | 'boolean' | 'upload';
  options?: { value: any; label: string }[];
  render?: (value: any, row: DataItem) => React.ReactNode;
  formRender?: (value: any, onChange: (v: any) => void) => React.ReactNode;
  editable?: boolean;
  required?: boolean;
  validation?: (value: any) => string | null;
  filterable?: boolean; // 是否可筛选
  filterType?: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange' | 'boolean' | 'multiSelect';
  filterOptions?: { value: any; label: string }[]; // 筛选选项
  filterPlaceholder?: string; // 筛选占位符
  uploadHandler?: (file: File) => Promise<string>; // 可选，上传逻辑，返回文件url
}


// 组件属性类型
export interface DataTableProps {
  title?: string;
  columns: ColumnConfig[];
  data: DataItem[];
  loading?: boolean;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onAdd?: (data: Partial<DataItem>) => Promise<void>;
  onEdit?: (id: string | number, data: Partial<DataItem>) => Promise<void>;
  onDelete?: (id: string | number) => Promise<void>;
  onRefresh?: () => void;
  onFilter?: (filters: FilterCondition[]) => void;
  formType?: 'dialog' | 'drawer';
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  title = '数据列表',
  columns,
  data,
  loading = false,
  total = 0,
  page = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onAdd,
  onEdit,
  onDelete,
  onRefresh,
  onFilter,
  formType = 'dialog',
  searchable = true,
  filterable = true,
  selectable = false,
  onSelectionChange
}) => {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [formData, setFormData] = useState<Partial<DataItem>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterData, setFilterData] = useState<Record<string, any>>({});
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);

  // 初始化表单数据
  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({});
    }
    setFormErrors({});
  }, [editingItem]);

  // 处理选择变化
  const handleSelectionChange = (id: string | number, checked: boolean) => {
    const newSelectedIds = checked
      ? [...selectedIds, id]
      : selectedIds.filter(selectedId => selectedId !== id);
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    const newSelectedIds = checked ? data.map(item => item.id) : [];
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  // 验证表单
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    columns.forEach(column => {
      const value = formData[column.field];
      // upload类型特殊处理：空字符串、null、undefined都算未上传
      if (column.required && (
        value === undefined || value === null || value === '' ||
        (column.type === 'upload' && (!value || (typeof value === 'object' && !value.name && !value.url)))
      )) {
        errors[column.field] = `${column.label}是必填项`;
      } else if (column.validation) {
        const error = column.validation(value);
        if (error) {
          errors[column.field] = error;
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // 检查是否有upload字段
      const hasUpload = columns.some(col => col.type === 'upload');
      let submitData: any = formData;
      if (hasUpload) {
        const fd = new FormData();
        columns.forEach(col => {
          const val = formData[col.field];
          if (col.type === 'upload' && val) {
            // File对象或字符串（如url）都append
            fd.append(col.field, val);
          } else if (val !== undefined && val !== null) {
            fd.append(col.field, val);
          }
        });
        submitData = fd;
      }
      if (editingItem) {
        await onEdit?.(editingItem.id, submitData);
      } else {
        await onAdd?.(submitData);
      }
      handleCloseForm();
    } catch (error) {
      console.error('表单提交失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 处理删除
  const handleDelete = async (id: string | number) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      try {
        await onDelete?.(id);
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  // 打开添加表单
  const handleAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  // 打开编辑表单
  const handleEdit = (item: DataItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  // 关闭表单
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingItem(null);
    setFormData({});
    setFormErrors({});
  };

  // 处理筛选
  const handleFilter = () => {
    const filters: FilterCondition[] = [];
    
    Object.entries(filterData).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        const column = columns.find(col => col.field === field);
        if (column?.filterable) {
          let operator: FilterCondition['operator'] = 'equals';
          let filterValue = value;
          let filterValue2 = undefined;

          switch (column.filterType) {
            case 'text':
              operator = 'contains';
              break;
            case 'numberRange':
              if (Array.isArray(value)) {
                operator = 'between';
                filterValue = value[0];
                filterValue2 = value[1];
              }
              break;
            case 'dateRange':
              if (Array.isArray(value)) {
                operator = 'between';
                filterValue = value[0];
                filterValue2 = value[1];
              }
              break;
            case 'multiSelect':
              operator = 'in';
              break;
            case 'boolean':
              operator = 'equals';
              break;
          }

          filters.push({
            field,
            operator,
            value: filterValue,
            value2: filterValue2
          });
        }
      }
    });

    setActiveFilters(filters);
    onFilter?.(filters);
    setFilterOpen(false);
  };

  // 清除筛选
  const handleClearFilters = () => {
    setFilterData({});
    setActiveFilters([]);
    onFilter?.([]);
  };

  // 移除单个筛选条件
  const handleRemoveFilter = (field: string) => {
    const newFilters = activeFilters.filter(f => f.field !== field);
    setActiveFilters(newFilters);
    const newFilterData = { ...filterData };
    delete newFilterData[field];
    setFilterData(newFilterData);
    onFilter?.(newFilters);
  };

  // 渲染筛选字段
  const renderFilterField = (column: ColumnConfig) => {
    const value = filterData[column.field];

    switch (column.filterType) {
      case 'select':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{column.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => setFilterData(prev => ({ ...prev, [column.field]: e.target.value }))}
              label={column.label}
            >
              <MenuItem value="">全部</MenuItem>
              {column.filterOptions?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'multiSelect':
        return (
          <FormControl fullWidth size="small">
            <InputLabel>{column.label}</InputLabel>
            <Select
              multiple
              value={value || []}
              onChange={(e) => setFilterData(prev => ({ ...prev, [column.field]: e.target.value }))}
              label={column.label}
            >
              {column.filterOptions?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            fullWidth
            size="small"
            label={column.label}
            placeholder={column.filterPlaceholder || `请输入${column.label}`}
            value={value || ''}
            onChange={(e) => setFilterData(prev => ({ ...prev, [column.field]: e.target.value }))}
          />
        );

      case 'dateRange':
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              label={`${column.label}开始`}
              placeholder={`${column.label}开始`}
              value={value?.[0] || ''}
              onChange={(e) => setFilterData(prev => ({ ...prev, [column.field]: [e.target.value, prev[column.field]?.[1]] }))}
            />
            <TextField
              fullWidth
              size="small"
              label={`${column.label}结束`}
              placeholder={`${column.label}结束`}
              value={value?.[1] || ''}
              onChange={(e) => setFilterData(prev => ({ ...prev, [column.field]: [prev[column.field]?.[0], e.target.value] }))}
            />
          </Box>
        );

      case 'numberRange':
        return (
          <Box>
            <Typography variant="body2" gutterBottom>{column.label}</Typography>
            <Slider
              value={value || [0, 100]}
              onChange={(_, newValue) => setFilterData(prev => ({ ...prev, [column.field]: newValue }))}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                size="small"
                label="最小值"
                value={value?.[0] || ''}
                onChange={(e) => setFilterData(prev => ({ 
                  ...prev, 
                  [column.field]: [Number(e.target.value), prev[column.field]?.[1]] 
                }))}
                type="number"
              />
              <TextField
                size="small"
                label="最大值"
                value={value?.[1] || ''}
                onChange={(e) => setFilterData(prev => ({ 
                  ...prev, 
                  [column.field]: [prev[column.field]?.[0], Number(e.target.value)] 
                }))}
                type="number"
              />
            </Box>
          </Box>
        );

      case 'boolean':
        return (
          <FormControl component="fieldset" size="small">
            <FormLabel component="legend">{column.label}</FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => setFilterData(prev => ({ ...prev, [column.field]: e.target.value }))}
            >
              <FormControlLabel value="" control={<Radio />} label="全部" />
              <FormControlLabel value="true" control={<Radio />} label="是" />
              <FormControlLabel value="false" control={<Radio />} label="否" />
            </RadioGroup>
          </FormControl>
        );

      default:
        return (
          <TextField
            fullWidth
            size="small"
            label={column.label}
            placeholder={column.filterPlaceholder || `请输入${column.label}`}
            value={value || ''}
            onChange={(e) => setFilterData(prev => ({ ...prev, [column.field]: e.target.value }))}
          />
        );
    }
  };

  // 渲染表单字段
  const renderFormField = (column: ColumnConfig) => {
    const value = formData[column.field] || '';
    const error = formErrors[column.field];

    if (column.formRender) {
      return column.formRender(value, (v) => setFormData(prev => ({ ...prev, [column.field]: v })));
    }

    switch (column.type) {
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label={column.label}
              value={value ? moment(value) : null}
              onChange={(date) => setFormData(prev => ({ ...prev, [column.field]: date ? date.format('YYYY-MM-DD') : '' }))}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  helperText: error,
                }
              }}
            />
          </LocalizationProvider>
        );
      case 'select':
        return (
          <FormControl fullWidth error={!!error}>
            <InputLabel>{column.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => setFormData(prev => ({ ...prev, [column.field]: e.target.value }))}
              label={column.label}
            >
              {column.options?.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => setFormData(prev => ({ ...prev, [column.field]: e.target.checked }))}
              />
            }
            label={column.label}
          />
        );
      case 'upload':
        // 仅允许图片类型
         const api = import.meta.env.VITE_API_BASE_URL;
        const isImage = (fileOrUrl: any) => {
         
          if (!fileOrUrl) return false;
          if (typeof fileOrUrl === 'string') {
            return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileOrUrl);
          }
          if (fileOrUrl.type) {
            return fileOrUrl.type.startsWith('image/');
          }
          return false;
        };
        let previewUrl = '';
        if (typeof value === 'string' && isImage(value)) {
          previewUrl = value;
        } else if (value && value instanceof File && isImage(value)) {
          previewUrl = URL.createObjectURL(value);
        }
        return (
          <Box>
            <Button
              variant="outlined"
              component="label"
              size="small"
              sx={{ mr: 2 }}
            >
              上传图片
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith('image/')) {
                    setFormErrors(prev => ({ ...prev, [column.field]: '仅支持图片文件' }));
                    return;
                  }
                  setFormErrors(prev => ({ ...prev, [column.field]: '' }));
                  if (column.uploadHandler) {
                    const url = await column.uploadHandler(file);
                    setFormData(prev => ({ ...prev, [column.field]: url }));
                  } else {
                    setFormData(prev => ({ ...prev, [column.field]: file }));
                  }
                }}
              />
            </Button>
            {previewUrl && (
              <Box sx={{ display: 'inline-block', verticalAlign: 'middle', mr: 2 }}>
                <img src={api + previewUrl} alt="预览" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }} />
              </Box>
            )}
            {value && !previewUrl && (
              <Typography variant="body2" component="span">{typeof value === 'string' ? value : (value.name || '')}</Typography>
            )}
            {error && (
              <Typography color="error" variant="caption" display="block">{error}</Typography>
            )}
          </Box>
        );
      default:
        return (
          <TextField
            fullWidth
            label={column.label}
            value={value}
            onChange={(e) => setFormData(prev => ({ ...prev, [column.field]: e.target.value }))}
            error={!!error}
            helperText={error}
            type={column.type === 'number' ? 'number' : 'text'}
          />
        );
    }
  };

  // 渲染表格单元格
  const renderCell = (column: ColumnConfig, row: DataItem) => {
    const value = row[column.field];

    if (column.render) {
      return column.render(value, row);
    }

    switch (column.type) {
      case 'chip':
        return <Chip label={value} size="small" />;
      case 'switch':
        return <Switch checked={!!value} disabled />;
      case 'select':
        const option = column.options?.find(opt => opt.value === value);
        return option?.label || value;
      case 'upload':
        if (!value) return '';
        // 如果是url则显示下载链接，否则显示文件名
        if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
          return <a href={value} target="_blank" rel="noopener noreferrer">下载</a>;
        }
        return value.name || value;
      default:
        return value;
    }
  };

  return (
    <Box>
      {/* 工具栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onRefresh && (
            <Tooltip title="刷新">
              <IconButton onClick={onRefresh} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
          )}
          {filterable && (
            <Tooltip title="高级筛选">
              <IconButton 
                onClick={() => setFilterOpen(true)}
                color={activeFilters.length > 0 ? 'primary' : 'default'}
              >
                <FilterList />
              </IconButton>
            </Tooltip>
          )}
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
              disabled={loading}
            >
              添加
            </Button>
          )}
        </Box>
      </Box>

      {/* 活跃筛选条件 */}
      {activeFilters.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {activeFilters.map((filter, index) => {
            const column = columns.find(col => col.field === filter.field);
            return (
              <Chip
                key={index}
                label={`${column?.label}: ${filter.value}${filter.value2 ? ` - ${filter.value2}` : ''}`}
                onDelete={() => handleRemoveFilter(filter.field)}
                color="primary"
                variant="outlined"
                size="small"
              />
            );
          })}
          <Button
            size="small"
            onClick={handleClearFilters}
            startIcon={<Clear />}
          >
            清除全部
          </Button>
        </Box>
      )}

      {/* 搜索 */}
      {searchable && (
        <Box sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder="搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 200 }}
          />
        </Box>
      )}

      {/* 数据表格 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
              )}
              {columns.map(column => (
                <TableCell key={column.field} style={{ width: column.width }}>
                  {column.label}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell align="center" style={{ width: 120 }}>
                  操作
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (onEdit || onDelete ? 1 : 0)} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (onEdit || onDelete ? 1 : 0)} align="center">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              data.map(row => (
                <TableRow key={row.id} hover>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(row.id)}
                        onChange={(e) => handleSelectionChange(row.id, e.target.checked)}
                      />
                    </TableCell>
                  )}
                  {columns.map(column => (
                    <TableCell key={column.field}>
                      {renderCell(column, row)}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {onEdit && (
                          <Tooltip title="编辑">
                            <IconButton size="small" onClick={() => handleEdit(row)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="删除">
                            <IconButton size="small" onClick={() => handleDelete(row.id)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 分页 */}
      {onPageChange && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}

      {/* 高级筛选抽屉 */}
      {filterable && (
        <Drawer anchor="right" open={filterOpen} onClose={() => setFilterOpen(false)}>
          <Box sx={{ width: 400, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                高级筛选
              </Typography>
              <IconButton onClick={() => setFilterOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {columns.filter(col => col.filterable).map(column => (
                <Box key={column.field}>
                  {renderFilterField(column)}
                </Box>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleFilter}
                startIcon={<FilterList />}
              >
                应用筛选
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                startIcon={<Clear />}
              >
                清除筛选
              </Button>
            </Box>
          </Box>
        </Drawer>
      )}

      {/* 表单弹窗/抽屉 */}
      {formType === 'drawer' ? (
        <Drawer anchor="right" open={formOpen} onClose={handleCloseForm}>
          <Box sx={{ width: 400, p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {editingItem ? '编辑' : '添加'}
              </Typography>
              <IconButton onClick={handleCloseForm}>
                <Close />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {columns.filter(col => col.editable !== false).map(column => (
                <Box key={column.field}>
                  {renderFormField(column)}
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={16} /> : <Save />}
              >
                {submitting ? '保存中...' : '保存'}
              </Button>
              <Button variant="outlined" onClick={handleCloseForm}>
                取消
              </Button>
            </Box>
          </Box>
        </Drawer>
      ) : (
        <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingItem ? '编辑' : '添加'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {columns.filter(col => col.editable !== false).map(column => (
                <Box key={column.field}>
                  {renderFormField(column)}
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm}>取消</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : <Save />}
            >
              {submitting ? '保存中...' : '保存'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}; 