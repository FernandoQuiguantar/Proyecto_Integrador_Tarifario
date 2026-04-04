import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config';

const CENTROS = ['CCI', 'CONDADO', 'INMODIAMANTE'];

function ProveedorListaPage() {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [ofertas, setOfertas] = useState({});   // { [correo]: { total, por_centro } }
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/proveedores`);
        const lista = await res.json();
        setProveedores(lista);

        // Cargar ofertas de todos los proveedores en paralelo
        const resultados = await Promise.all(
          lista.map(p =>
            fetch(`${API_BASE}/api/precios/proveedor/${encodeURIComponent(p.correo)}`)
              .then(r => r.ok ? r.json() : { total: 0, por_centro: {} })
              .catch(() => ({ total: 0, por_centro: {} }))
          )
        );

        const map = {};
        lista.forEach((p, i) => { map[p.correo] = resultados[i]; });
        setOfertas(map);
      } catch {
        setProveedores([]);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const filtrados = proveedores.filter(p => {
    const q = busqueda.toLowerCase();
    return !q || p.razon_social?.toLowerCase().includes(q) || p.ruc?.includes(q) || p.correo?.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">

        {/* ENCABEZADO */}
        <header className="bg-[#1e3a5f] text-white p-8 rounded-t-3xl flex justify-between items-center shadow-2xl">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lista de Proveedores</h1>
            <p className="text-violet-300 text-sm mt-1 font-semibold">Registros y ofertas por centro comercial</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white/20 text-white text-sm font-bold px-4 py-2 rounded-xl">
              {proveedores.length} proveedores
            </span>
            <div className="bg-white p-3 rounded-xl shadow-md border-2 border-blue-100">
              <img src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png" alt="Logo" className="h-10 w-auto object-contain" />
            </div>
          </div>
        </header>

        {/* BUSCADOR */}
        <div className="bg-white rounded-none border-x border-gray-100 px-6 py-4 shadow-sm">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por razón social, RUC o correo..."
              className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl outline-none focus:border-violet-500 text-sm" />
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-gray-100 p-6">
          {loading ? (
            <p className="text-center text-gray-400 py-20 font-medium">Cargando proveedores...</p>
          ) : filtrados.length === 0 ? (
            <p className="text-center text-gray-400 py-20 font-medium">No se encontraron proveedores.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {filtrados.map(p => {
                const data = ofertas[p.correo] || { total: 0, por_centro: {} };
                return (
                  <div key={p.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow bg-slate-50/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                      {/* Datos del proveedor */}
                      <div className="flex flex-col gap-1 flex-1">
                        <h3 className="text-base font-black text-gray-800">{p.razon_social}</h3>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <span className="font-bold text-gray-600">RUC:</span> {p.ruc}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-bold text-gray-600">Correo:</span> {p.correo}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="font-bold text-gray-600">Contacto:</span> {p.numero_contacto}
                          </span>
                        </div>
                      </div>

                      {/* Ofertas por centro comercial */}
                      <div className="flex flex-col gap-2 min-w-[240px]">
                        <p className="text-xs font-bold text-gray-400 uppercase">Ofertas registradas</p>
                        <div className="flex flex-wrap gap-2">
                          {CENTROS.map(cc => (
                            <div key={cc} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5">
                              <span className="text-xs font-bold text-gray-600">{cc}</span>
                              <span className={`text-sm font-black ${(data.por_centro[cc] || 0) > 0 ? 'text-violet-700' : 'text-gray-300'}`}>
                                {data.por_centro[cc] || 0}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded-xl px-3 py-1.5">
                            <span className="text-xs font-bold text-violet-600">Total</span>
                            <span className="text-sm font-black text-violet-700">{data.total}</span>
                          </div>
                        </div>
                      </div>

                      {/* Botón editar */}
                      <button
                        onClick={() => navigate(`/proveedor/editar?id=${p.id}`)}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors whitespace-nowrap"
                      >
                        ✏️ Editar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button onClick={() => navigate('/proveedor')} className="mt-8 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProveedorListaPage;
