import { response } from "express";
import {
    registerUserService,
    loginUserService,
    getUserService,
    logoutUserService
} from "../services/authServices.js";

export const registerUserController = async (req, res) => {
    try {

        const { token, user } = await registerUserService(req.body);

        res.cookie("accesstoken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
});

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });

    } catch (error) {

        const status =
            error.message === "User with this email already exists."
                ? 409
                : 500;

        return res.status(status).json({
            success: false,
            message: error.message,
        });
    }
};

export const loginUserController = async (req, res) => {
    try {

        const { token, user } = await loginUserService(req.body);

        res.cookie("accesstoken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
});

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
        });

    } catch (error) {

        const status =
            error.message === "User not registered" ||
            error.message === "Invalid email or password"
                ? 401
                : 500;

        return res.status(status).json({
            success: false,
            message: error.message,
        });
    }
};

export const getUserController = async (req, res) => {
    try {

        const user = await getUserService(req.user.id);

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const logoutUserController = async(req,res)=>{
    try {
        const accesstoken = req.cookies?.accesstoken || req.headers.authorization?.split(" ")[1];
         await logoutUserService(accesstoken);

         res.clearCookie("accesstoken")
         res.status(200).json({
            success:true,
            message:"User Logged Out Successfully"
         })
       
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}