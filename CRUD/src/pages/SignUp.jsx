import {Link} from 'react-router-dom'

const SignUp = () => {
    return (
        <div className='p-3 max-w-lg mx-auto'>
           <h1 className='text-3xl text-center font-semibold my-7'> Sign Up </h1>
            <form className='flex flex-col gap-4'>
                <input className='border p-3 rounded-lg' type='text' placeholder='username' id='username'/>
                <input className='border p-3 rounded-lg' type='email' placeholder='email' id='email'/>
                <input className='border p-3 rounded-lg' type='password' placeholder='password' id='password'/>
                <button className='bg-slate-600 text-white p-3 rounded-lg
                hover:opacity-90 disabled:opacity-80 uppercase'>Sign Up</button>
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Have an account?</p>
                <Link to={'/sign-in'}>
                    <span className='text-blue-700'>Sign in</span>
                </Link>
            </div>
           
        </div>
    );
};

export default SignUp;