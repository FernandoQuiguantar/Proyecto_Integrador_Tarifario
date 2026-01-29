export const CardMaterial = ({ item }) => (
  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
    <img src={item.img} className="w-full h-40 object-cover rounded-lg mb-4" />
    <h3 className="text-lg font-bold text-gray-800">{item.nombre}</h3>
    <p className="text-sm text-gray-500">{item.material}</p>
    <div className="flex justify-between items-center mt-4">
      <span className="text-blue-600 font-bold">${item.precio}</span>
      <button className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Ver detalle</button>
    </div>
  </div>
);