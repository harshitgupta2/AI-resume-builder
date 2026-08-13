import { AuthContext } from "./authContext.jsx";
import { useState,useEffect } from "react";
import {getUser} from "../services/auth.api.js";
 
 export const AuthProvider = ({children})=>{
    const[user,setUser] = useState(null);
    const[loading,setLoading] = useState(true);


              useEffect(()=>{
            const getAndSetUser = async()=>{
            try {
               const data =  await getUser()
               setUser(data.user)
            } catch (error) {
              console.log(error)
            }finally{
              
                setLoading(false)
            }
        }
        getAndSetUser()
        },[])


    return(
       <AuthContext.Provider value = {{user, loading , setLoading,setUser}}>
        {children}
       </AuthContext.Provider>
    )
}