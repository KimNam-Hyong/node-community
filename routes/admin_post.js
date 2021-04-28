const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('./middlewares');
const {SiteSetting,User,BoardSetting,sequelize, Board,Content,Menu} = require('../models/');
const {Op} = require('sequelize');
const { FileSystemLoader } = require('nunjucks');
const fs = require('fs');
//사이트 설정 페이지가기
router.post('/site_setup',async (req,res,next) => {
    try{
        console.log(req.body);
        const row=await SiteSetting.findAndCountAll();
        //사이트설정 업데이트
        if(0 < row.count){
            await SiteSetting.update({
                site_title:req.body.site_title,
                meta_tag:req.body.meta_tag,
                board_filter:req.body.board_filter,
                user_addr_set:req.body.user_addr_set,
                user_tel_set:req.body.user_tel_set,
                user_email_set:req.body.user_email_set,
                user_mobile_set:req.body.user_mobile_set,
                user_level_text:req.body.user_level_text,
                user_level_set:req.body.user_level_set,
                user_auth_set:req.body.user_auth_set,
                company_name:req.body.company_name,
                company_biz_no:req.body.company_biz_no,
                company_ceo:req.body.company_ceo,
                company_tel:req.body.company_tel,
                company_fax:req.body.company_fax,
                company_email:req.body.company_email,
                company_zip:req.body.company_zip,
                company_addr1:req.body.company_addr1,
                company_addr2:req.body.company_addr2,
                company_addr3:req.body.company_addr3
            },
            {where:{id:1}});
            //사이트 설정 인서트
        }else{
            await SiteSetting.create({
                site_title:req.body.site_title,
                meta_tag:req.body.meta_tag,
                board_filter:req.body.board_filter,
                user_addr_set:req.body.user_addr_set,
                user_tel_set:req.body.user_tel_set,
                user_mobile_set:req.body.user_mobile_set,
                user_level_text:req.body.user_level_text,
                user_level_set:req.body.user_level_set,
                user_auth_set:req.body.user_auth_set,
                company_name:req.body.company_name,
                company_biz_no:req.body.company_biz_no,
                company_ceo:req.body.company_ceo,
                company_tel:req.body.company_tel,
                company_fax:req.body.company_fax,
                company_email:req.body.company_email,
                company_zip:req.body.company_zip,
                company_addr1:req.body.company_addr1,
                company_addr2:req.body.company_addr2,
                company_addr3:req.body.company_addr3
            });
        }
        res.redirect('/admin/site_setup');
    }catch(err){
        console.log(err);
    }
});


