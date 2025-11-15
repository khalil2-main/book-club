import React, { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const letterRegex=/^[\p{L}\p{M}]+$/u;

const SignUpForm = () => {
  const navigate= useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value, allValues = form) => {
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) return "This field is required";
        if (value.length < 2) return "Must be at least 2 characters";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!emailRegex.test(value)) return "Invalid email format";
        return "";
     case "address":
    if (!value) return ""; 
    if (!letterRegex.test(value)) return "Address must be letter only";
    return "";

      case "city":
        if (!value) return "";
        if (!letterRegex.test(value)) return "city must be letter only";
        return"";
      case "state":
        if (!value) return "";
        if (!letterRegex.test(value)) return "state must be letter only";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Must be at least 8 characters";
        if (!/[A-Z]/.test(value)) return "Include at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Include at least one number";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== allValues.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    const fieldError = validateField(name, value, newForm);
    const updatedErrors = { ...errors, [name]: fieldError };

    if (name === "password" && newForm.confirmPassword) {
      updatedErrors.confirmPassword = validateField(
        "confirmPassword",
        newForm.confirmPassword,
        newForm
      );
    }

    setErrors(updatedErrors);
  };

  const validateForm = () => {
    const nextErrors = {};
    Object.keys(form).forEach((key) => {
      nextErrors[key] = validateField(key, form[key], form);
    });
    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", form);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Sign Up</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col space-y-2"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
            className="flex-1"
          />
          <Input
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
            className="flex-1"
          />
        </div>

        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          error={errors.address}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            error={errors.city}
            className="flex-1"
          />
          <Input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            error={errors.state}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            className="flex-1"
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Repeat Password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            className="flex-1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 mt-2"
        >
          Sign Up
        </button>
      </form>
      
        <button onClick={() => navigate("../login")} className="mt-6 text-indigo-600 font-medium hover:underline transition"> Don't Already have an account? Log in</button>
      
    </div>
  );
};

export default SignUpForm;
