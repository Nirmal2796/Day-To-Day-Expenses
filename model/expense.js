const Sequelize = require('sequelize').Sequelize;

const { INTEGER, STRING } = require('sequelize');
const sequelize=require('../util/database');

const Expense=sequelize.define('expense',{
    id:{
        type:INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true       
    },
    amount:{
        type:INTEGER,
        allowNull:false,
    },
    description:{
        type:STRING,
        allowNull:false
    },
    category:{
        type:STRING,
        allowNull:false
    }
});

module.exports=Expense;