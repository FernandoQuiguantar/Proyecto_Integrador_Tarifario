import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import API_BASE from '../config';

function AdminRolesPage() {
  const navigate = useNavigate();
  const { account, rol, loadingRol } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ email: '', nombre: '', password: '', rol: 'visor' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [loading, setLoading] = useState(false);
  const [cambiandoPass, setCambiandoPass] = useState(null);
  const [nuevaPass, setNuevaPass] = useState('');

  useEffect(() => {
    if (!loadingRol) {
      if (!account || rol !== 'admin') { navigate('/'); return; }
      fetchUsuarios();
    }
  }, [account, rol, loadingRol, navigate]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/roles`);
      setUsuarios(await res.json());
    } catch {
      setError('Error al cargar usuarios.');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setError(''); setExito('');
    if (!form.email || !form.password) return setError('Correo y contraseña son obligatorios.');
    try {
      const res = await fetch(`${API_BASE}/api/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setExito(`Usuario ${form.email} creado como ${form.rol}.`);
        setForm({ email: '', nombre: '', password: '', rol: 'visor' });
        fetchUsuarios();
      } else {
        setError(data.message || 'Error al crear usuario.');
      }
    } catch {
      setError('No se pudo conectar con el servidor.');
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`¿Eliminar acceso de ${email}?`)) return;
    try {
      await fetch(`${API_BASE}/api/roles/${encodeURIComponent(email)}`, { method: 'DELETE' });
      fetchUsuarios();
    } catch {
      setError('Error al eliminar usuario.');
    }
  };

  const handleChangeRol = async (email, nuevoRol) => {
    try {
      await fetch(`${API_BASE}/api/roles/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol: nuevoRol }),
      });
      fetchUsuarios();
    } catch {
      setError('Error al actualizar rol.');
    }
  };

  const handleChangePass = async (email) => {
    if (!nuevaPass) return;
    try {
      await fetch(`${API_BASE}/api/roles/${encodeURIComponent(email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: nuevaPass }),
      });
      setCambiandoPass(null);
      setNuevaPass('');
      setExito(`Contraseña de ${email} actualizada.`);
    } catch {
      setError('Error al cambiar contraseña.');
    }
  };

  if (loadingRol) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-500 font-semibold">Verificando acceso...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto">

        <header className="bg-[#1e3a5f] text-white p-8 rounded-t-3xl flex justify-between items-center shadow-2xl">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight whitespace-nowrap">Tarifario SMO</h1>
            <p className="text-blue-200 text-sm mt-1 font-semibold">Gestión de Usuarios</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/usuario')} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              ← Volver
            </button>
            <div className="bg-white p-3 rounded-xl shadow-md border-2 border-blue-100">
              <img src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png" alt="Logo" className="h-8 w-auto object-contain" />
            </div>
          </div>
        </header>

        {/* FORMULARIO CREAR USUARIO */}
        <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-gray-100 p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 p-2 rounded-lg text-blue-600">👤</span>
            Crear nuevo usuario
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Correo electrónico *</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="usuario@smo.ec"
                className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Nombre</label>
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre completo"
                className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Contraseña *</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Rol</label>
              <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}
                className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white transition-colors">
                <option value="visor">Visor (solo lectura del catálogo)</option>
                <option value="editor">Editor (catálogo + proveedores)</option>
                <option value="admin">Administrador (acceso total)</option>
              </select>
            </div>
          </div>
          <button onClick={handleSave}
            className="mt-4 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
            Crear Usuario
          </button>
          {error && <p className="text-red-500 text-sm font-semibold mt-3">⚠️ {error}</p>}
          {exito && <p className="text-emerald-600 text-sm font-semibold mt-3">✓ {exito}</p>}
        </div>

        {/* TABLA DE USUARIOS */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-700">Usuarios registrados</h2>
            <span className="bg-blue-900 text-white px-3 py-0.5 rounded-full text-xs font-bold">{usuarios.length}</span>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-10 text-sm">Cargando...</p>
          ) : usuarios.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">No hay usuarios registrados.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-gray-500 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Correo</th>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-center">Rol</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usuarios.map(u => (
                  <tr key={u.email} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-800">{u.email}</td>
                    <td className="px-4 py-3 text-gray-500">{u.nombre || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <select value={u.rol} onChange={e => handleChangeRol(u.email, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                          u.rol === 'admin' ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : u.rol === 'editor' ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                        <option value="visor">Visor</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {cambiandoPass === u.email ? (
                          <div className="flex items-center gap-1">
                            <input type="password" value={nuevaPass} onChange={e => setNuevaPass(e.target.value)}
                              placeholder="Nueva contraseña"
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none w-32" />
                            <button onClick={() => handleChangePass(u.email)}
                              className="text-xs font-bold text-emerald-600 hover:text-white hover:bg-emerald-500 border border-emerald-200 px-2 py-1 rounded-lg transition-all">✓</button>
                            <button onClick={() => { setCambiandoPass(null); setNuevaPass(''); }}
                              className="text-xs font-bold text-gray-400 hover:text-red-500 px-1">✕</button>
                          </div>
                        ) : (
                          <button onClick={() => { setCambiandoPass(u.email); setNuevaPass(''); }}
                            className="text-xs font-bold text-blue-500 hover:text-white hover:bg-blue-500 border border-blue-200 px-3 py-1 rounded-xl transition-all">
                            Cambiar pass
                          </button>
                        )}
                        <button onClick={() => handleDelete(u.email)}
                          className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-3 py-1 rounded-xl transition-all">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRolesPage;
