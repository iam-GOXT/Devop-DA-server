const router = require("express").Router();
const validate = require("../middlewares/validateMiddleware");
const { isAuth } = require("../middlewares/authenticationMiddleware");
const {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  updateSchema,
} = require("../schemas/userSchema");
const {
  registerUser,
  loginAdmin,
  forgotPassword,
  resetPassword,
  getUserById,
  getMyProfile,
  updateMyProfile,
  deleteAdmin,
  getAllAdmin,
  getAdminRequest,
  grantAdminRequests,
  handleAdminVerification,
} = require("../controllers/userControllers");
const { isSuperAdminAuth } = require("../middlewares/verifyUser");

router.post("/register", validate(RegisterSchema), registerUser);
router.post("/login", validate(LoginSchema), loginAdmin);
router.patch("/", validate(updateSchema), isAuth, updateMyProfile);
router.get("/all-admin", isAuth, isSuperAdminAuth, getAllAdmin);
// router.get("/all-admin", getAllAdmin);
// admin login request
router.get("/req", isAuth, isSuperAdminAuth, getAdminRequest);
router.get("/req/:id", isAuth, isSuperAdminAuth, grantAdminRequests);
router.put("/verify", isAuth, isSuperAdminAuth, handleAdminVerification);

router.get("/", isAuth, getMyProfile);
router.delete("/:id", isAuth, isSuperAdminAuth, deleteAdmin);

// password
router.patch("/forgotPassword", validate(ForgotPasswordSchema), forgotPassword);
router.patch("/resetPassword", validate(ResetPasswordSchema), resetPassword);

// global Search
router.get("/:profileId", isAuth, getUserById);

module.exports = router;
