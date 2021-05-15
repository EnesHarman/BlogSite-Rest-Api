const jwt = require('jsonwebtoken');
const User = require('../../models/user')
const Answer = require('../../models/answer');
const asyncErrorRapper = require('express-async-handler');
const CustomError = require('../../helpers/errors/CustomError');
const {isTokenIncluded,getAccessTokenFromHeader} = require('../../helpers/authorization/tokenHelpers');

const getAccessToRoute=(req,res,next)=>{

    if(!isTokenIncluded(req)){
        return next(new CustomError('You are not authorized to this route.',401));
    }

    const accessToken = getAccessTokenFromHeader(req);
    
    jwt.verify(accessToken,process.env.JWT_SECRET_KEY,(err,decoded)=>{
        if(err) return next(new CustomError('You are not authorized to this route.',401));
        req.user ={ 
            id : decoded.id,
            name: decoded.name,
        }
        next();
    }); 
}

const getAdminAccess = asyncErrorRapper( async(req,res,next)=>{
    const {id} = req.user;
    const user = await User.findById(id);
    if(user.role !== "admin"){
        return next(new CustomError('Only admin can access to this route.',400));
    }

    next();
});

const checkAnswerOwner = asyncErrorRapper( async(req,res,next)=>{
    const {answer_id} = req.params;
    const answer = await Answer.findById(answer_id);
    if(answer.user != req.user.id){
        return next(new CustomError('Only owner of this answer can access this route.'));
    }

    next();
});


module.exports = {
    getAccessToRoute,
    getAdminAccess,
    checkAnswerOwner
};