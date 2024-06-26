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
} from "../redux/user/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
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

      </form>

      <div className="flex justify-between my-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
    </div>
  );
};

export default Profile;
