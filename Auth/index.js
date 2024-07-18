const express = require('express');
const app = express()
const User = require('./models/user');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/loginDemo')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
})

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'./views'))
// app.set('views','views')
app.use(express.urlencoded({extended:true}))

app.get('/register',(req,res)=>{
    res.render('register')
})

app.post('/register',async (req,res)=>{
    const {password,username} = req.body
    const hash = await bcrypt.hash(password,12)
    res.send(hash)
})

app.get('/secret',(req,res)=>{
    res.send("No access as it's a secret!")
})

app.listen(3000,()=>{
    console.log("Serving app on port 3000!!")
})