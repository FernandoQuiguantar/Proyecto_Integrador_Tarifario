export const TextInput = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1 mb-4">
    {label && <label className="text-sm font-bold text-gray-700">{label}</label>}
    <input 
      className={`border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);