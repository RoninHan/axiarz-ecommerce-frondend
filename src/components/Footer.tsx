import React from 'react';
import { Box, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useAppStore } from '../stores/StoreProvider';

export const Footer: React.FC = observer(() => {
  const appStore = useAppStore();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        width: '100%',
        backgroundColor: appStore.theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
        borderTop: `1px solid ${appStore.theme === 'dark' ? '#333' : '#e0e0e0'}`,
        color: appStore.theme === 'dark' ? '#fff' : '#666',
        boxSizing: 'border-box'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">
          © {currentYear} Axiarz E-commerce. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
}); 