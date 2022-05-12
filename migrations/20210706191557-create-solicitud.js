'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('solicitud', {
      id_solicitud: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ticket: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      prioridad: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fecha_solicitud: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      detalle: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tipo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dni_cliente: {
        references: {
          model: "cliente",
          key: "dni",
        },
        type: Sequelize.BIGINT,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('solicitud');
  }
};