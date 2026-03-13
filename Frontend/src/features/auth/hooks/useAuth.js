import {register,login,getme,logout,} from "../services/auth.api";
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";


export const useAuth = () => {
    const context = useContext(AuthContext)
     
    const {user,setUser,loading, setLoading} = context;

    async function handleRegister({username,email,password}) {
        setLoading(true);
        const data = await register({username,email,password});

        setUser(data.user);
        setLoading(false);
    };


    async function handleLogin({email,password}) {
        setLoading(true);
        const data = await login({email,password});

        setUser(data.user);
        setLoading(false);
    };

    async function handleGetMe() {
        setLoading(true);
        const data = await getme();

        setUser(data.user);
        setLoading(false);
    };

    async function handleLogOut() {
        setLoading(true);
        const data = await logout();

        setUser(null);
        setLoading(false);   
    };

    useEffect(() => {handleGetMe()},[])

    return( 
        {user,loading,handleRegister,handleLogin,handleGetMe,handleLogOut}
    )
}