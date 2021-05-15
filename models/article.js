const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');
const ArticleSchema = new Schema({
    title:{
        type : String,
        required : [true,'Please provide a title'],
        minlength :[6,"Please provide a title with min length 6."]
    },

    content :{
        type : String,
        required :[true,"Please provide a content."],
        minlength :[10,"Please provide a content with min length 10."]
    },

    createdAt :{
        type : Date,
        default : Date.now,
    },

    slug : String,

    likes:[
        {
            type : mongoose.Schema.ObjectId,
            ref: "User",
        }
    ],

    likeCount:{
        type:Number,
    },

    answers:[{
        type: mongoose.Schema.ObjectId,
        ref: "Answer",
    }],

    answerCount :{
        type : Number,
    },

    user :{
        type : mongoose.Schema.ObjectId,
        ref:"User",
    }
});

ArticleSchema.pre("save",function(next){
    if(!this.isModified("title")){
        next();
    }

    this.slug = this.makeSlug();
    next();
});



ArticleSchema.methods.makeSlug =function(){
    return slugify(this.title,{
        replacement : '-',
        remove : /[*+~.()'"!:@]/g,
        lower : true,
    })
}

module.exports = mongoose.model('Article',ArticleSchema);