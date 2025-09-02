import { Router } from "express";
import {
    signUp,
    login,
    logOut,
    updatePassword,
    updateProfile,
    updateAvatar,
    refreshAccessToken,
    getUserDetails,
    fetchUserDetails,
    exploreTop,
    alignedSearchUsers,
    unalignedSearchUsers
} from "../controllers/user.controller.js"

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/sign-up").post(signUp)
userRouter.route("/login").post(login)
userRouter.route("/refresh-token").post(refreshAccessToken)
userRouter.route("/explore-top").get(exploreTop)

// Secured routes
userRouter.route("/logout").post(verifyJWT, logOut)
userRouter.route("/update-password").post(verifyJWT, updatePassword)
userRouter.route("/update-profile").post(verifyJWT, updateProfile)
userRouter.route("/update-avatar").post(
    verifyJWT,
    upload.fields([{
        name: "avatar",
        maxCount: 1
    }]),
    updateAvatar
)
userRouter.route("/my-profile").get(verifyJWT, getUserDetails)
userRouter.route("/c/:id").get(verifyJWT, fetchUserDetails)
userRouter.route("/search/a").get(verifyJWT, alignedSearchUsers)
userRouter.route("/search/s").get(verifyJWT, unalignedSearchUsers)

export default userRouter