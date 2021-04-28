const express = require('express');
const router = express.Router();
const { User,SiteSetting,BoardSetting, Board,sequelize, BoardFile,BoardComment } = require('../models/');
const Swal = require('sweetalert2');
const fs = require('fs');
const Sequelize = require('sequelize');
const mime = require('mime');


//게시판 페이지
router.get('/:bo_id/:type',async (req,res,next) => {
    try {
        console.log(global.bo_password);
        const bRow=await BoardSetting.findOne({
            where:{bo_id:req.params.bo_id}
        });
        const siteInfo=await SiteSetting.findOne();
        //권한설정 체킹할 때 필요함
        var user_level=0;
        if(req.user!=undefined){
            user_level = req.user.user_level;
        }
        var errorMsg = "";
        //목록페이지 
        if(req.params.type=="list"){
            const page = Number(req.query.page) || 1;//현재페이지
            const limit = bRow.bo_list_su;//목록에 보여줄 갯수
            const pageSize = 10;//페이지네이션
            const skipSize = (page-1) * limit;//다음페이지 건너뛸 리스트 수
            
            var sql = "select count(*) as count from board where f_bo_id = :f_bo_id";
            
            if(req.query.field&&req.query.value){
                sql+=` and ${req.query.field} like '%${req.query.value}%'`;
            }
            const bbsCnt=await sequelize.query(sql,{
                replacements: { f_bo_id: req.params.bo_id },
                nest:true
            });
            const totalCnt = bbsCnt[0].count;
            console.log(totalCnt);
            const pageTotal = Math.ceil(totalCnt / limit);//총 페이지 수
            const pageStart = ((Math.ceil(page/pageSize) -1) * pageSize) + 1;//첫번째 페이지 번호
            const pageEnd = (pageStart + pageSize) -1;//마지막 페이지 번호
            // 목록 권한 체크하기
            if(user_level<bRow.bo_list_level){
                errorMsg = "목록권한이 없습니다.";
            }
           
            const levels = JSON.parse(siteInfo.user_level_text);
            /*const row = await User.findAll({
                offset: skipSize,
                limit:limit
            });*/
            var sql = "select *,(select count(*) from board_comment where f_bbs_id = b.id) as cnt from board b where b.f_bo_id = :f_bo_id";
            
            if(req.query.field&&req.query.value){
                sql+=` and ${req.query.field} like '%${req.query.value}%'`;
            }
            sql+=`  order by b.id desc limit ${skipSize},${limit}`;
            console.log(sql);
            const row=await sequelize.query(sql,{
                replacements: { f_bo_id: req.params.bo_id },
                nest:true
            });
            if(row.length==0&&0<totalCnt){
                return res.redirect(`/bbs/${req.params.bo_id}/${req.params.type}/?page=${page-1}&field=${req.query.field}&value=${req.query.value}`);
            }
            const pageData = {
                page,
                pageStart,
                pageEnd,
                pageTotal,
                totalCnt,
                skipSize,
                row
            };
            //공지사항 체크된 게시물 쿼리문
            const noticeRow = await Board.findAll({
                where:{
                    f_bo_id:req.params.bo_id,
                    is_notice:1
                },
                order:[['id','DESC']],
                limit:bRow.bo_notice_su
            });
            console.log(noticeRow);
            res.render(`./board_skin/${bRow.bo_skin_path}/${req.params.type}`, {
                title: '게시판 목록',
                user:req.user,
                errorMsg,
                siteInfo,
                pageData,
                params:req.params,
                noticeRow,
                menuRow

            });
        //글쓰기 페이지            
        }else if(req.params.type=="write"){
            if(user_level<bRow.bo_write_level){
                errorMsg = "글쓰기 및 수정 권한이 없습니다.";
            }
            var row;
            if(req.query.id!=undefined){
                row = await Board.findOne({
                    where:{
                        id:req.query.id
                    }
                });
                //회원로그인이 아니거나 또는 비밀번호 입력을 안 한 후에 바로 접근을 했을 때...
                console.log(req.user);
                if(req.user==undefined){
                    if(global.bo_password != Boolean(req.query.result)){
                        errorMsg = "비밀번호가 틀렸거나 또는 수정페이지에 바로 접근을 했습니다..";
                    }else{
                        global.bo_password=false;
                    }
                }
            }
            
            res.render(`./board_skin/${bRow.bo_skin_path}/${req.params.type}`, {
                title: `${bRow.bo_name} 목록`,
                errorMsg,
                user:req.user,
                siteInfo,
                params:req.params,
                user_level:user_level,
                bRow,
                row,
                menuRow
            });
        //게시판 상세보기            
        }else if(req.params.type=="view"){
            if(user_level<bRow.bo_view_level){
                errorMsg = "글보기 권한이 없습니다.";
            }
            //조회수 올리기
            await Board.update({
                read_hit: Sequelize.literal('read_hit + 1') 
            },{where:{id:req.query.id}});

            const row=await Board.findOne({
                where:{
                    id:req.query.id,
                    f_bo_id:req.params.bo_id
                }
            });

            const fileRow=await BoardFile.findAll({
                where:{
                    f_bbs_id:req.query.id
                }
            });
            const commentRow = await BoardComment.findAll({
                where:{
                    f_bbs_id:req.query.id
                }
            });
            
            res.render(`./board_skin/${bRow.bo_skin_path}/${req.params.type}`, {
                title: '상세보기',
                row,
                fileRow,
                params:req.params,
                query:req.query,
                user_level:user_level,
                bRow,
                errorMsg,
                siteInfo,
                commentRow,
                menuRow
            });
        }else if(req.params.type=="password"){
            global.bo_password = false;
            res.render(`./board_skin/${bRow.bo_skin_path}/${req.params.type}`, {
                title: '게시판 비밀번호',
                params:req.params,
                query:req.query,
                siteInfo,
                errorMsg,
                menuRow
            });
        }
        
    } catch (error) {
        console.log(error);
    }
});
//다운로드
router.get('/download/:file_no/:f_bbs_id',async (req,res,next) => {
    try{
        await BoardFile.update({
            file_download_su: Sequelize.literal('file_download_su + 1') 
        },{
            where:{
                f_bbs_id:req.params.f_bbs_id,
                file_no:req.params.file_no
            }
        });
        const row=await BoardFile.findOne({
            where:{
                f_bbs_id:req.params.f_bbs_id,
                file_no:req.params.file_no
            }
        });
        console.log(row);
        const file = row.file_path;
        const file_name = row.file_name;
        const mimetype = row.mimetype.replace('application','text');
        console.log(mimetype);
        res.header("Access-Control-Allow-Origin", "*");
        res.setHeader('Content-disposition','attachment; filename='+encodeURIComponent(file_name));
        res.setHeader('Content-type',mimetype);
        const filestream = fs.createReadStream(file);
        filestream.pipe(res);
    }catch(error){
        console.log(error);
    }
});

module.exports = router;