const express = require('express');
const router = express.Router();
const User = require('../models/user'); 
const userQueryMiddleware = require('../middlewares/query/userQueryMiddleware');

const {
    getUserProfile,
    getAllUsers,
    updateInfo
} = require('../controller/userController');

const {
    checkUserExist
} = require('../middlewares/database/databaseErrorHelpers');

const {
    getAdminAccess,
    getAccessToRoute
} = require('../middlewares/authorization/auth');

router.put('/update-info',getAccessToRoute,updateInfo);
router.get('/get-users',[getAccessToRoute,getAdminAccess],userQueryMiddleware(User),getAllUsers);
router.get('/get-user-profile/:id',checkUserExist,getUserProfile);

module.exports = router;