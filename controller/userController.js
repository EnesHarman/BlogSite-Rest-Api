const User = require('../models/user');
const asyncErrorRapper = require('express-async-handler');
const CustomError = require('../helpers/errors/CustomError');

const getUserProfile = asyncErrorRapper(async (req,res,next) =>{

    const user = req.user;

    res.status(200)
    .json({
        success: true,
        data : user,
    })
});

const getAllUsers = asyncErrorRapper(async (req,res,next) =>{
    return res.status(200)
    .json(res.queryResults)
});

const updateInfo = asyncErrorRapper(async (req,res,next) =>{
    const information = req.body;
    const userid = req.user.id;

    const user = await User.findByIdAndUpdate(userid,{
        ...information,
    });
    
    return res.status(200)
    .json({
        success: true,
        message: "Update progress successfull.",
        data : user,
    })

});

module.exports = {
    getUserProfile,
    getAllUsers,
    updateInfo
};