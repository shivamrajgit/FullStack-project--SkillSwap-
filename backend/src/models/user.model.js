import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        index: true,
        trim: true
    },
    lastName:{
        type: String,
        index: true,
        trim: true        
    },
    bio:{
        type: String,
        trim: true        
    },
    techStack:{
        type: [String],
        index: true,
        default: []
    },
    lookingToLearn:{
        type: [String],
        index: true,
        default: []
    },
    githubURL:{
        type: String
    },
    linkedinURL:{
        type: String
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String
    },
    impressionCount:{
        type: Number,
        default: 0
    },
    discordID:{
        type: String
    },
    refreshToken:{
        type: String
    },
    password:{
        type: String,
        required: [true, "Password is required !"]
    }
},{timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            firstName: this.firstName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)