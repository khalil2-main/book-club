import React, { useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router";
import axios from "axios";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const letterRegex = /^[\p{L}\p{M}]+$/u;

const SignUpForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    birthday: "",
    address: {
      location: "",
      city: "",
      country: ""
    },
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION ----------------
  const validateField = (name, value, allValues = form) => {
    switch (name) {
      case "firstname":
      case "lastname":
        if (!value.trim()) return "This field is required";
        if (!letterRegex.test(value)) return " must be letters only";
        
        if (value.length < 2) return "Must be at least 2 characters";
        return "";

      case "email":
        if (!value) return "Email is required";
        if (!emailRegex.test(value)) return "Invalid email format";
        return "";

      case "birthday":
        if (!value) return "Birthday is required";
        return "";

      case "location":
      
        return "";

      case "city":
      case "country":
        if (value && !letterRegex.test(value)) return "Letters only";
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

  // Handle change including nested address
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm;

    if (["location", "city", "country"].includes(name)) {
      updatedForm = {
        ...form,
        address: {
          ...form.address,
          [name]: value,
        },
      };
    } else {
      updatedForm = { ...form, [name]: value };
    }

    setForm(updatedForm);

    const fieldError = validateField(name, value, updatedForm);

    const updatedErrors = {
      ...errors,
      [name]: fieldError,
    };

    if (name === "password" && updatedForm.confirmPassword) {
      updatedErrors.confirmPassword = validateField(
        "confirmPassword",
        updatedForm.confirmPassword,
        updatedForm
      );
    }

    setErrors(updatedErrors);
  };

  // Validate entire form
  const validateForm = () => {
    const nextErrors = {};

    Object.keys(form).forEach((key) => {
      if (key === "address") {
        Object.keys(form.address).forEach((subKey) => {
          nextErrors[subKey] = validateField(subKey, form.address[subKey], form);
        });
      } else {
        nextErrors[key] = validateField(key, form[key], form);
      }
    });

    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  // ---------------- SEND DATA ----------------
  const creatUser = async () => {
    try {
      await axios.post("/api/users", form);
      console.log("Sent:", form);
      navigate("/");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) creatUser();
  };

  // ---------------- UI ----------------
  return (
    <div className="flex flex-col justify-center items-center w-full px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Sign Up</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col space-y-2"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            name="firstname"
            placeholder="First Name"
            value={form.firstname}
            onChange={handleChange}
            error={errors.firstname}
            className="flex-1"
          />

          <Input
            name="lastname"
            placeholder="Last Name"
            value={form.lastname}
            onChange={handleChange}
            error={errors.lastname}
            className="flex-1"
          />
        </div>

        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
           onChange={handleChange}
            error={errors.lastname}
            className="flex-1"
          />

        <Input
          name="birthday"
          type="date"
          placeholder="Birthday"
          value={form.birthday}
          onChange={handleChange}
          error={errors.birthday}
        />

        <Input
          name="location"
          placeholder="Street / Location"
          value={form.address.location}
          onChange={handleChange}
          error={errors.location}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            name="city"
            placeholder="City"
            value={form.address.city}
            onChange={handleChange}
            error={errors.city}
            className="flex-1"
          />

          <Input
            name="country"
            placeholder="Country"
            value={form.address.country}
            onChange={handleChange}
            error={errors.country}
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

      <button
        onClick={() => navigate("../login")}
        className="mt-6 text-indigo-600 font-medium hover:underline transition"
      >
        Already have an account? Log in
      </button>
    </div>
  );
};

export default SignUpForm;
