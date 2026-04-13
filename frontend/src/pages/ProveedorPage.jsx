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
        { key: 'id',          width: 14 },
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

      // Fila 1: identificación del proveedor
      const proveedorRow = sheet.addRow(['Proveedor:', '', '', '', '', '', '', '', '', '', '']);
      proveedorRow.height = 22;
      proveedorRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.protection = { locked: colNumber !== 3 }; // solo C1 editable
        if (colNumber === 1) {
          cell.font = { bold: true, color: { argb: 'FF1e3a5f' }, size: 11 };
          cell.alignment = { horizontal: 'right', vertical: 'middle' };
        } else if (colNumber === 3) {
          cell.font = { bold: true, size: 11 };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE599' } };
          cell.alignment = { vertical: 'middle' };
          cell.border = { bottom: { style: 'thin', color: { argb: 'FF1e3a5f' } } };
        }
      });

      // Fila 2: encabezados
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

      // AutoFilter en fila 2 (A2:K2)
      sheet.autoFilter = { from: 'A2', to: 'K2' };

      const filtradas = tarifas.filter(t =>
        exportCentros.includes(t.centro_comercial) &&
        exportCategorias.includes(t.categoria)
      );

      const imagenesData = await Promise.all(
        filtradas.map(t =>
          t.imagen_url && t.imagen_url.trim() !== '' ? fetchImageData(t.imagen_url) : Promise.resolve(null)
        )
      );

      // Datos desde fila 3
      filtradas.forEach((t, idx) => {
        const rowNum = idx + 3;
        const row = sheet.addRow({
          id: t.id, cc: t.centro_comercial || '', categoria: t.categoria || '',
          codigo: t.codigo || '', pieza: t.pieza || '', tipo: t.cotizacion_tipo || '',
          descripcion: t.descripcion_material || '', medida: t.medida || '',
          imagen_url: t.imagen_url || '', imagen: '', precio: '',
        });
        row.height = 80;

        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          if (colNumber === 11) {
            // Col K: Mi Precio — editable, solo numérico
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

      // Validación numérica en col K (desde fila 3)
      sheet.dataValidations.add(`K3:K1048576`, {
        type: 'decimal',
        operator: 'greaterThanOrEqual',
        formulae: [0],
        showErrorMessage: true,
        errorStyle: 'stop',
        errorTitle: 'Valor inválido',
        error: 'Solo se permiten valores numéricos (ej: 12.50)',
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

      // ── HOJA INSTRUCTIVO ──────────────────────────────────────────
      const inst = workbook.addWorksheet('Instructivo');
      inst.columns = [
        { key: 'a', width: 28 },
        { key: 'b', width: 70 },
      ];

      const COLOR_AZUL   = 'FF1e3a5f';
      const COLOR_BLANCO = 'FFFFFFFF';
      const COLOR_GRIS   = 'FFF2F2F2';
      const COLOR_ROJO   = 'FFC0392B';
      const COLOR_VERDE  = 'FF1a6b3a';
      const COLOR_AMARI  = 'FFFFE599';

      const addInstRow = (col1, col2, opts = {}) => {
        const row = inst.addRow([col1, col2]);
        row.height = opts.height || 18;
        row.getCell(1).font      = { bold: opts.boldLeft  ?? false, color: { argb: opts.colorLeft  || 'FF333333' }, size: opts.size || 11 };
        row.getCell(2).font      = { bold: opts.boldRight ?? false, color: { argb: opts.colorRight || 'FF333333' }, size: opts.size || 11 };
        row.getCell(1).alignment = { vertical: 'middle', horizontal: opts.alignLeft  || 'left', wrapText: true };
        row.getCell(2).alignment = { vertical: 'middle', horizontal: opts.alignRight || 'left', wrapText: true };
        if (opts.fillLeft)  row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.fillLeft  } };
        if (opts.fillRight) row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.fillRight } };
        if (opts.fillBoth) {
          row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.fillBoth } };
          row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.fillBoth } };
        }
        row.eachCell({ includeEmpty: true }, cell => { cell.protection = { locked: true }; });
        return row;
      };

      // Título principal
      inst.mergeCells('A1:B1');
      const tituloCell = inst.getCell('A1');
      tituloCell.value     = 'INSTRUCTIVO — TARIFARIO SMO';
      tituloCell.font      = { bold: true, color: { argb: COLOR_BLANCO }, size: 14 };
      tituloCell.alignment = { horizontal: 'center', vertical: 'middle' };
      tituloCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_AZUL } };
      tituloCell.protection = { locked: true };
      inst.getRow(1).height = 32;

      inst.mergeCells('A2:B2');
      const subCell = inst.getCell('A2');
      subCell.value     = 'Guía para el correcto llenado del archivo de cotización';
      subCell.font      = { italic: true, color: { argb: 'FF555555' }, size: 10 };
      subCell.alignment = { horizontal: 'center', vertical: 'middle' };
      subCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8EDF3' } };
      subCell.protection = { locked: true };
      inst.getRow(2).height = 20;

      addInstRow('', '', { height: 8 });

      // Sección: Campos del archivo
      inst.mergeCells('A4:B4');
      const sec1 = inst.getCell('A4');
      sec1.value     = '📋  DESCRIPCIÓN DE CAMPOS';
      sec1.font      = { bold: true, color: { argb: COLOR_BLANCO }, size: 11 };
      sec1.alignment = { horizontal: 'left', vertical: 'middle' };
      sec1.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_AZUL } };
      sec1.protection = { locked: true };
      inst.getRow(4).height = 22;

      // Encabezado tabla
      addInstRow('Campo', 'Descripción', {
        boldLeft: true, boldRight: true,
        colorLeft: COLOR_BLANCO, colorRight: COLOR_BLANCO,
        fillBoth: 'FF2c5282', height: 20,
      });

      const campos = [
        ['Proveedor (C1)',    'Escriba el nombre completo o razón social de su empresa. Es el único campo editable fuera de la columna de precios.'],
        ['ID',               'Identificador interno del artículo. No modificar.'],
        ['Centro Comercial', 'Mall o centro al que pertenece el artículo (INMODIAMANTE, CONDADO, CCI). No modificar.'],
        ['Categoría',        'Tipo de material o servicio (ej: Elemento iluminado, Material impreso). No modificar.'],
        ['Código',           'Código único del artículo en el sistema. No modificar.'],
        ['Pieza',            'Nombre descriptivo del material o servicio. No modificar.'],
        ['Tipo Cotización',  'Indica si es Mantenimiento, Brandeo, Nuevo o Comprar Nuevo. No modificar.'],
        ['Especificación',   'Detalle técnico del material (tipo de vinil, estructura, acabado, etc.). No modificar.'],
        ['Medida',           'Dimensiones del artículo (ej: 2x3 mts). No modificar.'],
        ['Imagen',           'Fotografía de referencia del artículo. Solo visual, no modificar.'],
        ['Mi Precio (USD)',  'ÚNICO CAMPO QUE DEBE LLENAR. Ingrese su precio en dólares (USD) con hasta 2 decimales. Ej: 45.00'],
      ];

      campos.forEach(([ campo, desc ], i) => {
        const esPrecio = campo.includes('Precio');
        addInstRow(campo, desc, {
          boldLeft:   esPrecio,
          boldRight:  esPrecio,
          colorLeft:  esPrecio ? COLOR_VERDE  : 'FF1e3a5f',
          colorRight: esPrecio ? COLOR_VERDE  : 'FF333333',
          fillBoth:   esPrecio ? COLOR_AMARI  : (i % 2 === 0 ? COLOR_GRIS : COLOR_BLANCO),
          height: 30,
        });
      });

      addInstRow('', '', { height: 8 });

      // Sección: Reglas
      const rFila = inst.rowCount + 1;
      inst.mergeCells(`A${rFila}:B${rFila}`);
      const sec2 = inst.getCell(`A${rFila}`);
      sec2.value     = '⚠️  RESTRICCIONES — LO QUE NO PUEDE HACER';
      sec2.font      = { bold: true, color: { argb: COLOR_BLANCO }, size: 11 };
      sec2.alignment = { horizontal: 'left', vertical: 'middle' };
      sec2.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_ROJO } };
      sec2.protection = { locked: true };
      inst.getRow(rFila).height = 22;

      const restricciones = [
        ['❌  Modificar celdas bloqueadas',   'Todos los campos excepto "Proveedor" (C1) y "Mi Precio" (col K) están protegidos. No intente desbloquear la hoja.'],
        ['❌  Ingresar texto en Mi Precio',    'La columna K solo acepta valores numéricos (decimales). Si escribe letras o símbolos, el sistema lo rechazará.'],
        ['❌  Dejar el nombre de proveedor vacío', 'La celda C1 debe contener el nombre de su empresa antes de enviar el archivo.'],
        ['❌  Agregar o eliminar filas/columnas', 'La estructura del archivo no debe modificarse. Agregar o borrar filas o columnas invalidará el archivo.'],
        ['❌  Cambiar el nombre de la hoja',   'La hoja "Tarifario" debe mantener su nombre original para que el sistema pueda procesarla correctamente.'],
        ['❌  Enviar precios en cero o negativos', 'Los precios deben ser mayores a cero. Un precio de 0 se interpretará como "sin oferta".'],
        ['❌  Modificar el formato de las celdas', 'No cambiar fuentes, colores ni bordes de las celdas bloqueadas.'],
      ];

      restricciones.forEach(([ titulo, desc ], i) => {
        addInstRow(titulo, desc, {
          boldLeft:   true,
          colorLeft:  COLOR_ROJO,
          colorRight: 'FF555555',
          fillBoth:   i % 2 === 0 ? 'FFFFF0F0' : COLOR_BLANCO,
          height: 30,
        });
      });

      addInstRow('', '', { height: 8 });

      // Sección: Pasos
      const pFila = inst.rowCount + 1;
      inst.mergeCells(`A${pFila}:B${pFila}`);
      const sec3 = inst.getCell(`A${pFila}`);
      sec3.value     = '✅  PASOS PARA COMPLETAR EL ARCHIVO';
      sec3.font      = { bold: true, color: { argb: COLOR_BLANCO }, size: 11 };
      sec3.alignment = { horizontal: 'left', vertical: 'middle' };
      sec3.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_VERDE } };
      sec3.protection = { locked: true };
      inst.getRow(pFila).height = 22;

      const pasos = [
        ['Paso 1', 'Abra la hoja "Tarifario" del archivo.'],
        ['Paso 2', 'En la celda C1 (fondo amarillo), escriba el nombre de su empresa o razón social.'],
        ['Paso 3', 'Revise los artículos listados. Puede usar los filtros de la fila 2 para encontrar los que le corresponden.'],
        ['Paso 4', 'En la columna K "Mi Precio (USD)", ingrese su precio para cada artículo que desea cotizar.'],
        ['Paso 5', 'Deje en blanco las filas de artículos que no desea cotizar.'],
        ['Paso 6', 'Guarde el archivo y envíelo al contacto de SMO indicado.'],
      ];

      pasos.forEach(([ paso, desc ], i) => {
        addInstRow(paso, desc, {
          boldLeft:   true,
          colorLeft:  COLOR_VERDE,
          colorRight: 'FF333333',
          fillBoth:   i % 2 === 0 ? 'FFf0fff4' : COLOR_BLANCO,
          height: 26,
        });
      });

      // Proteger hoja instructivo (solo lectura total)
      await inst.protect('', {
        selectLockedCells:   true,
        selectUnlockedCells: true,
      });
      // ── FIN HOJA INSTRUCTIVO ──────────────────────────────────────

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
