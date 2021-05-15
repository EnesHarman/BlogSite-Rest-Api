const Article = require('../../models/article');
const asyncErrorRapper = require('express-async-handler');
const {searchHelper,populateHelper,paginationHelper} = require('./queryMiddlewareHelpers');

const answerQueryMiddleware = function(model,options){
    return asyncErrorRapper( async function (req,res,next){
        const{id} = req.params;
        const arrayName = "answers";

        const total = (await model.findById(id)).answerCount;
        
        const paginationResults = await paginationHelper(total,undefined,req);
        
        const startIndex= paginationResults.startIndex;
        const limit = paginationResults.limit;
        
        let queryObject ={};

        queryObject[arrayName] = {$slice : [startIndex,limit]};

        let query = model.find({_id: id}, queryObject);

        query = populateHelper(query,options.population);

        const queryResults = await query;

        res.queryResults ={
            success : true,
            pagination : paginationResults.pagination,
            data : queryResults,
        }

        next();
    });
}

module.exports = answerQueryMiddleware;