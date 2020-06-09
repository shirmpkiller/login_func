exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {//express와 passport에서 로그인했는지 제공하는 함수가 isauthenticated
    next(); //next하면 다음 미들웨어로 이동
  } else {
    res.status(401).send('로그인이 필요합니다.');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인한 사용자는 접근할 수 없습니다.');
  }
};
