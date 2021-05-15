const Article = require('../models/article');
const asyncErrorRapper = require('express-async-handler');
const CustomError = require('../helpers/errors/CustomError');

const createArticle =asyncErrorRapper(async (req,res,next)=>{
    const {title,content} = req.body;
    const article = await Article.create({
        title: title,
        content : content,
        user : req.user.id,
    })

    res.status(200)
    .json({
        success : true,
        data: article,
    })
});

const getAllArticle =asyncErrorRapper(async (req,res,next)=>{
   
    return res.status(200)
    .json(
        res.queryResults,
    )
});

const getSingleArticle =asyncErrorRapper(async (req,res,next)=>{
    return res.status(200)
    .json(res.queryResults)
});

const updateArticle =asyncErrorRapper(async (req,res,next)=>{
    const {id} = req.params;
    const information = req.body;
    const article = await Article.findByIdAndUpdate(id,{
        ...information,
    });
    article.slug = article.makeSlug();

    await article.save();
    return res.status(200)
    .json({
        success: true,
        message: "Article has been updated.",
        data : article
    })
    
});
const deleteArticle =asyncErrorRapper(async (req,res,next)=>{
    const {id} = req.params;
     await Article.findByIdAndDelete(id);
    return res.status(200)
    .json({
        success: true,
        message: "Article has been deleted.",
    })
});
const likeArticle =asyncErrorRapper(async (req,res,next)=>{
    const {id} = req.params;
    const userid = req.user.id;

    const article = await Article.findById(id);

    if(article.likes.includes(userid)){
        return next(new CustomError('You have already liked  this answer.',400));
    }

    article.likes.push(userid);
    article.likeCount = article.likes.length;

    article.save();

    return res.status(200)
    .json({
        success:true,
        message : 'Article liked.',
    })
});
const undolikeArticle =asyncErrorRapper(async (req,res,next)=>{
    const {id} = req.params;
    const userid = req.user.id;

    const article = await Article.findById(id);

    if(!article.likes.includes(userid)){
        return next(new CustomError('You have not liked this answer yet.',400));
    }

    article.likes.remove(userid);
    article.likeCount = article.likes.length;

    article.save();

    return res.status(200)
    .json({
        success:true,
        message : 'Article undoliked.',
    })
});

module.exports ={
    createArticle,
    getAllArticle,
    getSingleArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    undolikeArticle
};