import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import config from "../config/env.js";
import tokenBlackListModel from "../models/blacklistModel.js";




/**
 * 
 * @name registerUserService
 * @description Register a new user, expects username, email and password.
 * @returns {Object} Returns generated JWT token and registered user details.
 */

export const registerUserService = async ({ username, email, password }) => {

    const isUserAlreadyExist = await User.findOne({ email });

    if (isUserAlreadyExist) {
        throw new Error("User with this email already exists.");
    }

    const newUser = await User.create({
        username,
        email,
        password,
    });

    const token = jwt.sign(
        {
            id: newUser._id,
            username: newUser.username,
        },
        config.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );

    return {
        token,
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        },
    };
};
/**
 * 
 * @param {*} userData
 * @name loginUserService
 * @description Authenticate a user, expects email and password.
 * @returns {Object} Returns generated JWT token and logged in user details.
 */
export const loginUserService = async ({ email, password }) => {

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("User not registered");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
        },
        config.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );

    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    };
};

/**
 * 
 * @param {*} userId
 * @name getUserService
 * @description Get the authenticated user's details.
 * @returns {Object} Returns authenticated user information.
 */
export const getUserService = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return {
        id: user._id,
        username: user.username,
        email: user.email,
    };
};

/**
 * @name logoutUserService 
 * @description get the access token and remove it from cookie and add it to thr blacklist model
 */

export const logoutUserService = async(accesstoken)=>{
    
    if(!accesstoken){
        throw new Error("Invalid Token");
    }
    await tokenBlackListModel.create({accesstoken});
    return {success:true}

}