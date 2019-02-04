'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Bases', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    queryInterface
      .createTable('Positions', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING,
        },
        parentId: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        position: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        type: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => {
        return queryInterface.addIndex('Positions', ['parentId', 'type']);
      });

    queryInterface
      .createTable('Tables', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        baseId: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => {
        return queryInterface.addConstraint('Tables', ['baseId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'Bases',
            field: 'id',
          },
          onDelete: 'cascade',
        });
      });

    return queryInterface
      .createTable('Fields', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        tableId: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        fieldTypeId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        width: {
          type: Sequelize.INTEGER,
        },
        typeOptions: {
          type: Sequelize.JSONB,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => {
        return queryInterface.addConstraint('Fields', ['tableId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'Tables',
            field: 'id',
          },
          onDelete: 'cascade',
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Bases');
  },
};
