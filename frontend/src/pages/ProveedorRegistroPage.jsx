import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../config';

const FORM_INITIAL = { ruc: '', razon_social: '', correo: '', numero_contacto: '' };

function ProveedorRegistroPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(FORM_INITIAL);
  const [archivo, setArchivo] = useState(null);
  const [preciosParseados, setPreciosParseados] = useState(null); // { count, precios[] }
  const [parseError, setParseError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

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
      setParseError('No se pudo leer el archivo. Asegúrese de cargar un Excel válido generado desde este sistema.');
      setArchivo(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ruc, razon_social, correo, numero_contacto } = form;

    if (!ruc || !razon_social || !correo || !numero_contacto) {
      setMsg({ tipo: 'error', texto: 'Todos los campos del formulario son requeridos.' });
      return;
    }
    if (!preciosParseados || preciosParseados.count === 0) {
      setMsg({ tipo: 'error', texto: 'Carga el Excel con al menos un precio ingresado.' });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      // 1. Registrar proveedor
      const resProveedor = await fetch(`${API_BASE}/api/proveedores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruc, razon_social, correo, numero_contacto }),
      });

      if (!resProveedor.ok) {
        const data = await resProveedor.json();
        // Si ya existe (409) continúa igualmente para cargar precios
        if (resProveedor.status !== 409) {
          setMsg({ tipo: 'error', texto: data.message || 'Error al registrar proveedor.' });
          return;
        }
      }

      // 2. Cargar precios
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

      setMsg({
        tipo: 'exito',
        texto: `Proveedor "${razon_social}" registrado. ${ok} precio${ok !== 1 ? 's' : ''} cargado${ok !== 1 ? 's' : ''} correctamente.${fail > 0 ? ` ${fail} error(es).` : ''}`,
      });
      setForm(FORM_INITIAL);
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
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Registrar Proveedor</h1>
            <p className="text-emerald-300 text-sm mt-1 font-semibold">Ingresa tus datos y carga el Excel con precios</p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-md border-2 border-blue-100">
            <img src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png" alt="Logo" className="h-10 w-auto object-contain" />
          </div>
        </header>

        {/* FORMULARIO */}
        <div className="bg-white p-8 rounded-b-3xl shadow-xl border-x border-b border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* RUC */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">RUC</label>
              <input type="text" maxLength={13} value={form.ruc}
                onChange={e => setForm(p => ({ ...p, ruc: e.target.value }))}
                placeholder="Ej: 1234567890001"
                className="p-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors" />
            </div>

            {/* Razón Social */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Razón Social</label>
              <input type="text" value={form.razon_social}
                onChange={e => setForm(p => ({ ...p, razon_social: e.target.value }))}
                placeholder="Nombre de la empresa"
                className="p-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors" />
            </div>

            {/* Correo */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Correo</label>
              <input type="email" value={form.correo}
                onChange={e => setForm(p => ({ ...p, correo: e.target.value }))}
                placeholder="correo@empresa.com"
                className="p-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors" />
            </div>

            {/* Número de Contacto */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Número de Contacto</label>
              <input type="tel" value={form.numero_contacto}
                onChange={e => setForm(p => ({ ...p, numero_contacto: e.target.value }))}
                placeholder="Ej: 0991234567"
                className="p-3 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors" />
            </div>

            {/* Cargar Excel */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Excel con Precios</label>
              <input ref={fileInputRef} type="file" accept=".xlsx" className="hidden" onChange={handleArchivoChange} />
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 border-2 border-dashed border-emerald-400 hover:border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold py-3 px-4 rounded-xl text-sm transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 8l5-5 5 5M12 3v12" />
                </svg>
                {archivo ? archivo.name : 'Seleccionar archivo Excel'}
              </button>

              {parseError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-lg">{parseError}</p>
              )}

              {preciosParseados && (
                <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg">
                  ✓ Se encontraron <strong>{preciosParseados.count}</strong> precio{preciosParseados.count !== 1 ? 's' : ''} en el archivo.
                </p>
              )}
            </div>

            {/* Mensaje resultado */}
            {msg && (
              <p className={`text-sm font-semibold px-4 py-3 rounded-xl ${msg.tipo === 'exito' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {msg.texto}
              </p>
            )}

            {/* Botón submit */}
            <button type="submit" disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-black py-3 rounded-xl text-sm transition-colors uppercase tracking-wide">
              {loading ? 'Registrando y cargando precios...' : 'Registrar Proveedor y Cargar Precios'}
            </button>

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

export default ProveedorRegistroPage;
