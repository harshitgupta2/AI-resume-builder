import express from 'express';
import config from './config/env.js';
import cors from 'cors'
import authRoutes from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import interviewRouter from './routes/interviewRoutes.js';


const app = express();


app.use(cors({
    origin:[
        'http://localhost:5173',
        // Matches every Vercel deployment URL for this project (previews change each deploy)
        /^https:\/\/ai-resume-builder-.*\.vercel\.app$/
    ],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser())


// auth routes 
app.use('/api/auth',authRoutes)
app.use('/api/interview',interviewRouter)




export default app