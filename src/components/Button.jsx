export default function Button({
  label = "Botón",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick
}) {
  const base = "rounded font-semibold transition";
  
  const variants = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-200 text-gray-800",
    danger: "bg-red-600 text-white",
    ghost: "bg-transparent text-blue-600"
  };

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} opacity-${disabled ? "50" : "100"}`}
    >
      {loading ? "Cargando..." : label}
    </button>
  );
}
