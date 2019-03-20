var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    methodOverride=require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    passport=require('passport'),
    LocalStrategy=require('passport-local'),
    User=require('./models/user'),
    
    mongoose=require('mongoose');
    

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
app.set("view engine", 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());



// passport configuration


const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: 'this is my REST blog',
    resave: false,
    saveUninitialized: false,
    
}));

app.use(session({
    store: new MongoStore( { mongooseConnection: process.env.DATABASE } )
}))



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


blogRoutes    = require("./routes")
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });
app.use("/", blogRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server is running');
});