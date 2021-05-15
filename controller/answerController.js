const Answer = require('../models/answer');
const Article = require('../models/article');
const asyncErrorRapper = require('express-async-handler');
const CustomError = require('../helpers/errors/CustomError');

const addAnswer = asyncErrorRapper(async (req,res,next)=>{
    const {article_id} = req.params;
    const information = req.body;
    const user_id = req.user.id;

    const answer = await Answer.create({
        ...information,
        article: article_id,
        user : user_id
    });
    
    return res.status(200)
    .json({
        success: true,
        data : answer
    })
});

const getAllAnswers = asyncErrorRapper(async (req,res,next)=>{
    const {article_id} = req.params;
    const article = await Article.findById(article_id).populate('answers');
    const answers = article.answers;

    return res.status(200)
    .json({
        success:true,
        data : answers,
    })
});

const getSingleAnswer = asyncErrorRapper(async (req,res,next)=>{
    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id);

    return res.status(200)
    .json({
        success:true,
        data : answer,
    })
});

const updateAnswer = asyncErrorRapper(async (req,res,next)=>{
    const {answer_id} = req.params;
    const information = req.body;

    const answer = await Answer.findByIdAndUpdate(answer_id,{
        ...information
    });

    return res.status(200)
    .json({
        success:true,
        message : "Answer has been updated.",
    })
});

const deleteAnswer = asyncErrorRapper(async (req,res,next)=>{
    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id);

    await answer.remove();

    return res.status(200)
    .json({
        success:true,
        message : "Answer has been deleted.",
    })

});

const likeAnswer = asyncErrorRapper(async (req,res,next)=>{
    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id);
    const user_id = req.user.id;

    if(answer.likes.includes(user_id)){
        return next(new CustomError('You have already liked this answer.'));
    }

    answer.likes.push(user_id);

    answer.save();

    return res.status(200)
    .json({
        success:true,
        message : "You liked this answer.",
    })

});

const undoLikeAnswer= asyncErrorRapper(async (req,res,next)=>{
    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id);
    const user_id = req.user.id;

    if(!answer.likes.includes(user_id)){
        return next(new CustomError('You have not liked this answer yet.'));
    }

    answer.likes.remove(user_id);
    answer.save();

    return res.status(200)
    .json({
        success:true,
        message : "You undoliked this answer.",
    })
});

module.exports = {
    addAnswer,
    getAllAnswers,getSingleAnswer,
    updateAnswer,
    deleteAnswer,
    likeAnswer,
    undoLikeAnswer
};
