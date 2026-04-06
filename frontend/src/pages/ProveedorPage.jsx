import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import API_BASE from '../config';

const CENTROS    = ['CCI', 'CONDADO', 'INMODIAMANTE'];
const CATEGORIAS = ['Elemento iluminado', 'Estructura física', 'Material impreso', 'Piezas por metro cuadrado', 'Servicio'];

function ProveedorPage() {
  const navigate = useNavigate();
  const { rol } = useAuth();
  const puedeEditar = rol === 'admin' || rol === 'editor';
  const [tarifas, setTarifas] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportCentros, setExportCentros] = useState([...CENTROS]);
  const [exportCategorias, setExportCategorias] = useState([...CATEGORIAS]);

  useEffect(() => {
    fetch(`${API_BASE}/api/tarifas`)
      .then(r => r.ok ? r.json() : [])
      .then(setTarifas)
      .catch(() => {});
  }, []);

  const toggleCheck = (valor, setLista) => {
    setLista(prev => prev.includes(valor) ? prev.filter(v => v !== valor) : [...prev, valor]);
  };

  const handleSyncImagenes = async () => {
    if (!window.confirm('¿Deseas propagar las imágenes a todos los artículos que comparten el mismo código y centro comercial?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/tarifas/sync-imagenes`, { method: 'POST' });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert('Error al sincronizar imágenes: ' + err.message);
    }
  };

  const fetchImageData = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      const mimeType = blob.type || 'image/jpeg';
      const rawExt = mimeType.split('/')[1] || 'jpeg';
      const extension = rawExt === 'jpg' ? 'jpeg' : rawExt;
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ base64: reader.result.split(',')[1], extension });
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const handleExportExcel = async () => {
    if (exportCentros.length === 0 || exportCategorias.length === 0) {
      alert('Selecciona al menos un centro comercial y una categoría.');
      return;
    }
    setShowExportModal(false);
    setExportLoading(true);
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Tarifario');

      // Definir columnas sin header (los headers se agregan manualmente en fila 2)
      sheet.columns = [
        { key: 'id',          width: 8  },
        { key: 'cc',          width: 18 },
        { key: 'categoria',   width: 24 },
        { key: 'codigo',      width: 15 },
        { key: 'pieza',       width: 32 },
        { key: 'tipo',        width: 20 },
        { key: 'descripcion', width: 38 },
        { key: 'medida',      width: 15 },
        { key: 'imagen_url',  width: 45 },
        { key: 'imagen',      width: 18 },
        { key: 'precio',      width: 16 },
      ];

      sheet.getColumn(9).hidden = true;  // Link Imagen (col I)

      // Fila 1: encabezados
      const headerRow = sheet.addRow([
        'ID', 'Centro Comercial', 'Categoría', 'Código', 'Pieza',
        'Tipo Cotización', 'Especificación', 'Medida', 'Link Imagen', 'Imagen', 'Mi Precio (USD)',
      ]);
      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1e3a5f' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.protection = { locked: true };
      });
      headerRow.height = 22;

      // AutoFilter en fila 1 (A1:K1)
      sheet.autoFilter = { from: 'A1', to: 'K1' };

      const filtradas = tarifas.filter(t =>
        exportCentros.includes(t.centro_comercial) &&
        exportCategorias.includes(t.categoria)
      );

      const imagenesData = await Promise.all(
        filtradas.map(t =>
          t.imagen_url && t.imagen_url.trim() !== '' ? fetchImageData(t.imagen_url) : Promise.resolve(null)
        )
      );

      // Datos desde fila 2
      filtradas.forEach((t, idx) => {
        const rowNum = idx + 2;
        const row = sheet.addRow({
          id: t.id, cc: t.centro_comercial || '', categoria: t.categoria || '',
          codigo: t.codigo || '', pieza: t.pieza || '', tipo: t.cotizacion_tipo || '',
          descripcion: t.descripcion_material || '', medida: t.medida || '',
          imagen_url: t.imagen_url || '', imagen: '', precio: '',
        });
        row.height = 80;

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (colNumber === 11) {
            // Col K: Mi Precio — editable, resaltado en amarillo
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF99' } };
            cell.font = { bold: true, color: { argb: 'FF1a6b3a' } };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.protection = { locked: false };
          } else {
            cell.font = { color: { argb: 'FF333333' } };
            cell.alignment = { vertical: 'middle' };
            cell.protection = { locked: true };
            if (colNumber === 1) cell.font = { color: { argb: 'FF999999' }, size: 9 };
            if (colNumber === 10) cell.alignment = { horizontal: 'center', vertical: 'middle' };
          }
        });

        // Incrustar imagen en col J (índice 0-based = 9)
        const imgData = imagenesData[idx];
        if (imgData) {
          const imageId = workbook.addImage({ base64: imgData.base64, extension: imgData.extension });
          sheet.addImage(imageId, {
            tl: { col: 9, row: rowNum - 1 },
            ext: { width: 140, height: 75 },
            editAs: 'oneCell',
          });
        }
      });


      // Proteger hoja: solo col K (precio) es editable
      await sheet.protect('', {
        selectLockedCells: true,
        selectUnlockedCells: true,
        autoFilter: true,
        sort: true,
        formatCells: false,
        formatColumns: false,
        formatRows: false,
        insertColumns: false,
        insertRows: false,
        deleteColumns: false,
        deleteRows: false,
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Tarifario SMO.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error al generar el Excel.');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-gray-800 flex items-center justify-center">
      <div className="max-w-2xl w-full">

        {/* ENCABEZADO */}
        <header className="bg-[#1e3a5f] text-white p-10 rounded-t-3xl flex justify-between items-start shadow-2xl">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight mb-2 whitespace-nowrap">Tarifario SMO</h1>
            <p className="text-emerald-300 text-sm mt-1 font-semibold">Portal de Proveedores</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md ml-4 border-2 border-blue-100">
            <img src="https://smo.ec/wp-content/uploads/2024/11/cropped-Shop_Icono_LogoShoppingV22.png" alt="Logo" className="h-12 w-auto object-contain" />
          </div>
        </header>

        {/* BOTONES PRINCIPALES */}
        <div className="bg-white p-12 rounded-b-3xl shadow-xl border-x border-b border-gray-100">
          <h2 className="text-2xl font-black text-gray-800 text-center mb-2 uppercase tracking-tight">
            ¿Qué desea hacer?
          </h2>
          <p className="text-gray-500 text-center mb-10 text-sm">Seleccione una opción para continuar</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Exportar Excel */}
            <button
              onClick={() => { setExportCentros([...CENTROS]); setExportCategorias([...CATEGORIAS]); setShowExportModal(true); }}
              disabled={exportLoading || tarifas.length === 0}
              className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-7 rounded-2xl shadow-lg hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📥</div>
              <h3 className="text-lg font-bold mb-1">{exportLoading ? 'Generando...' : 'Exportar Excel'}</h3>
              <p className="text-blue-200 text-xs">Descarga el catálogo para cotizar</p>
            </button>

            {/* Registrar Proveedor */}
            <button
              onClick={() => navigate('/proveedor/registro')}
              className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-7 rounded-2xl shadow-lg hover:shadow-emerald-500/40 hover:scale-105 transition-all duration-300 group text-left"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏢</div>
              <h3 className="text-lg font-bold mb-1">Registrar Proveedor</h3>
              <p className="text-emerald-200 text-xs">Ingresa datos y carga precios</p>
            </button>

            {/* Lista de Proveedores */}
            <button
              onClick={() => navigate('/proveedor/lista')}
              className="bg-gradient-to-br from-violet-600 to-violet-900 text-white p-7 rounded-2xl shadow-lg hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300 group text-left"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="text-lg font-bold mb-1">Lista de Proveedores</h3>
              <p className="text-violet-200 text-xs">Ver registros y ofertas por centro comercial</p>
            </button>

            {/* Editar Registro */}
            <button
              onClick={() => navigate('/proveedor/editar')}
              className="bg-gradient-to-br from-amber-500 to-amber-700 text-white p-7 rounded-2xl shadow-lg hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 group text-left"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">✏️</div>
              <h3 className="text-lg font-bold mb-1">Editar Registro</h3>
              <p className="text-amber-100 text-xs">Modifica datos o actualiza precios</p>
            </button>
          </div>

          <button onClick={() => navigate('/')} className="mt-8 w-full text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← Volver al inicio
          </button>
        </div>
      </div>

      {/* MODAL FILTROS EXPORTAR */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Filtros de Exportación</h3>
              <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">✕</button>
            </div>

            {/* Centro Comercial */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-gray-500 uppercase">Centro Comercial</p>
                <button onClick={() => setExportCentros([...CENTROS])} className="text-xs text-blue-600 hover:underline font-semibold">Seleccionar todo</button>
              </div>
              <div className="flex flex-col gap-2">
                {CENTROS.map(cc => (
                  <label key={cc} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={exportCentros.includes(cc)}
                      onChange={() => toggleCheck(cc, setExportCentros)}
                      className="w-4 h-4 accent-blue-700 cursor-pointer" />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">{cc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 mb-5" />

            {/* Categoría */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-gray-500 uppercase">Categoría</p>
                <button onClick={() => setExportCategorias([...CATEGORIAS])} className="text-xs text-blue-600 hover:underline font-semibold">Seleccionar todo</button>
              </div>
              <div className="flex flex-col gap-2">
                {CATEGORIAS.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={exportCategorias.includes(cat)}
                      onChange={() => toggleCheck(cat, setExportCategorias)}
                      className="w-4 h-4 accent-blue-700 cursor-pointer" />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {puedeEditar && (
              <>
                <div className="border-t border-gray-100 mb-4" />
                <div className="bg-indigo-50 rounded-xl p-3 mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-indigo-700">🖼️ Sincronizar Imágenes</p>
                    <p className="text-xs text-indigo-500 mt-0.5">Propaga imágenes a artículos con el mismo código y centro comercial.</p>
                  </div>
                  <button
                    onClick={handleSyncImagenes}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Sincronizar
                  </button>
                </div>
              </>
            )}

            <p className="text-xs text-gray-400 mb-4">
              Se exportarán <strong className="text-gray-700">
                {tarifas.filter(t => exportCentros.includes(t.centro_comercial) && exportCategorias.includes(t.categoria)).length}
              </strong> artículos.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowExportModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors">
                Cancelar
              </button>
              <button onClick={handleExportExcel}
                disabled={exportCentros.length === 0 || exportCategorias.length === 0}
                className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProveedorPage;
