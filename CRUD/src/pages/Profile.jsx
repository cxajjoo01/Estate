import { useSelector } from "react-redux";


const Profile = () => {
    const {currentUser} = useSelector(state =>state.user)
    return (
        <div className="p-3 max-w-lg mx-auto">
          <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

          <form className="flex flex-col gap-4">
          <img className="w-24 h-24 rounded-full self-center cursor-pointer mt-2"
           src={currentUser.user.profilePic} alt=""/>

            <input className="p-3 border rounded-lg" type="text"
             placeholder="username" id="username"/>

            <input className="p-3 border rounded-lg" type="email"
             placeholder="email" id="email"/>

            <input className="p-3 border rounded-lg" type="text"
             placeholder="password" id="password"/>
             <button className="bg-slate-700 text-white p-3
              rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
              update
            </button>
          </form>
          <div className="flex justify-between my-5">
            <span className="text-red-700 cursor-pointer">Delete account</span>
            <span className="text-red-700 cursor-pointer">Sign out</span>
          </div>
        </div>
    );
};

export default Profile;