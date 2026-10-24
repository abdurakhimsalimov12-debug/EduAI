import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './i18n/index.js';
import './index.css';
import { AuthProvider } from './features/auth/AuthContext.jsx';
import { ToastProvider } from './components/ui/ToastContext.jsx';
import Loading from './components/ui/Loading.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<Loading full />}>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </Suspense>
  </StrictMode>
);
