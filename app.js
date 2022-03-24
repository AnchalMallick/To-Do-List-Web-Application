const express = require("express");         //require express
const mongoose = require("mongoose");       //require mongoose
const bodyParser = require("body-parser");  //require body-parser
const _ = require("lodash");                //require lodash
const ejsLint = require("ejs-lint");        //require ejs-lint
const date = require(__dirname+"/date.js"); //require a local module

const app = express();  //set up an express application

app.set('view engine', 'ejs');  //tell the app to use ejs as its view engine

app.use(bodyParser.urlencoded({extended: true})); //use body parser in our application,urlencoded mode is used to parse data that comes frm html form,extended:true allows us to post nested obtects
app.use(express.static("public"));  //to make sure static files-> styles.css in css folder present in public folder can be rendered

//      Connecting with mongoDB database and creating schemas and models      //

// mongoose.connect('mongodb://localhost:27017/todolistDB');
mongoose.connect('mongodb+srv://Admin-Anchal:test123@cluster0.0bhd2.mongodb.net/todolistDB');   //create a todolistDB database in mongoDB

const itemSchema = new mongoose.Schema ({                   //create a schema for item
  name: String
});

const Item = mongoose.model("Item", itemSchema);            //create a model that complies with the schema for item

const item1 = new Item ({                                   //create 3 documents complying with Item model
  name: "Welcome to your To-do list!"
});
const item2 = new Item({
  name: "Click on + to add new items to your To-do list!"
});
const item3 = new Item({
  name: "<-- Click here to delete any item."
});
const defaultItems = [item1, item2, item3];                   //these three documents created make up the defaultItems array

const listSchema = new mongoose.Schema ({                     //create a schema for custom list
  name: String,
  items: [itemSchema]
});
const List = mongoose.model("List", listSchema);              //create a model that complies with the schema for custom list


//      get method to handle get requests made to any custom list route       //

app.get("/:customListName", function(req, res){     //get method to handle all the get requests to custom list routes
  const customListName = _.capitalize(req.params.customListName);       //creating custom lists using express route parameters
  List.findOne({name: customListName}, function(err, foundList){
    if(err){
      console.log(err);
    }
    else{
      if(!foundList){         //create a new list
        const list = new List ({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }
      else{                   //show the existing list
        res.render('list', {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });
});

//            get method to handle get requests made to root route            //

app.get("/", function(req, res){              //get method to handle all the get requests  to root route
  let day = date.getDate();                   //variable day is bound to the output of this date module which gets us the current date
  Item.find({}, function(err, foundItems){    //read all documents in the items collection(foundItems is an array of documents found)
    if(err){
      console.log(err);
    }
    else{
      if(foundItems.length === 0){            //add the default items only when there is no item in our database
        Item.insertMany(defaultItems, function(err){
          if(err){
            console.log(err);
          }
          else{
            console.log("Successfully saved all the items");
          }
        });
        res.redirect("/");
      }
      else{
      res.render('list', {listTitle: day, newListItems: foundItems});  //render a file called list.ejs and pass the values for ejs variables
      }                                                                //foundItems is an array of documents
    }
  });
});

//        post method to handle post requests made to server at root route    //

app.post("/", function(req,res){             //create a post method that handles post requests to server at root route
  console.log(req.body);
  const day = date.getDate();
  const newItemName = req.body.newItem;     //fetch the new item from the post response
  const listName = req.body.list;
  const newItem = new Item ({               //create a new document for this new item
    name: newItemName
  });
  if(listName === day){
    newItem.save();                        //save it to the items collection
    res.redirect("/");
  }
  else{
    List.findOne({name: listName}, function(err, foundList){
      if(err){
        console.log(err);
      }
      else{
        foundList.items.push(newItem);    //push it to the items array inside foundList
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }
});

//      post method to handle post requests made to server at delete route    //

app.post("/delete", function(req, res){   //create a post method that handles post requests to server at delete route
  console.log(req.body);
  const day = date.getDate();
  const checkedItemID = req.body.checked;
  const listName = req.body.listName;
  if(listName === day){
    Item.deleteOne({_id: checkedItemID}, function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Successfully deleted the checked item.");
        res.redirect("/");
      }
    });
  }
  else{
    List.findOneAndUpdate(
      {name: listName},
      {$pull: {items: {_id: checkedItemID}}},
      function(err, foundList){
        if(err){
          console.log(err);
        }
        else{
          res.redirect("/" + listName);
        }
      }
    )};
});

//                        Start the server on port 3000                       //

app.listen(3000,function(){     //start the server on port 3000
  console.log("Server started on port 3000");
});
