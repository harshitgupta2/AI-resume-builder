import express from 'express';
import config from './config/env.js';
import cors from 'cors'
import authRoutes from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import interviewRouter from './routes/interviewRoutes.js';


const app = express();


const allowedOrigins = [
    'http://localhost:5173',
    'https://ai-resume-builder-silk-pi.vercel.app',
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser())


// auth routes 
app.use('/api/auth',authRoutes)
app.use('/api/interview',interviewRouter)




export default app