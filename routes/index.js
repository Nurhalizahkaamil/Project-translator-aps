const express = require('express');
const authRouter = require('./authRoute');
const projectRouter = require('./projectRoute');
const userRouter = require('./userRoute');
const localizationRouter = require('./localizationRoute');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/projects', projectRouter);
router.use('/users', userRouter);
router.use('/localizations', localizationRouter);

module.exports = router;
