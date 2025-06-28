import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { useAppStore } from '../stores/StoreProvider';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = observer(({ children }) => {
  const appStore = useAppStore();

  // 创建主题
  const theme = createTheme({
    palette: {
      mode: appStore.theme,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: appStore.theme === 'dark' ? '#121212' : '#f5f5f5',
        paper: appStore.theme === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: appStore.theme === 'dark' ? '#1a1a1a' : '#ffffff',
            color: appStore.theme === 'dark' ? '#ffffff' : '#333333',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: appStore.theme === 'dark' ? '#1a1a1a' : '#1976d2',
          },
        },
      },
    },
  });

  const handleMenuClick = () => {
    appStore.toggleSidebar();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        width: '100vw',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: appStore.theme === 'dark' ? '#121212' : '#f5f5f5',
            width: 'auto',
            transition: 'margin-left 0.2s ease-in-out',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Header */}
          <Header onMenuClick={handleMenuClick} />
          
          {/* Content Area */}
          <Box
            sx={{
              flexGrow: 1,
              mt: 8, // 为固定定位的Header留出空间
              pt: 3,
              pr: 3,
              pb: 3,
              pl: 3,
              width: '100%',
              boxSizing: 'border-box',
              overflow: 'auto',
              minHeight: 0, // 确保flex子元素可以收缩
            }}
          >
            {children}
          </Box>
          
          {/* Footer */}
          <Box sx={{ 
            flexShrink: 0,
            width: '100%'
          }}>
            <Footer />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}); 