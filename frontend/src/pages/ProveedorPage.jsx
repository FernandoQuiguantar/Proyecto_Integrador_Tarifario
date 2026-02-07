import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function ProveedorPage() {
  const navigate = useNavigate();
  const [tarifas, setTarifas] = useState([]);
  const [misPrecios, setMisPrecios] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [proveedorInfo, setProveedorInfo] = useState(null);

  const API_URL = 'http://localhost:3000/api/tarifas';
  const PRECIOS_URL = 'http://localhost:3000/api/precios';

  const fetchTarifas = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      const data = await res.json();
      setTarifas(data);
    } catch (err) {
      console.error("Error al cargar el tarifario:", err);
    }
  };

  const fetchMisPrecios = async (tarifasList, email) => {
    const preciosMap = {};
    for (const t of tarifasList) {
      try {
        const res = await fetch(`${PRECIOS_URL}/${t.id}`);
        if (res.ok) {
          const precios = await res.json();
          const miPrecio = precios.find(p => p.proveedor_email === email);
          if (miPrecio) {
            preciosMap[t.id] = miPrecio.precio;
          }
        }
      } catch (err) {
        
      }
    }
    setMisPrecios(preciosMap);
  };

  useEffect(() => {
    const proveedor = localStorage.getItem('proveedor');
    if (!proveedor) {
      navigate('/login-proveedor');
      return;
    }
    const info = JSON.parse(proveedor);
    setProveedorInfo(info);

    fetchTarifas().then(() => {});
  }, [navigate]);

  useEffect(() => {
    if (proveedorInfo && tarifas.length > 0) {
      fetchMisPrecios(tarifas, proveedorInfo.email);
    }
  }, [tarifas, proveedorInfo]);

  const handleSetMyPrice = async (tarifaId) => {
    if (!editPrice || Number(editPrice) <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }
    try {
      const res = await fetch(PRECIOS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tarifa_id: tarifaId,
          proveedor_email: proveedorInfo.email,
          proveedor_nombre: proveedorInfo.nombre,
          precio: Number(editPrice)
        })
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

  const handleLogout = () => {
    localStorage.removeItem('proveedor');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">

        {/* ENCABEZADO */}
        <header className="bg-[#1e3a5f] text-white p-10 rounded-3xl flex justify-between items-start relative shadow-2xl mb-12">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Proyecto Integrador: Tarifario de Marketing
            </h1>
            <p className="text-gray-300 italic text-lg font-medium">
              Desarrollado por: Erick Quiguantar - PUCE
            </p>
            <p className="text-emerald-300 text-sm mt-2 font-semibold">
              Panel de Proveedor {proveedorInfo ? `- ${proveedorInfo.nombre}` : ''}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="bg-white p-4 rounded-xl shadow-md border-2 border-blue-100">
              <img
                src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png"
                alt="Logo Shopping"
                className="h-12 w-auto object-contain"
              />
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* SECCIÓN DE CATÁLOGO (TABLA) */}
        <div className="flex justify-between items-center mb-8 border-b-2 border-emerald-100 pb-2">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Catálogo de Artículos - Vista Proveedor</h2>
          <span className="bg-emerald-800 text-white px-4 py-1 rounded-full text-xs font-bold">
            {tarifas.length} Items
          </span>
        </div>

        {tarifas.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No hay artículos registrados. ¡Comienza agregando uno!</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">  
                <thead>
                  <tr className="bg-[#1e3a5f] text-white">
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Imagen</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Pieza</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Dimensiones</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Precio Base</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Mi Precio</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tarifas.map((t, index) => (
                    <tr key={t.id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="px-6 py-4">
                        <img
                          src={t.imagen_url || 'https://via.placeholder.com/60x60?text=IMG'}
                          alt={t.pieza}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-200"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{t.pieza}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                          {t.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t.ancho || 0} x {t.alto || 0}
                        {t.profundidad > 0 ? ` x ${t.profundidad}` : ''} {t.unidad}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-gray-500">${t.precio_base}</span>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === t.id ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={e => setEditPrice(e.target.value)}
                            className="w-24 p-1.5 border-2 border-emerald-400 rounded-lg text-sm outline-none focus:border-emerald-600"
                            placeholder="0.00"
                          />
                        ) : (
                          misPrecios[t.id] ? (
                            <span className="text-xl font-black text-emerald-700">${misPrecios[t.id]}</span>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Sin precio</span>
                          )
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {editingId === t.id ? (
                            <>
                              <button
                                onClick={() => handleSetMyPrice(t.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => { setEditingId(null); setEditPrice(''); }}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button
                                onClick={() => { setEditingId(t.id); setEditPrice(misPrecios[t.id] || ''); }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                              >
                                {misPrecios[t.id] ? 'Editar Mi Precio' : 'Agregar Mi Precio'}
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
