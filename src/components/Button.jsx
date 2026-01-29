export const Button = ({ children, variant = 'primary', size = 'md', ...props }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-2",
    lg: "px-8 py-3 text-lg"
  };

  return (
    <button 
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium transition-all disabled:opacity-50`}
      {...props}
    >
      {children}
    </button>
  );
};