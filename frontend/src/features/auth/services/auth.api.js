import axios from 'axios'

// Normalize so the base always ends in exactly one /api — whether VITE_API_URL
// is set to the origin (…onrender.com) or already includes /api.
const API_BASE = (import.meta.env.VITE_API_URL)
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");


console.log(API_BASE)
const api = axios.create({
    baseURL: `${API_BASE}/api`,
    withCredentials:true
})

export const register = async({username,email,password})=>{
    try {
        const response = await api.post("/auth/register",{
            username,email,password
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const login = async({email,password})=>{
    try{
        const response = await api.post("/auth/login",{
            email,
            password
        })
        return response.data
    }catch(error){
        // Surface the backend message (e.g. "Invalid email or password") to the UI.
         console.log(error.response?.data?.message);

        throw error;
    }
}
export const logout = async()=>{
    try {
        const response = await api.post("/auth/logout")
        return response.data


    } catch (error) {
        console.log(error)
    }
}
export const getUser = async()=>{
  try {
      const response  =  await api.get("/auth/get-user")
      return response.data
  } catch (error) {
    console.log(error)
  }
}