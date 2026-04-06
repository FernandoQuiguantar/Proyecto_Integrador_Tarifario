import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API_BASE from '../config';

function ProveedorEditarPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef(null);

  const [proveedores, setProveedores] = useState([]);
  const [selectedId, setSelectedId] = useState(searchParams.get('id') || '');
  const [form, setForm] = useState({ ruc: '', razon_social: '', correo: '', numero_contacto: '' });
  const [archivo, setArchivo] = useState(null);
  const [preciosParseados, setPreciosParseados] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Cargar lista de proveedores
  useEffect(() => {
    fetch(`${API_BASE}/api/proveedores`)
      .then(r => r.ok ? r.json() : [])
      .then(lista => {
        setProveedores(lista);
        // Si viene ?id= en la URL, pre-seleccionar
        const id = searchParams.get('id');
        if (id) {
          const found = lista.find(p => String(p.id) === String(id));
          if (found) {
            setSelectedId(String(found.id));
            setForm({ ruc: found.ruc, razon_social: found.razon_social, correo: found.correo, numero_contacto: found.numero_contacto });
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectProveedor = (id) => {
    setSelectedId(id);
    setMsg(null);
    setArchivo(null);
    setPreciosParseados(null);
    setParseError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const found = proveedores.find(p => String(p.id) === String(id));
    if (found) {
      setForm({ ruc: found.ruc, razon_social: found.razon_social, correo: found.correo, numero_contacto: found.numero_contacto });
    } else {
      setForm({ ruc: '', razon_social: '', correo: '', numero_contacto: '' });
    }
  };

  const handleArchivoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setArchivo(file);
    setParseError(null);
    setPreciosParseados(null);

    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const sheet = workbook.worksheets[0];

      const precios = [];
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // fila 1 = encabezados
        const id     = row.getCell(1).value;
        const precio = row.getCell(11).value;
        if (id && precio !== null && precio !== '' && Number(precio) > 0) {
          precios.push({ tarifa_id: Number(id), precio: Number(precio) });
        }
      });

      setPreciosParseados({ count: precios.length, precios });
    } catch {
      setParseError('No se pudo leer el archivo. Use un Excel generado desde este sistema.');
      setArchivo(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      setMsg({ tipo: 'error', texto: 'Seleccione un proveedor para editar.' });
      return;
    }
    const { ruc, razon_social, correo, numero_contacto } = form;
    if (!ruc || !razon_social || !correo || !numero_contacto) {
      setMsg({ tipo: 'error', texto: 'Todos los campos son requeridos.' });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      // 1. Actualizar datos del proveedor
      const resProv = await fetch(`${API_BASE}/api/proveedores/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruc, razon_social, correo, numero_contacto }),
      });

      if (!resProv.ok) {
        const data = await resProv.json();
        setMsg({ tipo: 'error', texto: data.message || 'Error al actualizar proveedor.' });
        return;
      }

      // 2. Cargar precios si se subió Excel
      let textoPrecios = '';
      if (preciosParseados && preciosParseados.count > 0) {
        let ok = 0, fail = 0;
        for (const { tarifa_id, precio } of preciosParseados.precios) {
          try {
            const res = await fetch(`${API_BASE}/api/precios`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ tarifa_id, proveedor_email: correo, proveedor_nombre: razon_social, precio }),
            });
            if (res.ok) ok++; else fail++;
          } catch {
            fail++;
          }
        }
        textoPrecios = ` ${ok} precio${ok !== 1 ? 's' : ''} actualizado${ok !== 1 ? 's' : ''}.${fail > 0 ? ` ${fail} error(es).` : ''}`;
      }

      // Actualizar lista local
      setProveedores(prev => prev.map(p => String(p.id) === String(selectedId)
        ? { ...p, ruc, razon_social, correo, numero_contacto } : p
      ));

      setMsg({ tipo: 'exito', texto: `Proveedor actualizado correctamente.${textoPrecios}` });
      setArchivo(null);
      setPreciosParseados(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setMsg({ tipo: 'error', texto: 'Error de conexión. Intente nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800 flex items-center justify-center">
      <div className="max-w-xl w-full">

        {/* ENCABEZADO */}
        <header className="bg-[#1e3a5f] text-white p-8 rounded-t-3xl flex justify-between items-center shadow-2xl">
          <div className="flex-1 mr-6">
            <h1 className="text-2xl font-bold tracking-tight">Editar Registro</h1>
            <p className="text-amber-300 text-sm mt-1 font-semibold">Modifica datos o actualiza precios del proveedor</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-md border-2 border-blue-100">
            <img src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png" alt="Logo" className="h-10 w-auto object-contain" />
          </div>
        </header>

        <div className="bg-white p-8 rounded-b-3xl shadow-xl border-x border-b border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Selector de proveedor */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Seleccionar Proveedor</label>
              <select value={selectedId} onChange={e => handleSelectProveedor(e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-amber-500 bg-white transition-colors">
                <option value="">-- Seleccione un proveedor --</option>
                {proveedores.map(p => (
                  <option key={p.id} value={p.id}>{p.razon_social} — {p.ruc}</option>
                ))}
              </select>
            </div>

            {selectedId && (
              <>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-4">Datos del Proveedor</p>
                </div>

                {/* RUC */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">RUC</label>
                  <input type="text" maxLength={13} value={form.ruc}
                    onChange={e => setForm(p => ({ ...p, ruc: e.target.value }))}
                    className="p-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors" />
                </div>

                {/* Razón Social */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Razón Social</label>
                  <input type="text" value={form.razon_social}
                    onChange={e => setForm(p => ({ ...p, razon_social: e.target.value }))}
                    className="p-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors" />
                </div>

                {/* Correo */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Correo</label>
                  <input type="email" value={form.correo}
                    onChange={e => setForm(p => ({ ...p, correo: e.target.value }))}
                    className="p-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors" />
                </div>

                {/* Número de Contacto */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Número de Contacto</label>
                  <input type="tel" value={form.numero_contacto}
                    onChange={e => setForm(p => ({ ...p, numero_contacto: e.target.value }))}
                    className="p-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-amber-500 transition-colors" />
                </div>

                {/* Cargar nuevo Excel (opcional) */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Actualizar Precios (opcional)</label>
                  <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleArchivoChange} />
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 border-2 border-dashed border-amber-400 hover:border-amber-600 hover:bg-amber-50 text-amber-700 font-bold py-3 px-4 rounded-xl text-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 8l5-5 5 5M12 3v12" />
                    </svg>
                    {archivo ? archivo.name : 'Cargar Excel con nuevos precios'}
                  </button>

                  {parseError && (
                    <p className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-lg">{parseError}</p>
                  )}
                  {preciosParseados && (
                    <p className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                      ✓ {preciosParseados.count} precio{preciosParseados.count !== 1 ? 's' : ''} encontrado{preciosParseados.count !== 1 ? 's' : ''} en el archivo.
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Mensaje resultado */}
            {msg && (
              <p className={`text-sm font-semibold px-4 py-3 rounded-xl ${msg.tipo === 'exito' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {msg.texto}
              </p>
            )}

            {selectedId && (
              <div className="flex flex-col gap-3">
                <button type="submit" disabled={loading}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-black py-3 rounded-xl text-sm transition-colors uppercase tracking-wide">
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button type="button" disabled={loading}
                  onClick={async () => {
                    if (!window.confirm('¿Estás seguro de eliminar este proveedor? Se eliminarán también todos sus precios registrados.')) return;
                    setLoading(true);
                    try {
                      const res = await fetch(`${API_BASE}/api/proveedores/${selectedId}`, { method: 'DELETE' });
                      if (res.ok) {
                        setProveedores(prev => prev.filter(p => String(p.id) !== String(selectedId)));
                        setSelectedId('');
                        setForm({ ruc: '', razon_social: '', correo: '', numero_contacto: '' });
                        setMsg({ tipo: 'exito', texto: 'Proveedor eliminado correctamente.' });
                      } else {
                        const data = await res.json();
                        setMsg({ tipo: 'error', texto: data.message || 'Error al eliminar proveedor.' });
                      }
                    } catch {
                      setMsg({ tipo: 'error', texto: 'Error de conexión.' });
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-red-50 hover:bg-red-500 hover:text-white text-red-600 border border-red-200 hover:border-red-500 font-bold py-3 rounded-xl text-sm transition-all uppercase tracking-wide">
                  🗑️ Eliminar Proveedor
                </button>
              </div>
            )}

            <button type="button" onClick={() => navigate('/proveedor')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center">
              ← Volver
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProveedorEditarPage;
