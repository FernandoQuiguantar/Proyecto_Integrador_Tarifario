import { useState } from 'react';
import { Button } from './components/Button';
import { TextInput } from './components/TextInput';

// Mock Data (Preparado para API futura)
const materialesData = [
  { id: 1, nombre: "Lona Frontlight", material: "PVC", precio: 25.50, img: "https://via.placeholder.com/300x200?text=Lona" },
  { id: 2, nombre: "Vinilo Adhesivo", material: "Polímero", precio: 18.20, img: "https://via.placeholder.com/300x200?text=Vinilo" },
];

function App() {
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  const filtrados = materialesData.filter(m => 
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Dashboard Principal */}
      <header className="bg-white shadow-sm p-6 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Tarifario de Piezas de Marketing</h1>
          <Button variant="primary">Crear Nuevo</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Buscador Reutilizable */}
        <div className="mb-8 max-w-md">
          <TextInput 
            label="Filtrar materiales"
            placeholder="Ej: Lona..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Listado de Elementos (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtrados.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <img src={item.img} alt={item.nombre} className="w-full h-40 object-cover" />
              <div className="p-4">
                <p className="text-xs text-blue-500 font-bold uppercase">{item.material}</p>
                <h3 className="text-lg font-bold text-gray-800">{item.nombre}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-gray-900">${item.precio}</span>
                  <Button variant="secondary" size="sm">Detalles</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado Vacío (Requisito UI) */}
        {filtrados.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 italic text-lg">No hay resultados para "{busqueda}"</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;