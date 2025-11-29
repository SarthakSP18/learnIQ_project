import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration Successful");
      navigate("/login");
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">

      <form onSubmit={handleRegister} className="bg-white p-6 shadow-md rounded-lg w-80">
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border mb-3 rounded" />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 border mb-3 rounded" />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full p-2 border mb-3 rounded"
        >
          <option value="" disabled>
            Select your role
          </option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>

        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full p-2 border mb-4 rounded" />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Register</button>
        <p>Already registered? <Link to={"/login"}><span className="text-blue-800" >Login</span></Link> Here</p>
      </form>
    </div>
  );
};

export default Register;
