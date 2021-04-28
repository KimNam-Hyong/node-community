const Sequelize = require('sequelize');
module.exports = class SiteSetting extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            site_title:{
                type:Sequelize.STRING(200),
                allowNull:false,
                comment:'사이트명 또는 앱명'
            },
            meta_tag: {
                type: Sequelize.TEXT('long'),
                allowNull: true,
                comment:'메타태그'
            },
            board_filter:{
                type:Sequelize.TEXT('long'),
                allowNull:true,
                comment:'게시판 필터링'
            },
            user_addr_set:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'회원가입 주소 사용 여부 0: 사용안함 1: 선택 2: 필수'
            },
            user_tel_set:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'회원가입 전화번호 사용 여부 0: 사용안함 1: 선택 2: 필수'
            },
            user_mobile_set:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'회원가입 휴대폰번호 사용 여부 0: 사용안함 1: 선택 2: 필수'
            },
            user_email_set:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'회원가입 이메일 사용 여부 0: 사용안함 1: 선택 2: 필수'
            },
            user_level_text:{
                type:Sequelize.TEXT('long'),
                allowNull:false,
                comment:'회원레벨등급 설정'
            },
            user_level_set:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:1,
                comment:'회원가입 등급 사용 여부 1~10'
            },
            user_auth_set:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:0,
                comment:'회원가입 승인여부'
            },
            company_name:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'회사명'
            },
            company_biz_no:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'사업자번호'
            },
            company_ceo:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'대표자명'
            },
            company_tel:{
                type:Sequelize.STRING(20),
                allowNull:true,
                comment:'회사전화번호'
            },
            company_fax:{
                type:Sequelize.STRING(20),
                allowNull:true,
                comment:'회사팩스번호'
            },
            company_email:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'회사이메일'
            },
            company_zip:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'회사우편번호'
            },
            company_addr1:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'회사주소1'
            },
            company_addr2:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'회사주소2'
            },
            company_addr3:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'회사주소3'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'SiteSetting',
            tableName: 'site_setting',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
          });
    }
}