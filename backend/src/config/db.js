import mongoose from 'mongoose';
import config from './env.js';


const connectDb = async()=>{
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log("database connected")
    } catch (error) {
        console.log(error);
    }
}

export default connectDb;