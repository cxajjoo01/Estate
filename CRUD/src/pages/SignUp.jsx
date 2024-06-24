import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import Oauth from '../components/Oauth';

const SignUp = () => {

    const [formData, setFormData] = useState({})
    const [error, setError] = useState(null)
    const [loading,setLoading] = useState(false)

    const navigate = useNavigate()

    const InputHandle = (e) =>{
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }
    // console.log(formData)

    const handleSubmit = async(e) =>{
        e.preventDefault()

        try {
            setLoading(true)
            const resp = await fetch('/api/auth/signup',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            })
            const data = await resp.json()
            console.log(data)
            if(data.success === false) {
                setError(error.message)
                setLoading(false)
                return;
            }
            setLoading(false) 
            navigate('/sign-in')
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
        
    }


    return (
        <div className='p-3 max-w-lg mx-auto'>
           <h1 className='text-3xl text-center font-semibold my-7'> Sign Up </h1>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input className='border p-3 rounded-lg' type='text' placeholder='username'
                 id='username' onChange={InputHandle}/>
                <input className='border p-3 rounded-lg' type='email' placeholder='email'
                 id='email' onChange={InputHandle}/>
                <input className='border p-3 rounded-lg' type='password' placeholder='password'
                 id='password' onChange={InputHandle}/>
                <button disabled={loading} className='bg-slate-600 text-white p-3 rounded-lg
                hover:opacity-90 disabled:opacity-80 uppercase'>
                {
                    loading ? 'Loading...' : 'Sign Up'
                }
                </button>
                <Oauth/>
            </form>
            
            <div className='flex gap-2 mt-5'>
                <p>Have an account?</p>
                <Link to={'/sign-in'}>
                    <span className='text-blue-700'>Sign in</span>
                </Link>
            </div>
            {
                error && <p className='text-red-500 mt-5'>{error}</p>
            } 
        </div>
    );
};

export default SignUp;