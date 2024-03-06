const Sequelize = require('sequelize').Sequelize;

const { INTEGER, STRING, BOOLEAN } = require('sequelize');
const sequelize=require('../util/database');

const User=sequelize.define('user',{

    id:{
        type:INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },

    uname:{
        type:STRING,
        allowNull:false
    },

    email:{
        type:STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:STRING,
        allowNull:false,
        // unique:true
    },

    ispremiumuser:BOOLEAN
    
});

module.exports=User;