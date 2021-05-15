const Article  = require('../models/article');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    content : {
        type: String,
        required : [true, "Please provide a content."],
        minlength : [6,"Please provide a content with min length 6."],
    },

    likes:[{
        type : mongoose.Schema.ObjectId,
        ref : "User",
    }],

    likeCount:{
        type : Number,
    },
    createdAt:{
        type : Date,
        default: Date.now
    },
    user :{
        type :mongoose.Schema.ObjectId,
        ref :"User",
        required : true,
    },

    article :{
        type :mongoose.Schema.ObjectId,
        ref:"Article",
        required: true,
    }
});

AnswerSchema.pre('save',async function(next){
    
    if(!this.isModified('user')) return next();
    try {
        const article_id = this.article;
        const article = await Article.findById(article_id);
        
        article.answers.push(this._id);
        article.answerCount = article.answers.length;

        await article.save();
    } catch (error) {
        return next(error);
    }
});

AnswerSchema.post("remove",async function(){

    const article = await Article.findById(this.article);
    article.answers.splice(article.answers.indexOf(this._id),1);
    article.answerCount = article.answers.length;

    await article.save();
})

module.exports = mongoose.model('Answer',AnswerSchema);