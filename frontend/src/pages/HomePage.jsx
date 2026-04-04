import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function HomePage() {
  const navigate = useNavigate();
  const { account } = useAuth();

  useEffect(() => {
    if (account) navigate('/usuario');
  }, [account, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800 flex items-center justify-center">
      <div className="max-w-2xl w-full">

        {/* ENCABEZADO */}
        <header className="bg-[#1e3a5f] text-white p-10 rounded-t-3xl flex justify-between items-start shadow-2xl">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-2 whitespace-nowrap">
              Tarifario SMO
            </h1>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md ml-4 border-2 border-blue-100">
            <img
              src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png"
              alt="Logo Shopping"
              className="h-4 w-auto object-contain"
            />
          </div>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <div className="bg-white p-12 rounded-b-3xl shadow-xl border-x border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-800 text-center mb-3 uppercase tracking-tight">
            Bienvenido al Sistema Tarifario
          </h2>
          <p className="text-gray-500 text-center mb-10 text-sm">
            Seleccione su tipo de acceso para continuar
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {/* BOTÓN USUARIO */}
            <button
              onClick={() => navigate('/login-usuario')}
              className="flex-1 bg-gradient-to-br from-blue-700 to-blue-900 text-white p-8 rounded-2xl shadow-lg hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👤</div>
              <h3 className="text-xl font-bold mb-2">Ingresar Usuario</h3>
              <p className="text-blue-200 text-sm">
                Accede al catálogo de servicios y materiales
              </p>
            </button>

            {/* BOTÓN PROVEEDOR */}
            <button
              onClick={() => navigate('/proveedor')}
              className="flex-1 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-8 rounded-2xl shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="text-xl font-bold mb-2">Registrar Proveedores</h3>
              <p className="text-emerald-200 text-sm">
                Registre los precios del Proveedor
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
