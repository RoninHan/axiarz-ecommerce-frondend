import React from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { RenderRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {RenderRoutes()}
      </Routes>
    </BrowserRouter>
  );
}; 