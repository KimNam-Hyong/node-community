const Sequelize = require('sequelize');
module.exports = class BoardSetting extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            
            bo_id:{
                type:Sequelize.STRING(40),
                allowNull:false,
                comment:'게시판아이디'
            },
            bo_name:{
                type:Sequelize.STRING(200),
                allowNull:false,
                comment:'게시판명'
            },
            bo_skin_path:{
                type:Sequelize.STRING(200),
                allowNull:false,
                comment:'게시판스킨'
            },
            bo_write_level:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'글등록 레벨'
            },
            bo_comment_level:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'댓글 레벨'
            },
            bo_list_level:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'글목록 레벨'
            },
            bo_view_level:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'글상세보기 레벨'
            },
            bo_upload_level:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'파일첨부 레벨'
            },
            bo_download_level:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'파일첨부 레벨'
            },
            bo_file_ea:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:2,
                comment:'파일첨부 갯수'
            },
            bo_file_size:{
                type:Sequelize.BIGINT,
                allowNull:false,
                defaultValue:2,
                comment:'파일첨부 용량(byte)'
            },
            bo_gallery_su:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:4,
                comment:'pc 버전 갤러리 갯수'
            },
            bo_gallery_su:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:4,
                comment:'pc 버전 갤러리 갯수'
            },
            bo_mobile_gallery_su:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:3,
                comment:'모바일 버전 갤러리 갯수'
            },
            bo_list_width:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:3,
                comment:'pc 버전 가로 사이즈'
            },
            bo_mobile_list_width:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:3,
                comment:'모바일 버전 가로 사이즈'
            },
            bo_list_su:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:20,
                comment:'한페이지에 보여주는 게시물 수 '
            },
            is_notice:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:0,
                comment:'공지사항 여부 0: 공지사항 사용안함 1: 공지사항 사용함'
            },
            bo_notice_su:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'공지사항 갯수(게시판 상단)'
            },
            is_secret:{
                type:Sequelize.INTEGER,
                allowNull:false,
                defaultValue:0,
                comment:'0 비밀글 사용안함 1 비밀글 선택 2 필수'
            },
            bo_ext1_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항1 제목'
            },
            bo_ext2_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항2 제목'
            },
            bo_ext3_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항3 제목'
            },
            bo_ext4_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항4 제목'
            },
            bo_ext5_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항5 제목'
            },
            bo_ext6_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항6 제목'
            },
            bo_ext7_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항7 제목'
            },
            bo_ext8_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항8 제목'
            },
            bo_ext9_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항9 제목'
            },
            bo_ext10_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항10 제목'
            },
            bo_ext11_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항11 제목'
            },
            bo_ext12_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항12 제목'
            },
            bo_ext13_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항13 제목'
            },
            bo_ext14_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항14 제목'
            },
            bo_ext15_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항15 제목'
            },
            bo_ext16_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항16 제목'
            },
            bo_ext17_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항17 제목'
            },
            bo_ext18_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항18 제목'
            },
            bo_ext19_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항19 제목'
            },
            bo_ext20_title:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'기타사항20 제목'
            },
            bo_geo_code_set:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:0,
                comment:'위치기반 사용여부'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'BoardSetting',
            tableName: 'board_setting',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
          });
    }
}