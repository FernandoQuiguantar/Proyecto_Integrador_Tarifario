import { useState } from 'react';

const NEW_KEY = '__nuevo__';

const SelectWithNew = ({ value, onChange, options, className, label, labelClass }) => {
  const [showInput, setShowInput] = useState(false);
  const [nuevoValor, setNuevoValor] = useState('');

  const handleSelectChange = (e) => {
    if (e.target.value === NEW_KEY) {
      setShowInput(true);
      setNuevoValor('');
    } else {
      setShowInput(false);
      onChange(e.target.value);
    }
  };

  const handleConfirm = () => {
    const v = nuevoValor.trim();
    if (!v) return;
    onChange(v);
    setShowInput(false);
    setNuevoValor('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleConfirm(); }
    if (e.key === 'Escape') { setShowInput(false); setNuevoValor(''); onChange(options[0] || ''); }
  };

  const allOptions = options.includes(value) ? options : [...options, value];

  return (
    <div className="flex flex-col gap-1">
      {label && <label className={labelClass}>{label}</label>}
      {!showInput ? (
        <select className={className} value={value} onChange={handleSelectChange}>
          {allOptions.map(o => <option key={o} value={o}>{o}</option>)}
          <option value={NEW_KEY}>➕ Agregar nuevo...</option>
        </select>
      ) : (
        <div className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={nuevoValor}
            onChange={e => setNuevoValor(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe el nuevo valor..."
            className={`flex-1 ${className}`}
          />
          <button
            type="button"
            onClick={handleConfirm}
            className="px-3 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => { setShowInput(false); setNuevoValor(''); }}
            className="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectWithNew;
