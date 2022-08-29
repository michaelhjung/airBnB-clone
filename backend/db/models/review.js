'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: 'id' });
      Review.belongsTo(models.Spot, { foreignKey: 'id' });
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId' });
    }
  }
  Review.init({
    spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    review: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            atLeast1Char(str) {
                if (str.length < 1) throw new Error("Review text is required");
            }
        }
    },
    stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1,
            max: 5
        }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
