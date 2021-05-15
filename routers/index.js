const express = require('express');
const router = express.Router();
const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const articleRoute = require('./articleRoute');
const adminRoute = require('./adminRoute');


router.use('/article',articleRoute);
router.use('/user',userRoute);
router.use('/auth',authRoute);
router.use('/admin',adminRoute);


module.exports = router;