const express = require('express');
const cors=require('cors');

const app=express();

const bodyParser=require('body-parser');

const sequelize=require('./util/database');

const SignUpRouter=require('./routes/signup');


app.use(cors());
app.use(bodyParser.json({ extended: false}));

app.use(SignUpRouter);

sequelize
.sync()
// .sync({force:true})
.then(()=>{
    app.listen(3000);
})
.catch(err=> console.log(err))
