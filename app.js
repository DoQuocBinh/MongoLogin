const express = require('express')
const hbs = require('hbs')

var app = express();
app.set('view engine','hbs')

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var MongoClient = require('mongodb').MongoClient;
var url =  "mongodb+srv://tommy:123456abc@cluster0.lkrga.mongodb.net/test";

app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/doLogin',async (req,res)=>{
    const nameInput =req.body.txtName;
    const passInput = req.body.txtPass;

    const client = await MongoClient.connect(url);
    const dbo = client.db(dbName);
    const user = await dbo.collection("users").find({$and:[{username:nameInput},{password:passInput}]});
    var messageStatus;
    console.log(user);
    if(user !=null){
        messageStatus = 'Login in Ok!';
    }else{
        messageStatus = 'Login in Failed!';
    }
    res.render('index',{msg:messageStatus})
});

const dbName = "DoQuocBinhDB";
app.post('/register',async (req,res)=>{
    const nameInput =req.body.txtName;
    const passInput = req.body.txtPass;
    const newUser = {name:nameInput,password:passInput};

    const client = await MongoClient.connect(url);
    const dbo = client.db(dbName);
    await dbo.collection("users").insertOne(newUser);
    res.redirect('/')
})

var PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log('Server is running at: '+ PORT);