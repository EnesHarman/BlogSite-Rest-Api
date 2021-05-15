const express = require('express');
const router = express.Router();
const profileImageUploaded = require('../middlewares/libaries/profileImageUpload');

const {
    createUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword
} = require('../controller/authController');

const {
    getAccessToRoute
} = require('../middlewares/authorization/auth');

router.post('/register',createUser);
router.post('/login', login);
router.get('/logout',getAccessToRoute,logout);
router.post('/forgotpassword',forgotPassword);
router.post('/resetpassword',resetPassword);
router.post("/upload",[getAccessToRoute,profileImageUploaded.single("profile_image")],imageUpload);

module.exports = router; 