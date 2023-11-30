const router = require('express').Router();
const userRouter = require('./userRoute')
const superAdminRouter = require('./superAdminRoute')
const recordRouter = require('./recordRoute')
const draftRouter = require('./draftRoute')

require('dotenv').config()

router.use('/admin', userRouter)
router.use('/superadmin', superAdminRouter)
router.use('/record', recordRouter)
router.use('/draft', draftRouter)

module.exports = router