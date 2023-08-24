To-Do List App Documentation
Introduction
This documentation provides an overview and explanation of the code for a To-Do List web application built using Node.js, Express.js, and MongoDB. The application allows users to create, manage, and organize their to-do lists. The code is well-structured, following the Model-View-Controller (MVC) design pattern, and uses various npm packages to enhance functionality.
Technologies Used
Node.js
Express.js
MongoDB (via Mongoose)
EJS (Embedded JavaScript) for rendering views
Lodash for data manipulation
Body-parser for handling POST requests
Code Overview
Dependencies
The application uses several Node.js packages which need to be installed using npm:
express: A web application framework for Node.js.
body-parser: Middleware for parsing incoming request bodies.
mongoose: A MongoDB object modeling tool.
ejs: A templating engine for rendering views.
lodash: A utility library for working with arrays, strings, objects, etc.
Application Setup
The code starts by importing the required packages and setting up the Express application.
javascript

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const app = express();

It configures the application to use EJS as the view engine and sets up middleware for parsing URL-encoded data and serving static files.
javascript

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

The code establishes a connection to a MongoDB database named "todolistDB".
javascript

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.3");

Database Schema and Models
The application defines two MongoDB schemas and models: itemSchema and listSchema. These models are used to interact with the database.
itemSchema represents a to-do item with a name field.
listSchema represents a list of to-do items, with a name field and an items array that contains items.
Middleware for Current Date
A middleware function is used to add the current date to the response's local variables. This date is then accessible in all views and route handlers.
javascript

app.use((req, res, next) => {
    const currentDate = date.getDate();
    res.locals.currentDate = currentDate;
    next();
});

Routes and Controllers
The code defines several routes and controllers to handle various aspects of the To-Do List application.
Root Route (/)
The root route handles both GET and POST requests.
It retrieves all to-do items from the database and renders the "list" view, passing the items as newListItems.
If the database is empty, it inserts default items.
Custom List Route (/:customListName)
This dynamic route is used to handle custom lists.
It checks if a list with the provided name already exists in the database. If not, it creates a new list with default items.
If the list exists, it retrieves the list's items and renders the "list" view.
POST Request to Add an Item (/)
This route handles POST requests to add new to-do items.
It checks whether the item is meant to be added to the default "Today" list or a custom list.
If the item is for the "Today" list, it is saved directly to the database.
If it's for a custom list, it finds the list in the database and adds the item to it.
POST Request to Delete an Item (/delete)
This route handles POST requests to delete to-do items.
It determines whether the item is in the "Today" list or a custom list and deletes it accordingly.
Server Initialization
The application listens on port 3000, and a message is logged to the console when the server starts.
javascript

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

Conclusion
This To-Do List web application is a simple yet functional example of using Node.js, Express.js, and MongoDB to build a dynamic web application. It demonstrates CRUD (Create, Read, Update, Delete) operations for to-do items and allows users to organize their tasks in custom lists. The code is well-structured, making it easy to understand and maintain, and it follows best practices for building web applications with Node.js and Express.js.

