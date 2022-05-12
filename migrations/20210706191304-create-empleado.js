'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('empleado', {
      dni: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      apellido: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      telefono: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      contraseña: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      rol: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_area: {
        references: {
          model: "area",
          key: "id_area",
        },
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
        
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('empleado');
  }
};