var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
//path settings 
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//Schema
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);


//Routings
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//INDEX
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR");
        }else{
            res.render("index", {blogs: blogs});
        }
    });   
});

//NEW route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE route
app.post("/blogs", function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
       if(err){
           res.render("new");
       }else{
           //redirect to index
           res.redirect("/blogs");
       }
    });
});

//SHOW route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
        res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});
 
//EDIT route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //Syntax: Blog.findByIdAndUpdate(id, newData, callback);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

//DELETE route
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        //redirect somewhere and handle errors
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
    
});

app.listen(8080, function(){
    console.log("Server has started");
});