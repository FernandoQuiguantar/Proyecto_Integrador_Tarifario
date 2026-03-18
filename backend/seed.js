const sequelize = require('./config/db');
require('./models/PrecioProveedor');
const Tarifa = require('./models/Tarifa');

const articulos = [
  // ===================== SECCIÓN 1: PIEZAS =====================

  // 1. IMP-001 AFICHE ASCENSOR PANORÁMICO (ESTRUCTURA)
  { codigo: 'IMP-001', pieza: 'AFICHE ASCENSOR PANORÁMICO (ESTRUCTURA)', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Acrílico con botones 0.62X0.82', medida: '0.62x0.82', cantidad: 4, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'IMP-001', pieza: 'AFICHE ASCENSOR PANORÁMICO (ESTRUCTURA)', cotizacion_tipo: 'Nuevo', descripcion_material: 'Backline con luz 0.62X0.82', medida: '0.62x0.82', cantidad: 4, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },

  // 2. EST-001 PUERTAS ASCENSORES
  { codigo: 'EST-001', pieza: 'PUERTAS ASCENSORES', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil adhesivo removible mate', medida: '1x2.10', cantidad: 12, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 3. ILU-001 CAJAS DE LUZ SUBSUELOS Y EXTERNAS
  { codigo: 'ILU-001', pieza: 'CAJAS DE LUZ SUBSUELOS Y EXTERNAS', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Estructura caja de luz tubo cuadrado de 1 pulgada laterales en toll galbanizado pintura al horno', medida: '3X2 Y 4X2', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'ILU-001', pieza: 'CAJAS DE LUZ SUBSUELOS Y EXTERNAS', cotizacion_tipo: 'Brandeo', descripcion_material: 'Lona translucidad', medida: '3X2 Y 4X2', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },

  // 4. ILU-002 CAJAS DE LUZ SUBSUELOS
  { codigo: 'ILU-002', pieza: 'CAJAS DE LUZ SUBSUELOS', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Estructura caja de luz tubo cuadrado de 1 pulgada laterales en toll galbanizado pintura al horno', medida: '15X1.20', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'ILU-002', pieza: 'CAJAS DE LUZ SUBSUELOS', cotizacion_tipo: 'Brandeo', descripcion_material: 'Lona translucidad', medida: '15X1.20', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },

  // 5. ILU-003 CAJAS DE LUZ SUBSUELOS 2
  { codigo: 'ILU-003', pieza: 'CAJAS DE LUZ SUBSUELOS 2', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Estructura caja de luz tubo cuadrado de 1 pulgada laterales en toll galbanizado pintura al horno', medida: '4x0.35x2', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'ILU-003', pieza: 'CAJAS DE LUZ SUBSUELOS 2', cotizacion_tipo: 'Nuevo', descripcion_material: 'Estructuras tipo bastidor elaboradas en tubo cuadrado de 3/4", doble lado. Tapas laterales en tol, lacadas, base en tubo cuadrado con anclajes y expansores', medida: '4x0.35x2', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'ILU-003', pieza: 'CAJAS DE LUZ SUBSUELOS 2', cotizacion_tipo: 'Brandeo', descripcion_material: 'Lona translucidad', medida: '4x0.35x2', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },

  // 6. IMP-003 TOTEMS DE MADERA
  { codigo: 'IMP-003', pieza: 'TOTEMS DE MADERA', cotizacion_tipo: 'Brandeo', descripcion_material: 'Backlite laminado mate', medida: '0.70x1.05 metros', cantidad: 2, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'IMP-003', pieza: 'TOTEMS DE MADERA', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mantenimiento estructura', medida: '0.70x1.05 metros', cantidad: 2, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 7. IMP-002 TENT CARD GIGANTES
  { codigo: 'IMP-002', pieza: 'TENT CARD GIGANTES', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Cintra o MDF con vinil', medida: '1.20x1.60', cantidad: 1, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'IMP-002', pieza: 'TENT CARD GIGANTES', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en vinil sobre cintra', medida: '1.20x1.60', cantidad: 1, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'IMP-002', pieza: 'TENT CARD GIGANTES', cotizacion_tipo: 'Brandeo', descripcion_material: 'Impresión en vinil sobre MDF existente / Por metro M2', medida: '1.20x1.60', cantidad: 1, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 8. IMP-009 PENDONES
  { codigo: 'IMP-009', pieza: 'PENDONES', cotizacion_tipo: 'Nuevo', descripcion_material: 'Estructura tipo bastidor con ganchos y cable', medida: '1.22x2', cantidad: 6, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'IMP-009', pieza: 'PENDONES', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil adhesivo mate', medida: '1.22x2', cantidad: 6, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 9. EST-015 GRADAS ELECTRICAS
  { codigo: 'EST-015', pieza: 'GRADAS ELECTRICAS', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil adhesivo removible mate', medida: '215X74/144X74', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 10. IMP-005 ROMPETRAFICOS
  { codigo: 'IMP-005', pieza: 'ROMPETRAFICOS', cotizacion_tipo: 'Nuevo', descripcion_material: 'Cintra sobre vinil', medida: '25X45', cantidad: 1, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 11. IMP-004 TENCARD LOCALES E ISLA DE SERVICO AL CLIENTE
  { codigo: 'IMP-004', pieza: 'TENCARD LOCALES E ISLA DE SERVICO AL CLIENTE', cotizacion_tipo: 'Nuevo', descripcion_material: 'Pegable full color tiro armado en tipo A', medida: 'A5 Y A4', cantidad: 250, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 12. EST-008 ANFORAS BOLETOS CAMPAÑA GRANDE
  { codigo: 'EST-008', pieza: 'ANFORAS BOLETOS CAMPAÑA GRANDE', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'De estructura en MDF, con formica y pintura incluye: cepillado completo, instalación completa de formica, cambio de base y masillado. Cambio de acrílico transparente de ser el caso.', medida: '1.20*0.90*0.60', cantidad: 2, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-008', pieza: 'ANFORAS BOLETOS CAMPAÑA GRANDE', cotizacion_tipo: 'Brandeo', descripcion_material: 'Impresión en vinil laminado montado sobre PVC de 3mm, brandeo en la parte baja con micoperforado.', medida: '1.20*0.90*0.60', cantidad: 2, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 13. IMP-010 ANFORA PEQUEÑA
  { codigo: 'IMP-010', pieza: 'ANFORA PEQUEÑA', cotizacion_tipo: 'Nuevo', descripcion_material: 'Acrílico 2MM con puerta', medida: '31X47X26', cantidad: 2, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'IMP-010', pieza: 'ANFORA PEQUEÑA', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil adhesivo mate', medida: '31X47X26', cantidad: 2, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 14. EST-002 ANFORA DE MADERA 1.22 X 0.45 CMTRS
  { codigo: 'EST-002', pieza: 'ANFORA DE MADERA 1.22 X 0.45 CMTRS', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mantenimiento estructura', medida: '1.22cm alto x 0.45 ancho', cantidad: 3, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-002', pieza: 'ANFORA DE MADERA 1.22 X 0.45 CMTRS', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil laminado mate', medida: '1.22cm alto x 0.45 ancho', cantidad: 3, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 15. IMP-006 BIG BOY
  { codigo: 'IMP-006', pieza: 'BIG BOY', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión vinil laminado mate sobre MDF de 9mm un lado / Impresión vinil laminado mate / Sobre foam board 5mm un lado / Coroplast 5mm un lado', medida: '1.70 mt alto x 1 mt ancho', cantidad: 1, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'IMP-006', pieza: 'BIG BOY', cotizacion_tipo: 'Brandeo', descripcion_material: 'Impresión vinil laminado mate', medida: '1.70 mt alto x 1 mt ancho', cantidad: 1, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 16. EST-005 EXIBIDORES
  { codigo: 'EST-005', pieza: 'EXIBIDORES', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Acrílico 2mm ensanduchado con estructura metálica con base color gris de 1.49 de alto con bordes para sujeción del acrílico', medida: 'A3', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-005', pieza: 'EXIBIDORES', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Acrílico 2MM', medida: 'A3', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 17. EST-006 BACKING
  { codigo: 'EST-006', pieza: 'BACKING', cotizacion_tipo: 'Brandeo', descripcion_material: 'Lona full color', medida: '3X2', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-006', pieza: 'BACKING', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Estructura tipo bastidor 3X2', medida: '3X2', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 18. EST-010 BRANDEO DE MUEBLE DE COCINA
  { codigo: 'EST-010', pieza: 'BRANDEO DE MUEBLE DE COCINA', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinyl de respaldo gris impreso full color instalado', medida: '163x88cm', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-010', pieza: 'BRANDEO DE MUEBLE DE COCINA', cotizacion_tipo: 'Nuevo', descripcion_material: 'Estructura de MDF laminada', medida: '183x88cm', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 19. EST-009 METEGOL
  { codigo: 'EST-009', pieza: 'METEGOL', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Estructura metálica base templado lona con círculos reforzados. Posterior con malla de protección', medida: '2X2', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 20. ILU-004 CAJA DE LUZ GRANDE
  { codigo: 'ILU-004', pieza: 'CAJA DE LUZ GRANDE', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mueble en estructura metálica con revestimiento de MDF y vinil color negro. Instalaciones eléctricas internas con tubos LED luz blanca y borde perimetral con manguera neón LED.', medida: '3 x 0.2 x 2.1', cantidad: 6, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'ILU-004', pieza: 'CAJA DE LUZ GRANDE', cotizacion_tipo: 'Nuevo', descripcion_material: 'Mueble en estructura metálica con MDF, vinil negro, instalaciones LED, borde perimetral neón. Impresión full color 1440 DPI sobre lona tráslucida tiro y retiro.', medida: '3 x 0.2 x 2.1', cantidad: 6, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'ILU-004', pieza: 'CAJA DE LUZ GRANDE', cotizacion_tipo: 'Brandeo', descripcion_material: 'Impresión full color 1440 DPI sobre lona tráslucida tensada en tiro y retiro.', medida: '3 x 0.2 x 2.1', cantidad: 6, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },

  // 21. ILU-005 CAJA DE LUZ PEQUEÑA
  { codigo: 'ILU-005', pieza: 'CAJA DE LUZ PEQUEÑA', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mueble en estructura metálica con revestimiento de MDF y vinil color negro.', medida: '1.5 x 0.2 x 2.1', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'ILU-005', pieza: 'CAJA DE LUZ PEQUEÑA', cotizacion_tipo: 'Nuevo', descripcion_material: 'Mueble en estructura metálica con MDF, vinil negro, instalaciones LED y borde perimetral. Impresión full color 1440 DPI sobre lona tráslucida tensada.', medida: '1.5 x 0.2 x 2.1', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'ILU-005', pieza: 'CAJA DE LUZ PEQUEÑA', cotizacion_tipo: 'Brandeo', descripcion_material: 'Impresión full color 1440 DPI sobre lona tráslucida tensada en tiro y retiro.', medida: '1.5 x 0.2 x 2.1', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },

  // 22. EST-007 DISPLAY EXPLICATIVO
  { codigo: 'EST-007', pieza: 'DISPLAY EXPLICATIVO', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mueble en estructura metálica con revestimiento de MDF y vinil color negro. Instalaciones eléctricas internas con tubos LED luz blanca.', medida: '0.8 x 0.15 x 2', cantidad: 2, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-007', pieza: 'DISPLAY EXPLICATIVO', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil negro ploteado vaciado con letras en color verde y logo amarillo sobre lona tráslucida tensada en tiro y retiro.', medida: '0.8 x 0.15 x 2', cantidad: 2, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 23. ILU-006 CAJA DE LUZ INTERNA
  { codigo: 'ILU-006', pieza: 'CAJA DE LUZ INTERNA', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mantenimiento estructura y luces', medida: '2.0x6.0', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'ILU-006', pieza: 'CAJA DE LUZ INTERNA', cotizacion_tipo: 'Nuevo', descripcion_material: 'Estructura caja de luz tubo cuadrado de 1 pulgada laterales en toll galbanizado pintura al horno', medida: '2.0x6.0', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'ILU-006', pieza: 'CAJA DE LUZ INTERNA', cotizacion_tipo: 'Brandeo', descripcion_material: 'Lona translucida full color', medida: '2.0x6.0', cantidad: 1, categoria: 'Elemento iluminado', centro_comercial: 'INMODIAMANTE' },

  // 24. IMP-013 LETREROS MASCOTAS
  { codigo: 'IMP-013', pieza: 'LETREROS MASCOTAS', cotizacion_tipo: 'Brandeo', descripcion_material: 'Estructuras en MDF + troquel y vinil impreso full color', medida: '0.5x1.5', cantidad: 2, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'IMP-013', pieza: 'LETREROS MASCOTAS', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Caja de luz con estructura nueva', medida: '0.5x1.5', cantidad: 2, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 25. EST-011 ROMPETRÁFICOS CON ESTRUTURA
  { codigo: 'EST-011', pieza: 'ROMPETRÁFICOS CON ESTRUTURA', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil laminado mate, impresión full color tiro y retiro', medida: '0.70x1.10 / arte 0.50x0.70', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-011', pieza: 'ROMPETRÁFICOS CON ESTRUTURA', cotizacion_tipo: 'Nuevo', descripcion_material: 'Elaborado en tubo cuadrado de 1", pintado con pintura automotriz', medida: '0.70x1.10 / arte 0.50x0.70', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-011', pieza: 'ROMPETRÁFICOS CON ESTRUTURA', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Ganchos y pintura', medida: '0.70x1.10 / arte 0.50x0.70', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 26. EST-003 ACRILICO COUNTER LOGOTIPO EN VINIL PLOTEADO
  { codigo: 'EST-003', pieza: 'ACRILICO COUNTER LOGOTIPO EN VINIL PLOTEADO ISLA SERVICIO AL CLIENTE', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil ploteado con logotipo', medida: '0.5X0.5', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-003', pieza: 'ACRILICO COUNTER LOGOTIPO EN VINIL PLOTEADO ISLA SERVICIO AL CLIENTE', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mantenimiento acrílico y vinil', medida: '0.5X0.5', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 27. IMP-011 INFORMACION SEGÚN DISEÑO VINIL PLOTEADO TROQUELADO LETRAS
  { codigo: 'IMP-011', pieza: 'INFORMACION SEGÚN DISEÑO VINIL PLOTEADO TROQUELADO LETRAS', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil ploteado troquelado', medida: 'Variable', cantidad: 1, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 28. IMP-007 PULSERAS DE PAPEL
  { codigo: 'IMP-007', pieza: 'PULSERAS DE PAPEL', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Polipropileno full color tiro troquelado y laminado', medida: '2*2', cantidad: 2000, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 29. IMP-008 TARJETAS PVC
  { codigo: 'IMP-008', pieza: 'TARJETAS PVC', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Substrato PVC laminación Overlay PVC tamaño 8.6*5.4 espesor 30 mils CR-80 personalización numeración', medida: '8.6x5.4', cantidad: 1000, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 30. EST-013 TOTEMS MDF
  { codigo: 'EST-013', pieza: 'TOTEMS MDF', cotizacion_tipo: 'Nuevo', descripcion_material: 'Estructura en MDF con patas de madera', medida: '0.80X1.60', cantidad: 11, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-013', pieza: 'TOTEMS MDF', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil full color tiro y retiro', medida: '0.80X1.60', cantidad: 11, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-013', pieza: 'TOTEMS MDF', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Pintura patas base o cambio de base', medida: '0.80X1.60', cantidad: 11, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 31. EST-014 TOTEM DE MADERA
  { codigo: 'EST-014', pieza: 'TOTEM DE MADERA', cotizacion_tipo: 'Nuevo', descripcion_material: 'Estructura en MDF con base negra de madera y logo en acrílico 3MM', medida: '0.80X1.60', cantidad: 9, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-014', pieza: 'TOTEM DE MADERA', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil full color tiro y retiro', medida: '0.80X1.60', cantidad: 9, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-014', pieza: 'TOTEM DE MADERA', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Cambio de acrílico y pintura base', medida: '0.80X1.60', cantidad: 9, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 32. EST-012 BASTIDORES EXTERNOS
  { codigo: 'EST-012', pieza: 'BASTIDORES EXTERNOS', cotizacion_tipo: 'Brandeo', descripcion_material: 'Lona mate', medida: '1.50X2', cantidad: 3, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-012', pieza: 'BASTIDORES EXTERNOS', cotizacion_tipo: 'Nuevo', descripcion_material: 'Bastidor metálico con patas base', medida: '1.50X2', cantidad: 3, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 33. EST-004 ACRILICOS ASCENSOR
  { codigo: 'EST-004', pieza: 'ACRILICOS ASCENSOR', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil adhesivo full color', medida: '0.46X0.34', cantidad: 12, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-004', pieza: 'ACRILICOS ASCENSOR', cotizacion_tipo: 'Nuevo', descripcion_material: 'Acrílico cristal de 3MM vinil al espejo botones decorativos tipo sanduche', medida: '0.46X0.34', cantidad: 12, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 34. EST-019 BASTIDOR CON LONA PARA INGRESO S1
  { codigo: 'EST-019', pieza: 'BASTIDOR CON LONA PARA INGRESO S1', cotizacion_tipo: 'Brandeo', descripcion_material: 'Cambio de lona full color sobre bastidor', medida: '6X2', cantidad: 2, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-019', pieza: 'BASTIDOR CON LONA PARA INGRESO S1', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mantenimiento del toll estructura', medida: '6X2', cantidad: 2, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 35-40. SERVICIOS
  { codigo: 'SRV-001', pieza: 'SERVICIO INSTALACIÓN GRANDE', cotizacion_tipo: 'Servicio', descripcion_material: 'Instalación de todos los elementos de una campaña grande', medida: 'N/A', cantidad: 1, categoria: 'Servicio', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'SRV-002', pieza: 'SERVICIO DESINSTALACIÓN GRANDE', cotizacion_tipo: 'Servicio', descripcion_material: 'Desinstalación de todos los elementos de una campaña grande', medida: 'N/A', cantidad: 1, categoria: 'Servicio', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'SRV-003', pieza: 'SERVICIO INSTALACIÓN MEDIANA', cotizacion_tipo: 'Servicio', descripcion_material: 'Instalación en alturas de 4 pendones.', medida: 'N/A', cantidad: 1, categoria: 'Servicio', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'SRV-004', pieza: 'SERVICIO DESINSTALACIÓN MEDIANA', cotizacion_tipo: 'Servicio', descripcion_material: 'Desinstalación en alturas de 4 pendones.', medida: 'N/A', cantidad: 1, categoria: 'Servicio', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'SRV-005', pieza: 'SERVICIO INSTALACIÓN PEQUEÑA', cotizacion_tipo: 'Servicio', descripcion_material: 'Instalación de vinil en elementos para campañas pequeñas.', medida: 'N/A', cantidad: 1, categoria: 'Servicio', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'SRV-006', pieza: 'SERVICIO DESINSTALACIÓN PEQUEÑA', cotizacion_tipo: 'Servicio', descripcion_material: 'Desinstalación de vinil en elementos para campañas pequeñas.', medida: 'N/A', cantidad: 1, categoria: 'Servicio', centro_comercial: 'INMODIAMANTE' },

  // ===================== SECCIÓN 2: PIEZAS POR METRO CUADRADO =====================

  // 1. EST-017 BRANDEO DE JARDINERAS EN ESTRUCTURA METALICA
  { codigo: 'EST-017', pieza: 'BRANDEO DE JARDINERAS EN ESTRUCTURA METALICA', cotizacion_tipo: 'Brandeo', descripcion_material: 'Foambord full color tiro y retiro, colgado en estructura con hilo nylon', medida: '0.8*2', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-017', pieza: 'BRANDEO DE JARDINERAS EN ESTRUCTURA METALICA', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Foambord full color tiro y retiro, colgado en estructura con hilo nylon', medida: '0.8*2', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 2. M2-001 LONA MESH
  { codigo: 'M2-001', pieza: 'LONA MESH', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Impresión en lona mesh un solo lado tornasol bolsillo superior e inferior cable acero + grilletas / Termosellado bolsillo superior e inferior cable acero + grilletas', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },

  // 3. EST-018 BASTIDOR CON LONA PARA INGRESO S1 Y S2
  { codigo: 'EST-018', pieza: 'BASTIDOR CON LONA PARA INGRESO S1 Y S2', cotizacion_tipo: 'Brandeo', descripcion_material: 'Cambio de lona full color sobre bastidor', medida: '6X2', cantidad: 2, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-018', pieza: 'BASTIDOR CON LONA PARA INGRESO S1 Y S2', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mantenimiento del toll estructura', medida: '6X2', cantidad: 2, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 4. EST-016 LETRAS DE BLOQUE EN ACRÍLICO LECHOSO CON LUZ LED BLANCA
  { codigo: 'EST-016', pieza: 'LETRAS DE BLOQUE EN ACRÍLICO LECHOSO CON LUZ LED BLANCA', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Letras de bloque en acrílico lechoso con luz LED blanca', medida: 'Variable', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 5. EST-020 ANFORA PEQUEÑA ACRÍLICO
  { codigo: 'EST-020', pieza: 'ANFORA PEQUEÑA ACRÍLICO', cotizacion_tipo: 'Nuevo', descripcion_material: 'Acrílico 2MM con puerta', medida: '31X47X26', cantidad: 2, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-020', pieza: 'ANFORA PEQUEÑA ACRÍLICO', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil adhesivo mate', medida: '31X47X26', cantidad: 2, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 6. EST-021 ESTRUCTURA METALICA DE BACKING (BASTIDOR)
  { codigo: 'EST-021', pieza: 'ESTRUCTURA METALICA DE BACKING (BASTIDOR)', cotizacion_tipo: 'Brandeo', descripcion_material: 'Bastidor elaborado en estructura metálica + pintura al horno blanca 3x2 / $30 m2', medida: '3X2', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-021', pieza: 'ESTRUCTURA METALICA DE BACKING (BASTIDOR)', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mantenimiento del toll estructura', medida: '3X2', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 7. IMP-017 INVITACIONES
  { codigo: 'IMP-017', pieza: 'INVITACIONES', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Impresa en couché de 300 gr, full color tiro y retiro de 18*25.5 cm abierto, grafado y doblado. Sticker troquelado laminado mate.', medida: '21x30', cantidad: 60, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 8. M2-002 ACRILICO TRANSPARENTE 4 MM
  { codigo: 'M2-002', pieza: 'ACRILICO TRANSPARENTE 4 MM', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Acrílico transparente', medida: 'A5', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },

  // 9-15. SINTRA varias medidas
  { codigo: 'M2-003', pieza: 'SINTRA 1mm', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Sintra 1mm', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-004', pieza: 'SINTRA 2mm', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Sintra 2mm', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-005', pieza: 'SINTRA 3mm', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Sintra 3mm', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-006', pieza: 'SINTRA 4mm', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Sintra 4mm', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-007', pieza: 'SINTRA 6mm', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Sintra 6mm', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-008', pieza: 'SINTRA 8mm', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Sintra 8mm', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },

  // 16. M2-009 CESPED SINTETICO VERDE
  { codigo: 'M2-009', pieza: 'CESPED SINTETICO VERDE 3 X 3 MTRS', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Curve Green 30MM Belli CurveB12', medida: '6x7', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },

  // 17. EST-022 CUBO ACRILICO
  { codigo: 'EST-022', pieza: 'CUBO ACRILICO 0.50CM X 0.56CM', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Cubo acrílico transparente', medida: '0.50x0.56', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-022', pieza: 'CUBO ACRILICO 0.50CM X 0.56CM', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Mantenimiento cubo acrílico', medida: '0.50x0.56', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 18. EST-020B PUERTAS ASCENSORES 0.90x2.10
  { codigo: 'EST-020B', pieza: 'PUERTAS ASCENSORES 0.90x2.10', cotizacion_tipo: 'Brandeo', descripcion_material: 'Vinil adhesivo removible mate', medida: '0.90x2.10', cantidad: 3, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 19. IMP-018 TENCARD LOCALES E ISLA DE SERVICO AL CLIENTE (sección M2)
  { codigo: 'IMP-018', pieza: 'TENCARD LOCALES E ISLA DE SERVICO AL CLIENTE', cotizacion_tipo: 'Nuevo', descripcion_material: 'Pegable full color tiro armado en tipo A', medida: 'A5', cantidad: 250, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 20-27. M2-010 al M2-017 VOLANTES TIRO
  { codigo: 'M2-010', pieza: 'VOLANTES TIRO A5 - 300u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 300, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-011', pieza: 'VOLANTES TIRO A5 - 500u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 500, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-012', pieza: 'VOLANTES TIRO A5 - 1000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 1000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-013', pieza: 'VOLANTES TIRO A5 - 1500u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 1500, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-014', pieza: 'VOLANTES TIRO A5 - 3000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 3000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-015', pieza: 'VOLANTES TIRO A5 - 5000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 5000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-016', pieza: 'VOLANTES TIRO A5 - 20000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 20000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-017', pieza: 'VOLANTES TIRO A5 - 25000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 25000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },

  // 28-36. M2-019 al M2-027 VOLANTES TIRO Y RETIRO
  { codigo: 'M2-019', pieza: 'VOLANTES TIRO Y RETIRO A5 - 300u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 300, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-020', pieza: 'VOLANTES TIRO Y RETIRO A5 - 500u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 500, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-021', pieza: 'VOLANTES TIRO Y RETIRO A5 - 1000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 1000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-022', pieza: 'VOLANTES TIRO Y RETIRO A5 - 1500u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 1500, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-023', pieza: 'VOLANTES TIRO Y RETIRO A5 - 3000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 3000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-024', pieza: 'VOLANTES TIRO Y RETIRO A5 - 5000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 5000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-025', pieza: 'VOLANTES TIRO Y RETIRO A5 - 6000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 6000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-026', pieza: 'VOLANTES TIRO Y RETIRO A5 - 20000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 20000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'M2-027', pieza: 'VOLANTES TIRO Y RETIRO A5 - 25000u', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión en couché de 115 gr', medida: 'A5', cantidad: 25000, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },

  // 37. IMP-019 CAMISETA BRANDEADA
  { codigo: 'IMP-019', pieza: 'CAMISETA BRANDEADA', cotizacion_tipo: 'Nuevo', descripcion_material: 'Tela algodón, con cuello redondo, con brandeo con transfer en 2 ubicaciones, full color.', medida: 'Talla única', cantidad: 1, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 38. IMP-020 CARTILLAS
  { codigo: 'IMP-020', pieza: 'CARTILLAS', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión digital en papel couché de 150 gr. tiro y retiro', medida: 'A5', cantidad: 350, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 39. IMP-022 BIG BOY (sección M2)
  { codigo: 'IMP-022', pieza: 'BIG BOY LAMINADO', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión vinil laminado mate sobre MDF 9mm un lado / Impresión vinil laminado mate / Sobre foam board 5mm un lado / Coroplast 5mm un lado', medida: '1.70 mt alto x 1 mt ancho', cantidad: 1, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 40. IMP-021 FLOOR GRAPHIC
  { codigo: 'IMP-021', pieza: 'FLOOR GRAPHIC', cotizacion_tipo: 'Nuevo', descripcion_material: 'Vinil de piso floor graphic impresión 1400 DPI', medida: '871x871', cantidad: 1, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 41. IMP-023 CAPUCHONES TEATRO
  { codigo: 'IMP-023', pieza: 'CAPUCHONES TEATRO', cotizacion_tipo: 'Nuevo', descripcion_material: 'Cabecera poliéster logo sublimado', medida: 'M2', cantidad: 250, categoria: 'Material impreso', centro_comercial: 'INMODIAMANTE' },

  // 42. EST-024 LETRAS CORPOREAS
  { codigo: 'EST-024', pieza: 'LETRAS CORPOREAS', cotizacion_tipo: 'Nuevo', descripcion_material: 'Letras corpóreas troqueladas en sintra 3mm de revestimiento, vinil full color, base troquelada', medida: '3.93X0.2X1.4', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 43. EST-025 LETRERO INGRESO TUNEL S2
  { codigo: 'EST-025', pieza: 'LETRERO INGRESO TUNEL S2', cotizacion_tipo: 'Comprar nuevo', descripcion_material: 'Bastidor elaborado en estructura metálica + pintura al horno + troquelado en sintra', medida: 'M2', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },
  { codigo: 'EST-025', pieza: 'LETRERO INGRESO TUNEL S2', cotizacion_tipo: 'Mantenimiento', descripcion_material: 'Pintura de la estructura, luz, cambio de sintra', medida: 'M2', cantidad: 1, categoria: 'Estructura física', centro_comercial: 'INMODIAMANTE' },

  // 44. M2-028 VINIL
  { codigo: 'M2-028', pieza: 'VINIL', cotizacion_tipo: 'Nuevo', descripcion_material: 'Vinil laminado brillante / mate 1400 dpi removible', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },

  // 45. M2-029 LONA MATE
  { codigo: 'M2-029', pieza: 'LONA MATE', cotizacion_tipo: 'Nuevo', descripcion_material: 'Lona de 13 onz a 1400 DPI.', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },

  // 46. M2-030 LONA TRANSLÚCIDA
  { codigo: 'M2-030', pieza: 'LONA TRANSLÚCIDA', cotizacion_tipo: 'Nuevo', descripcion_material: 'Lona de 13 onz a 1400 DPI.', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },

  // 47. M2-031 MICROPERFORADO
  { codigo: 'M2-031', pieza: 'MICROPERFORADO', cotizacion_tipo: 'Nuevo', descripcion_material: 'Impresión sobre vinil mesh impresión 1400 dpi incluye instalación.', medida: 'M2', cantidad: 1, categoria: 'Piezas por metro cuadrado', centro_comercial: 'INMODIAMANTE' },

  // 48. SRV-007 TRANSPORTE GRUA CONEJO
  { codigo: 'SRV-007', pieza: 'TRANSPORTE GRUA CONEJO', cotizacion_tipo: 'Servicio', descripcion_material: 'Transporte tipo plataforma', medida: 'Km', cantidad: 1, categoria: 'Servicio', centro_comercial: 'INMODIAMANTE' },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await Tarifa.sync();
    await Tarifa.bulkCreate(articulos);
    console.log(`✅ ${articulos.length} artículos insertados correctamente`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seed();
