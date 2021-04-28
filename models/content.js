const Sequelize = require('sequelize');
module.exports = class Content extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            
            co_id:{
                type:Sequelize.STRING(100),
                allowNull:false,
                comment:'내용 아이디'
            },
            subject:{
                type:Sequelize.STRING(100),
                allowNull:false,
                comment:'제목',
                defaultValue:''
            },
            content:{
                type:Sequelize.TEXT('long'),
                allowNull:true,
                comment:'내용'
            },
            is_view:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:1,
                comment:'출력 여부 0:출력 안함 1:출력함'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Content',
            tableName: 'content',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
          });
    }
}