const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');//strategy를 알아보기쉽게 localsrategy로 바꿈
const bcrypt = require('bcrypt');
const db = require('../models');
//로그인전략은 어떤 것을 로그인 시킬지
module.exports = () => {
  passport.use(new LocalStrategy({//passport도 middleware식으로 use를 사용함
    usernameField: 'userId',//front에서 req.body에 넣어준 것
    passwordField: 'password',
  }, async (userId, password, done) => {
    try {
      const user = await db.User.findOne({ where: { userId } });
      if (!user) {//기존 사용자가 없으면
        return done(null, false, { reason: '존재하지 않는 사용자입니다!' });
      }
      const result = await bcrypt.compare(password, user.password);//compare라는 걸 bcrypt에서 제공
      if (result) {//비교해서 일치하면 result가 true
        return done(null, user);//성고했을 때 done의 두 번째 인수
      }
      return done(null, false, { reason: '비밀번호가 틀립니다.' });
    } catch (e) {
      console.error(e);
      return done(e);
    }
  }));
};
