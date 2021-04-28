const express = require('express');
const {User} = require('../models');
const bcrypt = require('bcrypt');//비밀번호를 암호화하기 위한 모듈
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');//로그인이 되었는지 안 되었는지 확인하는 미들웨어
const router = express.Router();

router.get('/',(req,res,next) => {
    
    res.render('./setup/main', {
        title: '게시판 설정'
    });
}).post('/',async (req,res,next) => {
    try{
        const hashPassword=await bcrypt.hash(req.body.user_password,12);
        const AdminCreate = await User.create({
            user_id:req.body.user_id,
            user_name:req.body.user_name,
            user_password:hashPassword,
            user_level:10,
            auth_status:1
        });
        const s_hashPassword = await bcrypt.hash(req.body.super_password,12);
        const SuperCreate = await User.create({
            user_id:req.body.super_id,
            user_name:'슈퍼관리자',
            user_password:s_hashPassword,
            user_level:20,
            auth_status:1
        });
        res.redirect('/');
    }catch(err){

    }
    
    console.log(req.body);
    console.log("설정");

});

module.exports = router;