'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class M_tnsm_list extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    M_tnsm_list.init({
        system_name: DataTypes.STRING,
        system_group: DataTypes.STRING,
        author_name: DataTypes.STRING,
        description: DataTypes.STRING,
        url_system: DataTypes.STRING,
        img_system: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'M_tnsm_list',
        underscored: true,
    });
    return M_tnsm_list;
};