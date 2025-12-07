import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import backgroundImg from "../images/mainbg.jpg";
import { useNavigate } from "react-router-dom";
const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2000);
  };

  // Removed handleBack function

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      showPopup("Passwords do not match!", "error");
      return;
    }

    try {
      const response = await fetch("https://sheetdb.io/api/v1/uqjs69bch77kz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              "First Name": formData.first_name,
              "Last Name": formData.last_name,
              Email: formData.email,
              Password: formData.password,
            },
          ],
        }),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok && result.created) {
        showPopup("Registration successful!", "success");
        setTimeout(() => {
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
          });
          navigate("/LoginCompany");
        }, 1500);
      } else {
        showPopup("Failed to register. Please check your SheetDB setup.", "error");
      }
    } catch (error) {
      showPopup("Error connecting to the API.", "warning");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md mt-10">
        <h2 className="text-2xl font-bold text-center text-blue-900">
          Welcome to CareerMatch
        </h2>
        <h3 className="text-xl mt-2 font-semibold text-center text-gray-700">
          Create Your Account
        </h3>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* First Name */}
          <div className="mb-4 relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" />
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4 relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800" />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold"
          >
            Register
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-gray-600">Already have an account?</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Login Redirect */}
          <p className="mt-2 text-center text-gray-700">
            <a href="/LoginCompany" className="text-blue-700 font-semibold">
              Login
            </a>
          </p>
        </form>
      </div>

      {/* Popup Notification */}
      {popup.show && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white font-medium animate-fade ${
            popup.type === "success"
              ? "bg-green-600"
              : popup.type === "error"
              ? "bg-red-600"
              : popup.type === "warning"
              ? "bg-yellow-400 text-black"
              : "bg-blue-600"
          }`}
        >
          {popup.message}
        </div>
      )}
    </div>
  );
};

export default RegisterCompany;
