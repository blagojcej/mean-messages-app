const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const app = express();

mongoose.connect("mongodb+srv://blagojce:3tj4mVJUCxn6S0h4@cluster0-lp7jo.mongodb.net/mean-messages-app")
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

// Test middleware, when it's calling next middleware, when it's returning response
/*
app.use((req, res, next) => {
    console.log('First Middleware');
    next();
});

app.use((req, res, next) => {
    console.log('Second Middleware');
    res.send('Hello from Express');
});
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use("/images", express.static(path.join("backend/images")));

//Add CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
