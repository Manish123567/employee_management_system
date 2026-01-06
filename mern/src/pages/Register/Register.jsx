import React, { useState } from "react";
import axios from "axios";
import img1 from "../../assets/Images/login.png";
import img2 from "../../assets/Images/logo.png";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { VscEyeClosed } from "react-icons/vsc";
import { Link } from "react-router-dom";

const Login = () => {
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput({
      ...formInput,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: undefined,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formInput.name.trim()) newErrors.name = "Name is required";
    if (!formInput.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formInput.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formInput.password) newErrors.password = "Password is required";
    if (!formInput.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formInput.password !== formInput.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8009/api/register",
        formInput
      );
      console.log("data added successfully", response.data);
      setFormInput({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      alert("register successfully");
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Logo */}
      <div className="flex justify-center py-8">
        <img src={img2} alt="Logo" className="w-36 h-auto" />
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row justify-center items-center max-w-7xl mx-auto p-4 lg:p-8 gap-8">
        {/* Image Left */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src={img1}
            alt="Login Visual"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Form Right */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md p-6 sm:p-8 max-w-md mx-auto">
          <h1 className="text-2xl font-semibold mb-4 text-start text-gray-800">
            Welcome to Dashboard
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                className="w-full border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-blue-500"
                autoComplete="off"
                value={formInput.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-blue-500"
                autoComplete="off"
                value={formInput.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                className="w-full border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-blue-500"
                autoComplete="off"
                value={formInput.password}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 cursor-pointer text-gray-600"
              >
                {showPassword ? <VscEyeClosed /> : <MdOutlineRemoveRedEye />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4 relative">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-blue-500"
                autoComplete="off"
                value={formInput.confirmPassword}
                onChange={handleChange}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-9 right-3 cursor-pointer text-gray-600"
              >
                {showConfirmPassword ? (
                  <VscEyeClosed />
                ) : (
                  <MdOutlineRemoveRedEye />
                )}
              </span>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#4D007D] hover:bg-[#360059] text-white font-semibold py-2 px-8 rounded-full w-full mt-2"
            >
              Register
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-gray-600 text-sm text-start">
            Already have an account?
            <Link to="/" className="text-[#4D007D] hover:underline ml-1">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
