const Sequelize = require('sequelize');
module.exports = class Menu extends Sequelize.Model {
    static init(sequelize){
        return super.init({            
            me_code:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'메뉴아이디',
                defaultValue:''
            },
            me_id:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'메뉴서브아이디',
                defaultValue:''
            },
            me_name:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'메뉴명',
                defaultValue:''
            },
            me_url:{
                type:Sequelize.STRING(200),
                allowNull:true,
                defaultValue:0,
                comment:'url주소'
            },
            me_target:{
                type:Sequelize.STRING(20),
                allowNull:true,
                defaultValue:'_self',
                comment:'타겟'
            },
            me_order:{
                type:Sequelize.INTEGER,
                allowNull:true,
                defaultValue:0,
                comment:'출력순서'
            },
            is_view:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                comment:'출력여부',
                defaultValue:Sequelize.BOOLEAN
            },
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Menu',
            tableName: 'menu',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            dateStrings:true,
            typeCast:true
          });
    }
}