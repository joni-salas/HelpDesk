'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class historial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      historial.belongsTo(models.empleado, {
        foreignKey: "dni_empleado",
      });
      historial.belongsTo(models.area, {
        foreignKey: "id_area",
      });
      historial.belongsTo(models.solicitud, {
        foreignKey: "id_solicitud",
      });
      historial.hasMany(models.notificacion, {
        foreignKey: "fecha_historial",
      });
      historial.hasMany(models.notificacion, {
        foreignKey: "id_solicitud_historial",
      });
      historial.hasMany(models.notificacion, {
        foreignKey: "id_area_historial",
      });
    }
  };
  historial.init({
    fecha_ingreso: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    estado: DataTypes.STRING,
    detalle_razon: DataTypes.STRING,
    detalle_solucion: DataTypes.STRING,
    id_area: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    id_solicitud: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    dni_empleado: DataTypes.BIGINT,
    fecha_egreso: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'historial',
    tableName: 'historial',
    createdAt: false,
    updatedAt: false,
  });
  return historial;
};