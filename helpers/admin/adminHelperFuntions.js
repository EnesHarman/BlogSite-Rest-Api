const asyncErrorRapper = require('express-async-handler');

const checkUserBlock =asyncErrorRapper(async (user) =>{
    if(user.blocked === true){
        return true;
    }

    else{
        return false;
    }

});

module.exports = {
    checkUserBlock
};