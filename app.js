const express = require("express");         //require express
const bodyParser = require("body-parser");  //require body-parser
const ejsLint = require("ejs-lint");
const date = require(__dirname+"/date.js");  //require a local module

const app = express();  //set up an express application

let listOfItems = ["Exercise","Finish the presentation","Attend the meeting"];
let workItems = [];

app.set('view engine', 'ejs');  //tell the app to use ejs as its view engine

app.use(bodyParser.urlencoded({extended: true})); //use body parser in our application,urlencoded mode is used to parse data that comes frm html form,extended:true allows us to post nested obtects
app.use(express.static("public"));  //to make sure static files-> styles.css in css folder present in public folder can be rendered

app.get("/", function(req, res){ //get method to handle all the get requests  to root route
  let day = date.getDate(); //variable day is bound to the output of this date module which gets us the current date
  res.render('list', {listTitle: day, newListItems: listOfItems});  //render a file called list.ejs(this file would be present in a folder called views) and in that file pass day into the variable kindOfDay
});

app.get("/work", function(req, res){
  res.render('list', {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render('about');
});

app.post("/", function(req,res){ //create a post method that handles post requests to server at root route
  console.log(req.body);
  let item = req.body.newItem;
  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");
  }
  else{
    listOfItems.push(item);
    res.redirect("/");
  }
});

app.post("/work", function(req, res){ //create a post method that handles post requests to server at work route
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

app.listen(3000,function(){     //start the server on port 3000
  console.log("Server started on port 3000");
});
