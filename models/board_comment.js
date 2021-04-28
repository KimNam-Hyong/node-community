const Sequelize = require('sequelize');
module.exports = class BoardComment extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            
            user_id:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'회원아이디'
            },
            user_name:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'글쓴이'
            },
            is_secret:{
                type:Sequelize.BOOLEAN,
                allowNull:true,
                defaultValue:0,
                comment:'비밀글 여부 0: 안함 1: 비밀글'
            },
            co_password:{
                type:Sequelize.STRING(100),
                allowNull:true,
                defaultValue:0,
                comment:'비밀번호-(수정 및 삭제시 필요)'
            },
            co_comment:{
                type:Sequelize.TEXT('long'),
                allowNull:false,
                comment:'글내용'
            },
            regdate:{
                type:Sequelize.DATE,
                defaultValue:Sequelize.NOW,
                comment:'글쓴날짜'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'BoardComment',
            tableName: 'board_comment',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            dateStrings:true,
            typeCast:true
          });
    }
    static associate(db){
        db.BoardComment.belongsTo(db.Board, {foreignKey:'f_bbs_id',targetKey:'id',onDelete:'CASCADE',onUpdate:'CASCADE'});
    }
}