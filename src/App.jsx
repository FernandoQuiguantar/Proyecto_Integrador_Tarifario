import { useState, useEffect } from 'react';
import MyButton from './components/MyButton';
import MyInput from './components/MyInput';
import Card from './components/Card'; 

function App() {
  const [tarifas, setTarifas] = useState([]);
  const [error, setError] = useState('');
  
  // Estado inicial con las dimensiones separadas y unidad de medida
  const [form, setForm] = useState({ 
    pieza: '', 
    ancho: '',      
    alto: '',       
    profundidad: '', 
    unidad: 'cm',   
    precio_base: '', 
    categoria: 'Digital',
    imagen_url: '' 
  });

  const API_URL = 'http://localhost:3000/api/tarifas';

  // Carga inicial de datos desde el Backend
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

  useEffect(() => {
    fetchTarifas();
  }, []);

  // Función para guardar una nueva pieza
  const handleSave = async () => {
    setError('');
    if (!form.pieza || !form.precio_base) {
      return setError('Nombre y Precio son campos obligatorios');
    }
    
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al guardar");
      } else {
        // Reset del formulario tras el éxito
        setForm({ 
          pieza: '', ancho: '', alto: '', profundidad: '', 
          unidad: 'cm', precio_base: '', categoria: 'Digital', imagen_url: '' 
        });
        fetchTarifas(); // Recargamos la lista
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor del Tarifario.");
    }
  };

  // Función para eliminar
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este material del catálogo?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTarifas();
      } catch (err) {
        alert("Error al intentar eliminar.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO ESTILO INSTITUCIONAL */}
        <header className="bg-[#1e3a5f] text-white p-10 rounded-t-3xl flex justify-between items-start relative shadow-2xl">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Proyecto Integrador: Tarifario de Marketing
            </h1>
            <p className="text-gray-300 italic text-lg font-medium">
              Desarrollado por: Erick Quiguantar - PUCE
            </p>
          </div>
          {/* Logo Shoppingmanagements en recuadro blanco */}
          <div className="bg-white p-4 rounded-xl shadow-md ml-4 border-2 border-blue-100">
            <img 
              src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png" 
              alt="Logo Shopping" 
              className="h-12 w-auto object-contain"
            />
          </div>
        </header>

        {/* FORMULARIO DE REGISTRO */}
        <div className="bg-white p-8 rounded-b-3xl shadow-xl border-x border-b border-gray-100 mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2">
            <span className="bg-blue-100 p-2 rounded-lg text-blue-600"></span> Registrar Nuevo Material
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Nombre y URL ocupan más espacio */}
            <div className="lg:col-span-2">
              <MyInput label="Nombre de la Pieza" value={form.pieza} onChange={e => setForm({...form, pieza: e.target.value})} placeholder="Ej: Gigantografía Exterior" />
            </div>
            <div className="lg:col-span-2">
              <MyInput label="URL de Imagen" value={form.imagen_url} onChange={e => setForm({...form, imagen_url: e.target.value})} placeholder="https://ejemplo.com/foto.jpg" />
            </div>
            
            {/* Dimensiones Independientes */}
            <MyInput label="Ancho" type="number" value={form.ancho} onChange={e => setForm({...form, ancho: e.target.value})} placeholder="0.00" />
            <MyInput label="Alto" type="number" value={form.alto} onChange={e => setForm({...form, alto: e.target.value})} placeholder="0.00" />
            <MyInput label="Profundidad/Altura" type="number" value={form.profundidad} onChange={e => setForm({...form, profundidad: e.target.value})} placeholder="0.00" />

            {/* Selector de Unidades */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-1">Unidad</label>
              <select 
                className="p-2.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500 transition-colors"
                value={form.unidad} 
                onChange={e => setForm({...form, unidad: e.target.value})}
              >
                <option value="cm">Centímetros (cm)</option>
                <option value="mts">Metros (mts)</option>
                <option value="px">Píxeles (px)</option>
                <option value="in">Pulgadas (in)</option>
                <option value="und">Unidades (und)</option>
              </select>
            </div>

            {/* Precio y Categoría */}
            <MyInput label="Precio Base ($)" type="number" value={form.precio_base} onChange={e => setForm({...form, precio_base: e.target.value})} placeholder="0.00" />
            
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-1">Categoría</label>
              <select 
                className="p-2.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500 transition-colors"
                value={form.categoria} 
                onChange={e => setForm({...form, categoria: e.target.value})}
              >
                <option value="Digital">Digital</option>
                <option value="Impreso">Impreso</option>
                <option value="Audiovisual">Audiovisual</option>
              </select>
            </div>
            
            {/* Botón Guardar - Variante Primary que configuramos */}
            <div className="flex items-end lg:col-span-2">
              <MyButton onClick={handleSave} variant="primary">
                Guardar Material
              </MyButton>
            </div>
          </div>
          
          {error && <p className="text-red-500 mt-4 font-bold animate-pulse text-sm">⚠️ {error}</p>}
        </div>

        {/* SECCIÓN DE CATÁLOGO (CARDS) */}
        <div className="flex justify-between items-center mb-8 border-b-2 border-blue-100 pb-2">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Catálogo de Servicios, Piezas y Materiales </h2>
          <span className="bg-blue-900 text-white px-4 py-1 rounded-full text-xs font-bold">
            {tarifas.length} Items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tarifas.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No hay registros en el tarifario. ¡Comienza agregando uno!</p>
            </div>
          ) : (
            tarifas.map((t) => (
              <Card 
                key={t.id} 
                tarifa={t} 
                onDelete={handleDelete} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;