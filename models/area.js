'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      area.hasMany(models.empleado, {
        foreignKey: "id_area",
      });
      area.belongsToMany(models.solicitud, {
        through: "historial",
        foreignKey: "id_area",
      });
    }
  };
  area.init({
    id_area: {
      type: DataTypes.INTEGER,
      primaryKey: true
  },
    nombre_area: DataTypes.STRING,
    estado: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'area',
    tableName: 'area',
    createdAt: false,
    updatedAt: false,
  });
  return area;
};