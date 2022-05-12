'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class solicitud extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      solicitud.belongsTo(models.cliente, {
        foreignKey: "dni_cliente",
      });
      solicitud.belongsToMany(models.area, {
        through: "historial",
        foreignKey: "id_solicitud",
      });
      solicitud.belongsToMany(models.empleado, {
        through: "historial",
        foreignKey: "dni_empleado",
      });
    }
  };
  solicitud.init({
    id_solicitud: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    ticket: DataTypes.BIGINT,
    prioridad: DataTypes.STRING,
    fecha_solicitud: DataTypes.DATE,
    detalle: DataTypes.STRING,
    tipo: DataTypes.STRING,
    dni_cliente: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'solicitud',
    tableName: 'solicitud',
    createdAt: false,
    updatedAt: false,
  });
  return solicitud;
};