const express = require('express');
const router = express.Router();
const {
    blockUser, 
    undoBlockUser,
    deleteUser
} =require('../controller/adminController');

const {
    checkUserExist
} = require('../middlewares/database/databaseErrorHelpers');

const {
    getAccessToRoute,
    getAdminAccess
} = require('../middlewares/authorization/auth');

router.post('/block-user/:id',[getAccessToRoute,getAdminAccess],checkUserExist,blockUser);
router.post('/undoblock-user/:id',[getAccessToRoute,getAdminAccess],checkUserExist,undoBlockUser);
router.delete('/delete-user/:id', [getAccessToRoute,getAdminAccess],checkUserExist,deleteUser)

module.exports = router;