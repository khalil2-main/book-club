import React, { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router";
import axios from "axios";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LogInForm = () => {
  const getToken = async () => {
    

    try {
      await axios.post("/api/login", form);
      console.log("Sent:", form);
      navigate("/");
    } catch (err) {
      if(err.response.data.errors) {
        console.log(err.response.data.errors)
        setErrors(err.response.data.errors)}
      console.error("Signup failed:", err);
    }
  };
  const navigate=useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!emailRegex.test(value)) return "Enter a valid email";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    const nextErrors = {
      email: validateField("email", form.email),
      password: validateField("password", form.password),
    };
    setErrors(nextErrors);
    return Object.values(nextErrors).every((v) => !v);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = Object.keys(errors).find((k) => errors[k]);
      if (firstError) {
        const el = document.querySelector(`[name="${firstError}"]`);
        if (el) el.focus();
      }
      return;
    }

    getToken()
  };

  return (
    <div className="flex flex-col justify-center items-center w-full px-4 py-8">
      <h1 className="text-3xl font-semibold mb-2 text-gray-800">Log In</h1>
      <p className="text-gray-500 mb-6">Welcome back! Please enter your details</p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col flex-grow space-y-2"
        noValidate
      >
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 mt-2"
        >
          Log In
        </button>
      </form>
              <button onClick={() => navigate("../signup")} className="mt-6 text-indigo-600 font-medium hover:underline transition" >
    Don’t have an account? Sign up
  </button>
    </div>
  );
};

export default LogInForm;
