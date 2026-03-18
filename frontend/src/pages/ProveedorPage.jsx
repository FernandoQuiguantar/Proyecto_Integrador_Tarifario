import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TIPO_BADGE = {
  'Mantenimiento': 'bg-amber-100 text-amber-800',
  'Brandeo':       'bg-blue-100 text-blue-800',
  'Nuevo':         'bg-emerald-100 text-emerald-800',
  'Comprar Nuevo': 'bg-purple-100 text-purple-800',
  'Brandeo/Mantenimiento': 'bg-cyan-100 text-cyan-800',
};

function ProveedorPage() {
  const navigate = useNavigate();
  const [tarifas, setTarifas] = useState([]);
  const [misPrecios, setMisPrecios] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [proveedorInfo, setProveedorInfo] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');

  const API_URL = 'http://localhost:3000/api/tarifas';
  const PRECIOS_URL = 'http://localhost:3000/api/precios';

  const fetchTarifas = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error();
      setTarifas(await res.json());
    } catch (err) {
      console.error("Error al cargar el tarifario:", err);
    }
  };

  const fetchMisPrecios = async (lista, email) => {
    const results = await Promise.all(
      lista.map(t =>
        fetch(`${PRECIOS_URL}/${t.id}`)
          .then(r => r.ok ? r.json() : [])
          .then(precios => ({ id: t.id, precio: precios.find(p => p.proveedor_email === email)?.precio }))
          .catch(() => ({ id: t.id, precio: undefined }))
      )
    );
    const map = {};
    results.forEach(({ id, precio }) => { if (precio !== undefined) map[id] = precio; });
    setMisPrecios(map);
  };

  useEffect(() => {
    const proveedor = localStorage.getItem('proveedor');
    if (!proveedor) { navigate('/login-proveedor'); return; }
    const info = JSON.parse(proveedor);
    setProveedorInfo(info);
    fetchTarifas();
  }, [navigate]);

  useEffect(() => {
    if (proveedorInfo && tarifas.length > 0) {
      fetchMisPrecios(tarifas, proveedorInfo.email);
    }
  }, [tarifas, proveedorInfo]);

  const handleSetMyPrice = async (tarifaId) => {
    if (!editPrice || Number(editPrice) <= 0) { alert("El precio debe ser mayor a 0"); return; }
    try {
      const res = await fetch(PRECIOS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tarifa_id: tarifaId, proveedor_email: proveedorInfo.email, proveedor_nombre: proveedorInfo.nombre, precio: Number(editPrice) })
      });
      if (res.ok) {
        setEditingId(null);
        setEditPrice('');
        fetchTarifas();
      } else {
        alert("Error al guardar el precio");
      }
    } catch (err) {
      alert("Error de conexión al guardar precio.");
    }
  };

  const handleLogout = () => { localStorage.removeItem('proveedor'); navigate('/'); };

  const tarifasFiltradas = tarifas.filter(t => {
    const texto = busqueda.toLowerCase();
    const coincide = !busqueda || t.pieza?.toLowerCase().includes(texto) || t.codigo?.toLowerCase().includes(texto);
    const coincideCat = !filtroCategoria || t.categoria === filtroCategoria;
    return coincide && coincideCat;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">

        {/* ENCABEZADO */}
        <header className="bg-[#1e3a5f] text-white p-10 rounded-3xl flex justify-between items-start shadow-2xl mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Proyecto Integrador: Tarifario de Marketing</h1>
            <p className="text-gray-300 italic text-lg font-medium">Desarrollado por: Erick Quiguantar - PUCE</p>
            <p className="text-emerald-300 text-sm mt-2 font-semibold">
              Panel de Proveedor {proveedorInfo ? `- ${proveedorInfo.nombre}` : ''}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="bg-white p-4 rounded-xl shadow-md border-2 border-blue-100">
              <img src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png" alt="Logo" className="h-12 w-auto object-contain" />
            </div>
            <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* BARRA DE BÚSQUEDA */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar por código o nombre..."
              className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm" />
          </div>
          <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}
            className="p-2.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-emerald-500 text-sm min-w-[200px]">
            <option value="">Todas las categorías</option>
            <option value="Elemento iluminado">Elemento iluminado</option>
            <option value="Estructura física">Estructura física</option>
            <option value="Material impreso">Material impreso</option>
            <option value="Piezas por metro cuadrado">Piezas por metro cuadrado</option>
            <option value="Servicio">Servicio</option>
          </select>
          {(busqueda || filtroCategoria) && (
            <button onClick={() => { setBusqueda(''); setFiltroCategoria(''); }}
              className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors px-2">
              ✕ Limpiar
            </button>
          )}
        </div>

        {/* TABLA */}
        <div className="flex justify-between items-center mb-4 border-b-2 border-emerald-100 pb-2">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Catálogo de Artículos - Vista Proveedor</h2>
          <span className="bg-emerald-800 text-white px-4 py-1 rounded-full text-xs font-bold">
            {tarifasFiltradas.length} Items
          </span>
        </div>

        {tarifasFiltradas.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No hay artículos registrados.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1e3a5f] text-white">
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Código</th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Pieza</th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Tipo Cotización</th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Especificación</th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Medida</th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Mi Precio</th>
                    <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tarifasFiltradas.map((t, index) => (
                    <tr key={t.id} className={`hover:bg-emerald-50/40 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                      <td className="px-4 py-3">
                        <span className="font-black text-blue-700 text-sm">{t.codigo}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900 text-sm">{t.pieza}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${TIPO_BADGE[t.cotizacion_tipo] || 'bg-gray-100 text-gray-700'}`}>
                          {t.cotizacion_tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-xs text-gray-500 line-clamp-2">{t.descripcion_material || '-'}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.medida || '-'}</td>
                      <td className="px-4 py-3">
                        {editingId === t.id ? (
                          <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                            className="w-24 p-1.5 border-2 border-emerald-400 rounded-lg text-sm outline-none focus:border-emerald-600"
                            placeholder="0.00" autoFocus />
                        ) : misPrecios[t.id] ? (
                          <span className="text-lg font-black text-emerald-700">${misPrecios[t.id]}</span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Sin precio</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {editingId === t.id ? (
                            <>
                              <button onClick={() => handleSetMyPrice(t.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                Guardar
                              </button>
                              <button onClick={() => { setEditingId(null); setEditPrice(''); }}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button onClick={() => { setEditingId(t.id); setEditPrice(misPrecios[t.id] || ''); }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                              {misPrecios[t.id] ? 'Editar Precio' : 'Cotizar'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProveedorPage;
