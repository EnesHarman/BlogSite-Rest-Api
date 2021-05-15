const User = require('../../models/user');
const asyncErrorRapper = require('express-async-handler');
const {searchHelper,paginationHelper} = require('./queryMiddlewareHelpers');

const userQueryMiddleware = function(model,options){
    return asyncErrorRapper( async function (req,res,next){

        const total = await User.countDocuments();
        let query = model.find();

        query = searchHelper('name', query,req);

        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;
        const pagination = paginationResult.pagination;

        const queryResults = await query.find();

        res.queryResults ={
            success: true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        }
        next();
    });
}

module.exports = userQueryMiddleware;