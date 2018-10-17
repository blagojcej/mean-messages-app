const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://blagojce:3tj4mVJUCxn6S0h4@cluster0-lp7jo.mongodb.net/mean-messages-app?retryWrites=true")
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

//Add CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  // const post=req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post added succesfully',
        postId: result._id
      });
    });
});

app.get("/api/posts", (req, res, next) => {
  //Dummy data for testing witout database
  // const posts=[
  //     { id: 'fjhdsfkjs32432', title: 'First sever-side post', content: 'This is comming from the server'},
  //     { id: 'gfsg132fds1g3f', title: 'Second sever-side post', content: 'This is comming from the server!'}
  // ];

  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
      console.log(documents);
    });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({
      _id: req.params.id
    })
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Post deleted!"
      });
    });
});

module.exports = app;
