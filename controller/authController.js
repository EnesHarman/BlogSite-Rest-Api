const User = require('../models/user');
const asyncErrorRapper = require('express-async-handler');
const sendEmail = require('../helpers/libaries/sendEmail');
const CustomError = require('../helpers/errors/CustomError');
const {sendJwtToClient} = require('../helpers/authorization/tokenHelpers');
const {
    validateInputs,
    comparePassword
} = require('../helpers/input/inputHelpers');

const createUser = asyncErrorRapper(async (req,res,next) =>{
    const {name,email,password,role} =req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    return res
    .status(200)
    .json({
        success: true,
        data : user
    })
});


const login= asyncErrorRapper(async (req,res,next) =>{
    const {email,password} = req.body;
    if(!validateInputs(email,password)){
        return next(new CustomError('Please provide inputs.',400));
    }
    const user = await User.findOne({email}).select('+password');
    if(user ===null){
        return next(new CustomError('Please check your inputs.',400));
    }
    if(!comparePassword(user,password)){
        return next(new CustomError('Please check your inputs.',400));
    }

    if(user.blocked){
        return next(new CustomError('You are blocked. You can not login.'));
    }
    
    sendJwtToClient(user,res);
});

const logout= asyncErrorRapper(async (req,res,next) =>{
    return res.status(200).cookie({
        httpOnly: true,
        expires : new Date(Date.now),
        secure : false
    })
    .json({
        success:true,
        message: "Logout Successfull."
    })
});

const imageUpload = asyncErrorRapper(async (req,res,next) =>{
    await User.findByIdAndUpdate(
        {
            _id: req.user.id,
        },
        {
            profile_image : req.savedProfileImage,
        },
        function(err, result,next){
            if(err){
                return next(new CustomError('Image could not upload to database.',500));
            }

            else{
                res.status(200).json({
                    success : true,
                    message : "Image upload successully."
                })
            }
        }
    )    
});

const forgotPassword = asyncErrorRapper(async (req,res,next) =>{
    const resetEmail = req.body.email;
    const user = await User.findOne({email: resetEmail});

    if(!user){
        return next(new CustomError('There is no such a user with that email.'));
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser();
    await user.save();


    const resetPasswordUrl = `http://localhost:3000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>This <a href ='${resetPasswordUrl}' target = '_blank'>link</a> will expire in 1 hour</p>
    `;

    try {
        await sendEmail({
            from : process.env.SMPT_USER,
            to : resetEmail,
            subject : "Reset Your Password",
            html : emailTemplate
        });
        return res.status(200)
        .json({success: true,message : "Token sent to your email."});


    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new CustomError('Email Could not be sent.',500));
    }
});

const resetPassword = asyncErrorRapper(async (req,res,next) =>{
    const {resetPasswordToken} = req.query;
    const{password} = req.body;

    if(!resetPasswordToken){
        return next(new CustomError('Please provide a valid token.',400));
    }

    let user = await User.findOne({
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    });

    if(!user){
        return next(new CustomError('Invalid Token or Session Expired.',404));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200)
    .json({
        success: true,
        messsage : "Password Changed.",
    })

});

module.exports ={
    createUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword
};