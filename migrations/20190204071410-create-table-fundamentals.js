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
          type: Sequelize.UUID,
        },
        parentId: {
          type: Sequelize.UUID,
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

    queryInterface
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

    queryInterface
      .createTable('Records', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
        },
        tableId: {
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
        return queryInterface.addConstraint('Records', ['tableId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'Tables',
            field: 'id',
          },
          onDelete: 'cascade',
        });
      });

    return queryInterface
      .createTable('FieldValues', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        recordId: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        fieldId: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        value: {
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
        return queryInterface.addConstraint(
          'FieldValues',
          ['recordId', 'fieldId'],
          {
            type: 'unique',
          },
        );
      });
  },
  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('FieldValues');
    queryInterface.dropTable('Fields');
    queryInterface.dropTable('Records');
    queryInterface.dropTable('Tables');
    queryInterface.dropTable('Positions');
    return queryInterface.dropTable('Bases');
  },
};
