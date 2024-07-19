const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const localization = sequelize.define(
  'localization',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    key: {
      type: DataTypes.STRING,
    },
    translated_text: {
      type: DataTypes.STRING,
    },
    to_locale: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    freezeTableName: true,
    modelName: 'localization',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    tableName: 'localization', // Ensure it uses the correct table name
  }
);

module.exports = localization;
