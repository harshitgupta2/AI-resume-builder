import dotenv from 'dotenv';

dotenv.config();

if(!process.env.PORT){
    console.log("PORT not availabel");
}
if(!process.env.JWT_SECRET){
    console.log("jwt secret not available");
}

const config={
    PORT:Number(process.env.PORT || 5000),
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
}
export default config
