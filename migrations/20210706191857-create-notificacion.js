'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notificacion', {
      id_notificacion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fecha_historial: {
        references: {
          model: "historial",
          key: "fecha_ingreso",
        },
        type: Sequelize.DATE,
        allowNull: false,
      },
      id_solicitud_historial: {
        references: {
          model: "historial",
          key: "id_solicitud",
        },
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_area_historial: {
        references: {
          model: "historial",
          key: "id_area",
        },
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notificacion');
  }
};