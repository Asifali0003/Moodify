import {useState} from 'react'
import '../style/register.scss'
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useAuth} from '../hooks/useAuth'
import { Navigate } from 'react-router'

export const Register = () => {

    const {user,loading,handleRegister} = useAuth();
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

      if(loading) return <div>Loading...</div>

      if(user) return <Navigate to='/' replace/>


    async function handleSubmit(e){
        e.preventDefault();
        await handleRegister({username,email,password});

        <Navigate to='/' replace/>
    }

    return (
        <main className='register-page'>
            <div className="container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit} >
                    <FormGroup 
                    value={username} 
                    onChange={(e)=>{setUsername(e.target.value)}} 
                    label='username' 
                    placeholder='Choose your username'/>

                    <FormGroup 

                    value={email} 
                    onChange={(e)=>{setEmail(e.target.value)}} 
                    label='email' 
                    placeholder='Enter your email'/>

                    <FormGroup 
                    value={password} 
                    onChange={(e)=>{setPassword(e.target.value)}} 
                    label='password' 
                    placeholder='Enter your password' 
                    type='password'
                    autoComplete="new-password"/>

                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <Link to='/login'>Login</Link></p>
            </div>
        </main>
    )
} 
