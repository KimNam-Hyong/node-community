const express = require('express');
const router = express.Router();
const { User,SiteSetting,sequelize} = require('../models/');
const {Op} = require('../models');
const Swal = require('sweetalert2');
const fs = require('fs');
const base_convert=require('locutus/php/math/base_convert');
//메인페이지
router.get('/',async (req,res,next) => {
    try {
        const siteInfo = await SiteSetting.findOne();
        const AdminCount = await User.findAndCountAll({ where:{'user_level':10}});

        var sql = `select * from menu where length(me_code) = '2'`;
        global.menuRow=await sequelize.query(sql,{nest:true});
        if(AdminCount.count==0){
            res.redirect('/setup/');
        }else{
           
            res.render('main', {
                title: '포원커뮤니티',
                user:req.user,
                siteInfo:siteInfo,
                menuRow
            });
        }
    } catch (error) {
        console.log(error);
    }
});
//로그인페이지
router.get('/login',async (req,res,next) => {
    var sql = `select * from menu where length(me_code) = '2'`;
    global.menuRow=await sequelize.query(sql,{nest:true});
    const siteInfo = await SiteSetting.findOne();
    res.render('./member/login',{
        title:'로그인',
        siteInfo:siteInfo,
        menuRow
    });
});
//회원가입페이지
router.get('/join',async (req,res,next) => {
    try{
        const siteInfo = await SiteSetting.findOne();
        var sql = `select * from menu where length(me_code) = '2'`;
        global.menuRow=await sequelize.query(sql,{nest:true});
        if(req.query.w=="u"){
        
        if(req.user.user_id==""){
            res.redirect('/');
        }
        }
        res.render('./member/join', {
            title:'회원가입',
            siteInfo:siteInfo,
            user:req.user,
            query:req.query,
            menuRow
        });
    }catch(error){
        res.redirect('/');
    }
});
//회원가입 성공페이지
router.get('/join_success',async (req,res,next) => {
    const siteInfo = await SiteSetting.findOne();
    res.render('./member/join_success', {
        title:'회원가입',
        siteInfo:siteInfo,
        query:req.query,
        menuRow
    });
});
module.exports = router;