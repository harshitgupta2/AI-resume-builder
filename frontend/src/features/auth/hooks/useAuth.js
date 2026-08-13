import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { register, login, logout} from "../services/auth.api.js";

export const useAuth = () => {
    const { user, loading, setUser, setLoading } = useContext(AuthContext);


    const handleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true);
            const data = await register({ username, email, password });
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
        setLoading(true);
        try {
            const data = await login({ email, password });
            if (data?.user) {
                setUser(data.user);
            }
            return data?.user ?? null;
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
