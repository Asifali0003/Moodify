import {useState} from 'react'
import '../style/login.scss'
import FormGroup from '../components/FormGroup'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'

export const Login = () => {
  const {user,loading,handleLogin} = useAuth();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  if(loading) return <div>Loading...</div>

  if(user) return <Navigate to='/' replace/>

  async function handleSubmit(e){
    e.preventDefault();
    await handleLogin({email,password});

    <Navigate to='/'/>



  }



  return (
    <main className='login-page'>
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <FormGroup value={email} onChange={(e)=> setEmail(e.target.value)} label='email' placeholder='Enter your email'/>
                <FormGroup value={password} onChange={(e)=> setPassword(e.target.value)} label='password' placeholder='Enter your password'/>

                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to='/register'>Register</Link></p>
        </div>
    </main>
  )
}
