const Tarifa = require('../models/Tarifa');

const findAll = () => Tarifa.findAll();
const findById = (id) => Tarifa.findByPk(id);
const create = (data) => Tarifa.create(data);
const update = async (id, data) => {
  const tarifa = await Tarifa.findByPk(id);
  return tarifa ? tarifa.update(data) : null;
};
const destroy = (id) => Tarifa.destroy({ where: { id } });

module.exports = { findAll, findById, create, update, destroy };