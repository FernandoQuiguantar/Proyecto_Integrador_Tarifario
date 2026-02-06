import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginUsuario from './pages/LoginUsuario';
import LoginProveedor from './pages/LoginProveedor';
import UsuarioPage from './pages/UsuarioPage';
import ProveedorPage from './pages/ProveedorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-usuario" element={<LoginUsuario />} />
        <Route path="/login-proveedor" element={<LoginProveedor />} />
        <Route path="/usuario" element={<UsuarioPage />} />
        <Route path="/proveedor" element={<ProveedorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
