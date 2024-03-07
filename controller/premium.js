const Sequelize = require('sequelize').Sequelize;
const User=require('../model/user');
const Expense=require('../model/expense');
const sequelize = require('../util/database');




exports.showLeaderBoard=(req,res,next)=>{

    User.findAll({
        attributes:['id','uname',[sequelize.fn('sum',sequelize.col('amount')),'amount']],//select 
        include:[{
            model:Expense,
            attributes:[]
        }],
        group:['user.id'],
        order:[[sequelize.col('amount'),'DESC']]
    })

    // Expense.findAll({attributes:[[sequelize.fn('sum',sequelize.col('amount')),'amount']],
    //         include:[{model:User, attributes:['id','uname'] ,required:false ,right:true}],
    //         group:['user.id']
    //     })
    .then((result)=>{
        // result.sort((a,b)=> b.amount - a.amount);
        res.status(200).json({result:result});
    })
    .catch(err=>{
        console.log(err);
    })
}