import React, { useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import backgroundImg from "../images/mainbg.jpg";
import { useNavigate } from "react-router-dom";

const LoginCompany = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showPopup = (message, type = "info") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/CareerMatch-Final/CMBackend/employer_login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        showPopup(data.message, "success");
        setTimeout(() => {
          setFormData({ email: "", password: "" });
          navigate("/CompanyMainPage");
        }, 1500);
      } else {
        showPopup(data.message, "error");
      }
    } catch (error) {
      showPopup("Error connecting to the server.", "warning");
      console.error(error);
    }
  };

  const handleGoogleLogin = () => showPopup("Google login clicked");
  const handleFacebookLogin = () => showPopup("Facebook login clicked");

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
          Login
        </h3>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold"
          >
            Login
          </button>

          <p className="mt-6 text-center text-gray-700">
            Don’t have an account?{" "}
            <a href="/RegisterCompany" className="text-blue-700 font-semibold">
              Register
            </a>
          </p>
        </form>
      </div>

      {popup.show && (
        <div
          className={`fixed top-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg text-white font-medium animate-fade ${
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

export default LoginCompany;
