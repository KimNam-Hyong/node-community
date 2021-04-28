exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      //res.status(403).send('로그인 필요');
      res.redirect(`/login?err_code=04&loginError=다시 로그인을 하십시오.`);
    }
};
  
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    console.log(`req 정보:${req.user.user_level}`);
    const message = encodeURIComponent('로그인한 상태입니다.');
    /*if(req.user.user_level==1){
      res.redirect(`/?error=${message}`);
    }
    if(req.user.user_level==2){
      res.redirect(`/manager/?error=${message}`);
    }
    if(req.user.user_level==10){
      res.redirect(`/adm/?error=${message}`);
    }*/
    res.redirect(`/?error=${message}`);
  }
};