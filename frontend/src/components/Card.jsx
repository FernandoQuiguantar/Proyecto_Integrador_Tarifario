import { useState } from 'react';
import MyButton from './MyButton';

const API_URL = 'http://localhost:3000/api/tarifas';

const CATEGORIAS = ['Elemento iluminado', 'Estructura física', 'Material impreso', 'Piezas por metro cuadrado', 'Servicio'];
const CENTROS = ['INMODIAMANTE', 'CONDADO', 'CCI'];
const TIPOS = ['Mantenimiento', 'Brandeo', 'Nuevo', 'Comprar nuevo', 'Servicio'];

const TIPO_COLORS = {
  'Mantenimiento': 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
  'Brandeo':       'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  'Nuevo':         'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
  'Comprar Nuevo': 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  'Brandeo/Mantenimiento': 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200',
};
const TIPO_ACTIVE = {
  'Mantenimiento': 'bg-amber-500 text-white border-amber-500',
  'Brandeo':       'bg-blue-600 text-white border-blue-600',
  'Nuevo':         'bg-emerald-600 text-white border-emerald-600',
  'Comprar Nuevo': 'bg-purple-600 text-white border-purple-600',
  'Brandeo/Mantenimiento': 'bg-cyan-600 text-white border-cyan-600',
};

const PRECIOS_URL = 'http://localhost:3000/api/precios';

