const router = require('express').Router();
const validate = require("../middlewares/validateMiddleware");
const { isAuth } = require('../middlewares/authenticationMiddleware');
const { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema, updateSchema } = require("../schemas/userSchema");
const { registerUser, 
    loginSuperAdmin, 
    forgotPassword, 
    resetPassword, 
    getUserById, 
    getMyProfile, 
    // getAdminRequest,
    // grantAdminRequests,
    updateMyProfile,
    deleteSuperAdmin
} = require('../controllers/superAdminController');

// router.get("/admin", (req, res) => {
//     res.status(200);
//     res.end();
// });
 
router.post("/register", validate(RegisterSchema), registerUser);
router.post("/login", validate(LoginSchema), loginSuperAdmin);
router.patch('/', validate(updateSchema), isAuth, updateMyProfile)
router.get("/", isAuth, getMyProfile);
router.delete("/", isAuth, deleteSuperAdmin);

// password
router.patch("/forgotPassword", validate(ForgotPasswordSchema), forgotPassword);
router.patch("/resetPassword", validate(ResetPasswordSchema), resetPassword);

// // admin login request
// router.get('/req', isAuth, getAdminRequest)
// router.get('/req/:id', isAuth, grantAdminRequests)

router.get("/:id", getUserById)

module.exports = router



