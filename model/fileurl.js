const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const FileURL=sequelize.define('fileurl',{
    id:{
        primaryKey:true,
        type:Sequelize.INTEGER,
        autoIncrement:true
    },

    url:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=FileURL;