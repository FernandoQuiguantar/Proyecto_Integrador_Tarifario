import { useState } from 'react';
import MyButton from './MyButton';

const Card = ({ tarifa, onDelete }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [precios, setPrecios] = useState([]);
  const [loading, setLoading] = useState(false);

  const PRECIOS_URL = 'http://localhost:3000/api/precios';

  const handleToggleDetail = async () => {
    if (showDetail) {
      setShowDetail(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${PRECIOS_URL}/${tarifa.id}`);
      if (res.ok) {
        const data = await res.json();
        setPrecios(data);
      }
    } catch (err) {
      console.error("Error al cargar precios:", err);
    }
    setLoading(false);
    setShowDetail(true);
  };

  const precioMenor = precios.length > 0 ? Math.min(...precios.map(p => p.precio)) : null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group">
      {/* Contenedor de Imagen */}
      <div className="h-48 bg-gray-100 overflow-hidden relative">
        <img
          src={tarifa.imagen_url || 'https://via.placeholder.com/400x300?text=Material+Marketing'}
          alt={tarifa.pieza}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-blue-900 shadow-sm">
          {tarifa.categoria}
        </div>
      </div>

      {/* Contenedor de Información */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
          {tarifa.pieza}
        </h3>

        {/* Recuadro de Dimensiones */}
        <div className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
          <p className="text-xs text-gray-400 uppercase font-bold mb-1">Dimensiones</p>
          <p className="text-sm text-gray-700 font-medium">
            {tarifa.ancho || 0} x {tarifa.alto || 0}
            {tarifa.profundidad > 0 ? ` x ${tarifa.profundidad}` : ''}
            <span className="ml-1 text-blue-600 font-bold">{tarifa.unidad}</span>
          </p>
        </div>

        {/* Precio base y acciones */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black text-blue-900">
            ${tarifa.precio_base}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleToggleDetail}
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md hover:shadow-blue-400/50 transition-all duration-300 active:scale-95"
            >
              {showDetail ? 'Cerrar' : 'Ver Detalle'}
            </button>
            <MyButton
              variant="danger"
              size="sm"
              onClick={() => onDelete(tarifa.id)}
            >
              Eliminar
            </MyButton>
          </div>
        </div>

        {/* Panel de detalle con precios de proveedores */}
        {showDetail && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-3">
              Comparativa de Precios por Proveedor
            </h4>

            {loading ? (
              <p className="text-gray-400 text-sm">Cargando...</p>
            ) : precios.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <p className="text-gray-400 text-sm">Ningún proveedor ha registrado precio aún</p>
              </div>
            ) : (
              <div className="space-y-2">
                {precios.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`flex justify-between items-center p-3 rounded-xl border ${
                      p.precio === precioMenor
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${
                        p.precio === precioMenor ? 'bg-emerald-600' : 'bg-gray-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-bold text-gray-800 text-sm">
                        {p.proveedor_nombre}
                      </span>
                      {p.precio === precioMenor && (
                        <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                          MEJOR PRECIO
                        </span>
                      )}
                    </div>
                    <span className={`text-lg font-black ${
                      p.precio === precioMenor ? 'text-emerald-700' : 'text-gray-600'
                    }`}>
                      ${p.precio}
                    </span>
                  </div>
                ))}

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
