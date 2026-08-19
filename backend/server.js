import app from "./src/app.js";
import config from "./src/config/env.js";
import connectDb from './src/config/db.js';



connectDb();


console.log(config.PORT)
app.listen(config.PORT,"0.0.0.0",()=>{
    console.log(`server is listing on ${config.PORT}`)
})