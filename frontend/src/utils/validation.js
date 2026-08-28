// Validaciones compartidas para formularios de proveedor y acceso.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RUC_REGEX = /^\d{13}$/;
const TELEFONO_REGEX = /^\d{7,10}$/;

export function validarEmail(email) {
  return EMAIL_REGEX.test(String(email).trim());
}

export function validarRuc(ruc) {
  return RUC_REGEX.test(String(ruc).trim());
}

export function validarTelefono(telefono) {
  return TELEFONO_REGEX.test(String(telefono).trim());
}

// Valida los datos de un proveedor (registro y edición comparten las mismas reglas).
// Devuelve un objeto { campo: mensaje } con los errores encontrados; vacío si todo es válido.
export function validarProveedor({ ruc, razon_social, correo, numero_contacto }) {
  const errores = {};

  if (!ruc || !ruc.trim()) {
    errores.ruc = 'El RUC es requerido.';
  } else if (!validarRuc(ruc)) {
    errores.ruc = 'El RUC debe tener exactamente 13 dígitos numéricos.';
  }

  if (!razon_social || !razon_social.trim()) {
    errores.razon_social = 'La razón social es requerida.';
  } else if (razon_social.trim().length < 3) {
    errores.razon_social = 'La razón social debe tener al menos 3 caracteres.';
  }

  if (!correo || !correo.trim()) {
    errores.correo = 'El correo es requerido.';
  } else if (!validarEmail(correo)) {
    errores.correo = 'Ingrese un correo electrónico válido.';
  }

  if (!numero_contacto || !numero_contacto.trim()) {
    errores.numero_contacto = 'El número de contacto es requerido.';
  } else if (!validarTelefono(numero_contacto)) {
    errores.numero_contacto = 'El número de contacto debe tener entre 7 y 10 dígitos numéricos.';
  }

  return errores;
}

// Valida el formulario de inicio de sesión (acepta correo o nombre de usuario).
export function validarLogin({ identificador, password }) {
  const errores = {};

  if (!identificador || !identificador.trim()) {
    errores.identificador = 'Ingresa tu correo o nombre de usuario.';
  } else if (identificador.includes('@') && !validarEmail(identificador)) {
    errores.identificador = 'Ingresa un correo electrónico válido.';
  }

  if (!password) {
    errores.password = 'La contraseña es requerida.';
  } else if (password.length < 4) {
    errores.password = 'La contraseña debe tener al menos 4 caracteres.';
  }

  return errores;
}
