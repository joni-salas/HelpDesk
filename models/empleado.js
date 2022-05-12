'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class empleado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      empleado.belongsTo(models.area, {
        foreignKey: "id_area",
      });
      empleado.belongsToMany(models.solicitud, {
        through: "historial",
        foreignKey: "dni_empleado",
      });
    }
  };
  empleado.init({
    dni:{
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    mail: DataTypes.STRING,
    telefono: DataTypes.BIGINT,
    contraseña: DataTypes.STRING,
    rol: DataTypes.STRING,
    id_area: DataTypes.INTEGER,
    estado: DataTypes.STRING,
    fecha: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'empleado',
    tableName: 'empleado',
    createdAt: false,
    updatedAt: false,
  });
  return empleado;
};