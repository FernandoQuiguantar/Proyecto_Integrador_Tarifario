export default function EmptyState({
  title = "Sin datos",
  description = "No hay información para mostrar"
}) {
  return (
    <div className="text-center py-10 text-gray-500">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}
