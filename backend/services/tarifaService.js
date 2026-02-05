const tarifaRepository = require('../repositories/tarifaRepository');

const listarTarifas = () => tarifaRepository.findAll();

const registrarTarifa = async (data) => {
  // Lógica de negocio: Validar que el precio no sea negativo
  if (data.precio_base <= 0) {
    throw { status: 400, message: "El precio de la pieza debe ser mayor a cero" };
  }
  return await tarifaRepository.create(data);
};

const eliminarTarifa = (id) => tarifaRepository.destroy(id);

module.exports = { listarTarifas, registrarTarifa, eliminarTarifa };