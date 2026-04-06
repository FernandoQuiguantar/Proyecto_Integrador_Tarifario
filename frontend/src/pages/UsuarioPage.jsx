import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import MyButton from '../components/MyButton';
import MyInput from '../components/MyInput';
import Card from '../components/Card';
import API_BASE from '../config';

function UsuarioPage() {
  const navigate = useNavigate();
  const { account, rol, loadingRol, logout } = useAuth();

  const [tarifas, setTarifas] = useState([]);
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroCentro, setFiltroCentro] = useState('');
  const [pagina, setPagina] = useState(1);
  const ITEMS_POR_PAGINA = 20;

  const [form, setForm] = useState({
    codigo: '',
    pieza: '',
    cotizacion_tipo: 'Mantenimiento',
    descripcion_material: '',
    medida: '',
    cantidad: '',
    categoria: 'Elemento iluminado',
    centro_comercial: 'INMODIAMANTE',
    imagen_url: ''
  });

  const API_URL = `${API_BASE}/api/tarifas`;
  const UPLOAD_URL = `${API_BASE}/api/upload`;
  const puedeEditar = rol === 'admin' || rol === 'editor';
  const puedeGestionar = rol === 'admin';

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('imagen', file);
    try {
      const res = await fetch(UPLOAD_URL, { method: 'POST', body: data });
      const json = await res.json();
      if (res.ok) setForm(f => ({ ...f, imagen_url: json.url }));
    } catch (err) {
      console.error('Error al subir imagen:', err);
    }
  };

  const fetchTarifas = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error en la respuesta del servidor');
      setTarifas(await res.json());
    } catch (err) {
      console.error('Error al cargar el tarifario:', err);
    }
  };

  useEffect(() => {
    if (!loadingRol) {
      if (!account) { navigate('/login-usuario'); return; }
      if (rol !== 'admin' && rol !== 'editor' && rol !== 'visor') { navigate('/login-usuario'); return; }
      fetchTarifas();
    }
  }, [account, rol, loadingRol, navigate]);

  const handleSave = async () => {
    setError('');
    if (!form.codigo) return setError('El código es obligatorio (Ej: IMP-001)');
    if (!form.pieza) return setError('El nombre de la pieza es obligatorio');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al guardar');
      } else {
        setForm({
          codigo: '', pieza: '', cotizacion_tipo: 'Mantenimiento',
          descripcion_material: '', medida: '', cantidad: '',
          categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE', imagen_url: ''
        });
        fetchTarifas();
      }
    } catch {
      setError('No se pudo conectar con el servidor del Tarifario.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta cotización del catálogo?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTarifas();
      } catch {
        alert('Error al intentar eliminar.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login-usuario');
  };

  const handleSyncImagenes = async () => {
    if (!window.confirm('¿Deseas propagar las imágenes a todos los artículos que comparten el mismo código y centro comercial?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/tarifas/sync-imagenes`, { method: 'POST' });
      const data = await res.json();
      alert(data.message);
      if (data.actualizados > 0) fetchTarifas();
    } catch (err) {
      alert('Error al sincronizar imágenes: ' + err.message);
    }
  };

  const tarifasFiltradas = tarifas.filter(t => {
    const texto = busqueda.toLowerCase();
    const coincideTexto = !busqueda ||
      t.pieza?.toLowerCase().includes(texto) ||
      t.codigo?.toLowerCase().includes(texto) ||
      t.descripcion_material?.toLowerCase().includes(texto);
    const coincideCategoria = !filtroCategoria || t.categoria === filtroCategoria;
    const coincideCentro = !filtroCentro || t.centro_comercial === filtroCentro;
    return coincideTexto && coincideCategoria && coincideCentro;
  });

  const gruposMap = tarifasFiltradas.reduce((acc, t) => {
    if (!acc[t.codigo]) acc[t.codigo] = [];
    acc[t.codigo].push(t);
    return acc;
  }, {});
  const grupos = Object.values(gruposMap);
  const totalPaginas = Math.ceil(grupos.length / ITEMS_POR_PAGINA);
  const gruposPagina = grupos.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  if (loadingRol) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-500 font-semibold">Verificando acceso...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">

        {/* ENCABEZADO */}
        <header className="bg-[#1e3a5f] text-white p-10 rounded-t-3xl flex justify-between items-start shadow-2xl">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-2 whitespace-nowrap">Tarifario SMO</h1>
            <p className="text-blue-200 text-sm mt-1 font-semibold">
              {puedeGestionar ? 'Panel Administrador' : puedeEditar ? 'Panel Editor' : 'Panel Visor'} —{' '}
              <span className="text-white">{account?.name || account?.username}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="bg-white p-4 rounded-xl shadow-md border-2 border-blue-100">
              <img src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png" alt="Logo" className="h-12 w-auto object-contain" />
            </div>
            <button onClick={() => navigate('/')} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              ← Inicio
            </button>
            {puedeGestionar && (
              <button onClick={() => navigate('/admin/roles')} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                👥 Gestionar Accesos
              </button>
            )}
            <button onClick={handleLogout} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* FORMULARIO — admin y editor */}
        {puedeEditar && (
          <div className="bg-white rounded-b-3xl shadow-xl border-x border-b border-gray-100 mb-8">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                <span className="bg-blue-100 p-2 rounded-lg text-blue-600">📋</span>
                Registrar Nuevo Material / Cotización
              </h2>
              <button
                onClick={() => setFormVisible(!formVisible)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors"
              >
                {formVisible ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>Minimizar</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>Expandir</>
                )}
              </button>
            </div>

            {formVisible && (
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <MyInput label="Código" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} placeholder="Ej: IMP-001" />
                  </div>
                  <div className="lg:col-span-3">
                    <MyInput label="Nombre de la Pieza" value={form.pieza} onChange={e => setForm({...form, pieza: e.target.value})} placeholder="Ej: Gigantografía Exterior" />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-1">Tipo de Cotización</label>
                    <select className="p-2.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500 transition-colors"
                      value={form.cotizacion_tipo} onChange={e => setForm({...form, cotizacion_tipo: e.target.value})}>
                      <option value="Mantenimiento">Mantenimiento</option>
                      <option value="Brandeo">Brandeo</option>
                      <option value="Nuevo">Nuevo</option>
                      <option value="Comprar Nuevo">Comprar Nuevo</option>
                    </select>
                  </div>

                  <div className="lg:col-span-3 flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-1">Descripción del Material</label>
                    <textarea
                      className="p-2.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500 transition-colors resize-none text-sm"
                      rows={2}
                      value={form.descripcion_material}
                      onChange={e => setForm({...form, descripcion_material: e.target.value})}
                      placeholder="Ej: Vinil adhesivo removible mate, laminado brillante..."
                    />
                  </div>

                  <MyInput label="Medida" value={form.medida} onChange={e => setForm({...form, medida: e.target.value})} placeholder="Ej: 2x3 mts" />
                  <MyInput label="Cantidad" type="number" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} placeholder="0" />

                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-1">Categoría</label>
                    <select className="p-2.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500 transition-colors"
                      value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                      <option value="Elemento iluminado">Elemento iluminado</option>
                      <option value="Estructura física">Estructura física</option>
                      <option value="Material impreso">Material impreso</option>
                      <option value="Piezas por metro cuadrado">Piezas por metro cuadrado</option>
                      <option value="Servicio">Servicio</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-1">Centro Comercial</label>
                    <select className="p-2.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500 transition-colors"
                      value={form.centro_comercial} onChange={e => setForm({...form, centro_comercial: e.target.value})}>
                      <option value="INMODIAMANTE">INMODIAMANTE</option>
                      <option value="CONDADO">CONDADO</option>
                      <option value="CCI">CCI</option>
                    </select>
                  </div>

                  <div className="lg:col-span-2 flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-1">Imagen</label>
                    <input type="file" accept="image/*" onChange={handleImagenChange}
                      className="p-2 border-2 border-gray-200 rounded-xl text-sm bg-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 cursor-pointer" />
                    {form.imagen_url && (
                      <img src={form.imagen_url} alt="preview" className="mt-2 h-16 w-auto rounded-lg object-cover border border-gray-200" />
                    )}
                  </div>

                  <div className="flex items-end lg:col-span-2">
                    <MyButton onClick={handleSave} variant="primary">Guardar Cotización</MyButton>
                  </div>
                </div>
                {error && <p className="text-red-500 mt-4 font-bold text-sm">⚠️ {error}</p>}
              </div>
            )}
          </div>
        )}

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className={`bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-8 flex flex-col md:flex-row gap-4 ${!puedeEditar ? 'rounded-t-3xl' : ''}`}>
          <div className="flex-1 relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input type="text" value={busqueda} onChange={e => { setBusqueda(e.target.value); setPagina(1); }}
              placeholder="Buscar por nombre, código o material..."
              className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm" />
          </div>
          <select value={filtroCategoria} onChange={e => { setFiltroCategoria(e.target.value); setPagina(1); }}
            className="p-2.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500 text-sm min-w-[200px]">
            <option value="">Todas las categorías</option>
            <option value="Elemento iluminado">Elemento iluminado</option>
            <option value="Estructura física">Estructura física</option>
            <option value="Material impreso">Material impreso</option>
            <option value="Piezas por metro cuadrado">Piezas por metro cuadrado</option>
            <option value="Servicio">Servicio</option>
          </select>
          <select value={filtroCentro} onChange={e => { setFiltroCentro(e.target.value); setPagina(1); }}
            className="p-2.5 border-2 border-gray-200 rounded-xl bg-white outline-none focus:border-blue-500 text-sm min-w-[170px]">
            <option value="">Todos los centros</option>
            <option value="INMODIAMANTE">INMODIAMANTE</option>
            <option value="CONDADO">CONDADO</option>
            <option value="CCI">CCI</option>
          </select>
          {(busqueda || filtroCategoria || filtroCentro) && (
            <button onClick={() => { setBusqueda(''); setFiltroCategoria(''); setFiltroCentro(''); setPagina(1); }}
              className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors px-2">
              ✕ Limpiar
            </button>
          )}
        </div>

        {/* CATÁLOGO */}
        <div className="flex justify-between items-center mb-8 border-b-2 border-blue-100 pb-2">
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Catálogo de Servicios, Piezas y Materiales</h2>
          <div className="flex items-center gap-3">
            {puedeEditar && (
              <button
                onClick={handleSyncImagenes}
                title="Copia la imagen de artículos que la tienen hacia los que comparten el mismo código y centro comercial"
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
              >
                🖼️ Sincronizar Imágenes
              </button>
            )}
            <span className="bg-blue-900 text-white px-4 py-1 rounded-full text-xs font-bold">
              {grupos.length} Artículos
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {grupos.length === 0 ? (
            <div className="col-span-full bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">
                {tarifas.length === 0 ? 'No hay registros en el tarifario.' : 'No se encontraron resultados para los filtros aplicados.'}
              </p>
            </div>
          ) : (
            gruposPagina.map(grupo => (
              <Card
                key={grupo[0].codigo}
                grupo={grupo}
                onDelete={puedeEditar ? handleDelete : null}
                onUpdate={puedeEditar ? fetchTarifas : null}
                soloLectura={!puedeEditar}
              />
            ))
          )}
        </div>

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 mb-4 flex-wrap">
            <button
              onClick={() => { setPagina(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={pagina === 1}
              className="px-3 py-2 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              «
            </button>
            <button
              onClick={() => { setPagina(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={pagina === 1}
              className="px-3 py-2 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ‹
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 2)
              .reduce((acc, n, idx, arr) => {
                if (idx > 0 && n - arr[idx - 1] > 1) acc.push('...');
                acc.push(n);
                return acc;
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={`dots-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => { setPagina(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all ${
                      pagina === item
                        ? 'bg-blue-900 border-blue-900 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => { setPagina(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={pagina === totalPaginas}
              className="px-3 py-2 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ›
            </button>
            <button
              onClick={() => { setPagina(totalPaginas); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={pagina === totalPaginas}
              className="px-3 py-2 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              »
            </button>

            <span className="text-xs text-gray-400 ml-2">
              Página {pagina} de {totalPaginas} — {grupos.length} artículos
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsuarioPage;
