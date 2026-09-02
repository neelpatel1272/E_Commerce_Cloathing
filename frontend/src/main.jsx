import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import './assets/css/style.scss'
import { AdminAuthProvider } from './components/context/AdminAuth.jsx';
import { AuthProvider } from './components/context/Auth.jsx';
import { CartProvider } from './components/context/Cart.jsx';
import CustomCursor from './components/common/CustomCursor.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomCursor />
    <AdminAuthProvider>
      <AuthProvider>

      
      <CartProvider>
          <App />
      </CartProvider>

      </AuthProvider>
    </AdminAuthProvider>
  </StrictMode>,
)
