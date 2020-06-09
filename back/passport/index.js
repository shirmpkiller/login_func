const passport = require('passport');
const db = require('../models');
const local = require('./local');
//serializeUser 자체가 저장하는 함수
//done은 세션에 무엇을 저장할지에 대한 함수
module.exports = () => {
  passport.serializeUser((user, done) => { // 서버쪽에 [{ id: 3, cookie: 'asdfgh' }]저장// id랑 쿠키를 보냄
    return done(null, user.id);//done은 세션에 무엇을 저장할지에 대한 함수
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: { id },
      });
      return done(null, user); // req.user를 만들어냄
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  local(); //전략을 연결
};

// 프론트에서 서버로는 cookie만 보내요(asdfgh)
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 3 발견
// id: 3이 deserializeUser에 들어감
// req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱
