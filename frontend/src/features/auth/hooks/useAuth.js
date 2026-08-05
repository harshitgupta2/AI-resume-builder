import { useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { register, login, logout ,getUser} from "../auth.api.js";

export const useAuth = () => {
    const { user, loading, setUser, setLoading } = useContext(AuthContext);
          useEffect(()=>{
        const getAndSetUser = async()=>{
            console.log("before Api");
        try {
           const data =  await getUser()
           console.log("after api")
           console.log(data)
           setUser(data.user)
        } catch (error) {
          console.log(error)
        }finally{
            console.log("finally")
            setLoading(false)
        }
    }
    getAndSetUser()
    },[])

    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);
            const data = await register({ username, email, password });
            console.log("from useAuth", data);
            if (data) {
                setUser(data.user);
            }
            return data
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
        
    };
    const   handleLogin = async ({ email, password }) => {
        try {
            setLoading(true);
            const data = await login({ email, password });
            if (data) {
                setUser(data.user);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = async () => {
        try {
            setLoading(true);
            const data = await logout();
            if (data) {
                setUser(null);
            }
        } catch (error) {
            console.log(error);
        } finally {
            (false);
        }
    };
    return { user, loading, handleLogin, handleRegister, handleLogout };

    



};
