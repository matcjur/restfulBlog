var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    methodOverride=require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    passport=require('passport'),
    LocalStrategy=require('passport-local'),
    blogRoutes    = require("./routes"),
    User=require('./models/user'),
    dotenv = require('dotenv'),
    mongoose=require('mongoose');
    
    
    dotenv.config();


    
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
app.set("view engine", 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());



// passport configuration



app.use(require('express-session')(
    {
        secret: 'this is the rest blog',
        resave: false,
        saveUninitialized: false
    }
))




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// adds req.user to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });

 // uses router
app.use("/", blogRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server is running');
});