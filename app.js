//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//connect to mongoDB
mongoose.connect("mongodb+srv://admin-stefanobg:test123@todolist.1jth2cc.mongodb.net/wikiDB", {useNewUrlParser: true});
//create table schema
mongoose.set('strictQuery', true);
const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);
//make chain rout
app.route("/articles")
.get((req,res)=>{
  Article.find(function(err, foundArticles){
   res.send(foundArticles);
   })
  })
.post( (req,res)=>{
  const newArticle = new Article({

  title: (req.body.title).trim() ,
  content: req.body.content
  });
  newArticle.save();
  res.send("New saved" + newArticle)
  
})

.delete((req,res)=>{
    Article.deleteMany(function(err){
       res.send("All articles are deleted   " )
    });
  });

// make get rerquest
// app.get('/articles', (req,res)=>{
//    Article.find(function(err, foundArticles){
    
//     const lastElement = foundArticles[foundArticles.length -1 ];
//     res.send("This is the last article added:    " + lastElement);
//     });
 
// });

// // POST article

// app.post('/articles', (req,res)=>{
//     newArticle = new Article({

//     title: req.body.title,
//     content: req.body.content
//     });
//     newArticle.save();
//     res.send("New saved" + newArticle)

// });
// // remove ALL
// app.delete('/articles', (req,res)=>{
//   Article.deleteMany(function(err){
//      res.send("All articles are deleted   " )
//   });
// });

// /////////////////////////////////////////////////////////
//routing  to specific article name
app.route("/articles/:articleTitle")
// find item 

.get((req, res) => {

  const articleTitle = req.params.articleTitle;
    Article.findOne({title: articleTitle},function(err,foundArticle){
      if(foundArticle) {
        res.send("Found  " + articleTitle);
    } else {
      res.send("Not found article name: "+ articleTitle);
    }
  });
}) 
.put((req,res)=>{
  const articleTitle = req.params.articleTitle;
  Article.findOneAndUpdate(
    {title: articleTitle },
    {title: req.body.title, content: req.body.content },
    {overwrite: true}, function(){
      res.send("Successfully added")
    } 
    )
 })
 .patch((req,res)=>{
  const articleTitle = req.params.articleTitle;
  Article.findOneAndReplace(
    {title: articleTitle },
    {$set: req.body},function(){
      res.send("Successfully update the title: "+ req.body )
    });
  })
  .delete((req,res)=>{
    const articleTitle1 = req.params.articleTitle;
     const articleTitle = articleTitle1;
    Article.findOneAndRemove(
      {title: articleTitle },function(){
        res.send("Successfully deleted the title: "+ articleTitle)
      });
    })
    // .delete((req,res)=>{
    //   const id = req.body._id;
    //     Article.findByIdAndDelete(
    //     {_id: id },function(){
    //       res.send("Successfully deleted the title: "+ id)
    //     });
    //   })
    ;
// start server to listen for request on localhost:3000/
app.listen(3000, ()=>{
    
    console.log('server listening on port 3000')
})
