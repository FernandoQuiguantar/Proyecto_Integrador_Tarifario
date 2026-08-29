import { useState, useEffect } from 'react';
import API_BASE from '../config';

const TIPOS_DEFAULT = ['Brandeo', 'Mantenimiento', 'Nuevo', 'Servicio'];
const CATEGORIAS_DEFAULT = ['Elemento iluminado', 'Estructura física', 'Material impreso', 'Piezas por metro cuadrado', 'Servicio'];

export function useOpciones() {
  const [tipos, setTipos] = useState(TIPOS_DEFAULT);
  const [categorias, setCategorias] = useState(CATEGORIAS_DEFAULT);

  useEffect(() => {
    fetch(`${API_BASE}/api/opciones/cotizacion_tipo`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setTipos(data); })
      .catch(() => {});

    fetch(`${API_BASE}/api/opciones/categoria`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setCategorias(data); })
      .catch(() => {});
  }, []);

  return { tipos, categorias };
}
