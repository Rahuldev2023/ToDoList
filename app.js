const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const date=require(__dirname+"/date.js");
const _=require("lodash");
const app=express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-rahul:Test1234@cluster0.h2a9lkd.mongodb.net/todolistDB");


//items and lists schema
const itemSchema=new mongoose.Schema({
    name:String
});
const listSchema=new mongoose.Schema({
    name:String,
    items:[itemSchema]
});

//items model and lists model
const Item=mongoose.model("Item",itemSchema);
const List=mongoose.model("List",listSchema);

const defaultItems = [
  {
    name: "Welcome to To-Do List App",
  },
  {
    name: "Hit ➕ to add new tasks",
  },
  {
    name: "☑ Check the box to delete tasks",
  },
];

app.use((req, res, next) => {//a middleware function for req and res
    const currentDate = date.getDate();
    res.locals.currentDate = currentDate;//res.locals object in Express.js is a property that provides a way to store response-local variables. These variables can then be accessed within your views (e.g., EJS templates) without needing to pass them explicitly to each route handler. In this case, you're storing the current date as res.locals.currentDate.
    next();//the next() function is called, which passes control to the next middleware or route handler in the application's request-response cycle. This allows the application to continue processing the request after setting the currentDate in res.locals.
//By adding this middleware, you ensure that the currentDate variable is available in all your views and route handlers, allowing you to display the current date on every page of your Express.js application. This approach provides a convenient and consistent way to include common data (in this case, the current date) across multiple parts of your application.
  });

app.get("/", async (req, res) => {
  try {
    const foundItems = await Item.find({});
    if (foundItems.length === 0) {
      await Item.insertMany(defaultItems);
      console.log("Documents inserted successfully!");
      res.redirect("/");
    } else {
        //if not empty rendering the items that are present in the list
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  } catch (error) {
    console.error(error);
  }
});

//creating customLists with express routes and checking with findOne whether any list already exists !
app.get("/:customListName", async (req, res) => {
  //lodash converts only the 1st letter to uppercase and the rest to lowercase.
  const customListName = _.capitalize(req.params.customListName);
  try {
    const foundList = await List.findOne({ name: customListName });
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: defaultItems,
      });
      await list.save();
       //without redirecting to the custom List document the page cannot be loaded
      res.redirect("/" + customListName);
    } else {
      //if the lists already exists then render the page with its items 
      res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
    }
  } catch (error) {
    console.error(error);
  }
});


app.post("/", async (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    await item.save();
    res.redirect("/");
  } else {
    try {
      const foundList = await List.findOne({ name: listName });
      if (foundList) {
        foundList.items.push(item);
        await foundList.save();
        res.redirect("/" + listName);
      }
    } catch (error) {
      console.error(error);
    }
  }
});


app.post("/delete", async (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  try {
    if (listName === "Today") {
      // For the "Today" list, remove the item by its ID
      await Item.findByIdAndRemove(checkedItemId);
      console.log("Document deleted successfully!");
      res.redirect("/");
    } else {
      // For custom lists, use $pull to remove the item from the items array
      const foundList = await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } }
      );
      if (foundList) {
        res.redirect("/" + listName);
      }
    }
  } catch (error) {
    console.error("Error deleting document:", error);
  }
});


app.listen(process.env.PORT ||3000, () => {
  console.log("Server running on port 3000");
});