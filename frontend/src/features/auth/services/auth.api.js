import axios from 'axios'

const api = axios.create({
    baseURL:"http://localhost:3000/api",
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
       console.log(error)
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