const express = require('express');
const app = express();
let bodyParser = require('body-parser');
const uuid = require('uuid');

const jsonParser = bodyParser.json();

var arrPosts = [{
    id: uuid.v4(),
    title: "Web Development",
    content: "It is easy to work a server side app with Node.js!",
    author: "FedericoHuguet",
    publishDate: "22/03/2019"
},
{
    id: uuid.v4(),
    title: "Security",
    content: "Check out this passwords that you should never use!",
    author: "FedericoHuguet",
    publishDate: "23/03/2019"
}];

//GET request of all blog posts
app.get('/blog-posts', (req, res) => {
    return res.status(200).json({
        message: "List of all blog posts",
        status: 200,
        data: arrPosts
    });
});

//GET by author requests
app.get('/blog-posts/:author', (req, res) => {
    //Check parameter
    if (req.params.author == null) {
        return res.status(406).json({
            message: "Please include author",
            status: 406,
            data: []
        });
    }
    var output = arrPosts.filter(post => {return post.author == req.params.author;});
    //Author does not exist
    if (output.length < 1) {
        return res.status(406).json({
            message: "Author not found in the list of blog posts",
            status: 406,
            data: []
        });
    }
    //Success
    return res.status(200).json({
        message: `List of blog posts of ${req.params.author}`,
        status: 200,
        data: output
    });
});

//POST requests of a blog post
app.post('/blog-posts', jsonParser, (req, res) => {

    let requireFields = ['title', 'content', 'author', 'publishDate'];
    for (let i = 0; i < requireFields.length; i++) {
        let currentField = requireFields[i];

        if (!(currentField in req.body)) {
            return res.status(406).json({
                message: `Missing field ${currentField} in body.`,
                status: 406,
                data: []
            });
        }
    }

    let newPost = {
        id: uuid.v4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    };

    arrPosts.push(newPost);

    return res.status(201).json({
        message: "Success! New post added",
        status: 201,
        data: newPost
    });
});

//DELETE request
app.delete('/blog-posts/:id', jsonParser, (req, res) => {
    
    if(req.params.id == null || req.body.id == null){
        return res.status(406).json({
            message: "Please include id in body and parameters",
            status: 406,
            data: []
        });
    }
    if(req.params.id != req.body.id){
        return res.status(406).json({
            message: "Please verify that ids match",
            status: 406,
            data: []
        });
    }
    var index = arrPosts.findIndex(post => {return post.id == req.params.id;});
    if(index < 0){
        return res.status(404).json({
            message: "Blog post not found",
            status: 404,
            data: []
        });  
    }
    arrPosts.splice(index, 1);

    return res.status(404).json({
        message: "Success! Blog post deleted",
        status: 204,
        data: arrPosts
    }); 
});

//UPDATE post
app.put('/blog-posts/:id', jsonParser, (req, res) => {
    
    //Id not included
    if(req.params.id == null){
        return res.status(406).json({
            message: "Please include id in parameters",
            status: 406,
            data: []
        })
    }

    var indexPost = arrPosts.findIndex(post => {return post.id == req.params.id;});

    if (indexPost < 0) {
        return res.status(404).json({
            message: 'Post not found',
            status: 404,
            data: []
        });
    }        
    if (Object.keys(req.body).length < 1) {
        return res.status(404).json({
            message: 'Please include data',
            status: 404,
            data: []
        });
    }

    Object.keys(req.body).forEach(function(key,index) {
        if (arrPosts[indexPost].hasOwnProperty(key))
            arrPosts[indexPost][key] = req.body[key];
    });

    return res.status(200).json({
        message: "Successfully updated post",
        status: 200,
        data: arrPosts[indexPost]
    });
})

app.listen(8080, () => {
    console.log("App listening on http://localhost:8080 ...")
});