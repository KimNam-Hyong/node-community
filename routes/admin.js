const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('./middlewares');
const {SiteSetting,User, sequelize, BoardSetting,Content, Menu} = require('../models/');
const {Op} = require('sequelize');
const fs = require('fs');//파일관련 모듈
const base_convert=require('locutus/php/math/base_convert');
const { EDESTADDRREQ } = require('constants');

router.get('/',isLoggedIn, (req,res,next) => {
    try {
        if(req.user.user_level<10){
            return res.redirect('/login/?err_code=05&error_message=관리자 외 접근 하실 수 없습니다.')
        }
        console.log(req.user);
        res.render('./admin/main', {
            title: '관리자모드',
            user:req.user
        });
    } catch (error) {
        return res.redirect(`/login?err_code=04&loginError=다시 로그인을 하십시오.`);
    }
    
});
//사이트 설정 페이지가기
router.get('/site_setup',isLoggedIn,async (req,res,next) => {
    try {
        if(req.user.user_level<10){
            return res.redirect('/login/?err_code=05&error_message=관리자 외 접근 하실 수 없습니다.')
        }
        const row=await SiteSetting.findOne();
        console.log(row);
        res.render('./admin/site_setup',{
            title:'사이트 설정',
            row,
            user:req.user
        });    
    } catch (error) {
        console.log(error);
        return res.redirect(`/login?err_code=04&loginError=다시 로그인을 하십시오.`);
    }
});
//회원관리 페이지
router.get('/member_list',isLoggedIn, async (req,res,next) => {
    try {
        if(req.user.user_level<10){
            return res.redirect('/login/?err_code=05&loginError=관리자 외 접근 하실 수 없습니다.');
        }
        const page = Number(req.query.page) || 1;//현재페이지
        const limit = 20;//목록에 보여줄 갯수
        const pageSize = 10;//페이지네이션
        const skipSize = (page-1) * limit;//다음페이지 건너뛸 리스트 수
        /*const userCnt = await User.findAndCountAll({
            where:{ 
                user_level : {[Op.ne]:20}
            }
        });//슈퍼관리자가 아닌 경우 가져오기*/
        var sql = "select count(*) as count from user where user_level < :level";
        
        if(req.query.field&&req.query.value){
            sql+=` and ${req.query.field} like '%${req.query.value}%'`;
        }
        const userCnt=await sequelize.query(sql,{
            replacements: { level: '10' },
            nest:true
        });
        const totalCnt = userCnt[0].count;
        const pageTotal = Math.ceil(totalCnt / limit);//총 페이지 수
        const pageStart = ((Math.ceil(page/pageSize) -1) * pageSize) + 1;//첫번째 페이지 번호
        const pageEnd = (pageStart + pageSize) -1;//마지막 페이지 번호
        
        const siteInfo=await SiteSetting.findOne();
        console.log(siteInfo.user_level_text);
        const levels = JSON.parse(siteInfo.user_level_text);
        /*const row = await User.findAll({
            offset: skipSize,
            limit:limit
        });*/
        var sql = "select * from user where user_level < :level";
        
        if(req.query.field&&req.query.value){
            sql+=` and ${req.query.field} like '%${req.query.value}%'`;
        }
        sql+=`  order by id desc limit ${skipSize},${limit}`;
        console.log(sql);
        const row=await sequelize.query(sql,{
            replacements: { level: '10' },
            nest:true
        });
        if(row.length==0&&0<totalCnt){
            return res.redirect(`/admin/member_list/?page=${page-1}&field=${req.query.field}&value=${req.query.value}`);
        }
        
        
        const pageData = {
            page,
            pageStart,
            pageEnd,
            pageTotal,
            totalCnt,
            skipSize,
            row,
            siteInfo,
            levels,
            query:req.query
        };
        console.log(req.user);
        res.render('./admin/member_list', {
            title: '관리자모드',
            user:req.user,
            pageData,
        });
    } catch (error) {
        console.log(error);
        return res.redirect(`/login?err_code=04&loginError=다시 로그인을 하십시오.`);
    }
    
});

