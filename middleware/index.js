var Blog=require('../models/blogPost');

var middlewareObj={};

middlewareObj.isLoggedIn= function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

middlewareObj.checkBlogOwnership= function (req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                console.log('error', 'blog not found');
                res.redirect('back');
            }else{
                //does the user own the blog?
                if(foundBlog.author.id.equals(req.user._id)){
                    next();
                    
                }else{
                    console.log('error', "You don't have permission to do that.");
                    res.redirect('back');
                }
                
            }
        })

    }else{
        console.log('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

module.exports=middlewareObj;