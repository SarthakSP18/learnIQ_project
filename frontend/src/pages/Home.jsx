import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const demoTests = [
    { title: "Java Aptitude", description: "Test your Java fundamentals and logic skills." },
    { title: "Python Basics", description: "Evaluate your Python programming concepts." },
    { title: "C++ Logical Test", description: "Challenge yourself with tricky C++ questions." },
  ];

  const handleGiveTest = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleViewMore = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-6">
      {/* Animated Heading */}
      <motion.h1
        className="text-4xl font-bold text-center text-blue-600 mb-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to LearnIQ
      </motion.h1>

      {/* Sub Text */}
      <motion.p
        className="text-gray-600 text-center max-w-2xl mx-auto mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Take aptitude tests, track your results, and improve your skills with LearnIQ.
      </motion.p>

      {/* Demo Test Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {demoTests.map((test, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{test.title}</h2>
            <p className="text-gray-600 mb-4">{test.description}</p>
            <button
              onClick={handleGiveTest}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Give Test
            </button>
          </motion.div>
        ))}
      </div>

      {/* View More Tests Button */}
      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.button
          onClick={handleViewMore}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
        >
          View More Tests →
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Home;
