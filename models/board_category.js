const Sequelize = require('sequelize');
module.exports = class BoardCategory extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            
            f_bo_id:{
                type:Sequelize.INTEGER,
                allowNull:false,
                comment:'게시판아이디'
            },
            cat_code:{
                type:Sequelize.STRING(200),
                allowNull:false,
                comment:'분류코드'
            },
            cat_name:{
                type:Sequelize.STRING(200),
                allowNull:false,
                comment:'분류명'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'BoardCategory',
            tableName: 'board_category',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
          });
    }
}