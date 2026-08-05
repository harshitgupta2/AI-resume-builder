import { AuthContext } from "./authContext";
import { useState } from "react";
 
 export const AuthProvider = ({children})=>{
    const[user,setUser] = useState(null);
    const[loading,setLoading] = useState(true);





    return(
       <AuthContext.Provider value = {{user, loading , setLoading,setUser}}>
        {children}
       </AuthContext.Provider>
    )
}