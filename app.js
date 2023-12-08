const express = require('express');
const path = require('path');
const app = express();
const mysql = require('mysql2');
require('dotenv').config();
const {v4:uuidv4} = require('uuid');
const methodoverride = require('method-override');
const ExpressError = require('./ExpressError');

app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:process.env.SQL_PASSWORD,
        database: 'caseStudy',
  });
    

app.listen(8080,(req,res)=>{
    console.log("app is listening");
})

app.get("/", async(req,res)=>{
    let q = "select * from staffmember join phoneno on staffmember.staff_no = phoneno.staff_no join email on email.staff_no = staffmember.staff_no;"

    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            console.log(result);
            res.render("index.ejs",{result});
        })
    }catch(err){
        console.log(err);
    }
})

app.get("/newStaff",(req,res)=>{
    res.render("newStaff.ejs");
})


app.post("/newStaff",(req,res,next)=>{
    runTransaction(req,res,next);
})

app.delete("/newStaff/:id",(req,res)=>{
  let {id} = req.params;
  connection.beginTransaction();
  try{
    let q1 = `delete from phoneno where staff_no = '${id}';`
    let q2 = `delete from staffmember where staff_no = '${id}';`
    let q3 = `deleter from email where staff_no = ${id};`

    connection.query(q3);
    connection.query(q1);
    connection.query(q2);

    connection.commit();
    res.redirect("/");
  }catch(err){
    if(err){
      connection.rollback();
    }
    res.status(500).send("Failed !");
    console.log("Error while deletion",err);
  }
})

function runTransaction(req,res,next) {
  try {
    connection.beginTransaction();

    let {name,salary,position,sex,country,state,city,mobno,email} = req.body;
    let id = uuidv4();
    let q1 = `insert into staffmember values('${id}','${name}',${salary},'${position}','${sex}','${country}','${state}','${city}');`
    let q2 = `insert into phoneNO values('${id}','${mobno}');`
    let q3 = `insert into email values('${id}','${email}');`
    connection.query(q1);
    connection.query(q2);
    connection.query(q3);

    connection.commit();
    res.redirect("/");
  } catch (err) {
    if (connection) {
       connection.rollback();
    }
    console.error('Error running transaction:', err);
  }
}

app.all("*",(req,res,next)=>{
  next(new ExpressError(400,"Page not found :( "));
})

app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something went wrong"} = err;
  console.log(err);
  res.status(statusCode).render("error.ejs",{message});
})