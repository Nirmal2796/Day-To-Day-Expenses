const Sequelize = require('sequelize').Sequelize;
const User=require('../model/user');
const Expense=require('../model/expense');
const sequelize = require('../util/database');




exports.showLeaderBoard=async(req,res,next)=>{
    try{
        
        const leaderBoard= await User.findAll({
                attributes:['id','uname','total_expense'],//select
                order:[['total_expense','DESC']]
            });


        
        
        //right join
        // Expense.findAll({attributes:[[sequelize.fn('sum',sequelize.col('amount')),'amount']],
        //         include:[{model:User, attributes:['id','uname'] ,required:false ,right:true}],
        //         group:['user.id']
        //     })
    
    
        res.status(200).json({result:leaderBoard});
        
    }

    catch(err){
        console.log(err);
    };
}