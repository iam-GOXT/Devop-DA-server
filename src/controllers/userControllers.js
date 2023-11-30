const userService = require("../services/userService");
const { encode_jwt } = require("../utils/jwtUtils");
const { sendMail } = require("../utils/sendMail");
const { storeImage } = require("../utils/cloudinaryUtil");
const userModel = require("../models/userModel");

// Register User
exports.registerUser = async (req, res) => {
  const userInfo = req.body;
  console.log("userInfo", userInfo);
  try {
    const existingEmail = await userService.findOne({ email: userInfo.email });

    if (existingEmail) {
      res.status(409).json({ error: "User data already exist" });
      return;
    }

    // Create user
    const userData = await userService.createUser(userInfo);
    console.log("userData", userData);
    // response
    res.status(200).json({ Success: true, message: userData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// login admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const existingUser = await userService.findOne({ email });
    console.log(existingUser);

    if (existingUser) {
      const checkPassword = await existingUser.matchPassword(password);
      if (checkPassword) {
        if (existingUser.isVerified) {
          const token = encode_jwt({ _id: existingUser._id, role: "admin" });
          res.status(200).json({
            accessToken: token,
            Token_Type: "Bearer",
            user_id: existingUser._id,
          });
        } else {
          res.status(401).json({ message: "login request pending" });
        }
      } else {
        res.status(400).json({ message: "Incorrect Password" });
      }
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  } catch (err) {
    res.status(500).json({ Success: false, message: err.message });
  }
};

// Get a user by id
exports.getUserById = async (req, res) => {
  try {
    const existingUser = await userService.findOne({
      _id: req.params.profileId,
    });
    console.log("existingUser", existingUser);

    if (!existingUser) {
      return res
        .status(403)
        .json({ success: false, message: "User does not exist" });
    }

    res.status(201).json({
      success: true,
      message: "User fetched successfully",
      data: existingUser,
    });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

// fetch my profile
exports.getMyProfile = async (req, res) => {
  try {
    const myProfile = await userService.findOne({
      _id: req.user,
    });
    // .populate({
    //   path: "records",
    //   select: "firstName lastName email contact we",
    // });
    console.log(`This is the current user ${myProfile}`);

    res.status(201).json({
      success: true,
      message: "User fetched successfully",
      data: myProfile,
    });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};

// get all admin by superAdmin

// exports.getAllAdmin = async (req, res) => {
//   console.log("req.user", req.user);
//   try {
//     if (req.user.role != "superAdmin") {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to perform this action",
//       });
//     } else {
//       const allAdmins = await userService.getAll({ deleted: false });
//       const totalAdmin = await userService.getCount({
//         role: { $in: ["Admin", "superAdmin"] },
//         deleted: false,
//       });
//       return res.status(200).json({
//         success: true,
//         message: "Admins fetched successfully",
//         Total_Admin: totalAdmin,
//         data: allAdmins,
//       });
//     }
//   } catch (err) {
//     res.status(403).json({ success: false, message: err.message });
//   }
// };

exports.getAllAdmin = async (req, res) => {
  console.log("req.user", req.user);
  console.log("req.query", req.query);
  const keyword = req.query.keyword || "";
  try {
    const limit = parseInt(req.query.perPage) || 20;
    const page = parseInt(req.query.page) || 0;
    let sortBy = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(",");
      sortBy[parts[0]] = parts[1] === "asc" ? 1 : -1;
    } else {
      sortBy = { createdAt: -1 };
    }
    const search =
      {
        $or: [
          { firstName: { $regex: keyword, $options: "i" } },
          { lastName: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
          { userName: { $regex: keyword, $options: "i" } },
        ],
      } || {};
    const allAdmins = await userModel
      .find({ ...search, deleted: false })
      .sort(sortBy)
      .limit(limit)
      .skip(limit * page);
    const totalAdmin = await userModel.countDocuments({
      ...search,
      deleted: false,
    });
    const numPages = Math.ceil(totalAdmin / limit);
    return res.status(200).json({
      success: true,
      message: "Admins fetched successfully",
      total: totalAdmin,
      data: allAdmins,
      page: page + 1,
      numPages: numPages,
      perPage: limit,
    });
    // }
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};
//   console.log("req.user", req.user);
//   try {
//     const allAdmins = await userService.getAll({ deleted: false });
//     const totalAdmin = await userService.getCount({
//       deleted: false,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Admins fetched successfully",
//       Total_Admin: totalAdmin,
//       data: allAdmins,
//     });
//   } catch (err) {
//     res.status(403).json({ success: false, message: err.message });
//   }
// };
// update a user
exports.updateMyProfile = async (req, res) => {
  const updateData = req.body;
  try {
    if (updateData.email) {
      const emailAvailable = await userService.findOne({
        email: updatedData.email,
        deleted: false,
      });
      if (emailAvailable) {
        return res.status(403).json({
          success: false,
          message: "Admin with update email already exist",
        });
      }
    }
    const updatedData = await userService.update(req.user, { ...updateData });

    res.status(200).json({
      success: true,
      message: "Admin data updated successfully",
      data: updatedData,
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

// delete user
exports.deleteAdmin = async (req, res) => {
  const _id = req.params.id;
  try {
    const existingUser = await userService.findOne({ _id, deleted: false });
    if (!existingUser)
      return res.status(404).json({ message: "Admin do not exist" });

    await userService.update(_id, { deleted: true });

    return res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

// get admin req
exports.getAdminRequest = async (req, res) => {
  try {
    // call a service (userService.getAll) to fetch the admin requests for the superAdmin where isVerified is false
    const adminRequests = await userService.getAll({ isVerified: false });

    res.status(200).json({
      success: true,
      message: "List of unverified admins",
      data: adminRequests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// verify admin login
exports.grantAdminRequests = async (req, res) => {
  const id = req.params.id;
  try {
    const existingAdminReq = await userService.findOne({ _id: id });

    await userService.update({ _id: id }, { $set: { isVerified: true } });

    res
      .status(200)
      .json({ success: true, message: "Admin verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.handleAdminVerification = async (req, res) => {
  const { admin } = req.body;
  const { action } = req.query;
  console.log("action", action);
  console.log("id", admin);
  try {
    const userDetail = await userService.findOne({ _id: admin });
    console.log("userDetail", userDetail);
    if (action === "verify") {
      console.log("verify");
      const verifiedAdmin = await userService.update(
        { _id: admin },
        { isVerified: true }
      );
      console.log("verified", verifiedAdmin);
      if (verifiedAdmin) {
        res
          .status(200)
          .json({ success: true, message: "Admin verified", verifiedAdmin });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    } else if (action === "unverify") {
      console.log("unverify");
      const unVerifiedAdmin = await userService.update(
        { _id: admin },
        { isVerified: false }
      );
      console.log("unverified", unVerifiedAdmin);
      if (unVerifiedAdmin) {
        res.status(200).json({
          success: true,
          message: "Admin unverified",
          unVerifiedAdmin,
        });
      } else {
        res.status(500).json({ success: false, message: error.message });
      }
    } else {
      res
        .status(500)
        .json({ success: false, message: "Admin with id does not exist" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// verify admin login
// exports.handleAdminVerification = async (req, res) => {
//   const { _id } = req.user;
//   const { action } = req.query;
//   console.log("action", action);
//   try {
//     if (action === "verify") {
//       const verifiedAdmin = await userService.update(
//         { _id },
//         { isVerified: true }
//       );
//       console.log("verified", verifiedAdmin);
//       if (verifiedAdmin) {
//         res.status(200).json({ success: true, message: verifiedAdmin });
//       } else {
//         res.status(500).json({ success: false, message: error.message });
//       }
//     } else if (action === "unverify") {
//       const unVerifiedAdmin = await userService.update(
//         { _id },
//         { isVerified: false }
//       );
//       console.log("unverified", unVerifiedAdmin);
//       if (unVerifiedAdmin) {
//         res.status(200).json({ success: true, message: unVerifiedAdmin });
//       } else {
//         res.status(500).json({ success: false, message: error.message });
//       }
//     } else {
//       res
//         .status(500)
//         .json({ success: false, message: "Admin with id does not exist" });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// verify admin login
exports.grantAdminRequests = async (req, res) => {
  const id = req.params.id;
  try {
    const existingAdminReq = await userService.findOne({ _id: id });

    await userService.update({ _id: id }, { $set: { isVerified: true } });

    res
      .status(200)
      .json({ success: true, message: "Admin verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userService.findOne({ email });
    if (!user) return res.status(404).json({ mesage: "User does not exist" });

    const resetCode = Math.floor(Math.random() * 9099) + 1000;
    user.passcode = resetCode.toString();
    await user.save();

    sendMail(email, resetCode.toString());
    res.status(200).json({ message: "Code sent to your email" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Invalid code" });
  }
};

// reset pasword
exports.resetPassword = async (req, res) => {
  const { resetCode, email, password, confirmPassword } = req.body;

  try {
    if (password === confirmPassword) {
      const user = await userService.findOne({ email });
      if (!user) res.status(404).json({ message: "user does not exist" });

      if (user.passcode === resetCode.toString()) {
        if (password === confirmPassword) {
          const salt = await bcrypt.genSalt(10);
          const newPassword = await bcrypt.hash(password, salt);

          user.passcode = "";
          user.password = newPassword;
          await user.save();
          res.status(200).json({ user, isPasswordReset: true });
        } else {
          res.status(400).json({ message: "Password does not match" });
        }
      } else {
        res.status(500).json({ message: "Invalid code" });
      }
    } else {
      res.status(500).json({ message: "Password does not match" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

// search admin
exports.searchAdmin = async (req, res) => {
  console.log(req.query);
  try {
    const searchedRecord = await recordService.getAll({
      $or: [
        { firstName: { $regex: req.query.keyword, $options: "i" } },
        { userName: { $regex: req.query.keyword, $options: "i" } },
        { lastName: { $regex: req.query.keyword, $options: "i" } },
        // { faculty: { $regex: req.query.keyword, $options: 'i' }},
      ],
    });
    // if(!searchedRecord || searchedRecord.length === 0) {
    //     return res.status(400).send({error : "No response was found"})
    // }
    return res.status(200).json({
      success: true,
      message: "searched Records",
      data: searchedRecord,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
