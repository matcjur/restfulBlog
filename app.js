var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    methodOverride=require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    mongoose=require('mongoose');
    Blog=require('./models/blogPost')

mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());

//  mongoose/model config




//  RESTful routes

//INDEX route(home webpage)
app.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log('error');
        }else{
            res.render('index', {blogs:blogs});
        }
    })
});

app.get('/', function(req, res){
    res.redirect('/blogs');
});

//NEW route(form page to input information)
app.get('/blogs/new', function(req, res){
    res.render("new");
})

//CREATE route(adds new page to the db)
app.post('/blogs', function(req, res){
    //create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
        }else{
            //redirect to index
            res.redirect('/blogs');
        }
    })
})

//SHOW route(shows a specific post)
app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('show', {blog:foundBlog});
        }
    })
})

//EDIT route(edits a post)
app.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('edit', {blog: foundBlog});
        }
    })
})

//UPDATE route(updates a post)

app.put('/blogs/:id', function(req, res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect('/blogs')
        }else{
            res.redirect('/blogs/' + req.params.id);
        }
    })
})

//DELETE route(deletes a post)

app.delete('/blogs/:id', function(req, res){
    //destroy blog
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs');
        }
    })
})

app.listen(3000, process.env.IP, function(){
    console.log('server is running');
});