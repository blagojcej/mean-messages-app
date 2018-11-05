const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
}

//Configuration for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    //Path is relative to server.js "backend/images"
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

const Post = require('../models/post');

//Multer will try to extract image from request body property "image"
router.post("", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  // const post=req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    // Added field userData in check-auth middleware
    creator: req.userData.userId
  });
  //To test userData field in check-auth middleware, and not to save post to database
  // console.log(req.userData);
  // return res.status(200).json({});
  post.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Post added succesfully',
        // postId: result._id
        post: {
          //Copy all properies of created post, and just for id set extra id
          ...result,
          // OR
          // title: createdPost.title,
          // content: createdPost.content,
          // imagePath: createdPost.imagePath
          id: result._id,

        }
      });
    });
});

router.put("/:id", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {

  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  //MongoDB will create new id if we're creating post without _id
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  // console.log(post);

  // Added field userData in check-auth middleware
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      // console.log(result);
      if (result.nModified > 0) {
        res.status(200).json({
          message: "Update successful!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }

    })
});

router.get("", (req, res, next) => {
  //Dummy data for testing witout database
  // const posts=[
  //     { id: 'fjhdsfkjs32432', title: 'First sever-side post', content: 'This is comming from the server'},
  //     { id: 'gfsg132fds1g3f', title: 'Second sever-side post', content: 'This is comming from the server!'}
  // ];

  // console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  // Changed when implemented pagination
  // Post.find()
  postQuery.find()
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
      // console.log(documents);
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      })
    });
});

router.get("/:id", (req, res, next) => {
  // console.log(req.params.id);
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        console.log(post);
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId
  })
    .then(result => {
      // console.log(result);
      if (result.n > 0) {
        res.status(200).json({
          message: "Deletion successful!"
        });
      } else {
        res.status(401).json({
          message: "Not authorized!"
        });
      }
    });
});

module.exports = router;