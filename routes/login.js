const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const {User,SiteSetting} = require('../models/');

const router = express.Router();
//로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
  
  passport.authenticate('local', (authError, user, info) => {
    
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/login?err_code=${info.err_code}&loginError=${info.message}`);
    }
    
    return req.login(user, (loginError) => {
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});
//회원가입
router.post('/join',async (req,res,next) => {
  try {
    const row = await SiteSetting.findOne();
    var auth_status = row.auth_status_set==1?0:1;
    
    if(req.body.w==""){
      const mRow=await User.findAndCountAll({
        where:{user_id:req.body.user_id}
      });
      //아이디가 있을 경우
      if(0 < mRow.count){
        res.redirect('/join/?error=nojoin');
      }
      const hashPassword=await bcrypt.hash(req.body.user_password,12);//비밀번호 암호화
      
        await User.create({
          user_id:req.body.user_id,
          user_name:req.body.user_name,
          user_password:hashPassword,
          user_tel:req.body.user_tel,
          user_mobile:req.body.user_mobile,
          user_email:req.body.user_email,
          user_zip:req.body.user_zip,
          user_addr1:req.body.user_addr1,
          user_addr2:req.body.user_addr2,
          user_addr3:req.body.user_addr3,
          user_level:row.user_level_set,
          auth_status:auth_status
        });
      
      res.redirect(`/join_success/?user_name=${req.body.user_name}`);
    }else{
      
      const MemberJoin = await User.update({
        user_name:req.body.user_name,
        user_tel:req.body.user_tel,
        user_mobile:req.body.user_mobile,
        user_email:req.body.user_email,
        user_zip:req.body.user_zip,
        user_addr1:req.body.user_addr1,
        user_addr2:req.body.user_addr2,
        user_addr3:req.body.user_addr3,
        user_level:row.user_level_set,
        auth_status:auth_status
      },{
        where:{user_id:req.body.user_id}
      });
      if(req.body.user_password){
        const hashPassword=await bcrypt.hash(req.body.user_password,12);//비밀번호 암호화
        const MemberJoin = await User.update({
          user_password:hashPassword,
        },{
          where:{user_id:req.body.user_id}
        });
      }
      res.redirect('/');
    }
    
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

//아이디 중복체크하기
router.post('/id_check',async (req,res,next)=> {
  try {
    
    const count=await User.findAndCountAll({
      where:{user_id:req.body.params.user_id}
    });
    console.log(count);
    if(0 < count.count){
      return res.json({success:'failed'});
    }else{
      return res.json({success:'success'});
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;