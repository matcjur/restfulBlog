var express=require('express'),
    router=express(),
    User=require('../models/user'),
    passport=require('passport'),
    localStrategy=require('passport-local'),
    passportLocalMongoose=require('passport-local-mongoose'),
    middleware= require('../middleware');
    Blog=require('../models/blogPost')

    
//  RESTful routes



//INDEX route(home webpage)
router.get('/blogs', function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log('error');
        }else{
            res.render('index', {blogs:blogs});
        }
    })
});

router.get('/', function(req, res){
    res.redirect('/blogs');
});

//NEW route(form page to input information)
router.get('/blogs/new', middleware.isLoggedIn, function(req, res){
    res.render("new");
})

//CREATE route(adds new page to the db)
router.post('/blogs', function(req, res){
    //create blog
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
        }else{
            // assigns authorship
            newBlog.author.id=req.user._id;
            newBlog.author.username=req.user.username;
            newBlog.save()
            //redirect to index
            res.redirect('/blogs');
        }
    })
})

//SHOW route(shows a specific post)
router.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('show', {blog:foundBlog});
        }
    })
})

//EDIT route(edits a post)
router.get('/blogs/:id/edit', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('edit', {blog: foundBlog});
        }
    })
})

//UPDATE route(updates a post)

router.put('/blogs/:id', function(req, res){
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

router.delete('/blogs/:id', function(req, res){
    //destroy blog
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs');
        }
    })
})
////////////////////////
// auth routes
///////////////////////
router.get('/register', function(req, res){
    res.render('register')
})

// signup logic

router.post('/register', function(req, res){
    var newUser= new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            console.log('you have signed up');
            res.redirect('/')
        })
    })
})

// login routes
router.get('/login', function(req, res){
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login'
}) ,function(req, res){
});

// logout route

router.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/')
})

module.exports=router;