//회원정보수정 및 등록폼 페이지
router.get('/member_form/:user_id/',isLoggedIn,async (req,res,next) => {

    try{
        if(req.user.user_level<10){
            return res.redirect('/login/?err_code=05&loginError=관리자 외 접근 하실 수 없습니다.');
        }
      const siteInfo=await SiteSetting.findOne();
      console.log(req.params);
      const row = await User.findOne({
          where:{
              user_id:req.params.user_id
          }
      });
      res.render('./admin/member_form',{
        title:`${req.params.user_id} 회원 수정`,
        siteInfo,
        query:req.query,
        row
      });
    }catch(error){
        console.log(error);
        return res.redirect(`/login?err_code=04&loginError=다시 로그인을 하십시오.`);
    }
});
//게시판 세팅 목록 페이지
router.get('/board_setting',isLoggedIn,async (req,res,next) => {
    try {
        if(req.user.user_level<10){
            return res.redirect('/?err_code=05&error_message=관리자 외 접근 하실 수 없습니다.')
        }
        boardSkin=[];
        fs.readdir('./view/board_skin/',(err,data) => {
            data.forEach(dir => {
              if(boardSkin.indexOf(dir) < 0){
                boardSkin.push(dir);
              }
            });
        });  
        const page = Number(req.query.page) || 1;//현재페이지
        const limit = 20;//목록에 보여줄 갯수
        const pageSize = 10;//페이지네이션
        const skipSize = (page-1) * limit;//다음페이지 건너뛸 리스트 수
        /*const userCnt = await User.findAndCountAll({
            where:{ 
                user_level : {[Op.ne]:20}
            }
        });//슈퍼관리자가 아닌 경우 가져오기*/
        var sql = "select count(*) as count from board_setting where 1";
        
        if(req.query.field&&req.query.value){
            sql+=` and ${req.query.field} like '%${req.query.value}%'`;
        }
        const boardSettingCnt=await sequelize.query(sql,{
            nest:true
        });
        const totalCnt = boardSettingCnt[0].count;
        const pageTotal = Math.ceil(totalCnt / limit);//총 페이지 수
        const pageStart = ((Math.ceil(page/pageSize) -1) * pageSize) + 1;//첫번째 페이지 번호
        const pageEnd = (pageStart + pageSize) -1;//마지막 페이지 번호
        
        const siteInfo=await SiteSetting.findOne();
        
        var sql = "select * from board_setting where 1";
        
        if(req.query.field&&req.query.value){
            sql+=` and ${req.query.field} like '%${req.query.value}%'`;
        }
        sql+=`  order by id desc limit ${skipSize},${limit}`;
        console.log(sql);
        const row=await sequelize.query(sql,{
            replacements: { level: '10' },
            nest:true
        });
        if(row.length==0&&0<totalCnt){
            return res.redirect(`/admin/board_setting/?page=${page-1}&field=${req.query.field}&value=${req.query.value}`);
        }
        
        
        const pageData = {
            page,
            pageStart,
            pageEnd,
            pageTotal,
            totalCnt,
            skipSize,
            row,
            siteInfo,
            query:req.query
        };
        console.log(req.user);
        res.render('./admin/board_setting',{
            title:'게시판설정',
            pageData,
            boardSkin
          
        });
    } catch (error) {
        console.log(error);
        return res.redirect(`/login?err_code=04&loginError=다시 로그인을 하십시오.`);
    }
});

