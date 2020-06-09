const dotenv = require('dotenv'); 

dotenv.config();//dotenv를 실행시키면 .env파일 안에걸 불러들여서 process.env에 넣어줌
//config.json 원래 json형식이였는데 변수를 사용하기위해서 js형식으로 바꿔줌

/*
  dotenv.config() 두번해야하는 이유?
config.js에 dotenv.config()를 하고 
index.js에도 dotenv.config()를 함

처음 진입점이 되는 곳에서는 해야합니다. seqeulize db:create같은 곳에서는 config.js가 진입점이고 일반 서버 실행시에는 index.js가 진입점입니다
*/
module.exports = {
  development: {
    username: 'root',
    password: process.env.DB_PASSWORD,//db 비번
    database: 'board',//db 아름
    host: '127.0.0.1',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'board',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'board',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
