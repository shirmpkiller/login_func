const express = require('express');//server를 구성하는 프레임워크
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');//세션 쿠키 보내주는것 자동화

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');

dotenv.config(); //dotenv를 실행시키면 .env파일안에것을 읽어들여와서 process.env에 넣어줌
const app = express();
db.sequelize.sync();//알아서 테이블 생성
passportConfig();//passport를 실행
//api는 다른 서비스가 내 서비스를 사용할 수 있게 열어둔 창구

app.use(morgan('dev'));//요청을 로그 찍는것
app.use('/', express.static('uploads'));
app.use(cors({ //origin과 credentials를 true로 해야 쿠키 주고받는 것 허용
  origin: true,
  credentials: true,
}));
app.use(express.json());//json형식의 본문을 처리하는 것
app.use(express.urlencoded({ extended: true }));//요청의 본문이 들어왔을 때 req.body에 넣어주는 역할
app.use(cookieParser(process.env.COOKIE_SECRET));//dotenv를 실행시키면 .env파일을 불러와서 process.env에 넣어줌
app.use(expressSession({//session사용 가능하게//express-session은 passport로 로그인 후 유저 정보를 세션에 저장하기 위해 사용
  resave: false,//매번 세션 강제 저장 false
  saveUninitialized: false,//빈 값도 저장 false
  secret: process.env.COOKIE_SECRET,//암호화 키 app.use(cookiePrser(?)) ?안에 똑같이 넣어줌
  cookie: {
    httpOnly: true,//쿠키를 자바스크립트로 접근을 못함
    secure: false, // https를 쓸 때 true
  },
  name: 'rnbck',//쿠키 이름 바꿔서 해커가 못 알아차리게함
}));
app.use(passport.initialize());
app.use(passport.session());//passport session은 express session보다 아래 적어야함 passport세션이 express세션을 내부적으로 사용하기때문
//미들웨어 간 의존관계 있을 시 순서 중요

// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/api/user', userAPIRouter);

app.listen(3065, () => {
  console.log('server is running on http://localhost:3065');
});
