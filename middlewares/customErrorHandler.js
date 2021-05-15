const CustomError = require('../helpers/errors/CustomError');

const customErrorHandler =(err,req,res,next)=>{
    let customError = err;

    if(err.code === 11000){
        customError = new CustomError('Duplicate key found : Check your Input.',400);
    }

    if(err.name === "CastError"){
        customError = new CustomError('Please provide a valid Id.', 400);
    }
    
    res.status(customError.status ||500)
    .json({
        success:false,
        message : customError.message || "Internal server error."
    })
}

module.exports = customErrorHandler;