'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('historial', {
      fecha_ingreso: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false,
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      detalle_razon: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      detalle_solucion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      id_area: {
        references: {
          model: "area",
          key: "id_area",
          allowNull: false,
        },
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      id_solicitud: {
        references: {
          model: "solicitud",
          key: "id_solicitud",
          allowNull: false,
        },
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      dni_empleado: {
        references: {
          model: "empleado",
          key: "dni",
          allowNull: true,
        },
        type: Sequelize.BIGINT,
      },
      fecha_egreso: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('historial');
  }
};