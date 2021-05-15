const User = require('../../models/user');
const Article = require('../../models/article');
const asyncErrorRapper = require('express-async-handler');
const CustomError = require('../../helpers/errors/CustomError');

const checkUserExist = asyncErrorRapper(async (req,res,next) =>{
    const {id} = req.params;

    const user = await User.findById(id);
    
    req.user = user;
    
    if(!user){
        return next(new CustomError('There is no such user with that id.',400));
    }

    next();
});

const checkArticleExist= asyncErrorRapper(async (req,res,next) =>{
    const article_id= req.params.id || req.params.article_id;
    const article = await Article.findById(article_id);
    if(!article){
        return next(new CustomError('There is no such an article with that id.',400));
    }

    next();
});
module.exports = {
    checkUserExist,
    checkArticleExist
};