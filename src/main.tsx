import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreProvider } from './stores/StoreProvider';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>
);
