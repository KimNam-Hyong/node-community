const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Board,BoardFile,BoardComment } = require('../models/');
const Swal = require('sweetalert2');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
var thumb = require('node-thumbnail').thumb;
const e = require('express');
const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads/');
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  });
//파일 업로드
router.post('/upload',upload.single('bo_file'),async (req,res,next) => {
    try{
        console.log(req.file);
        
        res.json(req.file);
    }catch(error){

    }
    
});
const upload2=multer();
router.post('/write',upload2.array('file'),async (req,res,next) => {
    try {
        const is_secret = req.body.is_secret=="1"?"1":"0";
        const is_notice = req.body.is_notice=="1"?"1":"0";
        if(req.body.w=="") {
            var hashPassword = "";
            if(req.body.bo_password!=""){
                hashPassword=await bcrypt.hash(req.body.bo_password,12);//비밀번호 암호화
            }
            await Board.create({
                f_bo_id:req.body.f_bo_id,
                bo_subject:req.body.bo_subject,
                bo_content:req.body.bo_content,
                bo_password:hashPassword,
                user_id:req.body.user_id,
                user_name:req.body.user_name,
                bo_ext1:req.body.bo_ext1,
                bo_ext2:req.body.bo_ext2,
                bo_ext3:req.body.bo_ext3,
                bo_ext4:req.body.bo_ext4,
                bo_ext5:req.body.bo_ext5,
                bo_ext6:req.body.bo_ext6,
                bo_ext7:req.body.bo_ext7,
                bo_ext8:req.body.bo_ext8,
                bo_ext9:req.body.bo_ext9,
                bo_ext10:req.body.bo_ext10,
                bo_ext11:req.body.bo_ext11,
                bo_ext12:req.body.bo_ext12,
                bo_ext13:req.body.bo_ext13,
                bo_ext14:req.body.bo_ext14,
                bo_ext15:req.body.bo_ext15,
                bo_ext16:req.body.bo_ext16,
                bo_ext17:req.body.bo_ext17,
                bo_ext18:req.body.bo_ext18,
                bo_ext19:req.body.bo_ext19,
                bo_ext20:req.body.bo_ext20,
                is_secret:is_secret,
                is_notice:is_notice
            }).then(async result => {
                console.log(result.id);
                //게시판별로 파일 저장하기
                for(var i=0;i<req.body.file_path.length;i++){
                    var j = i+1;
                    if(req.body.file_path[i]!=""){
                        await BoardFile.create({
                            file_no:j,
                            file_path:req.body.file_path[i],
                            file_name:req.body.file_name[i],
                            file_size:req.body.file_size[i],
                            mimetype:req.body.mimetype[i],
                            file_download_su:0,
                            f_bbs_id:result.id
                        })
                    }
                }
                res.redirect(`/bbs/${req.body.f_bo_id}/view/?id=${result.id}`);
            });
        //업데이트하기
        }else{
            
            await Board.update({
                bo_subject:req.body.bo_subject,
                bo_content:req.body.bo_content,
                user_name:req.body.user_name,
                bo_ext1:req.body.bo_ext1,
                bo_ext2:req.body.bo_ext2,
                bo_ext3:req.body.bo_ext3,
                bo_ext4:req.body.bo_ext4,
                bo_ext5:req.body.bo_ext5,
                bo_ext6:req.body.bo_ext6,
                bo_ext7:req.body.bo_ext7,
                bo_ext8:req.body.bo_ext8,
                bo_ext9:req.body.bo_ext9,
                bo_ext10:req.body.bo_ext10,
                bo_ext11:req.body.bo_ext11,
                bo_ext12:req.body.bo_ext12,
                bo_ext13:req.body.bo_ext13,
                bo_ext14:req.body.bo_ext14,
                bo_ext15:req.body.bo_ext15,
                bo_ext16:req.body.bo_ext16,
                bo_ext17:req.body.bo_ext17,
                bo_ext18:req.body.bo_ext18,
                bo_ext19:req.body.bo_ext19,
                bo_ext20:req.body.bo_ext20,
                is_secret:is_secret,
                is_notice:is_notice
            },{
                where:{id:req.body.id}
            }).then(async result => {
                /*console.log(result.id);
                //게시판별로 파일 저장하기
                for(var i=0;i<req.body.file_path.length;i++){
                    var j = i+1;
                    if(req.body.file_path[i]!=""){
                        await BoardFile.create({
                            file_no:j,
                            file_path:req.body.file_path[i],
                            file_name:req.body.file_name[i],
                            file_size:req.body.file_size[i],
                            mimetype:req.body.mimetype[i],
                            file_download_su:0,
                            f_bbs_id:result.id
                        })
                    }
                }*/
                
            });
            var hashPassword = "";
            if(req.body.bo_password!=""){
                hashPassword=await bcrypt.hash(req.body.bo_password,12);//비밀번호 암호화
                await Board.update({
                    bo_password:hashPassword
                },{
                    where:{id:req.body.id}
                });
            }
            res.redirect(`/bbs/${req.body.f_bo_id}/view/?id=${req.body.id}`);
        }
    } catch (error) {
        console.log(error);
    }
});
//비밀번호 확인하는 페이지
router.post('/password/:bo_id',async (req,res,next) => {
    try {
        const row = await Board.findOne({
            where:{
                id:req.body.id
            }
        });
        
        const result = await bcrypt.compare(req.body.bo_password, row.bo_password);
        global.bo_password = result;
        //비밀번호가 맞다면
        if(result){
            if(req.body.type=="remove"){
                const removeRow=await Board.destroy({
                    where:{id:req.body.id}
                });
                console.log(removeRow);
                res.redirect(`/bbs/${req.params.bo_id}/list`);
            }else if(req.body.type=="view"){
                res.redirect(`/bbs/${req.params.bo_id}/view/?id=${req.body.id}`);
            }else{
                res.redirect(`/bbs/${req.params.bo_id}/write/?id=${req.body.id}&result=${result}`);
            }
            
        }else{
            res.redirect(`/bbs/${req.params.bo_id}/password/?id=${req.body.id}&type=${req.body.type}&error_code=no_password`);
        }

    } catch (error) {
        console.log(error);
    }
});
//게시판 삭제
router.post('/board_remove',async (req,res,next) => {
    try{
        await Board.destroy({
            where:{id:req.body.id}
        });
        console.log('삭제');
        console.log(req.body);
        res.redirect(`/bbs/${req.body.bo_id}/list/?page=${req.body.page}&field=${req.body.field}&value=${req.body.value}`);
    }catch(error){

    }
});
//댓글 등록시 
router.post('/comment_write', async (req,res,next) => {
    try{
        const is_secret = req.body.is_secret=="1"?"1":"0";
        var hashPassword = "";
        if(req.body.co_password!=""){
            hashPassword=await bcrypt.hash(req.body.co_password,12);//비밀번호 암호화
        }
        await BoardComment.create({
            user_id:req.body.user_id,
            user_name:req.body.user_name,
            is_secret:is_secret,
            co_password:hashPassword,
            co_comment:req.body.co_comment,
            f_bbs_id:req.body.f_bbs_id
        }).then(result => {
            //댓글 등록시 해당 게시판에 댓글 목록이 올라오도록 - 소켓통신
            req.app.get('io').of('/comment').to(`${req.body.bo_id}/${req.body.f_bbs_id}`).emit('list', result);    
        });
        
        res.redirect(`/bbs/${req.body.bo_id}/view/?id=${req.body.f_bbs_id}&page=${req.body.page}&field=${req.body.field}&value=${req.body.value}`);
    }catch(error){
        console.log(error);
    }
});

module.exports = router;