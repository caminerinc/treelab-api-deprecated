'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface
        .createTable('BasePositions', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          parentId: {
            allowNull: false,
            type: Sequelize.UUID,
          },
          position: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          siblingId: {
            allowNull: false,
            type: Sequelize.UUID,
          },
        })
        .then(() => [
          queryInterface.addIndex('BasePositions', ['parentId']),
          queryInterface.addConstraint('BasePositions', ['siblingId'], {
            type: 'FOREIGN KEY',
            references: {
              table: 'Bases',
              field: 'id',
            },
            onDelete: 'cascade',
          }),
        ]),

      queryInterface
        .createTable('TablePositions', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          parentId: {
            allowNull: false,
            type: Sequelize.UUID,
          },
          position: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          siblingId: {
            allowNull: false,
            type: Sequelize.UUID,
          },
        })
        .then(() => [
          queryInterface.addIndex('TablePositions', ['parentId']),
          queryInterface.addConstraint('TablePositions', ['siblingId'], {
            type: 'FOREIGN KEY',
            references: {
              table: 'Tables',
              field: 'id',
            },
            onDelete: 'cascade',
          }),
          queryInterface.addConstraint('TablePositions', ['parentId'], {
            type: 'FOREIGN KEY',
            references: {
              table: 'Bases',
              field: 'id',
            },
            onDelete: 'cascade',
          }),
        ]),

      queryInterface
        .createTable('RecordPositions', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          parentId: {
            allowNull: false,
            type: Sequelize.UUID,
          },
          position: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          siblingId: {
            allowNull: false,
            type: Sequelize.UUID,
          },
        })
        .then(() => [
          queryInterface.addIndex('RecordPositions', ['parentId']),
          queryInterface.addConstraint('RecordPositions', ['siblingId'], {
            type: 'FOREIGN KEY',
            references: {
              table: 'Records',
              field: 'id',
            },
            onDelete: 'cascade',
          }),
          queryInterface.addConstraint('RecordPositions', ['parentId'], {
            type: 'FOREIGN KEY',
            references: {
              table: 'Tables',
              field: 'id',
            },
            onDelete: 'cascade',
          }),
        ]),

      queryInterface
        .createTable('FieldPositions', {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          parentId: {
            allowNull: false,
            type: Sequelize.UUID,
          },
          position: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          siblingId: {
            allowNull: false,
            type: Sequelize.UUID,
          },
        })
        .then(() => [
          queryInterface.addIndex('FieldPositions', ['parentId']),
          queryInterface.addConstraint('FieldPositions', ['siblingId'], {
            type: 'FOREIGN KEY',
            references: {
              table: 'Fields',
              field: 'id',
            },
            onDelete: 'cascade',
          }),
          queryInterface.addConstraint('FieldPositions', ['parentId'], {
            type: 'FOREIGN KEY',
            references: {
              table: 'Tables',
              field: 'id',
            },
            onDelete: 'cascade',
          }),
        ]),
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.dropTable('BasePositions'),
      queryInterface.dropTable('TablePositions'),
      queryInterface.dropTable('RecordPositions'),
      queryInterface.dropTable('FieldPositions'),
    ];
  },
};
