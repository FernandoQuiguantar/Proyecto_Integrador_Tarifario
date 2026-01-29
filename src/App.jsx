import { useState } from 'react';
import { Button } from './components/Button';
import { TextInput } from './components/TextInput';
import { materialesData } from './data/material.js'; 

function App() {
  const [busqueda, setBusqueda] = useState("");
  const [detalleItem, setDetalleItem] = useState(null);

  // Lógica de filtrado para el buscador
  const filtrados = materialesData.filter(m => 
    m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.material.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
  <div className="min-h-screen bg-gray-50 font-sans">
  {/* Encabezado Principal */}
  <header className="bg-white shadow-sm p-4 mb-8 sticky top-0 z-10 border-b border-gray-100">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      
      <div className="flex items-center gap-6">
        <img 
          src="https://imgbum.jobscdn.com/portal/img/empresas/0/0/0/2/2/7/2/3/7/0/logoMainPic_2272370_bum_vd8331334.jpg" 
          alt="Logo" 
          className="h-25 w-auto object-contain" 
        />
        <div className="h-10 w-[1px] bg-gray-200 hidden md:block"></div>
        <h1 className="text-xl md:text-2xl font-bold text-blue-600 italic leading-tight">
          Tarifario de Piezas de Marketing
        </h1>
      </div>

      <Button variant="primary" onClick={() => alert('Pendiente')}>
        Crear Nuevo
      </Button>
      
    </div>
  </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        {/* Buscador Reutilizable */}
        <div className="mb-10 max-w-md">
          <TextInput 
            label="Buscar por nombre o material"
            placeholder="Ej: Lona, Stand..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Listado de Materiales (Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtrados.map(item => {
            // Cálculo automático del precio más bajo entre los proveedores
            const precioMasBajo = item.proveedores && item.proveedores.length > 0
              ? Math.min(...item.proveedores.map(p => p.precio))
              : item.precio;

            return (
              <div key={item.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group">
                <div className="relative overflow-hidden">
                   <img 
                    src={item.img} 
                    alt={item.nombre} 
                    className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110 bg-gray-100" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-tighter">
                      {item.material}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.nombre}
                  </h3>
                  
                  <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-50">
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Mejor Oferta</p>
                      <span className="text-2xl font-black text-green-600">
                        ${precioMasBajo.toFixed(2)}
                      </span>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => setDetalleItem(item)}
                    >
                      Detalles
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estado de Búsqueda Vacía */}
        {filtrados.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-400 text-lg">
              No hay resultados para "<span className="font-semibold">{busqueda}</span>"
            </p>
          </div>
        )}
      </main>

      {/* Detalle*/}
      {detalleItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-lg w-full shadow-2xl relative animate-in slide-in-from-bottom-8">
            <button 
              onClick={() => setDetalleItem(null)}
              className="absolute top-6 right-6 text-gray-300 hover:text-gray-600 text-4xl leading-none transition-colors"
            >
              &times;
            </button>

            <div className="mb-6">
              <h2 className="text-3xl font-black text-gray-900 leading-tight">
                {detalleItem.nombre}
              </h2>
              <p className="text-blue-500 font-bold uppercase text-xs tracking-[0.2em] mt-1">
                Material: {detalleItem.material}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-blue-50/50 border border-blue-100 p-4 rounded-2xl mb-6">
              <span className="text-xl">📏</span>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Dimensiones</p>
                <p className="text-sm font-bold text-blue-900">
                    {detalleItem.medida}
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-8 text-sm leading-relaxed italic">
              "{detalleItem.descripcion}"
            </p>
            
            <div className="bg-gray-50/80 rounded-3xl p-6 mb-8 border border-gray-100">
              <h4 className="font-black text-gray-800 text-xs uppercase tracking-widest mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Precios por Proveedor
              </h4>
              <ul className="space-y-3">
                {(detalleItem.proveedores || []).map((p, index) => (
                  <li key={index} className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-50">
                    <span className="text-gray-600 font-semibold">{p.nombre}</span>
                    <span className="font-black text-green-600 text-xl">${p.precio.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Button 
              variant="primary" 
              className="w-full py-5 rounded-2xl text-lg font-bold shadow-xl shadow-blue-100"
              onClick={() => setDetalleItem(null)}
            >
              Cerrar Detalle
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;