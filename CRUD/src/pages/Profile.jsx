import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "./../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { Link } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingErrors,setShowListingErrors] = useState(false)
  const [userListings, setUserListings] = useState([])
  const { currentUser, loading, error } = useSelector((state) => state.user);


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        console.error('Error during file upload:', error);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({...formData, profilePic: downloadURL });
          setFileUploadError(false);
        });
      }
    );
  };

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser.user._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async() =>{
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser.user._id}`, {
          method: 'DELETE',
          });
          const data = await res.json();
          if (data.success === false){
            dispatch(deleteUserFailure(data.message));
            return;
          }
            dispatch(deleteUserSuccess(data));

      } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }
  }

  const handleSignOut = async() =>{
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure('Failed to sign out. Please try again!'));
    }
  }

  const handleShowListings = async() =>{
    try {
      setShowListingErrors(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if (data.success === false){
        setShowListingErrors(true)
        return
      }
      setUserListings(data)
    } catch (error) {
      setShowListingErrors(true)
    }
  }

  const handleListingDelete = async(listingId) =>{
      try {
        const res = await fetch(`/api/listing/delete/${listingId}`,{
          method: 'DELETE',
          })
          const data = await res.json();
          if (data.success === false){
            console.log(data.message)
            return
          }
          setUserListings((prev)=>prev.filter((listing) =>listing._id !==listingId))
        }
       catch (error) {
        console.log(error.message)
      }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="w-24 h-24 rounded-full self-center cursor-pointer mt-2"
          src={formData.profilePic || currentUser.profilePic}
          alt=""
        />

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload (image size must be less than 2 mb)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercent}%`}</span>
          ) : filePercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully!</span>
          ) : (
            ''
          )}
        </p>

        <input
          className="p-3 border rounded-lg"
          type="text"
          placeholder="username"
          id="username"
          onChange={handleInput}
          defaultValue={currentUser.username}
        />

        <input
          className="p-3 border rounded-lg"
          type="email"
          placeholder="email"
          id="email"
          onChange={handleInput}
          defaultValue={currentUser.email}
        />

        <input
          className="p-3 border rounded-lg"
          type="password"
          placeholder="password"
          id="password"
          onChange={handleInput}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          type="submit">
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link to={'/create-listing'} className="bg-green-700 text-white uppercase 
        p-3 rounded-lg text-center hover:opacity-95">
        Create Listing
        </Link>

      </form>

      <div className="flex justify-between my-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">Listings</button>
      <p className="text-red-700 text-sm mt-5">
        {
          showListingErrors ? 'Error while fetching listings' : ''
        }
      </p>
      {
        userListings && userListings.length > 0 && 
        <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl mt-7 font-semibold mb-4 text-[#059473] font-san">Your Listings</h1>
       {userListings.map((listing) =>
        <div key={listing._id} className="border p-3 rounded-lg flex justify-between items-center gap-3">
           <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing cover"
                className="w-[80px] h-[80px] object-contain"
              />
           </Link>
           <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate"
            to={`/listing/${listing._id}`}>
            <p>{listing.name}</p>
           </Link>
           <div className="flex flex-col items-center ">
            <button onClick={() =>handleListingDelete(listing._id)} className="text-red-700 font-semibold uppercase">Delete</button>
            <Link to={`/update-listing/${listing._id}`}>
              <button className="text-green-700 font-semibold uppercase">Edit</button>
            </Link>
           
           </div>
        </div>
        )}
        </div>
       
      }
    </div>
  );
};

export default Profile;
