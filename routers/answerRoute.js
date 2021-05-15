const express = require('express');
const router = express.Router({mergeParams: true});
const {
    getAccessToRoute,
    getAdminAccess,
    checkAnswerOwner
} = require('../middlewares/authorization/auth');

const {
    addAnswer,
    getAllAnswers,
    getSingleAnswer,
    updateAnswer,
    deleteAnswer,
    likeAnswer,
    undoLikeAnswer
} = require('../controller/answerController');

router.post('/add-answer',getAccessToRoute,addAnswer);
router.get('/get-all-answers',getAllAnswers);
router.get('/:answer_id', getSingleAnswer);
router.put('/:answer_id/update',[getAccessToRoute,checkAnswerOwner],updateAnswer);
router.delete('/:answer_id/delete',[getAccessToRoute,checkAnswerOwner],deleteAnswer);
router.get('/:answer_id/like',getAccessToRoute,likeAnswer);
router.get('/:answer_id/undolike',getAccessToRoute,undoLikeAnswer);

module.exports = router;