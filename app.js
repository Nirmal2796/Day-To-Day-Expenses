const express = require('express');
const cors=require('cors');

const app=express();

const bodyParser=require('body-parser');

const sequelize=require('./util/database');

const UserRouter=require('./routes/user');


app.use(cors());
app.use(bodyParser.json({ extended: false}));

app.use(UserRouter);

sequelize
.sync()
// .sync({force:true})
.then(()=>{
    app.listen(3000);
})
.catch(err=> console.log(err))
