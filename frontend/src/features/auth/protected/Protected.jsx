import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"
import { Navigate , useLocation } from "react-router"
import Loader from "../components/Loader"


const Protected = ({children})=>{
const location = useLocation();

const{user,loading} = useContext(AuthContext)
if(loading){
  return <Loader />
}
    if(!user){
        return(
        <Navigate
        to={"/login"}
        state={{ from: location }}
        replace
      />
    );
    }
    return children
}
export default Protected