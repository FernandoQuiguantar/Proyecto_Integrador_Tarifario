import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyInput from '../components/MyInput';

function LoginUsuario() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rol: 'usuario' })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.usuario));
        navigate('/usuario');
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800 flex items-center justify-center">
      <div className="max-w-md w-full">

        {/* ENCABEZADO */}
        <header className="bg-[#1e3a5f] text-white p-8 rounded-t-3xl flex justify-between items-center shadow-2xl">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Tarifario de Marketing
            </h1>
            <p className="text-blue-200 text-sm font-semibold">
              Inicio de Sesión - Usuario
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-md ml-4 border-2 border-blue-100">
            <img
              src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png"
              alt="Logo Shopping"
              className="h-10 w-auto object-contain"
            />
          </div>
        </header>

        {/* FORMULARIO LOGIN */}
        <div className="bg-white p-8 rounded-b-3xl shadow-xl border-x border-b border-gray-100">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">👤</div>
            <h2 className="text-xl font-black text-gray-800">Acceso Usuario</h2>
            <p className="text-gray-400 text-sm mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <MyInput
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@gmail.com"
            />
            <MyInput
              label="Contraseña"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <p className="text-red-500 font-bold text-sm text-center animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/50 hover:from-blue-800 hover:to-black transition-all duration-300 active:scale-95"
            >
              Iniciar Sesión
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
