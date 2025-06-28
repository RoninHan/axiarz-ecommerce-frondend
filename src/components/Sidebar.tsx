import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  Assessment,
  Settings,
  ExpandLess,
  ExpandMore,
  Store,
  Category,
  LocalShipping,
  Payment
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useAppStore } from '../stores/StoreProvider';

const DRAWER_WIDTH = 240;

// 菜单项接口
interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  children?: MenuItem[];
}

// 菜单配置
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: '仪表盘',
    icon: <Dashboard />,
    path: '/dashboard'
  },
  {
    id: 'users',
    title: '用户管理',
    icon: <People />,
    path: '/users'
  },
  {
    id: 'products',
    title: '商品管理',
    icon: <Inventory />,
    path: '/products',
    children: [
      {
        id: 'product-list',
        title: '商品列表',
        icon: <Category />,
        path: '/products/list'
      },
      {
        id: 'product-categories',
        title: '商品分类',
        icon: <Category />,
        path: '/products/categories'
      }
    ]
  },
  {
    id: 'orders',
    title: '订单管理',
    icon: <ShoppingCart />,
    path: '/orders',
    children: [
      {
        id: 'order-list',
        title: '订单列表',
        icon: <ShoppingCart />,
        path: '/orders/list'
      },
      {
        id: 'order-shipping',
        title: '物流管理',
        icon: <LocalShipping />,
        path: '/orders/shipping'
      }
    ]
  },
  {
    id: 'customers',
    title: '客户管理',
    icon: <People />,
    path: '/customers'
  },
  {
    id: 'analytics',
    title: '数据分析',
    icon: <Assessment />,
    path: '/analytics'
  },
  {
    id: 'payments',
    title: '支付管理',
    icon: <Payment />,
    path: '/payments'
  },
  {
    id: 'settings',
    title: '系统设置',
    icon: <Settings />,
    path: '/settings'
  }
];

export const Sidebar: React.FC = observer(() => {
  const appStore = useAppStore();
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    } else {
      // 处理导航
      console.log('Navigate to:', item.path);
      // 使用全局导航函数
      if ((window as any).navigate) {
        (window as any).navigate(item.path);
      }
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              pl: level * 2 + 2,
              minHeight: 48,
              justifyContent: appStore.sidebarCollapsed ? 'center' : 'initial',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: appStore.sidebarCollapsed ? 0 : 3,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!appStore.sidebarCollapsed && (
              <>
                <ListItemText primary={item.title} />
                {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
              </>
            )}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && !appStore.sidebarCollapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: appStore.sidebarCollapsed ? 64 : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: appStore.sidebarCollapsed ? 64 : DRAWER_WIDTH,
          boxSizing: 'border-box',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
          backgroundColor: appStore.theme === 'dark' ? '#1a1a1a' : '#fff',
          color: appStore.theme === 'dark' ? '#fff' : '#333',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>
    </Drawer>
  );
}); 