import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TestPage from "./pages/TestPage";
import Result from "./pages/Result";
import AdminDashboard from "./pages/AdminDashboard";
import CreateTest from "./pages/CreateTest";
import ManageTests from "./pages/ManageTests";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import StudentResults from "./pages/StudentResults";
import AdminResults from "./pages/AdminResults";
import HomeDashboard from "./pages/HomeDashboard";
import EditTest from "./pages/EditTest";
import StudentProfile from "./pages/StudentProfile";
import ResultDetails from "./pages/ResultDetails";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="student">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/:id"
            element={
              <ProtectedRoute role="student">
                <TestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute role="student">
                <Result />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-test"
            element={
              <ProtectedRoute role="admin">
                <CreateTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-tests"
            element={
              <ProtectedRoute role="admin">
                <ManageTests />
              </ProtectedRoute>
            }
          />
          {/* Student Results */}
          <Route
            path="/student/results"
            element={
              <ProtectedRoute role="student">
                <StudentResults />
              </ProtectedRoute>
            }
          />

          {/* Update Profile Students  */}
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute role="student">
                < StudentProfile />
              </ProtectedRoute>
            }
          />


          {/* Admin Results */}
          <Route
            path="/admin/results"
            element={
              <ProtectedRoute role="admin">
                <AdminResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomeDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/edit-test/:id" element={<EditTest />} />
          <Route path="/results/:id" element={<ResultDetails />} />


        </Routes>

      </div>
    </Router>
  );
};

export default App;
