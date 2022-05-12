'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cliente extends Model {

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      cliente.hasMany(models.solicitud, {
        foreignKey: "dni_cliente",
      });
    }
  };
  cliente.init({
    dni: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    mail: DataTypes.STRING,
    celular: DataTypes.BIGINT,
    contraseña: DataTypes.STRING,
    fecha: DataTypes.DATE,
    estado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cliente',
    tableName: 'cliente',
    createdAt: false,
    updatedAt: false,
  });
  return cliente;
};