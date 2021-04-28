const Sequelize = require('sequelize');
module.exports = class BoardFile extends Sequelize.Model {
    static init(sequelize){
        return super.init({
            
            file_no:{
                type:Sequelize.INTEGER,
                allowNull:true,
                comment:'파일번호'    
            },
            file_path:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'파일경로'
            },
            file_thum_path:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'썸네일 파일경로'
            },
            file_name:{
                type:Sequelize.STRING(200),
                allowNull:true,
                comment:'원본파일명'
            },
            file_size:{
                type:Sequelize.INTEGER.UNSIGNED,
                allowNull:true,
                comment:'파일용량'
            },
            mimetype:{
                type:Sequelize.STRING(100),
                allowNull:true,
                comment:'파일타입'
            },
            file_download_su:{
                type:Sequelize.INTEGER.UNSIGNED,
                allowNull:true,
                defaultValue:0,
                comment:'파일다운로드수'
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'BoardFile',
            tableName: 'board_file',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
          });
    }
    static associate(db){
        db.BoardFile.belongsTo(db.Board,{foreignKey:'f_bbs_id',targetKey:'id',onDelete:'CASCADE',onUpdate:'CASCADE'});
       // db.BoardFile.belongTo(db.Board,{foreignKey:'f_bbs_id',targetKey:'idx'});
    }
}