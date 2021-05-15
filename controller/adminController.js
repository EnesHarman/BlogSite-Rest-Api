const User = require('../models/user');
const asyncErrorRapper = require('express-async-handler');
const CustomError = require('../helpers/errors/CustomError');
const {checkUserBlock} = require('../helpers/admin/adminHelperFuntions');


const blockUser = asyncErrorRapper(async (req,res,next) =>{
    const user = req.user;

    const blockStatus = checkUserBlock(user);
    if(blockStatus){
        return next(new CustomError('User is already blocked.',400));
    }

    user.blocked = true;

    await user.save();

    return res.status(200)
    .json({
        success : true,
        message : `${user.name} has been blocked.`,
    })
    
});

const undoBlockUser = asyncErrorRapper(async (req,res,next) =>{
    const user = req.user;

    const blockStatus = checkUserBlock(user);
    if(!blockStatus){
        return next(new CustomError('User is not blocked.',400));
    }

    user.blocked = false;

    await user.save();

    return res.status(200)
    .json({
        success : true,
        message : `${user.name} has been unblocked.`,
    })
    
});

const deleteUser = asyncErrorRapper(async (req,res,next) =>{
    const userid = req.user._id;
    await User.findByIdAndDelete(userid);

    return res.status(200)
    .json({
        success: true,
        message: `${req.user.name} has been deleted.`
    })
    
});

module.exports = {
    blockUser,
    undoBlockUser,
    deleteUser
};