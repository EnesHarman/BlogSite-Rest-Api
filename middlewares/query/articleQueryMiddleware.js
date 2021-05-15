const Article = require('../../models/article');
const asyncErrorRapper = require('express-async-handler');
const {searchHelper,populateHelper,articleSortHelper,paginationHelper} = require('./queryMiddlewareHelpers');

const articleQueryMiddleware = function(model,options){
    return asyncErrorRapper( async function (req,res,next){

        let query = model.find();
        const total = await Article.countDocuments();
        query = searchHelper('title', query,req); 

        if(options && options.population){
            query = populateHelper(query,options.population)
        }

        query = articleSortHelper(query,req);

        const paginationResult = await paginationHelper(total,query,req);

        query = paginationResult.query;
        
        const pagination = paginationResult.pagination;

        const queryResults = await query;

        res.queryResults ={
            success: true,
            count : queryResults.length,
            pagination : pagination,
            data : queryResults
        }
        next();
    });
}

module.exports = articleQueryMiddleware;