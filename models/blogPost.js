mongoose=require('mongoose');

//  mongoose/model config
var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    owner: String,
    created: {type: Date, default: Date.now} 
});

module.exports = mongoose.model("Blog", blogSchema);