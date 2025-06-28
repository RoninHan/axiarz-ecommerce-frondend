import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useUserStore } from '../stores/StoreProvider';

export const TestLogin: React.FC = () => {
  const userStore = useUserStore();

  const handleLogout = () => {
    userStore.logout();
    window.location.reload();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        测试页面
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        当前用户: {userStore.user?.username || '未登录'}
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        登录状态: {userStore.isAuthenticated ? '已登录' : '未登录'}
      </Typography>
      
      <Button variant="contained" onClick={handleLogout}>
        退出登录
      </Button>
    </Box>
  );
}; 