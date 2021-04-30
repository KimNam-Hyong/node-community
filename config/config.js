require('dotenv').config();

module.exports = {
    development:{
        username:'dbmasteruser',
        password:process.env.SEQUELIZE_PASSWORD,
        database:'community',
        host:'ls-6a04beaafd7004c6bc227db32499ab66d9e75442.cobixnpefx6y.ap-northeast-2.rds.amazonaws.com',
        dialect:'mysql',
        timezone: '+09:00',
        timestamps:true
    },
    test:{
        username:'dbmasteruser',
        password:process.env.SEQUELIZE_PASSWORD,
        database:'community',
        host:'ls-6a04beaafd7004c6bc227db32499ab66d9e75442.cobixnpefx6y.ap-northeast-2.rds.amazonaws.com',
        dialect:'mysql',
        timezone: '+09:00',
        timestamps:true
    },
    production:{
        username:'dbmasteruser',
        password:process.env.SEQUELIZE_PASSWORD,
        database:'community',
        host:'ls-6a04beaafd7004c6bc227db32499ab66d9e75442.cobixnpefx6y.ap-northeast-2.rds.amazonaws.com',
        dialect:'mysql',
        timezone: '+09:00',
        logging:false,
        timestamps:true
    }
}