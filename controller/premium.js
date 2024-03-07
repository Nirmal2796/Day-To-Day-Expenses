const Sequelize = require('sequelize').Sequelize;
const User=require('../model/user');
const Expense=require('../model/expense');
const sequelize = require('../util/database');




exports.showLeaderBoard=(req,res,next)=>{

    Expense.findAll({attributes:[[sequelize.fn('sum',sequelize.col('amount')),'amount']],
            include:[{model:User, required:false ,right:true}],
            group:['user.id'],
            
        })
    .then((result)=>{
        res.status(200).json({result:result});
    })
    .catch(err=>{
        console.log(err);
    })
}