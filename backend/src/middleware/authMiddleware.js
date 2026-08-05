import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import config from "../config/env.js";
import tokenBlackListModel from "../models/blacklistModel.js";
const authMiddleware = async(req,res,next)=>{
    try { 
        const token = req.cookies?.accesstoken
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is missing",
            });
        }
        const isTokenBlackListed = await tokenBlackListModel.findOne({accesstoken:token});
        if(isTokenBlackListed){
            return res.status(401).json({
                success:false,
                message: "Not Authorized"
            })
        }
         const decoded = jwt.verify(token, config.JWT_SECRET);
         
         // get the user 
          const user = await User.findById(decoded.id).select("-password");

            if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
         req.user = user;
         next()
    } catch (error) {
        console.log(error)
          return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
}
export default authMiddleware