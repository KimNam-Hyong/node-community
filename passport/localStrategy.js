const passport = require('passport');//패스포트 모듈
const Op = require('sequelize').Op;//시퀄라이즈 where 조건문 모듈
const LocalStrategy = require('passport-local').Strategy;//로컬 로그인 구현할 때 쓰는 모듈
const bcrypt = require('bcrypt');//회원 로그인시 암복호화 할 때 필요
const {User} = require('../models/');
//require('date-utils');//시간계산할 때 필요로 함
const ip = require('ip');
module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField:'user_id',
        passwordField:'user_password',
    }, async (user_id, user_password,done) => {
        
        try {
            const exUser = await User.findOne({where : {user_id}});
            
            if(exUser) {
                const result = await bcrypt.compare(user_password, exUser.user_password);
                if (result){
                    done(null,exUser);
                }else{
                    done(null,false,{ err_code:'wrong password',message : '비밀번호가 맞지 않습니다.'});
                }
                //로그인 시간 업데이트하기
                //await User.update({login_date:Sequelize.DATE});
                /*if(exUser.auth_status==false){
                    done(null,false,{err_code:'not status',message: '승인되지 않은 회원입니다. 관리자가 승인 한 후에 이용이 가능합니다.'});
                }
                console.log(exUser.login_failed);
                if(10 <= exUser.login_failed){
                    done(null,false,{err_code:'login failed',message: '이 아이디는 10번 이상 로그인 실패하였습니다. 관리자에게 문의하십시오.'});
                }*/
                /*
                //로그인 성공할 때 로그인 실패횟수 초기화 업데이트 하기
                const result = await Members.update({
                    login_failed:0
                },{
                    where:{user_id}
                });
                const newDate=new Date();
                const att_time=newDate.toFormat('YYYY-MM-DD HH24:MI:SS');
                const attendace_time_line = new Date(newDate.toFormat("YYYY-MM-DD")+" 08:30:00");
                var isAttendace=false;
                const today = newDate.toFormat('YYYY-MM-DD').toString();
                var perceive_time=0;
                //if(ip.address()=="183.103.22.103"){
                //해당 아이피로 로그인 했을 때만 출석체크를 함
                if(ip.address()=="192.168.0.56"){
                    console.log(today.toString());
                    const timeCard = await MemberTimeCard.findOne({
                        where :{
                            member_id:exUser.id,
                            attendace_time : {[Op.like]:`%${today}%`}
                        }
                    });
                    console.log(timeCard);
                    if(timeCard==null){
                        const calMsec=attendace_time_line.getTime()-new Date(att_time).getTime();//밀리세컨드로 환산
                        perceive_time=Math.floor(Math.abs(calMsec/1000/60));
                        console.log(perceive_time);
                        const timeCardResult = await MemberTimeCard.create({
                            member_id:exUser.id,
                            attendace_time:att_time.toString()
                        });
                        isAttendace=true;
                        //지각을 할 경우 연차에서 깍이게
                        if(0 < perceive_time){
                            const MemberYearHolidayUpdate = await Members.update({
                                year_holiday:exUser.year_holiday-perceive_time
                            },
                            {where:{user_id}});
                        }
                    }
                }*/
                done(null,exUser);
               
            }else{
                done(null,false,{ err_code:'not member',message : '가입되지 않은 회원입니다.'});
            }
        } catch (err) {
            console.error(err);
            //done(error);
        }
    }));
}