# 后台管理系统

一个基于 React + TypeScript + MUI + MobX 的现代化后台管理系统。

## 功能特性

### 🎨 界面设计
- **简约风格**：采用现代化的简约设计风格
- **响应式布局**：支持桌面端和移动端
- **主题切换**：支持明暗主题切换
- **动画效果**：流畅的过渡动画和交互效果

### 🔐 用户认证
- **登录系统**：用户名、密码、图形验证码
- **记住我**：支持记住用户名
- **状态管理**：基于 MobX 的状态管理
- **本地存储**：自动保存登录状态

### 📊 数据管理
- **通用CRUD组件**：支持增删改查操作
- **分页功能**：支持数据分页显示
- **搜索筛选**：支持数据搜索和筛选
- **批量操作**：支持批量选择和操作
- **表单验证**：完整的表单验证机制

### 🎯 组件特性
- **弹窗表单**：支持弹窗式表单编辑
- **侧边栏表单**：支持侧边栏式表单编辑
- **多种字段类型**：文本、数字、选择、开关、芯片等
- **自定义渲染**：支持自定义字段渲染
- **加载状态**：完整的加载状态管理

## 技术栈

- **前端框架**：React 18 + TypeScript
- **UI组件库**：Material-UI (MUI) v6
- **状态管理**：MobX + mobx-react-lite
- **样式方案**：Tailwind CSS
- **构建工具**：Farm
- **开发工具**：React DevTools

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── DataTable.tsx   # 通用CRUD表格组件
│   ├── Header.tsx      # 顶部导航栏
│   ├── Sidebar.tsx     # 侧边栏菜单
│   └── Footer.tsx      # 底部信息
├── pages/              # 页面组件
│   ├── Login.tsx       # 登录页面
│   ├── Dashboard.tsx   # 仪表盘
│   └── UserManagement.tsx # 用户管理
├── layouts/            # 布局组件
│   └── MainLayout.tsx  # 主布局
├── stores/             # 状态管理
│   ├── RootStore.ts    # 根状态
│   └── StoreProvider.tsx # 状态提供者
├── api/                # API接口
│   ├── instance.ts     # 请求实例
│   └── services.ts     # 服务接口
└── App.tsx             # 主应用组件
```

## 快速开始

### 安装依赖

```bash
yarn install
```

### 启动开发服务器

```bash
yarn dev
```

访问 http://localhost:9000 查看应用。

### 构建生产版本

```bash
yarn build
```

## 使用指南

### 登录系统

1. 访问应用首页，自动跳转到登录页面
2. 输入用户名和密码
3. 输入图形验证码（固定为 "ABCD"）
4. 可选择"记住我"功能
5. 点击登录按钮

### 通用CRUD组件使用

#### 基本用法

```tsx
import { DataTable, DataItem, ColumnConfig } from './components/DataTable';

// 定义列配置
const columns: ColumnConfig[] = [
  {
    field: 'name',
    label: '名称',
    required: true
  },
  {
    field: 'status',
    label: '状态',
    type: 'switch'
  }
];

// 使用组件
<DataTable
  title="数据列表"
  columns={columns}
  data={data}
  onAdd={handleAdd}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

#### 支持的字段类型

- `text`：文本输入框
- `number`：数字输入框
- `select`：下拉选择框
- `switch`：开关组件
- `chip`：标签显示
- `custom`：自定义渲染

#### 表单类型

- `dialog`：弹窗表单（默认）
- `drawer`：侧边栏表单

### 状态管理

#### 用户状态

```tsx
import { useUserStore } from './stores/StoreProvider';

const userStore = useUserStore();

// 检查登录状态
if (userStore.isAuthenticated) {
  // 已登录
}

// 获取用户信息
const user = userStore.user;

// 登出
userStore.logout();
```

#### 应用状态

```tsx
import { useAppStore } from './stores/StoreProvider';

const appStore = useAppStore();

// 切换侧边栏
appStore.toggleSidebar();

// 切换主题
appStore.toggleTheme();
```

## 自定义配置

### 主题配置

在 `MainLayout.tsx` 中修改主题配置：

```tsx
const theme = createTheme({
  palette: {
    mode: appStore.theme,
    primary: {
      main: '#1976d2',
    },
    // 更多配置...
  },
});
```

### 路由配置

在 `App.tsx` 中添加新路由：

```tsx
const ROUTES = {
  '/': Dashboard,
  '/dashboard': Dashboard,
  '/users': UserManagement,
  '/new-page': NewPage, // 添加新页面
};
```

### 菜单配置

在 `Sidebar.tsx` 中修改菜单项：

```tsx
const menuItems: MenuItem[] = [
  {
    id: 'new-menu',
    title: '新菜单',
    icon: <NewIcon />,
    path: '/new-page'
  },
  // 更多菜单项...
];
```

## 开发指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新页面组件
2. 在 `App.tsx` 中添加路由配置
3. 在 `Sidebar.tsx` 中添加菜单项

### 添加新组件

1. 在 `src/components/` 目录下创建新组件
2. 使用 TypeScript 定义接口
3. 添加必要的样式和功能

### 状态管理

1. 在 `RootStore.ts` 中添加新的状态类
2. 使用 `makeAutoObservable` 装饰器
3. 在组件中使用 `useStore` 钩子

## 部署

### 构建

```bash
yarn build
```

### 部署到服务器

将 `dist` 目录下的文件部署到 Web 服务器即可。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
