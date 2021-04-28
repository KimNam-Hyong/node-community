const express = require('express');
const {Content} = require('../models');
const bcrypt = require('bcrypt');//비밀번호를 암호화하기 위한 모듈
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');//로그인이 되었는지 안 되었는지 확인하는 미들웨어
const router = express.Router();

router.get('/:co_id',async (req,res,next)=>{
    try {
        const row = await Content.findOne({
           where:{
               co_id:req.params.co_id
           } 
        });
        res.render('./content/content',{
            title:`내용관리`,
            row,
            menuRow
        });
    } catch (error) {
        
    }
});
module.exports = router;