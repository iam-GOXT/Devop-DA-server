const userService = require("../services/userService");

exports.verifyUser = async (req, res, next) => {
  const userId = req.user;
  const creatorId = req.body.user_id;

  try {
    // console.log(req.user)
    const user = await userService.findOne({ _id: userId });
    if (!user) {
      res.status(403).json({
        success: false,
        message: "Invalid token: User no longer exists",
      });
      return;
    }
    const isDeleted = user.deleted;
    const isSuperAdmin = user.role === "superAdmin";
    const isVerified = user.role === "admin" && user.isVerified;
    // console.log(req.user)
    // console.log(creatorId)

    if (isSuperAdmin || (isVerified && !isDeleted) || userId === creatorId) {
      next();
    } else {
      res.status(403).json({ success: false, message: "Permission denied" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.isSuperAdminAuth = async (req, res, next) => {
  const _id = req.user;
  try {
    const existingUser = await userService.findOne({ _id, deleted: false });

    if (!existingUser || existingUser.role !== "superAdmin")
      return res
        .status(403)
        .json({ success: false, message: "User is not a super admin" });

    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
