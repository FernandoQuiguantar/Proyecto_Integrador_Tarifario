export default function Loader({ text = "Cargando..." }) {
  return (
    <div className="flex justify-center items-center py-10">
      <p className="text-gray-500 animate-pulse">{text}</p>
    </div>
  );
}
