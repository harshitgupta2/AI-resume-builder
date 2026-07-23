import express from 'express';
import config from './config/env.js';
import cors from 'cors'
import connectDb from './config/db.js';
import authRoutes from './routes/authRoute.js';
import cookieParser from 'cookie-parser';

const app = express();

// database connection function
connectDb();

app.use(cors());
app.use(express.json());
app.use(cookieParser())


// auth routes 
app.use('/api/auth',authRoutes)



export default app