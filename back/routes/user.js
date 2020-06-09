const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => { // /api/user/
  const user = Object.assign({}, req.user.toJSON());
  delete user.password;
  return res.json(user);
});
router.post('/', async (req, res, next) => { // POST /api/user 회원가입
  try {
    const exUser = await db.User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // salt는 10~13 사이로
    const newUser = await db.User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: hashedPassword,
    });
    console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => { // 남의 정보 가져오는 것 ex) /api/user/123
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },//req.params.id가 문자열
    
      attributes: ['id', 'nickname'],
    });
    const jsonUser = user.toJSON();
    res.json(jsonUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/logout', (req, res) => { // /api/user/logout
  req.logout();
  req.session.destroy();
  res.send('logout 성공');
});

router.post('/login', (req, res, next) => { // POST /api/user/login
  passport.authenticate('local', (err, user, info) => { //passport를 불러오는 코드 필요
    if (err) {//서벙러라면//err user info 각각 done의 첫 두 세 번째 인자를 받음
      console.error(err);
      return next(err);//next로 서버에러 보내기
    }
    if (info) {//로지상에러라면
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {//req.login을 하면 서버쪽에 세션,쿠키가 저장//req.login할 때 passport의 serialized가 실행
      try {
        if (loginErr) {
          return next(loginErr);
        }
        const fullUser = await db.User.findOne({
          where: { id: user.id },
         
          attributes: ['id', 'nickname', 'userId'],//사용자 정보는 비밀번호만 빼고 보냄
        });
        console.log(fullUser);
        return res.json(fullUser);//사용자정보 보내기
      } catch (e) {
        next(e);
      }
    });
  })(req, res, next);
});






router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update({
      nickname: req.body.nickname,
    }, {
      where: { id: req.user.id },
    });
    res.send(req.body.nickname);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
