const userService = require('../services/userService')
const { encode_jwt } = require('../utils/jwtUtils');
const { sendMail } = require('../utils/sendMail')

// Register User
exports.registerUser = async (req, res) => {
    const userInfo = req.body
    try {
        const existingEmail = await userService.findOne({ email: userInfo.email });
        console.log('existingEmail', existingEmail)
        const existingPassword = await userService.findOne({ password: userInfo.password })
        

        if (existingEmail || existingPassword) {
            res.status(409).json({ error: "User data already exist" })
            return;
        }
        // set user role as 'superAdmin' adn admin_access as "super admin"
        userInfo.isVerified = true;
        userInfo.role = "superAdmin";
        userInfo.admin_access = "Level 2 Access";

        // Create user
        const userData = await userService.createUser({ ...userInfo })
        console.log(userData)
        // response
        res.status(200).json({ Success: true, message: userData })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// login superAdmin
exports.loginSuperAdmin = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingUser = await userService.findOne({ email })
        if (!existingUser) {
            res.status(404).json({ message: "User does not exist" })
            return;
        }

        const checkPassword = await existingUser.matchPassword(password)
        if (!checkPassword) {
            res.status(400).json({ message: "Incorrect Password" })
            return;
        }
        if (existingUser.role !== "superAdmin") return res.status(403).json({ success: false, message: "Not a superAdmin" })

        const token = encode_jwt({ _id: existingUser._id, role: "superAdmin" });

        res.status(200).json({
            accessToken: token,
            Token_Type: "Bearer",
            user_ID: existingUser._id
        })
    } catch (err) {
        res.status(500).json({ Success: false, message: err.message })
    }
}

// // get admin req
// exports.getAdminRequest = async (req, res) => {
//     try {
//         // call a service (userService.getAll) to fetch the admin requests for the superAdmin where isVerified is false
//         const adminRequests = await userService.getAll({ isVerified: false })

//         res.status(200).json({
//             success: true,
//             message: "List of unverified admins",
//             data: adminRequests
//         })
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message })
//     }
// }

// // verify admin login
// exports.grantAdminRequests = async (req, res) => {
//     const id = req.params.id
//     try {
//         const existingAdminReq = await userService.findOne({ _id: id })

//         await userService.update({ _id: id }, { "$set": { isVerified: true } });

//         res.status(200).json({ success: true, message: "Admin verified successfully" });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message })
//     }
// }

// Get a user by id
exports.getUserById = async (req, res) => {

    try {
        const existingUser = await userService.findOne({ _id: req.params.id })

        if (!existingUser) {
            return res.status(403).json({ success: false, message: "User does not exist" })
        }

        res.status(201).json({
            success: true,
            message: "User fetched successfully",
            data: existingUser
        })
    } catch (err) {
        res.status(403).json({ success: false, message: err.message })
    }
}

// fetch my profile
exports.getMyProfile = async (req, res) => {
    try {
        const myProfile = await userService.findOne({
            _id: req.user
        });
        console.log(req.user)

        res.status(201).json({
            success: true,
            message: "User fetched successfully",
            data: myProfile
        })
    } catch (err) {
        res.status(403).json({ success: false, message: err.message })
    }
};

// update my profile
exports.updateMyProfile = async (req, res) => {
    const updateData = req.body
    try {
        // if (updateData.email) {
        //     const emailAvailable = await userService.findOne({ email: updatedData.email, deleted: false })
        //     if (emailAvailable) {
        //         return res.status(403).json({ success: false, message: "Admin with update email already exist" })
        //     }
        // }
        const updatedData = await userService.update(req.user, { ...updateData }, { new: true })

        res.status(200).json({
            success: true,
            message: 'Admin data updated successfully',
            data: updatedData
        })
    } catch (err) {
        res.status(401).json({ success: false, message: err.message })
    }
}

// delete user
exports.deleteSuperAdmin = async (req, res) => {
    const id = req.user

    try {
        const existingUser = await userService.findOne({ _id: id, deleted: false })
        if (!existingUser) return res.status(404).json({ message: "User does not exist" })

        await userService.update(id, { deleted: true });

        res.status(200).json({ success: true, message: "user deleted succesfully" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// delete admin by superAdmin
exports.deleteAdmin = async (req, res) => {
    const _id = req.params.id

    try {
        const existingUser = await userService.findOne({ _id, deleted: false })
        if (!existingUser) return res.status(404).json({ message: "User does not exist" })

        await userService.update(_id, { deleted: true });
        res.status(200).json({ success: true, message: "You have successfully deleted the admin"})
    } catch(err) {
        res.status(500).json({ message: err.message })
    }

}
// forgot password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await userService.findOne({ email })
        if (!user) return res.status(404).json({ mesage: "User does not exist" })

        const resetCode = Math.floor(Math.random() * 9099) + 1000;
        user.passcode = resetCode.toString()
        await user.save()

        sendMail(email, resetCode.toString());
        res.status(200).json({ message: "Code sent to your email" })
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "Invalid code" })
    }

}

// Get all user
// exports.getAllUsers = async (req, res) => {
//   try{
//       const availableUsers = await userService.getAll({ deleted: false })

//       res.status(200).json({
//           success: true,
//           message: 'Users successfully fetched',
//           data: availableUsers 
//       })
//   } catch (err){
//       res.status(403).json({ success: false, message: err.message})
//   }
// }
// update a user
// delete a user
// get user profile

// reset pasword
exports.resetPassword = async (req, res) => {
    const { resetCode, email, password, confirmPassword } = req.body

    try {
        if (password === confirmPassword) {
            const user = await userService.findOne({ email })
            if (!user) res.status(404).json({ message: "user does not exist" })

            if (user.passcode === resetCode.toString()) {
                if (password === confirmPassword) {
                    const salt = await bcrypt.genSalt(10)
                    const newPassword = await bcrypt.hash(password, salt)

                    user.passcode = ""
                    user.password = newPassword
                    await user.save();
                    res.status(200).json({ user, isPasswordReset: true })
                } else {
                    res.status(400).json({ message: "Password does not match" })
                }
            } else {
                res.status(500).json({ message: "Invalid code" })
            }
        } else {
            res.status(500).json({ message: 'Password does not match' })
        }
    } catch (err) {
        res.status(500).json({ message: err })
    }
}
