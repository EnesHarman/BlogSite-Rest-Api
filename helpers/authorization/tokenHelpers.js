const jwt = require('jsonwebtoken');

const sendJwtToClient =(user, res)=>{
    const token = user.generateJWTFromUser();

    const {JWT_COOKIE} = process.env;

    return res
    .status(200)
    .cookie("access_token",token,{
        httpOnly: true,
        expires : new Date(Date.now() + parseInt (JWT_COOKIE)*60000),
        secure : false
    })
    .json({
        success: true,
        access_token : token,
        data : {
            name : user.name,
            email: user.email,
        }
    })
};

const isTokenIncluded = (req,res,next)=>{
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer:");
};

const getAccessTokenFromHeader =(req,res,next)=>{
    const access_token= req.headers.authorization.split(" ")[1];
    return access_token;
}

module.exports ={
    sendJwtToClient,
    isTokenIncluded,
    getAccessTokenFromHeader
};