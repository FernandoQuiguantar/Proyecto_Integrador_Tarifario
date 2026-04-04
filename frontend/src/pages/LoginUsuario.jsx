import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import API_BASE from '../config';

function LoginUsuario() {
  const navigate = useNavigate();
  const { account, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) navigate('/usuario');
  }, [account, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/roles/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/usuario');
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch {
      setError('No se pudo conectar con el servidor.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full">

        <header className="bg-[#1e3a5f] text-white p-8 rounded-t-3xl flex justify-between items-center shadow-2xl">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight mb-1 whitespace-nowrap">Tarifario SMO</h1>
            <p className="text-blue-200 text-sm font-semibold">Inicio de Sesión</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-md ml-4 border-2 border-blue-100">
            <img
              src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png"
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
        </header>

        <div className="bg-white p-8 rounded-b-3xl shadow-xl border-x border-b border-gray-100">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔐</div>
            <h2 className="text-xl font-black text-gray-800">Acceso al Sistema</h2>
            <p className="text-gray-400 text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@smo.ec"
                required
                className="p-2.5 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="p-2.5 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>

            {error && (
              <p className="text-red-500 font-bold text-sm text-center">⚠️ {error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-blue-500/40 hover:from-blue-800 hover:to-black transition-all duration-300 active:scale-95 disabled:opacity-60"
            >
              {loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginUsuario;
