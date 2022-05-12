'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notificacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      notificacion.hasOne(models.historial, {
        foreignKey: "fecha_ingreso",
      });
      notificacion.hasOne(models.historial, {
        foreignKey: "id_area",
      });
      notificacion.hasOne(models.historial, {
        foreignKey: "id_solicitud",
      });
    }
  };
  notificacion.init({
    id_notificacion:{
      type: DataTypes.INTEGER,
      primaryKey: true
  },
    fecha: DataTypes.DATE,
    descripcion: DataTypes.STRING,
    estado: DataTypes.STRING,
    fecha_historial: DataTypes.DATE,
    id_solicitud_historial: DataTypes.INTEGER,
    id_area_historial: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'notificacion',
    tableName: 'notificacion',
    createdAt: false,
    updatedAt: false,
  });
  return notificacion;
};