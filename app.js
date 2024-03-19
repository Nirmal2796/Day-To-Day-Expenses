const express = require('express');
const cors=require('cors');
require('dotenv').config(); 

const app=express();

const bodyParser=require('body-parser');

const sequelize=require('./util/database');

const User=require('./model/user');
const Expense=require('./model/expense');
const Order=require('./model/order');
const ForgotPasswordRequests=require('./model/forgotPasswordRequests');
const FileURL=require('./model/fileurl');

const UserRouter=require('./routes/user');
const ExpenseRouter=require('./routes/expense');
const PurchaseRouter=require('./routes/purchase');
const PremiumRouter=require('./routes/premium');
const PasswordRouter=require('./routes/password');


app.use(cors());
app.use(bodyParser.json({ extended: false}));

app.use(UserRouter);
app.use(ExpenseRouter);
app.use('/purchase',PurchaseRouter);
app.use('/premium',PremiumRouter);
app.use(PasswordRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

User.hasMany(FileURL);
FileURL.belongsTo(User);

sequelize
.sync()
// .sync({alter:true})
.then(()=>{
    app.listen(3000);
})
.catch(err=> console.log(err))
