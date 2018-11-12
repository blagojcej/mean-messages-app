const Post = require('../models/post');

exports.createPost = (req, res, next) => {
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
        })
        .catch(error => {
            res.status(500).json({
                message: 'Creating a post failed!'
            });
        });
}

exports.updatePost = (req, res, next) => {

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
        .catch(error => {
            res.status(500).json({
                message: 'Couldn\'t update post!'
            });
        })
}

exports.getPosts = (req, res, next) => {
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
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            });
        });
}

exports.getPost = (req, res, next) => {
    // console.log(req.params.id);
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                console.log(post);
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'Post not found!' });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching post failed!'
            });
        });
}

exports.deletePost = (req, res, next) => {
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
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            });
        });
}