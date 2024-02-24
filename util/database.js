const Sequelize=require('sequelize').Sequelize;

const sequelize=new Sequelize('day-to-day-expenses','root','Nirmal@27',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;