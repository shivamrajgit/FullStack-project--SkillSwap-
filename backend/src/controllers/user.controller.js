// signUp
// login
// logout
// updatePassword
// updateProfile
// updateAvatar
// refreshAccessToken
// getUserDetails
// password validate (Optional)
// fetchUserDetails and increment impression count
// exploreTop
// searchUsers (aligned and unaligned)

import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
    }
    catch (error){
        throw new apiError(500, "Error generating tokens !")
    }
}

const checkPasswordFormat = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password)
}

const signUp = asyncHandler( async (req, res) => {
    const {firstName, lastName, email, password} = req.body

    if(!firstName){
        throw new apiError(400, "First name is required !!")
    }

    if(!email){
        throw new apiError(400, "E-mail is required !!")
    }

    const userExist = await User.findOne({ email })

    if(userExist){
        throw new apiError(401, "User with same e-mail already exists !!")
    }

    if(!password){
        throw new apiError(402, "Password is required !")
    }

    if(!checkPasswordFormat(password)){
        throw new apiError(400, "Password format incorrect !")
    }

    const newUser = await User.create({
        firstName,
        lastName: lastName ? lastName : "",
        email,
        password
    })

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken")

    if(!createdUser){
        throw new apiError(500, "Something went wrong !")
    }

    return res.status(200).json(
        new apiResponse(200, createdUser, "User Registered Successfully !")
    )
})

const login = asyncHandler( async (req, res) => {
    const {email, password} = req.body

    if(!email){
        throw new apiError(401, "E-mail is required !!")
    }

    if(!password){
        throw new apiError(401, "Password is required !!")
    }

    const findUser = await User.findOne({ email }).select("-refreshToken")

    if(!findUser){
        throw new apiError(403, "User with e-mail doesn't exist !")
    }

    const isPaswordValid = await findUser.isPasswordCorrect(password)

    if(!isPaswordValid){
        throw new apiError(401, "Invalid Password !")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(findUser._id)

    const loggedInUser = await User.findById(findUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully !" 
        )
    )
})

const logOut = asyncHandler( async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {refreshToken: 1}
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully !"))
})

const updatePassword = asyncHandler( async (req, res) => {
    const {newPassword, oldPassword} = req.body

    const user = await User.findById(req?.user._id)

    if(!await user.isPasswordCorrect(oldPassword)){
        throw new apiError(400, "Invalid old password !")
    }

    if(newPassword == oldPassword){
        throw new apiError(400, "New password can't be same as old password !")
    }

    if(!checkPasswordFormat(newPassword)){
        throw new apiError(400, "Password format incorrect !")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200)
    .json(
        new apiResponse(
            200,
            {},
            "Password changed successfully !"
        )
    )
})

const updateProfile = asyncHandler( async (req, res) => {
    const {firstName, lastName, bio, techStack, lookingToLearn , githubURL, linkedinURL, discordID} = req.body

    const updates = Object.fromEntries(
    Object.entries({ firstName, lastName, bio, githubURL, linkedinURL, discordID })
        .filter(([_, value]) => value && value.trim() !== "")
    );

    if (Array.isArray(techStack) && techStack.length > 0){
        updates.techStack = techStack.map(item => item.trim()).filter(Boolean);
    }

    if (Array.isArray(lookingToLearn) && lookingToLearn.length > 0){
        updates.lookingToLearn= lookingToLearn.map(item => item.trim()).filter(Boolean);
    }

    if (Object.keys(updates).length === 0) {
        throw new apiError(403, "Nothing to update!");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        { 
            $set: updates 
        }, 
        { 
            new: true 
        }
    ).select("-password -refreshToken")

    return res.status(200)
    .json(
        new apiResponse(
            200,
            updatedUser,
            "User Profile updated successfully !"
        )
    )
})

const updateAvatar = asyncHandler( async (req, res) => {
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    if(!avatarLocalPath){
        throw new apiError(400, "Avatar image is required, nothing to update !")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar){
        throw new apiError(402, "Error uploading avatar to cloudinary !")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.secure_url || avatar.url,
            },
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    if(!updatedUser){
        throw new apiError(500, "Something went wrong !")
    }

    return res.status(200)
    .json(
        new apiResponse(

            200,
            updatedUser,
            "Avatar image updated successfully !"
        )
    )
})

