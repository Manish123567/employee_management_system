import React, { useState } from "react";
import img1 from "../../assets/Images/login.png";
import img2 from "../../assets/Images/logo.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { VscEyeClosed } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8009/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        setError(error.response.data.error || "Unknown error occurred");
      } else {
        setError("Server Error");
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      {/* Logo */}
      <div className="py-6">
        <img
          src={img2}
          alt="Logo"
          className="object-cover w-[144px] h-[44px] mx-auto"
        />
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row w-full max-w-[1360px] items-center justify-center px-4 md:px-10 lg:px-20">
        {/* Left Image */}
        <div className="hidden lg:block w-1/2 max-w-[680px] h-[400px] lg:h-[600px]">
          <img
            src={img1}
            alt="Login Visual"
            className="w-full h-full object-cover rounded-l-lg"
          />
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg px-6 py-10">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-start">
              Welcome to Dashboard
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="text-start">
                <label htmlFor="email" className="block text-gray-800">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500 rounded-md"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="text-start relative">
                <label htmlFor="password" className="block text-gray-800">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500 rounded-md"
                  autoComplete="off"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[36px] text-gray-600 cursor-pointer"
                >
                  {showPassword ? <VscEyeClosed /> : <MdOutlineRemoveRedEye />}
                </span>
              </div>

              {/* Forgot Password */}
              <div className="text-blue-500 text-right text-sm">
                <a href="#" className="hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-[#4D007D] text-white py-2 px-8 rounded-full w-full hover:bg-[#3a0060] transition-all"
              >
                Login
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-gray-500 text-start text-sm">
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#4D007D] hover:underline">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
