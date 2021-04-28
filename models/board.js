const Sequelize = require('sequelize');
module.exports = class Board extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            
            f_bo_id:{
                type:Sequelize.STRING(100),
                allowNull:false,
                comment:'게시판아이디'
            },
            bo_subject:{
                type:Sequelize.STRING(200),
                allowNull:false,
                comment:'게시판제목'
            },
            bo_content:{
                type:Sequelize.TEXT('long'),
                allowNull:false,
                comment:'내용'
            },
            user_id:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'회원아이디'
            },
            user_name:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'글쓴이 이름'
            },
            bo_ext1:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항1'
            },
            bo_ext2:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항2'
            },
            bo_ext3:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항3'
            },
            bo_ext4:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항4'
            },
            bo_ext5:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항5'
            },
            bo_ext6:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항6'
            },
            bo_ext7:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항7'
            },
            bo_ext8:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항8'
            },
            bo_ext9:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항9'
            },
            bo_ext10:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항10'
            },
            bo_ext11:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항11'
            },
            bo_ext12:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항12'
            },
            bo_ext13:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항13'
            },
            bo_ext14:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항14'
            },
            bo_ext15:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항15'
            },
            bo_ext16:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항16'
            },
            bo_ext17:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항17'
            },
            bo_ext18:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항18'
            },
            bo_ext19:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항19'
            },
            bo_ext20:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'기타사항20'
            },
            is_secret:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:false,
                comment:'0:비밀글 아님 1:비밀글'
            },
            is_notice:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:false,
                comment:'0:공지사항 아님 1:공지사항'
            },
            bo_password:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'게시판비밀번호-(암호화처리)'
            },
            cat_code:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'게시판 분류 코드'
            },
            read_hit:{
                type:Sequelize.INTEGER,
                allowNull:true,
                comment:'조회수',
                defaultValue:0
            },
            regdate:{
                type:Sequelize.DATE,
                allowNull:false,
                comment:'글쓴날짜',
                defaultValue:Sequelize.NOW
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Board',
            tableName: 'board',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            dateStrings:true,
            typeCast:true
          });
    }
    static associate(db){
        db.Board.hasMany(db.BoardComment,{foreignKey:'f_bbs_id',soruceKey:'id'});
        db.Board.hasMany(db.BoardFile,{foreignKey:'f_bbs_id',sourceKey:'id'});
    }
}