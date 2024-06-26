import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to='/'>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-700">Aayansh</span>
            <span className="text-slate-500">Estate</span>
          </h1>
        </Link>

        <form className='bg-slate-100 flex p-3 rounded-lg justify-center items-center'>
          <input className="bg-transparent focus:outline-none w-24 sm:w-64" type="text" placeholder="Search..." />
          <FaSearch className='text-slate-600' />
        </form>

        <ul className='flex gap-4 font-semibold text-lg'>
          <Link to='/'>
            <li className='hidden sm:inline text-[#059473] hover:text-slate-700/50 cursor-pointer'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-[#6aa194] hover:text-slate-700/50 cursor-pointer'>About</li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img src={currentUser.profilePic} alt='Profile' className='w-9 h-9 rounded-full object-cover' />
            ) : (
              <li className='text-[#059473] hover:text-slate-700/50 cursor-pointer'>Sign-in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
