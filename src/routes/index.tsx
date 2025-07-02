import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import routes from './routes.json';
import { Dashboard } from '../pages/Dashboard';
import { UserManagement } from '../pages/UserManagement';
import { ProductManagement } from '../pages/ProductManagement';
import ProductCRUD from '../pages/ProductCRUD';
import { Login } from '../pages/Login';
import { MainLayout } from '../layouts/MainLayout';
import { useUserStore } from '../stores/StoreProvider';

const elementMap: Record<string, React.ReactNode> = {
  Dashboard: <Dashboard />,
  UserManagement: <UserManagement />,
  ProductManagement: <ProductManagement />,
  ProductCRUD: <ProductCRUD />,
  Login: <Login />,
};

function RequireAuth({ children }: { children: JSX.Element }) {
  const userStore = useUserStore();
  if (!userStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function RenderRoutes() {
  const userStore = useUserStore();
  return (
    <>
      {routes.map(route => {
        if (route.auth) {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <RequireAuth>
                  <MainLayout>{elementMap[route.element]}</MainLayout>
                </RequireAuth>
              }
            />
          );
        } else {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                userStore.isAuthenticated
                  ? <Navigate to="/dashboard" replace />
                  : elementMap[route.element]
              }
            />
          );
        }
      })}
      {/* 404 跳转 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  );
} 