//회원 목록에서 등급 업데이트 및 삭제하기
router.post('/member_update', async (req,res,next) => {
    try {
        console.log(req.body.type);
        //목록에서 업데이트하기
        if(req.body.type=="list_update"){
            const chk_id = req.body.chk_id;    
            const user_level = req.body.user_level;
            const auth_status = req.body.auth_status;
            //체크박스가 배열이면 for문 돌리기
            console.log(Array.isArray(chk_id));
            if(Array.isArray(chk_id)){
                for(var i=0;i<chk_id.length;i++){
                    console.log(user_level[i]);
                    await User.update({
                        user_level:user_level[i],
                        auth_status:auth_status[i]
                    },
                    {where:{
                        user_id:chk_id[i]
                    }});
                }
            //아니면 바로 업데이트 하기
            }else{
                console.log(chk_id);
                await User.update({
                    user_level:req.body.user_level2,
                    auth_status:req.body.auth_status2
                },
                {where:{
                    user_id:chk_id
                }});
            }

        //목록에서 삭제하기            
        }else if(req.body.type=="list_delete"){
            const chk_id = req.body.chk_id;  
            //chk_id 가 배열일 때
            if(Array.isArray(chk_id)){
                for(var i=0;i<chk_id.length;i++){
                    console.log(chk_id[i]);
                    await User.destroy({
                        where:{
                            user_id:chk_id[i]
                        }
                    });
                    //게시판 삭제
                    await Board.destroy({
                        where:{
                            user_id:chk_id[i]
                        }
                    });
                }
            }else{
                await User.destroy({
                    where:{
                        user_id:chk_id
                    }
                });
                //게시판삭제
                await Board.destroy({
                    where:{
                        user_id:chk_id
                    }
                });
                
            }
        //회원등록하기            
        }else if(req.body.type=="add"){
            const row = await SiteSetting.findOne();
            var auth_status = row.auth_status_set==1?0:1;
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
                user_level:row.user_level_set
            });
        //회원업데이트 
        }else if(req.body.type=="update"){
            const row = await SiteSetting.findOne();
            var auth_status = row.auth_status_set==1?0:1;
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
        }else if(req.body.type=="delete"){
            await User.destroy({
                where:{
                    user_id:req.body.user_id
                }
            });
            //게시판 삭제
            await Board.destroy({
                where:{
                    user_id:req.body.user_id
                }
            });
        }
        res.redirect(`/admin/member_list/?page=${req.body.page}&field=${req.body.field}&value=${req.body.value}`);
    } catch (error) {
        console.log(error);
    }
});
//게시판 설정 등록 및 수정하기
router.post('/board_update', async (req,res,next) => {
    try {
        if(req.body.type=="list_update"){
            const chk_id = req.body.chk_id;    
            const bo_skin_path = req.body.bo_skin_path;
            //체크박스가 배열이면 for문 돌리기
            console.log(Array.isArray(chk_id));
            if(Array.isArray(chk_id)){
                for(var i=0;i<chk_id.length;i++){
                    console.log(bo_skin_path[i]);
                    await BoardSetting.update({
                        bo_skin_path:bo_skin_path[i]
                    },
                    {where:{
                        bo_id:chk_id[i]
                    }});
                }
            //아니면 바로 업데이트 하기
            }else{
                console.log(`111${chk_id}`);
                await BoardSetting.update({
                    bo_skin_path:req.body.bo_skin_path2
                },
                {where:{
                    bo_id:chk_id
                }});
            }
            res.redirect(`/admin/board_setting/?page=${req.body.page}&field=${req.body.field}&value=${req.body.value}`);
        //목록에서 선택 삭제하기            
        }else if(req.body.type=="list_delete"){
            const chk_id = req.body.chk_id;  
            if(Array.isArray(chk_id)){
                
                for(var i=0;i<chk_id.length;i++){
                    //해당하는 모든 게시판들을 다 삭제하기
                    await Board.destroy({
                        where:{f_bo_id:chk_id[i]}
                    })
                    console.log(chk_id[i]);
                    
                    fs.rmdirSync(`uploads/${chk_id[i]}`,{recursive:true});//게시판에 있는 모든 파일 삭제하기
                    //게시판 설정 삭제하기
                    await BoardSetting.destroy({
                        where:{
                            bo_id:chk_id[i]
                        }
                    });
                }
            }else{
                //해당하는 모든 게시판들을 다 삭제하기
                await Board.destroy({
                    where:{f_bo_id:chk_id}
                });
                //fs.rmdirSync(`uploads/${chk_id}`,{recursive:true});//게시판에 있는 모든 파일 삭제하기
                //게시판 설정 삭제하기
                await BoardSetting.destroy({
                    where:{
                        bo_id:chk_id
                    }
                });
            }
            res.redirect(`/admin/board_setting/?page=${req.body.page}&field=${req.body.field}&value=${req.body.value}`);
        }else if(req.body.type=="delete"){
            //해당하는 모든 게시판들을 다 삭제하기
            await Board.destroy({
                where:{f_bo_id:req.body.bo_id}
            });
            //fs.rmdirSync(`uploads/${req.body.bo_id}`,{recursive:true});//게시판에 있는 모든 파일 삭제하기
            //게시판 설정 삭제하기
            await BoardSetting.destroy({
                where:{
                    bo_id:req.body.bo_id
                }
            });
            res.redirect(`/admin/board_setting/?page=${req.body.page}&field=${req.body.field}&value=${req.body.value}`);
        }else {
            if(req.body.w==''){
                const row=BoardSetting.findAndCountAll({
                    where:{bo_id:req.body.bo_id}
                });
                if(0 < row.count){
                    return res.redirect('/admin/board_form/?error_msg=게시판 생성 실패');
                }
                //업로드할 디렉토리 만들기
                /*
                fs.mkdirSync("uploads/"+req.body.bo_id,"0707",(err)=>{
                    console.log(err);
                });*/
                //게시판 설정 인서트
                await BoardSetting.create({
                    bo_id:req.body.bo_id,
                    bo_name:req.body.bo_name,
                    bo_skin_path:req.body.bo_skin_path,
                    bo_write_level:req.body.bo_write_level,
                    bo_comment_level:req.body.bo_comment_level,
                    bo_list_level:req.body.bo_list_level,
                    bo_view_level:req.body.bo_view_level,
                    bo_upload_level:req.body.bo_upload_level,
                    bo_download_level:req.body.bo_download_level,
                    bo_file_ea:req.body.bo_file_ea,
                    bo_file_size:req.body.bo_file_size,
                    bo_gallery_su:req.body.bo_gallery_su,
                    bo_mobile_gallery_su:0,
                    bo_list_width:0,
                    bo_mobile_list_width:0,
                    bo_list_su:req.body.bo_list_su,
                    is_notice:req.body.is_notice,
                    bo_notice_su:req.body.bo_notice_su,
                    is_secret:req.body.is_secret,
                    bo_ext1_title:req.body.bo_ext1_title,
                    bo_ext2_title:req.body.bo_ext2_title,
                    bo_ext3_title:req.body.bo_ext3_title,
                    bo_ext4_title:req.body.bo_ext4_title,
                    bo_ext5_title:req.body.bo_ext5_title,
                    bo_ext6_title:req.body.bo_ext6_title,
                    bo_ext7_title:req.body.bo_ext7_title,
                    bo_ext8_title:req.body.bo_ext8_title,
                    bo_ext9_title:req.body.bo_ext9_title,
                    bo_ext10_title:req.body.bo_ext10_title,
                    bo_ext11_title:req.body.bo_ext11_title,
                    bo_ext12_title:req.body.bo_ext12_title,
                    bo_ext13_title:req.body.bo_ext13_title,
                    bo_ext14_title:req.body.bo_ext14_title,
                    bo_ext15_title:req.body.bo_ext15_title,
                    bo_ext16_title:req.body.bo_ext16_title,
                    bo_ext17_title:req.body.bo_ext17_title,
                    bo_ext18_title:req.body.bo_ext18_title,
                    bo_ext19_title:req.body.bo_ext19_title,
                    bo_ext20_title:req.body.bo_ext20_title
                });
                
            }else{
                //게시판 설정 업데이트
                await BoardSetting.update({
                    bo_name:req.body.bo_name,
                    bo_skin_path:req.body.bo_skin_path,
                    bo_write_level:req.body.bo_write_level,
                    bo_comment_level:req.body.comment_level,
                    bo_list_level:req.body.bo_list_level,
                    bo_view_level:req.body.bo_view_level,
                    bo_upload_level:req.body.bo_upload_level,
                    bo_download_level:req.body.bo_download_level,
                    bo_file_ea:req.body.bo_file_ea,
                    bo_file_size:req.body.bo_file_size,
                    bo_gallery_su:req.body.bo_gallery_su,
                    bo_mobile_gallery_su:'0',
                    bo_list_width:'0',
                    bo_mobile_list_width:'0',
                    bo_list_su:req.body.bo_list_su,
                    is_notice:req.body.is_notice,
                    bo_notice_su:req.body.bo_notice_su,
                    is_secret:req.body.is_secret,
                    bo_geo_code_set:'0',
                    bo_ext1_title:req.body.bo_ext1_title,
                    bo_ext2_title:req.body.bo_ext2_title,
                    bo_ext3_title:req.body.bo_ext3_title,
                    bo_ext4_title:req.body.bo_ext4_title,
                    bo_ext5_title:req.body.bo_ext5_title,
                    bo_ext6_title:req.body.bo_ext6_title,
                    bo_ext7_title:req.body.bo_ext7_title,
                    bo_ext8_title:req.body.bo_ext8_title,
                    bo_ext9_title:req.body.bo_ext9_title,
                    bo_ext10_title:req.body.bo_ext10_title,
                    bo_ext11_title:req.body.bo_ext11_title,
                    bo_ext12_title:req.body.bo_ext12_title,
                    bo_ext13_title:req.body.bo_ext13_title,
                    bo_ext14_title:req.body.bo_ext14_title,
                    bo_ext15_title:req.body.bo_ext15_title,
                    bo_ext16_title:req.body.bo_ext16_title,
                    bo_ext17_title:req.body.bo_ext17_title,
                    bo_ext18_title:req.body.bo_ext18_title,
                    bo_ext19_title:req.body.bo_ext19_title,
                    bo_ext20_title:req.body.bo_ext20_title
                },{
                    where:{bo_id:req.body.bo_id}
                });
            }
            res.redirect(`/admin/board_form/${req.body.bo_id}/?w=u&field=${req.body.field}&value=${req.body.value}`);
        }
        
    } catch (error) {
        console.log(error);
    }
});
//내용 인서트 및 업데이트하기
router.post('/content_update', async (req,res,next) => {
    try{
        //내용 삭제
        if(req.body.type=="delete"){
            await Content.destroy({
                where:{
                    id:req.body.id
                }
            });
            res.redirect('/admin/content_list');
        }else{
            //내용추가
            if(req.body.w==""){
                await Content.create({
                    co_id:req.body.co_id,
                    subject:req.body.subject,
                    content:req.body.content,
                    is_view:1

                });
            }else{
                //내용 수정
                await Content.update({
                    subject:req.body.subject,
                    content:req.body.content
                },{
                    where:{
                        id:req.body.id
                    }
                });
            }
        }
        res.redirect('/admin/content_list');
    }catch(error){
        console.log(error);
    }
});
//메뉴 인서트,업데이트,삭제
router.post('/menu_update', async (req,res,next)=>{
    try{
        //메뉴 추가
        if(req.body.type=="add"){
            await Menu.create({
                me_code:req.body.me_code,
                me_id:req.body.me_id,
                me_name:req.body.me_name,
                me_url:req.body.me_url,
                me_target:req.body.me_target,
                me_order:req.body.me_order,
                is_view:1
            });
        //메뉴 수정
        }else if(req.body.type=="update"){
            await Menu.update({
                me_id:req.body.me_id,
                me_name:req.body.me_name,
                me_url:req.body.me_url,
                me_target:req.body.me_target,
                me_order:req.body.me_order
            },{
                where:{id:req.body.id}
            });
        //메뉴 삭제
        }else{
            var sql = `delete from menu where left(me_code,${req.body.length}) = '${req.body.me_code}'`;
            await sequelize.query(sql);
        }
        res.redirect('/admin/menu_setting');
    }catch(error){
        console.log(error);
    }
});
//메뉴 찾기 선택할 시
router.post('/menu_find/:division',async (req,res,next) => {
    try {
        var data;
        if(req.params.division == 'board_setting'){
            await BoardSetting.findAll({
                attributes:['bo_id','bo_name']
            }).then((bs) =>{
                console.log(bs);
                res.json(bs);
            });
        }else if(req.params.division=="content"){
            await Content.findAll({
                attributes:['co_id','subject']
            }).then((cs) => {
                console.log(cs);
                res.json(cs);
            });
        }
    } catch (error) {
        
    }
});

module.exports = router;