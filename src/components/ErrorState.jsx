export default function ErrorState({
  message = "Ocurrió un error inesperado, por favor intente nuevamente."
}) {
  return (
    <div className="text-center py-10 text-red-600">
      <p className="font-semibold">{message}</p>
    </div>
  );
}
