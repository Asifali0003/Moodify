import {createBrowserRouter} from "react-router";
import {Register} from "./features/auth/pages/Register.jsx";
import {Login} from "./features/auth/pages/Login.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import Home from "./features/home/pages/home.jsx";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Protected><Home/></Protected>
    },
    {
        path:'/register',
        element: <Register/>
    },
    {
        path:'/login',
        element: <Login/>
    }
])