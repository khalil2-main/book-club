import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import axios from "axios";
import noImage from "../assets/images/no-picture.png";

const letterRegex = /^[\p{L}\p{M}]+$/u;

const UserProfile = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    birthday: "",
    address: "",
    city: "",
    country: "",
    image: null,
  });

  const [preview, setPreview] = useState(noImage);
  const [errors, setErrors] = useState({});

  // ---------------- FETCH USER DATA ----------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/users/me");
        setForm(data);
        if(data.image) setPreview(data.image);

      } catch (error) {
        console.error("Failed to load user", error);
      }
    };
    fetchUser();
  }, []);

  // ---------------- VALIDATION ----------------
  const validateField = (name, value) => {
    switch (name) {
      case "firstname":
      case "lastname":
        
        if (value.length < 2) return "Must be at least 2 characters";
        return "";

      case "birthday":
        
        return "";

      case "city":
      case "country":
        if (value && !letterRegex.test(value)) return "Letters only";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle image upload
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });
      if (file) setPreview(URL.createObjectURL(file));
      return;
    }

    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    const fieldError = validateField(name, value);
    setErrors({ ...errors, [name]: fieldError });
  };

  const validateForm = () => {
    const nextErrors = {};
    Object.keys(form).forEach((key) => {
      nextErrors[key] = validateField(key, form[key]);
    });
    setErrors(nextErrors);
    return Object.values(nextErrors).every((m) => !m);
  };

  // ---------------- UPDATE USER ----------------
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      await axios.put("/api/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated!");
    } catch (err) {
      console.error("Update failed", err);
    }
  };


  return (
    <div className="flex justify-center items-center w-full p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

        {/* PROFILE IMAGE */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src={preview || "/placeholder.png"}
            alt="Preview"
            className="w-20 h-20 rounded-full object-cover border"
          />

          <div>
            <label className="text-sm font-semibold">Profile Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block"
            />
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">

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
            disabled
            className="opacity-60 bg-gray-100"
          />

          <Input
            name="birthday"
            type="date"
            value={form.birthday}
            onChange={handleChange}
            error={errors.birthday}
          />

          <Input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
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
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              error={errors.country}
              className="flex-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
