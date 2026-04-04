import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginUsuario from './pages/LoginUsuario';
import UsuarioPage from './pages/UsuarioPage';
import ProveedorPage from './pages/ProveedorPage';
import ProveedorRegistroPage from './pages/ProveedorRegistroPage';
import ProveedorListaPage from './pages/ProveedorListaPage';
import ProveedorEditarPage from './pages/ProveedorEditarPage';
import AdminRolesPage from './pages/AdminRolesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-usuario" element={<LoginUsuario />} />
        <Route path="/usuario" element={<UsuarioPage />} />
        <Route path="/admin/roles" element={<AdminRolesPage />} />
        <Route path="/proveedor" element={<ProveedorPage />} />
        <Route path="/proveedor/registro" element={<ProveedorRegistroPage />} />
        <Route path="/proveedor/lista" element={<ProveedorListaPage />} />
        <Route path="/proveedor/editar" element={<ProveedorEditarPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
