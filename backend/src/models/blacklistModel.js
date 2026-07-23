import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
    accesstoken:{
        type:String,
        required:true
    }
},{timestamps:true})

const tokenBlackListModel = mongoose.model("blacklistrtoken",blackListTokenSchema);
export default tokenBlackListModel