//게시판 등록 및 수정 페이지
router.get('/board_form/:bo_id',isLoggedIn,async (req,res,next) => {
    try {
        if(req.user.user_level<10){
            return res.redirect('/login/?err_code=05&loginError=관리자 외 접근 하실 수 없습니다.');
        }
        boardSkin=[];
        fs.readdir('./view/board_skin/',(err,data) => {
            data.forEach(dir => {
              if(boardSkin.indexOf(dir) < 0){
                boardSkin.push(dir);
              }
            });
        });  
        console.log(boardSkin);
        //게시판 세팅용 쿼리문 가져오기
        const row = await BoardSetting.findOne({
            where:{bo_id:req.params.bo_id}
        });

        const siteInfo=await SiteSetting.findOne();
        const levels = JSON.parse(siteInfo.user_level_text);
        var bo_ext_titles=[];
        if(req.query.w=="u"){
            bo_ext_titles.push(row.bo_ext1_title);
            bo_ext_titles.push(row.bo_ext2_title);
            bo_ext_titles.push(row.bo_ext3_title);
            bo_ext_titles.push(row.bo_ext4_title);
            bo_ext_titles.push(row.bo_ext5_title);
            bo_ext_titles.push(row.bo_ext6_title);
            bo_ext_titles.push(row.bo_ext7_title);
            bo_ext_titles.push(row.bo_ext8_title);
            bo_ext_titles.push(row.bo_ext9_title);
            bo_ext_titles.push(row.bo_ext10_title);
            bo_ext_titles.push(row.bo_ext11_title);
            bo_ext_titles.push(row.bo_ext12_title);
            bo_ext_titles.push(row.bo_ext13_title);
            bo_ext_titles.push(row.bo_ext14_title);
            bo_ext_titles.push(row.bo_ext15_title);
            bo_ext_titles.push(row.bo_ext16_title);
            bo_ext_titles.push(row.bo_ext17_title);
            bo_ext_titles.push(row.bo_ext18_title);
            bo_ext_titles.push(row.bo_ext19_title);
            bo_ext_titles.push(row.bo_ext20_title);
        }
        
        res.render('./admin/board_form',{
            title:`${req.params.bo_id} 게시판 등록`,
            boardSkin,
            levels,
            params:req.params,
            query:req.query,
            row,
            bo_ext_titles
        });
    } catch (error) {
        console.log(error);
        return res.redirect(`/login?err_code=04&loginError=다시 로그인을 하십시오.`);
    }
});
//메뉴설정 목록 페이지 이동
router.get('/menu_setting',isLoggedIn,async (req,res,next) => {
    try {
        if(req.user.user_level<10){
            return res.redirect('/login/?err_code=05&loginError=관리자 외 접근 하실 수 없습니다.');
        }
        const row = await Menu.findAll({
            order:[['me_code','asc']]
        });
        var sql = `select * from menu where length(me_code) = '2'`;
        global.menuRow=await sequelize.query(sql,{nest:true});
        res.render('./admin/menu_setting',{
            title:'메뉴설정',   
            row
        });    
    } catch (error) {
        console.log(error);
        return res.redirect(`/login?err_code=04&loginError=다시 로그인을 하십시오.`);
    }
});
//메뉴 추가 및 수정 페이지 이동
router.get('/menu_form',isLoggedIn,async (req,res,next)=>{
    try{
        var num="";
        console.log(req.query.w);
        var me_code="";
        var sub_me_code ="";
        
        if(req.query.w==""){
            //메뉴 코드 초기 상태 지정하기 그누보드 참조해서 만듬
            if(req.query.me_code==undefined){
                me_code="";
            }else{
                me_code = req.query.me_code;
            }
            
            var len = me_code.length;
            if(7 <= len ){
                res.redirect('/admin/menu_setting/?errorMsg=더 이상 분류를 추가하실 수 없습니다.');
            }
            var len2 = len + 1;
            var sql = `select max(substring(me_code,${len2},2)) as max_subid from menu where substring(me_code,1,${len}) = '${me_code}'`;
            const row=await sequelize.query(sql,{nest:true});
            const max_subid = row[0].max_subid||0;
            console.log(max_subid);
            num = base_convert(max_subid,36,10)||0;
            num = parseInt(num)+36;
            if(num >= 36 * 36){
                num = " ";
            }
            num = base_convert(num,10,36);
            console.log(num);
            sub_me_code = num.substring(`00${num}`,-2);
            sub_me_code = me_code + sub_me_code;
            //메뉴초기상태 지정하기 끝 
            const sublen = num.length;
            var mRow;
            if(me_code){
                mRow=await Menu.findOne({
                    attributes:['me_name']
                },{
                    where:{
                        me_code:me_code
                    }
                });
            }

            res.render('./admin/menu_form',{
                title:'메뉴설정', 
                me_code:sub_me_code,
                query:req.query,
                mRow
            });    
            
        }else{
            const row=await Menu.findOne({
                where:{id:req.query.id}
            });
            console.log(row);
            res.render('./admin/menu_form',{
                title:'메뉴수정',
                me_code:row.me_code,
                row,
                query:req.query
            });
        }
        
    }catch(error){
        console.log(error);
    }
});
//메뉴 팝업창 띄우기
router.get('/popup_menu_form',isLoggedIn,async (req,res,next) => {
    try{
        res.render('./admin/popup_menu_form',{
            title:'메뉴설정'
        });
    }catch(error){

    }
});
//내용 목록 페이지
router.get('/content_list',isLoggedIn,async (req,res,next) => {
    try{
        if(req.user.user_level<10){
            return res.redirect('/login/?err_code=05&loginError=관리자 외 접근 하실 수 없습니다.');
        }
        var sql = "select * from content where 1";
        
        if(req.query.field&&req.query.value){
            sql+=` and ${req.query.field} like '%${req.query.value}%'`;
        }
        sql+=`  order by id desc`;
        console.log(sql);
        const row=await sequelize.query(sql,{
            nest:true
        });
        
        
        console.log(row);
        res.render('./admin/content_list',{
            title:`내용관리`,
            row,
            query:req.query
        });
    }catch(error){
        console.log(error);
        return res.redirect(`/login?err_code=04&loginError=다시 로그인을 하십시오.`);
    }
});
//내용 등록 및 수정페이지
router.get('/content_form',isLoggedIn,async (req,res,next) => {
    try{
        if(req.user.user_level<10){
            return res.redirect('/login/?err_code=05&loginError=관리자 외 접근 하실 수 없습니다.');
        }
        var row={};
        if(req.query.w=="u"){
            row = await Content.findOne({
                where:{
                    id:req.query.id
                }
            });
        }
        res.render('./admin/content_form',{
            title:`내용등록`,
            params:req.params,
            query:req.query,
            row
        });
    }catch(error){
        console.log(error);
        return res.redirect(`/login?err_code=04&loginError=다시 로그인을 하십시오.`);
    }
});
module.exports = router;