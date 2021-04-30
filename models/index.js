const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');//회원관련 db
const SiteSetting = require('./site_setting');//사이트설정관련 db
const BoardSetting = require('./board_setting');//게시판설정 관련 db
const BoardCategory = require('./board_category');//게시판분류 관련 db
const Board = require('./board');//게시판 관련 db
const BoardFile = require('./board_file');//게시판 파일 관련 db
const BoardComment = require('./board_comment');//게시판 댓글 관련 db
const Menu = require('./menu');
const Content = require('./content');


const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.User = User;
db.SiteSetting = SiteSetting;
db.BoardSetting = BoardSetting;
db.BoardCategory = BoardCategory;
db.Board = Board;
db.BoardFile = BoardFile;
db.BoardComment = BoardComment;
db.Content = Content;
db.Menu = Menu;

User.init(sequelize);
SiteSetting.init(sequelize);
BoardCategory.init(sequelize);
BoardSetting.init(sequelize);
Board.init(sequelize);
BoardFile.init(sequelize);
BoardComment.init(sequelize);
Menu.init(sequelize);
Content.init(sequelize);
//관계형일 때는 반드시 넣을 것
Board.associate(db);
BoardFile.associate(db);
BoardComment.associate(db);

module.exports = db;
