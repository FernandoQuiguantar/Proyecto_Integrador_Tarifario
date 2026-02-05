<<<<<<< HEAD
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
=======
import { useState } from 'react';
import { Button } from './components/Button';
import { TextInput } from './components/TextInput';
import { materialesData as initialData } from './data/material.js'; 

function App() {
  // --- ESTADOS ---
  const [materiales, setMateriales] = useState(initialData);
  const [busqueda, setBusqueda] = useState("");
  const [detalleItem, setDetalleItem] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  
  // Estado para el formulario con validación
  const [formulario, setFormulario] = useState({
    nombre: '', material: '', medida: '', descripcion: '', precio: ''
  });

  // --- LÓGICA DE FORMULARIO ---
  const abrirFormulario = (item = null) => {
    if (item) {
      setEditandoId(item.id);
      setFormulario({
        nombre: item.nombre,
        material: item.material,
        medida: item.medida,
        descripcion: item.descripcion || "",
        precio: item.proveedores?.[0]?.precio || item.precio
      });
    } else {
      setEditandoId(null);
      setFormulario({ nombre: '', material: '', medida: '', descripcion: '', precio: '' });
    }
    setMostrarForm(true);
  };

  const guardarCambios = () => {
    // Validaciones Básicas
    if (!formulario.nombre.trim() || !formulario.material.trim() || !formulario.precio) {
      alert("Por favor, completa los campos obligatorios: Nombre, Material y Precio.");
      return;
    }

    if (editandoId) {
      // Lógica de EDICIÓN
      setMateriales(materiales.map(m => m.id === editandoId ? {
        ...m,
        ...formulario,
        proveedores: [{ nombre: "Proveedor Principal", precio: parseFloat(formulario.precio) }]
      } : m));
    } else {
      // Lógica de CREACIÓN
      const nuevo = {
        ...formulario,
        id: Date.now(),
        img: "https://via.placeholder.com/300x200?text=Nuevo+Material",
        proveedores: [{ nombre: "Proveedor Principal", precio: parseFloat(formulario.precio) }]
      };
      setMateriales([nuevo, ...materiales]);
    }
    setMostrarForm(false);
  };

  // --- FILTRADO ---
  const filtrados = materiales.filter(m => 
    m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    m.material.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* 1. HEADER*/}
      <header className="bg-white shadow-sm p-4 mb-8 sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <img 
              src="https://imgbum.jobscdn.com/portal/img/empresas/0/0/0/2/2/7/2/3/7/0/logoMainPic_2272370_bum_vd8331334.jpg" 
              alt="Logo Tomebamba" 
              className="h-18 w-auto object-contain" 
            />
            <div className="h-12 w-[2px] bg-gray-200 hidden md:block"></div>
            <h1 className="text-xl md:text-2xl font-bold text-blue-600 italic leading-tight">
              Tarifario de Piezas de Marketing
            </h1>
          </div>
          <Button variant="primary" onClick={() => abrirFormulario()}>
            Crear Nuevo
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        
        {/* 2. BUSCADOR  */}
        <div className="mb-10 max-w-md">
          <TextInput 
            label="Buscar pieza o material"
            placeholder="Ej: Lona, Stand..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* 3. CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtrados.map(item => {
            const precioMasBajo = item.proveedores && item.proveedores.length > 0
              ? Math.min(...item.proveedores.map(p => p.precio))
              : item.precio;

            return (
              <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col group overflow-hidden hover:shadow-xl transition-all">
                <img src={item.img} alt={item.nombre} className="w-full h-52 object-cover bg-gray-100" />
                <div className="p-6 flex-grow flex flex-col">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-tighter">{item.material}</span>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{item.nombre}</h3>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase">Mejor Precio</p>
                      <span className="text-2xl font-black text-green-600">${precioMasBajo.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => abrirFormulario(item)}>Editar</Button>
                      <Button variant="primary" size="sm" onClick={() => setDetalleItem(item)}>Detalle</Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 4. CREAR / EDITAR */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editandoId ? 'Editar Material' : 'Nuevo Material - Pieza'}
            </h2>
            <div className="space-y-4">
              <TextInput label="Nombre *" value={formulario.nombre} onChange={(e) => setFormulario({...formulario, nombre: e.target.value})} />
              <TextInput label="Material *" value={formulario.material} onChange={(e) => setFormulario({...formulario, material: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <TextInput label="Medida" value={formulario.medida} onChange={(e) => setFormulario({...formulario, medida: e.target.value})} />
                <TextInput label="Precio ($) *" type="number" value={formulario.precio} onChange={(e) => setFormulario({...formulario, precio: e.target.value})} />
              </div>
              <TextInput label="Descripción" value={formulario.descripcion} onChange={(e) => setFormulario({...formulario, descripcion: e.target.value})} />
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="secondary" className="flex-1" onClick={() => setMostrarForm(false)}>Cancelar</Button>
              <Button variant="primary" className="flex-1" onClick={guardarCambios}>Guardar</Button>
            </div>
          </div>
        </div>
      )}

      {/* 5.VISTA DETALLE */}
      {detalleItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setDetalleItem(null)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-600 text-4xl">&times;</button>
            <h2 className="text-3xl font-black text-gray-900 leading-tight">{detalleItem.nombre}</h2>
            <p className="text-blue-500 font-bold uppercase text-xs mb-6 tracking-widest">{detalleItem.material}</p>
            
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-6">
              <span className="text-xl">📏</span>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Dimensiones</p>
                <p className="text-sm font-bold text-blue-900">{detalleItem.medida || "Estándar"}</p>
              </div>
            </div>

            <p className="text-gray-600 mb-8 text-sm leading-relaxed italic">"{detalleItem.descripcion}"</p>

            <div className="bg-gray-50 rounded-3xl p-6 mb-8">
              <h4 className="font-black text-gray-800 text-xs uppercase mb-4">Proveedores</h4>
              <ul className="space-y-3">
                {(detalleItem.proveedores || []).map((p, index) => (
                  <li key={index} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                    <span className="text-gray-600 font-semibold">{p.nombre}</span>
                    <span className="font-black text-green-600 text-xl">${p.precio.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="primary" className="w-full py-5 rounded-2xl" onClick={() => setDetalleItem(null)}>Cerrar</Button>
          </div>
        </div>
      )}
>>>>>>> d0d50ecb48ef9ae6907b76fb7f8b46b002634c61
    </div>
  );
}

export default App;