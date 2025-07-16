import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import routes from './routes.json';
import { Dashboard } from '../pages/Dashboard';
import { UserManagement } from '../pages/UserManagement';
import { ProductManagement } from '../pages/ProductManagement';
import { Login } from '../pages/Login';
import { MainLayout } from '../layouts/MainLayout';
import { useUserStore } from '../stores/StoreProvider';
import { CategoryManagement } from '../pages/CategoryManagement';
import { HomeProductManagement } from '../pages/HomeProductManagement';

const elementMap: Record<string, React.ReactNode> = {
  Dashboard: <Dashboard />,
  UserManagement: <UserManagement />,
  ProductManagement: <ProductManagement />,
  Login: <Login />,
  CategoryManagement: <CategoryManagement />,
  HomeProductManagement: <HomeProductManagement />, 
};

/**
 * A higher-order component that wraps children components and redirects to login page
 * if the user is not authenticated. Uses the user store to check authentication status.
 * 
 * @param children - The child components to render if authenticated
 * @returns Either the children components or a redirect to login page
 */
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