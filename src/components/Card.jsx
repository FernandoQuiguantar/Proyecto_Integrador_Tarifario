import React from 'react';
import MyButton from './MyButton';

const Card = ({ tarifa, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group">
      {/* Contenedor de Imagen */}
      <div className="h-48 bg-gray-100 overflow-hidden relative">
        <img 
          src={tarifa.imagen_url || 'https://via.placeholder.com/400x300?text=Material+Marketing'} 
          alt={tarifa.pieza} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-blue-900 shadow-sm">
          {tarifa.categoria}
        </div>
      </div>

      {/* Contenedor de Información */}
      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
          {tarifa.pieza}
        </h3>
        
        {/* Recuadro de Dimensiones */}
        <div className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
          <p className="text-xs text-gray-400 uppercase font-bold mb-1">Dimensiones</p>
          <p className="text-sm text-gray-700 font-medium">
            {tarifa.ancho || 0} x {tarifa.alto || 0} 
            {tarifa.profundidad > 0 ? ` x ${tarifa.profundidad}` : ''} 
            <span className="ml-1 text-blue-600 font-bold">{tarifa.unidad}</span>
          </p>
        </div>

        {/* Footer de la Card */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-black text-blue-900">
            ${tarifa.precio_base}
          </span>
          <MyButton 
            variant="danger" 
            size="sm" 
            onClick={() => onDelete(tarifa.id)}
          >
            Eliminar
          </MyButton>
        </div>
      </div>
    </div>
  );
};

export default Card;