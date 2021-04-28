const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            
            user_id:{
                type:Sequelize.STRING(100),
                allowNull:false,
                comment:'회원아이디'
            },
            user_password: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment:'회원비밀번호'
            },
            user_name: {
                type: Sequelize.STRING(100),
                allowNull: true,
                comment:'회원이름'
            },
            user_nick:{
                type: Sequelize.STRING(100),
                allowNull:true,
                comment:'회원닉네임'
            },
            user_tel:{
                type:Sequelize.STRING(20),
                allowNull:true,
                comment:'회원전화번호'
            },
            user_mobile:{
                type:Sequelize.STRING(20),
                allowNull:true,
                comment:'회원휴대폰번호'
            },
            user_zip:{
                type:Sequelize.STRING(20),
                allowNull:true,
                comment:'우편번호'
            },
            user_addr1:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'회원기본주소'
            },
            user_addr2:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'회원상세주소'
            },
            user_addr3:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'회원주소 기타'
            },
            user_email:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'회원 이메일'
            },
            user_level:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:1,
                comment:'회원레벨'
            },
            login_date:{
                type:Sequelize.DATE,
                allowNull:true,
                comment:'로그인 시간'
            },
            auth_status:{
                type:Sequelize.BOOLEAN,
                allowNull:true,
                comment:'승인여부'
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'user',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
          });
    }
}