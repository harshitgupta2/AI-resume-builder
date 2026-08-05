import app from "./src/app.js";
import config from "./src/config/env.js";
import connectDb from '../backend/src/config/db.js';



connectDb();



app.listen(config.PORT,()=>{
    console.log(`server is listing on ${config.PORT}`)
})