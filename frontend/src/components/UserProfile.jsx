import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import axios from "axios";
import noImage from "../assets/images/no-picture.png";

const letterRegex = /^[\p{L}\p{M} ]+$/u;


// ---------------- update function ----------------
const updateUser = async (data) => {

  try {
    const res = await axios.patch("/api/user/me", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Update failed:", err);
    throw err;
  }
};

const UserProfile = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    birthday: "",
    address: {
      location: "",
      city: "",
      country: "",
    },
    image: null,
  });

  const [preview, setPreview] = useState(noImage);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH USER ----------------
  ///use effect reloaded when the component is mounted
  useEffect(() => {
    const fetchUser = async () => {
      try {
        //get user user information
        //get information from the backend using the  id stored in the JWT token
          const res = await axios.get("/api/user/me", { withCredentials: true });
        const data = res.data.user;

        setForm({
          ...data,
          address: data.address || { location: "", city: "", country: "" },
          image: null,
        });
        setPreview(data.image || noImage);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ---------------- VALIDATION ----------------
  const validateField = (name, value) => {
    switch (name) {
      case "firstname":
      case "lastname":
        if (!value || value.length < 2) return "Must be at least 2 characters";
        if (value && !letterRegex.test(value)) return "Letters only";
        return "";
      case "city":
      case "country":
        if (value && !letterRegex.test(value)) return "Letters only";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const nextErrors = {
      firstname: validateField("firstname", form.firstname),
      lastname: validateField("lastname", form.lastname),
      city: validateField("city", form.address.city),
      country: validateField("country", form.address.country),
    };

    setErrors(nextErrors);
    return Object.values(nextErrors).every((msg) => !msg);
  };

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // IMAGE PREVIEW ONLY
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });
      if (file) setPreview(URL.createObjectURL(file));
      return;
    }

    // ADDRESS FIELDS
    if (["location", "city", "country"].includes(name)) {
      setForm({
        ...form,
        address: { ...form.address, [name]: value },
      });
      setErrors({ ...errors, [name]: validateField(name, value) });
      return;
    }

    // NORMAL FIELDS
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Prepare payload (skip image)
    const payload = {
    firstname: form.firstname || undefined,
    lastname: form.lastname || undefined,
    birthday: form.birthday || undefined,
    "address.location": form.address.location || undefined,
    "address.city": form.address.city || undefined,
    "address.country": form.address.country || undefined,
  };

    delete payload.image;

    try {
      console.log("Submitting payload:", payload);
      await updateUser(payload);
     
    } catch (err) {
      alert(err);
    }
  };

  // ---------------- UI ----------------
  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="flex justify-center items-center w-full p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>

        {/* PROFILE IMAGE */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src={preview}
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

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          />

          <Input
            name="location"
            placeholder="Address"
            value={form.address.location}
            onChange={handleChange}
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
