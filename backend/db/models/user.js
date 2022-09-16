'use strict';
const bcrypt = require('bcryptjs');
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /* --------------------- MODEL METHODS FOR AUTH --------------------- */
        toSafeObject() {
            const { id, firstName, lastName, username, email } = this; // context will be the User instance
            return { id, firstName, lastName, username, email };
        }

        validatePassword(password) {
            return bcrypt.compareSync(password, this.hashedPassword.toString());
        }

        static getCurrentUserById(id) {
            return User.scope("currentUser").findByPk(id);
        }

        static async login({ credential, password }) {
            const { Op } = require('sequelize');
            const user = await User.scope('loginUser').findOne({
                where: {
                    [Op.or]: {
                        username: credential,
                        email: credential
                    }
                }
            });
            if (user && user.validatePassword(password)) {
                return await User.scope('currentUser').findByPk(user.id);
            }
        }

        static async signup({ firstName, lastName, username, email, password }) {
            const hashedPassword = bcrypt.hashSync(password);
            const user = await User.create({
                firstName,
                lastName,
                username,
                email,
                hashedPassword
            });
            return await User.scope('currentUser').findByPk(user.id);
        }
        /* ------------------------------------------------------------------ */

        static associate(models) {
            User.hasMany(models.Spot, { foreignKey: 'ownerId' });
            User.hasMany(models.Review, { foreignKey: 'userId' });

            User.belongsToMany(models.Spot, {
                through: models.Booking,
                foreignKey: 'userId',
                otherKey: 'spotId'
            });

            User.belongsToMany(models.Spot, {
                through: models.Review,
                foreignKey: 'userId',
                otherKey: 'spotId'
            });
        }
    };

    User.init(
        {
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [2, 30],
                }
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [2, 30],
                }
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [4, 30],
                    isNotEmail(value) {
                        if (Validator.isEmail(value)) {
                            throw new Error("Cannot be an email.");
                        }
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [3, 256],
                    isEmail: true
                }
            },
            hashedPassword: {
                type: DataTypes.STRING.BINARY,
                allowNull: false,
                validate: {
                    len: [60, 60]
                }
            }
        },
        {
            sequelize,
            modelName: "User",
            /* --------------------------- SCOPES --------------------------- */
            defaultScope: {
                attributes: {
                    exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
                }
            },
            scopes: {
                currentUser: {
                    attributes: { exclude: ["hashedPassword"] }
                },
                loginUser: {
                    attributes: {}
                }
            }
            /* -------------------------------------------------------------- */
        }
    );
    return User;
};
