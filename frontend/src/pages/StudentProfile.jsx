import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { AuthContext } from "../context/AuthContext";

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  const savedUser = user;   // Always trusted from AuthContext
  const userId = savedUser?._id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!savedUser) {
      alert("Login required");
      navigate("/login");
      return;
    }

    setName(savedUser.name);
    setEmail(savedUser.email);
  }, [savedUser]);

  const updateProfile = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/update/${userId}`,
        { name, email, password }
      );

      alert("Profile updated!");

      // --- 🔥 Important Fix ---
      // Update AuthContext + localStorage both
      const updatedUser = { ...savedUser, name, email };
      login(updatedUser);

      navigate("/home");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <BackButton />
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Student Profile
      </h2>

      <div className="bg-white p-5 rounded shadow">
        <label className="block mb-2 font-semibold">Username</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2 font-semibold">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={updateProfile}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default StudentProfile;
