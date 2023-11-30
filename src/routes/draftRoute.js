const router = require('express').Router();
const validate = require('../middlewares/validateMiddleware')
const { isAuth } = require('../middlewares/authenticationMiddleware')
const { verifyUser, isSuperAdminAuth } = require('../middlewares/verifyUser')
const { createSchema } = require('../schemas/recordSchema')

const { createDraft, 
    getDraftRecords,
    getDraftById
} = require('../controllers/draftController')

// Draft CRUD and queries
router.post('/create', validate(createSchema), isAuth, verifyUser, createDraft);
router.get('/all', isAuth, isSuperAdminAuth, getDraftRecords);
router.get('/:id', isAuth, verifyUser, getDraftById);

module.exports = router