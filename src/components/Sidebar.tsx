import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useAppStore } from '../stores/StoreProvider';
import routes from '../routes/routes.json';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;

// 只保留menu为true的路由
const menuRoutes = routes.filter((r: any) => r.menu);

export const Sidebar: React.FC = observer(() => {
  const appStore = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path: string) => {
    if (location.pathname !== path) {
      navigate(path);
    }
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
          {menuRoutes.map((item: any) => {
            const Icon = item.icon && (MuiIcons as any)[item.icon];
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleItemClick(item.path)}
                  sx={{
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
                    {Icon ? <Icon /> : null}
                  </ListItemIcon>
                  {!appStore.sidebarCollapsed && (
                    <ListItemText primary={item.title} />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}); 