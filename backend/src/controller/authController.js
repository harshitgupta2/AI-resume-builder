import { response } from "express";
import {
    registerUserService,
    loginUserService,
    getUserService,
    logoutUserService
} from "../services/authServices.js";

// In production the frontend (Vercel) and backend (Render) are on different
// sites, so the auth cookie must be SameSite=None + Secure to be stored.
// Locally over http that combo is rejected, so fall back to lax/insecure.
const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
};

export const registerUserController = async (req, res) => {
    try {

        const { token, user } = await registerUserService(req.body);

        res.cookie("accesstoken", token, cookieOptions);

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

        res.cookie("accesstoken", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user,
        });

    } catch (error) {
        if (error.message === "User not registered") {
            return res.status(404).json({
                success: false,
                message: "User not registered. Please register first.",
            });
        }

        if (error.message === "Invalid email or password") {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again.",
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

         res.clearCookie("accesstoken", cookieOptions)
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