const Card = ({ grupo, onDelete, onUpdate }) => {
  const base = grupo[0];
  const [activoId, setActivoId] = useState(null);
  const [precios, setPrecios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(null); // tarifa que se está editando
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [editError, setEditError] = useState('');
  const [verImagen, setVerImagen] = useState(false);
  const [añadiendo, setAñadiendo] = useState(false);
  const [añadirForm, setAñadirForm] = useState({});
  const [savingAdd, setSavingAdd] = useState(false);
  const [addError, setAddError] = useState('');

  const tarifaActiva = grupo.find(t => t.id === activoId) || null;

  const handleSelectTipo = async (tarifa) => {
    if (activoId === tarifa.id) {
      setActivoId(null);
      setPrecios([]);
      return;
    }
    setActivoId(tarifa.id);
    setLoading(true);
    setPrecios([]);
    try {
      const res = await fetch(`${PRECIOS_URL}/${tarifa.id}`);
      if (res.ok) setPrecios(await res.json());
    } catch (err) {
      console.error('Error al cargar precios:', err);
    }
    setLoading(false);
  };

  const precioMenor = precios.length > 0 ? Math.min(...precios.map(p => p.precio)) : null;

  const handleOpenAñadir = () => {
    setAddError('');
    setAñadirForm({
      codigo: base.codigo,
      pieza: base.pieza,
      medida: base.medida || '',
      cantidad: base.cantidad || '',
      categoria: base.categoria,
      centro_comercial: base.centro_comercial || 'INMODIAMANTE',
      imagen_url: base.imagen_url || '',
      cotizacion_tipo: 'Mantenimiento',
      descripcion_material: ''
    });
    setAñadiendo(true);
  };

  const handleSaveAñadir = async () => {
    setAddError('');
    setSavingAdd(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(añadirForm)
      });
      if (res.ok) {
        setAñadiendo(false);
        if (onUpdate) onUpdate();
      } else {
        const data = await res.json();
        setAddError(data.message || 'Error al guardar.');
      }
    } catch (err) {
      setAddError('No se pudo conectar con el servidor.');
    }
    setSavingAdd(false);
  };

  const handleOpenEdit = (tarifa) => {
    setEditando(tarifa);
    setEditForm({
      codigo: tarifa.codigo,
      pieza: tarifa.pieza,
      cotizacion_tipo: tarifa.cotizacion_tipo,
      descripcion_material: tarifa.descripcion_material || '',
      medida: tarifa.medida || '',
      cantidad: tarifa.cantidad || '',
      categoria: tarifa.categoria,
      centro_comercial: tarifa.centro_comercial || 'INMODIAMANTE',
      imagen_url: tarifa.imagen_url || ''
    });
  };

  const handleImagenEdit = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    setEditError('');
    const data = new FormData();
    data.append('imagen', file);
    try {
      const res = await fetch('http://localhost:3000/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (res.ok) {
        setEditForm(f => ({ ...f, imagen_url: json.url }));
      } else {
        setEditError('Error al subir la imagen: ' + (json.message || ''));
      }
    } catch (err) {
      setEditError('No se pudo conectar para subir la imagen.');
    }
    setUploadingImg(false);
  };

  const handleSaveEdit = async () => {
    setEditError('');
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/${editando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setEditando(null);
        if (onUpdate) onUpdate();
      } else {
        const data = await res.json();
        setEditError(data.message || 'Error al guardar los cambios.');
      }
    } catch (err) {
      setEditError('No se pudo conectar con el servidor.');
    }
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group">
      {/* Imagen */}
      <div className="h-44 bg-gray-100 overflow-hidden relative cursor-pointer" onClick={() => setVerImagen(true)}>
        <img
          src={base.imagen_url
            ? (base.imagen_url.startsWith('http') ? base.imagen_url : `http://localhost:3000${base.imagen_url}`)
            : 'https://via.placeholder.com/400x300?text=Material+Marketing'
          }
          alt={base.pieza}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-black text-blue-900 shadow-sm">
          {base.categoria}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm0 0v1m-6-7v1m0 10v1M4 11H3m18 0h-1" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 8v6M8 11h6" />
          </svg>
        </div>
      </div>

      {/* LIGHTBOX */}
      {verImagen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setVerImagen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img
              src={base.imagen_url
                ? (base.imagen_url.startsWith('http') ? base.imagen_url : `http://localhost:3000${base.imagen_url}`)
                : 'https://via.placeholder.com/800x600?text=Sin+imagen'
              }
              alt={base.pieza}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setVerImagen(false)}
              className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold shadow-lg hover:bg-gray-100 transition-colors"
            >
              ×
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-2 px-4 rounded-b-2xl text-sm font-semibold">
              {base.pieza}
            </div>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Código y centro comercial */}
        <div className="flex gap-2 mb-2 flex-wrap">
          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg text-xs font-black border border-blue-100">
            {base.codigo}
          </span>
          {base.centro_comercial && (
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-xs font-semibold">
              {base.centro_comercial}
            </span>
          )}
        </div>

        {/* Nombre */}
        <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">
          {base.pieza}
        </h3>

        {/* Medida y cantidad */}
        {(base.medida || base.cantidad > 0) && (
          <p className="text-xs text-gray-500 mb-3">
            {base.medida && <span className="font-semibold">{base.medida}</span>}
            {base.cantidad > 0 && <span className="ml-2 text-blue-600 font-bold">× {base.cantidad}</span>}
          </p>
        )}

        {/* Botones de tipo de cotización */}
        <div className="flex flex-wrap gap-2 mb-3">
          {grupo.map(tarifa => (
            <button
              key={tarifa.id}
              onClick={() => handleSelectTipo(tarifa)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200 ${
                activoId === tarifa.id
                  ? (TIPO_ACTIVE[tarifa.cotizacion_tipo] || 'bg-gray-600 text-white border-gray-600')
                  : (TIPO_COLORS[tarifa.cotizacion_tipo] || 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200')
              }`}
            >
              {tarifa.cotizacion_tipo}
            </button>
          ))}
        </div>

        {/* Panel de cotización */}
        {activoId && (
          <div className="border-t border-gray-100 pt-3 mt-1">
            {/* Descripción del material */}
            {tarifaActiva?.descripcion_material && (
              <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Especificación</p>
                <p className="text-xs text-gray-700 leading-relaxed">{tarifaActiva.descripcion_material}</p>
              </div>
            )}

            {/* Top 3 precios de proveedores */}
            <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
              Top 3 precios de cotización
            </p>

            {loading ? (
              <p className="text-gray-400 text-xs">Cargando precios...</p>
            ) : precios.length === 0 ? (
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <p className="text-gray-400 text-xs">Ningún proveedor ha cotizado aún</p>
              </div>
            ) : (
              <div className="space-y-2">
                {precios.map((p, idx) => (
                  <div
                    key={p.id}
                    className={`flex justify-between items-center p-2.5 rounded-xl border ${
                      p.precio === precioMenor
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                        p.precio === precioMenor ? 'bg-emerald-600' : 'bg-gray-400'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-gray-800 text-xs">{p.proveedor_nombre}</span>
                      {p.precio === precioMenor && (
                        <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                          MEJOR
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-black ${p.precio === precioMenor ? 'text-emerald-700' : 'text-gray-600'}`}>
                      ${p.precio}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botones acción */}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 gap-2 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => handleOpenEdit(activoId ? tarifaActiva : grupo[0])}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-3 py-1.5 rounded-xl transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {activoId ? `Editar ${tarifaActiva?.cotizacion_tipo}` : 'Editar'}
            </button>
            <button
              onClick={handleOpenAñadir}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-white hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 px-3 py-1.5 rounded-xl transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Añadir
            </button>
          </div>
          <MyButton variant="danger" size="sm" onClick={() => onDelete(activoId || grupo[0].id)}>
            {activoId ? `Eliminar ${tarifaActiva?.cotizacion_tipo}` : 'Eliminar'}
          </MyButton>
        </div>
      </div>

      {/* MODAL AÑADIR */}
      {añadiendo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-emerald-700 text-white px-7 py-5 rounded-t-3xl flex justify-between items-center">
              <div>
                <p className="text-xs text-emerald-200 font-semibold uppercase tracking-wider mb-0.5">Nueva cotización para</p>
                <h3 className="text-lg font-bold">{base.codigo} — {base.pieza}</h3>
              </div>
              <button onClick={() => { setAñadiendo(false); setAddError(''); }} className="text-white/70 hover:text-white text-2xl font-light leading-none">×</button>
            </div>

            <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Campos bloqueados */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Código</label>
                <input disabled className="w-full p-2.5 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" value={añadirForm.codigo} readOnly />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Medida</label>
                <input disabled className="w-full p-2.5 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" value={añadirForm.medida} readOnly />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Nombre de la Pieza</label>
                <input disabled className="w-full p-2.5 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" value={añadirForm.pieza} readOnly />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Cantidad</label>
                <input disabled className="w-full p-2.5 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" value={añadirForm.cantidad} readOnly />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Categoría</label>
                <input disabled className="w-full p-2.5 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" value={añadirForm.categoria} readOnly />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Centro Comercial</label>
                <input disabled className="w-full p-2.5 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" value={añadirForm.centro_comercial} readOnly />
              </div>
              {añadirForm.imagen_url && (
                <div className="flex items-center gap-3">
                  <img
                    src={añadirForm.imagen_url.startsWith('http') ? añadirForm.imagen_url : `http://localhost:3000${añadirForm.imagen_url}`}
                    alt="preview"
                    className="h-14 w-auto rounded-lg object-cover border border-gray-200"
                  />
                  <span className="text-xs text-gray-400">Imagen de la pieza</span>
                </div>
              )}

              {/* Campos editables */}
              <div className={añadirForm.imagen_url ? '' : 'md:col-span-2'}>
                <label className="text-xs font-bold text-emerald-700 uppercase mb-1 block">Tipo de Cotización *</label>
                <select className="w-full p-2.5 border-2 border-emerald-300 rounded-xl text-sm outline-none focus:border-emerald-500 bg-white"
                  value={añadirForm.cotizacion_tipo} onChange={e => setAñadirForm({...añadirForm, cotizacion_tipo: e.target.value})}>
                  {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-emerald-700 uppercase mb-1 block">Descripción del Material *</label>
                <textarea rows={4} className="w-full p-2.5 border-2 border-emerald-300 rounded-xl text-sm outline-none focus:border-emerald-500 resize-none"
                  placeholder="Describe el material, especificaciones técnicas..."
                  value={añadirForm.descripcion_material} onChange={e => setAñadirForm({...añadirForm, descripcion_material: e.target.value})} />
              </div>
            </div>

            <div className="px-7 pb-7">
              {addError && <p className="text-red-500 text-sm font-semibold mb-3">⚠️ {addError}</p>}
              <div className="flex justify-end gap-3">
                <button onClick={() => { setAñadiendo(false); setAddError(''); }} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAñadir}
                  disabled={savingAdd}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-xl transition-colors flex items-center gap-2"
                >
                  {savingAdd ? 'Guardando...' : (
                    <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>Añadir cotización</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {editando && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header modal */}
            <div className="bg-[#1e3a5f] text-white px-7 py-5 rounded-t-3xl flex justify-between items-center">
              <div>
                <p className="text-xs text-blue-300 font-semibold uppercase tracking-wider mb-0.5">Editando cotización</p>
                <h3 className="text-lg font-bold">{editando.codigo} — {editando.cotizacion_tipo}</h3>
              </div>
              <button onClick={() => setEditando(null)} className="text-white/70 hover:text-white text-2xl font-light leading-none">×</button>
            </div>

            {/* Formulario */}
            <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Código</label>
                <input className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  value={editForm.codigo} onChange={e => setEditForm({...editForm, codigo: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Tipo de Cotización</label>
                <select className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                  value={editForm.cotizacion_tipo} onChange={e => setEditForm({...editForm, cotizacion_tipo: e.target.value})}>
                  {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Nombre de la Pieza</label>
                <input className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  value={editForm.pieza} onChange={e => setEditForm({...editForm, pieza: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Descripción del Material</label>
                <textarea rows={3} className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
                  value={editForm.descripcion_material} onChange={e => setEditForm({...editForm, descripcion_material: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Medida</label>
                <input className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  value={editForm.medida} onChange={e => setEditForm({...editForm, medida: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Cantidad</label>
                <input type="number" className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  value={editForm.cantidad} onChange={e => setEditForm({...editForm, cantidad: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Categoría</label>
                <select className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                  value={editForm.categoria} onChange={e => setEditForm({...editForm, categoria: e.target.value})}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Centro Comercial</label>
                <select className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                  value={editForm.centro_comercial} onChange={e => setEditForm({...editForm, centro_comercial: e.target.value})}>
                  {CENTROS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Imagen</label>
                <input type="file" accept="image/*" onChange={handleImagenEdit} disabled={uploadingImg}
                  className="w-full p-2 border-2 border-gray-200 rounded-xl text-sm bg-white file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100 cursor-pointer disabled:opacity-60" />
                {uploadingImg && <p className="text-xs text-blue-500 mt-1 font-semibold">Subiendo imagen...</p>}
                {editForm.imagen_url && !uploadingImg && (
                  <img
                    src={editForm.imagen_url.startsWith('http') ? editForm.imagen_url : `http://localhost:3000${editForm.imagen_url}`}
                    alt="preview"
                    className="mt-2 h-16 w-auto rounded-lg object-cover border border-gray-200"
                  />
                )}
              </div>
            </div>

            {/* Footer modal */}
            <div className="px-7 pb-7">
              {editError && <p className="text-red-500 text-sm font-semibold mb-3">⚠️ {editError}</p>}
              <div className="flex justify-end gap-3">
                <button onClick={() => { setEditando(null); setEditError(''); }} className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving || uploadingImg}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl transition-colors flex items-center gap-2"
                >
                  {saving ? 'Guardando...' : uploadingImg ? 'Esperando imagen...' : (
                    <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Guardar cambios</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
