const express = require('express');
const cors=require('cors');
require('dotenv').config(); 

const app=express();

const bodyParser=require('body-parser');

const sequelize=require('./util/database');

const User=require('./model/user');
const Expense=require('./model/expense');
const Order=require('./model/order');

const UserRouter=require('./routes/user');
const ExpenseRouter=require('./routes/expense');
const PurchaseRouter=require('./routes/purchase');


app.use(cors());
app.use(bodyParser.json({ extended: false}));

app.use(UserRouter);
app.use(ExpenseRouter);
app.use('/purchase',PurchaseRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
.sync()
// .sync({force:true})
.then(()=>{
    app.listen(3000);
})
.catch(err=> console.log(err))
