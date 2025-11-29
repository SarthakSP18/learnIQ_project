import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        
        {/* BRAND */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          LearnIQ
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex space-x-8 font-medium">
          <li><Link to="/" className="hover:text-blue-600">Home</Link></li>

          {!user && <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>}
          {!user && <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>}

          {user?.role === "student" && (
            <li><Link to="/home" className="hover:text-blue-600">Student Dashboard</Link></li>
          )}

          {user?.role === "admin" && (
            <li><Link to="/home" className="hover:text-blue-600">Admin Dashboard</Link></li>
          )}

          {user?.role === "student" && (
            <li><Link to="/student/results" className="hover:text-blue-600">My Results</Link></li>
          )}

          {user?.role === "student" && (
            <li><Link to="/student/profile" className="hover:text-blue-600">Profile</Link></li>
          )}

          {user?.role === "admin" && (
            <li><Link to="/admin/results" className="hover:text-blue-600">Results</Link></li>
          )}

          {user && (
            <li>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout ({user.role})
              </button>
            </li>
          )}
        </ul>

        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <ul className="md:hidden bg-white text-gray-700 flex flex-col items-center py-4 space-y-4 font-medium shadow-md">

          <li>
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          </li>

          {!user && (
            <>
              <li><Link to="/login" onClick={() => setOpen(false)}>Login</Link></li>
              <li><Link to="/register" onClick={() => setOpen(false)}>Register</Link></li>
            </>
          )}

          {user?.role === "student" && (
            <>
              <li><Link to="/home" onClick={() => setOpen(false)}>Student Dashboard</Link></li>
              <li><Link to="/student/results" onClick={() => setOpen(false)}>My Results</Link></li>
              <li><Link to="/student/profile" onClick={() => setOpen(false)}>Profile</Link></li>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <li><Link to="/home" onClick={() => setOpen(false)}>Admin Dashboard</Link></li>
              <li><Link to="/admin/results" onClick={() => setOpen(false)}>Results</Link></li>
            </>
          )}

          {user && (
            <li>
              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout ({user.role})
              </button>
            </li>
          )}

        </ul>
      )}
    </nav>
  );
};

export default Navbar;
