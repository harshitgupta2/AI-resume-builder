import {createBrowserRouter} from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Home from './features/auth/pages/Home'
import Protected from './features/auth/protected/Protected'
import Dashboard from './features/auth/pages/Dashboard'

export const router = createBrowserRouter([
    {
        path:"/login",
        element: <Login/>
    },
    {
        path:"/register",
        element:<Register />
    },
    {
        path:"/",
        element:<Protected><Home/></Protected>
    },
    {
        path:"/dashboard",
        element:<Protected><Dashboard /></Protected>
    }
])