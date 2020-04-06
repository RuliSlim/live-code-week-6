'use strict';
module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define('Food', {
    title: DataTypes.STRING,
    price: DataTypes.INTEGER,
    ingredients: DataTypes.STRING,
    tag: DataTypes.STRING
  }, {});
  Food.associate = function(models) {
    // associations can be defined here
  };
  return Food;
};