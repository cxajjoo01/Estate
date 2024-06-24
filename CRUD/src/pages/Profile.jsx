import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "./../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  console.log(formData);
  console.log(filePercent);
  console.log(fileUploadError);

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
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePic: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          src={formData.profilePic || currentUser.user.profilePic}
          alt=""
        />

        <p className="text-sm self-center">
        {
            fileUploadError ? (
          <span className="text-red-700">Error image upload (image size must be less than 2 mb) </span>
        ) : filePercent > 0 && filePercent < 100 ? (
          <span className="text-slate-700">{`Uploading ${filePercent}%`}</span>
        ) : filePercent === 100 ? (
          <span className="text-green-700">Image uploaded successfully!</span>
        ) :''
        }
        </p>

        <input
          className="p-3 border rounded-lg"
          type="text"
          placeholder="username"
          id="username"
          value={formData.username || ""}
          onChange={handleChange}
        />

        <input
          className="p-3 border rounded-lg"
          type="email"
          placeholder="email"
          id="email"
          value={formData.email || ""}
          onChange={handleChange}
        />

        <input
          className="p-3 border rounded-lg"
          type="password"
          placeholder="password"
          id="password"
          value={formData.password || ""}
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          type="submit"
        >
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