const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "Unauthorized request !")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new apiError(401, "Invalid refresh token !")
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new apiError(401, "Refresh token is expired or used !")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user?._id)

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {},
                "Tokens refreshed successfully !"
            )
        )

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh token !")
    }
})

const getUserDetails = asyncHandler( async (req, res) => {
    return res.status(200)
    .json(
        new apiResponse(
            200,
            req.user,
            "Current user fetched Successfully !"
        )
    )
})

const fetchUserDetails = asyncHandler( async (req, res) => {
    const { id } = req.params
    const viewedProfiles = req.cookies.viewedProfiles ? JSON.parse(req.cookies.viewedProfiles) : [];


    if(!id?.trim()){
        throw new apiError(400, "User id is missing !")
    }

    let user = await User.findById(id).select("-password -refreshToken")
    if(!user){
        throw new apiError(404, "User not found !")
    }
    if(!viewedProfiles.includes(id) && req.user._id.toString() !== id){
        user = await User.findByIdAndUpdate(id,{
            $inc: {
                impressionCount: 1
            }
        },{ new: true }).select("-password -refreshToken")
        viewedProfiles.push(id)
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("viewedProfiles", JSON.stringify(viewedProfiles), options)
    .json(
        new apiResponse(
            200,
            user,
            "User fetched successfully !"
        )
    )
})

const exploreTop = asyncHandler( async (_, res) => {
    const topProfiles = await User.aggregate([
        {
            $sort: { impressionCount : -1 }
        },
        {
            $limit: 10
        },
        {
            $project: {
                firstName: 1,
                lastName: 1,
                bio: 1,
                techStack: 1,
                githubURL: 1,
                linkedinURL: 1,
                email: 1,
                avatar: 1,
                impressionCount: 1,
                discordID: 1
            }
        }
    ])

    if(topProfiles.length === 0){
        throw new apiError(404, "No records found !")
    }
    
    return res.status(200)
    .json(
        new apiResponse(
            200,
            topProfiles,
            "top profiles fetched successfully !"
        )
    )
})

const alignedSearchUsers = asyncHandler( async (req, res) => {
    // /search?query=abc&limit=10&page=1
    const { query, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit)
    // find users aligned to tech stack in looking to learn or none[] in looking to learn
    // in this search for query in firstName, lastName, techStack
    // sort by impressionCount desc
    // limit and skip for pagination

    const currentUser = req.user

    if(!currentUser){
        throw new apiError(401, "Unauthorized request !")
    }

    const searchResults = await User.aggregate([
        {
            $match: {
                _id : { $ne: currentUser._id },
                $or: [
                    { lookingToLearn: { $in: currentUser.techStack } },
                    { lookingToLearn: { $size: 0 } }
                ]
            }
        },
        {
            $match: {
                $or: [
                    { techStack: { $regex: query ? query : "", $options: "i" } }
                ]
            }
        },
        {
            $sort: { impressionCount: -1 }
        },
        {
            $skip: skip
        },
        {
            $limit: parseInt(limit)
        }
    ])

    return res.status(200)
    .json(
        new apiResponse(
            200,
            searchResults,
            "Search results fetched successfully !"
        )
    )
})

const unalignedSearchUsers = asyncHandler( async (req, res) => {
    // /search?query=abc&limit=10&page=1
    const { query, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit)
    // Normal search for query in firstName, lastName, techStack
    // sort by impressionCount desc
    // limit and skip for pagination

    const currentUser = req.user

    if(!currentUser){
        throw new apiError(401, "Unauthorized request !")
    }

    const searchResults = await User.aggregate([
        {
            $match: {
                _id : { $ne: currentUser._id }
            }
        },
        {
            $match: query ? {
                    $or: [
                        { firstName: { $regex: query, $options: "i" } },
                        { lastName: { $regex: query, $options: "i" } },
                        { techStack: { $regex: query, $options: "i" } }
                    ]
                }
            : {}
        },
        {
            $sort: { impressionCount: -1 }
        },
        {
            $skip: skip
        },
        {
            $limit: parseInt(limit)
        }
    ])

    return res.status(200)
    .json(
        new apiResponse(
            200,
            searchResults,
            "Search results fetched successfully !"
        )
    )
})

export {
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
}