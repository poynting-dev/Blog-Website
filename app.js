//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const ld = require("lodash");
const methodOverride = require("method-override");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

mongoose.connect("mongodb+srv://may:may@cluster0.nuayu.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res) {
  
  Post.find({}, function(err, post) {

    if(post.length == 0) {
      const post = new Post({
        title: "Home",
        content: homeStartingContent
      });
      
      post.save();
      res.redirect("/");

    } else {
      const postTitle = ld.lowerCase(post.title);
      res.render("home", {
        startingContent: post.title,
        postsArr: post
      });
    }
  });    
  
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });

});

app.get("/posts/:postid", function(req, res) {
  const requestedId = req.params.postid;

  Post.findById({_id: requestedId}, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

//Get EditForm
app.get("/:postid/edit", function(req, res) {
  Post.findById({_id: req.params.postid}, function(err, post) {
      if(err){
          console.log(err);
          res.redirect("/");
      }else{
        res.render("update", {
          post: post
        });
      }
  });
});

app.put("/:postid/edit",(req, res)=>{
  Post.findByIdAndUpdate(req.params.postid, {content: req.body.postBody}, function(err,updatedata){
      if(err){
          console.log(err);
          res.redirect("/");
      }else{
          res.redirect("/");
      }
  })
})

app.delete("/:postid",(req,res)=>{
  Post.findByIdAndRemove(req.params.postid,function (err){
      if(err){
          console.log(err);
          res.redirect("/");
      } else {
        res.redirect("/");
      }
    });
});

app.get("/about", function(req, res) {
  res.render("about", {content: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {content: contactContent});
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
