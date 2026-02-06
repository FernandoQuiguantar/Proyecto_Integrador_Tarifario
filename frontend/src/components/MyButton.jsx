import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', ...props }) => {
  const variants = {
    
    primary: "bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-black shadow-lg hover:shadow-blue-500/50",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 shadow-md",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 font-bold",
    lg: "px-10 py-4 text-lg"
  };

  return (
    <button 
      className={`${variants[variant]} ${sizes[size]} rounded-xl transition-all duration-300 active:scale-95 transform disabled:opacity-50 flex items-center justify-center gap-2`}
      {...props}
    >
      {variant === 'primary'}
      {children}
    </button>
  );
};

export default Button;