var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    methodOverride=require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    mongoose=require('mongoose');
    

mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());

var blogRoutes    = require("./routes/blogs")
app.use("/", blogRoutes);







app.listen(3000, process.env.IP, function(){
    console.log('server is running');
});