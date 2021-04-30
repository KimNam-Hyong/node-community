const express = require('express');//웹프레임워크
const cookieParser = require('cookie-parser');//쿠키 파싱
const morgan = require('morgan');//로그찍는 미들웨어
const path = require('path');//경로 모듈
const session = require('express-session');//웹프레임워크 세션
const nunjucks = require('nunjucks');//UI 모듈
const dotenv = require('dotenv');//비밀번호 암호화하고 저장하는 모듈
const passport = require('passport');
//레디스 설정
//세션을 메모리에 저장하기 위한 작업
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
dotenv.config();
const redisClient = redis.createClient({
  url:`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password:process.env.REDIS_PASSWORD
});
const {sequelize} = require('./models');
const passportConfig = require('./passport');
const mainRouter = require('./routes/main');
const setupRouter = require('./routes/setup');
const adminRouter = require('./routes/admin');
const loginRouter = require('./routes/login');
const adminPostRouter = require('./routes/admin_post');
const bbsRouter = require('./routes/bbs');
const bbsPostRouter = require('./routes/bbs_post');
const webSocket = require('./socket');
const contentRouter = require('./routes/content');
const logger = require('./logger');
global.boardSkin=[];//게시판 스킨 목록

const app = express();
passportConfig();
app.set('port',process.env.PORT || 4001);
app.set('view engine','html');
nunjucks.configure('view', {
    express:app,
    watch:true,
    autoescape:false
});
//이것이 없으면 table 생성이 안 됨
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
    
  })
  .catch((err) => {
    console.error(err);
  });

if (process.env.NODE_ENV === 'production')
{
	app.use(morgan('combined'));
}else{
	app.use(morgan('dev'));//로그찍는 미들웨어
}
app.use(express.static(path.join(__dirname,'public')));//css,js 디렉토리 지정
app.use('/upload', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());//json
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionMiddleware = {
  resave:false,
  saveUninitalized:false,
  secret:process.env.COOKIE_SECRET,
  cookie: {
      httpOnly:true,
      secure:false
  },
  store: new RedisStore({client:redisClient}),
};
if(process.env.NODE_ENV === 'production'){
	sessionMiddleware.proxy = true;
}

app.use(session(sessionMiddleware));
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next) => {    
  res.locals.user = req.user;
  next();
})
app.use('/',mainRouter);
app.use('/setup',setupRouter);
app.use('/admin',adminRouter);
app.use('/admin_post',adminPostRouter);
app.use('/login',loginRouter);
app.use('/bbs',bbsRouter);
app.use('/bbs_post',bbsPostRouter);
app.use('/content',contentRouter);
app.use((req,res,next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    logger.info('hello');
    logger.error(error.message);
    next(error);
});

app.use((err,req,res,next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(app.get('port'),() => {
    console.log(app.get('port'), '번 포트에서 대기중');
});

webSocket(server,app,sessionMiddleware);
