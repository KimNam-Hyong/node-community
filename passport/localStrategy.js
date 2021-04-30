const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'user_id',
    passwordField: 'user_password',
  }, async (user_id, user_password, done) => {
    try {
      const exUser = await User.findOne({ where: { user_id } },{logging:true});
      if (exUser) {
        const result = await bcrypt.compare(user_password, exUser.user_password);
        if (result) {
          done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};