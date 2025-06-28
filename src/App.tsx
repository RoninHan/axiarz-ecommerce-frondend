import React, { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import { ProductManagement } from './pages/ProductManagement';
import { useUserStore } from './stores/StoreProvider';

// 简单的路由系统
const ROUTES = {
  '/': Dashboard,
  '/dashboard': Dashboard,
  '/users': UserManagement,
  '/products': ProductManagement,
  '/login': Login
};

export const App: React.FC = () => {
  const userStore = useUserStore();
  const [currentPath, setCurrentPath] = useState('/dashboard');

  // 监听路由变化
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    setCurrentPath(window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // 导航函数
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // 全局导航函数
  (window as any).navigate = navigate;

  // 如果未登录，显示登录页面
  if (!userStore.isAuthenticated) {
    return <Login />;
  }

  // 获取当前页面组件
  const CurrentPage = ROUTES[currentPath as keyof typeof ROUTES] || Dashboard;

  return (
    <MainLayout>
      <CurrentPage />
    </MainLayout>
  );
}; 