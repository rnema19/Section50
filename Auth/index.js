const express = require('express');
const app = express()
const User = require('./models/user');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser')
const session = require('express-session');

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
app.use(session({resave: true, saveUninitialized: true,secret: 'trolololo' }));
app.use(bodyParser.urlencoded({ extended: true }))

const requireLogin = (req,res,next) => {
    if(!req.sessionID){
        res.redirect('/login')
    }
    next()
}

app.get('/',(req,res)=>{
    res.send('This is the home page!')
})

app.get('/register',(req,res)=>{
    res.render('register')
})

// app.post('/register',async (req,res)=>{
//     const {password,username} = req.body
//     const hash = await bcrypt.hashSync(password,12)
//     const user = new User({
//         username,
//         password: hash
//     })
//     await user.save()
//     // res.send(hash)
//     res.redirect('/')
// })

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username });

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        await user.save();
        console.log(hashedPassword)
        // req.session.save
        req.sessionID = user._id
        res.redirect("/");
    } catch (e) {
        console.error(e);
        res.redirect("/register");
    }
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async (req,res)=>{
    const {username,password} = req.body
    // const user = await User.findOne({username})
    // const match = await bcrypt.compare(password, user.password);
    const match = await User.findAndValidate(username,password)
    if(match){
        // req.session.save
        req.sessionID = match._id
        res.send("Login Successful!!")
        
    }
    else{
        res.send("Invalid Credentials!!")
        // res.redirect('login')
    }
})

app.post('/logout',(req,res)=>{
    // req.sessionID = null
    req.session.destroy()
    res.redirect('/login')
})

app.get('/secret',requireLogin,(req,res)=>{
    // if(!req.sessionID){
    //    return res.redirect('/login')
    // }
    res.render('secret')
})

app.get('/topsecret',requireLogin,(req,res)=>{
    res.send("TOP SECRET!")
})

app.listen(3000,()=>{
    console.log("Serving app on port 3000!!")
})