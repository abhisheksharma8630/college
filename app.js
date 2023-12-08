const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2');
require('dotenv').config();


app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:process.env.SQL_PASSWORD,
    database: 'caseStudy'
})

app.listen(8080,(req,res)=>{
    console.log("app is listening");
})

app.get("/",(req,res)=>{
    let q = "select * from staffmember";
    try{
        connection.query(q,(err,result,fields)=>{
            console.log(result);
            console.log(fields);
            res.send("connection build"); 
        })
    }catch(err){
        console.log(err);
    }
})

app.post("/",(req,res)=>{
    
})