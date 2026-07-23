import { Router } from "express";
import * as authController from '../controller/authController.js'
import authMiddleware from "../middleware/authMiddleware.js";


const authRoutes = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new User
 * @access public
 */
authRoutes.post('/register',authController.registerUserController);
/**
 * @route POST /api/auth/login
 * @description login User
 * @access public
 */
authRoutes.post('/login',authController.loginUserController);

/**
 * @route GET /api/auth/get-user
 * @description get user profile
 * @access private 
 * 
 */

authRoutes.get('/get-user',authMiddleware,authController.getUserController)


/**
 * @route GET /api/auth/logout
 * @description clear cookie and add token to the blaclist model
 * @access public
 */
authRoutes.get('/logout',authController.logoutUserController)



export default authRoutes