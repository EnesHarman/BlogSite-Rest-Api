const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const answerRoute = require('./answerRoute');
const answerQueryMiddleware = require('../middlewares/query/answerQueryMiddleware');
const articleQueryMiddleware = require('../middlewares/query/articleQueryMiddleware');

const {
    createArticle,
    getAllArticle,
    getSingleArticle,
    updateArticle,
    deleteArticle,
    likeArticle,
    undolikeArticle
} = require('../controller/articleController');

const {
    getAccessToRoute,
    getAdminAccess
} = require('../middlewares/authorization/auth');

const {
    checkArticleExist
} = require('../middlewares/database/databaseErrorHelpers');


router.get('/get-all-article',articleQueryMiddleware(Article,{
    population : {
        path : "user",
        select : "name profile_image"
    }
}),getAllArticle);
router.post('/create-article',[getAccessToRoute,getAdminAccess] ,createArticle);
router.put('/update-article/:id',[checkArticleExist,getAccessToRoute,getAdminAccess],updateArticle);
router.delete('/delete-article/:id',[checkArticleExist,getAccessToRoute,getAdminAccess],deleteArticle)
router.get('/:id/like',[checkArticleExist,getAccessToRoute],likeArticle)
router.get('/:id/undolike',[checkArticleExist,getAccessToRoute],undolikeArticle)
router.get('/:id',checkArticleExist,answerQueryMiddleware(Article,{
    population :[
        {
            path : "user",
            select : "name profile_image"
        },
        {
            path : "answers",
            select :"user content"
        }

    ]
}),getSingleArticle);

router.use('/:article_id/answer',checkArticleExist,answerRoute);
module.exports = router;