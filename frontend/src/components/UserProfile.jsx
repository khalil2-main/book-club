import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "./Header";
import SideImage from "./sideimage";
import { useAuth } from "../context/AuthContext";
import Input from "./Input";
import axios from "axios";
import noImage from "../assets/images/no-picture.png";
import toast, { Toaster } from "react-hot-toast";

const letterRegex = /^[\p{L}\p{M} ]+$/u;

// ---------------- update function ----------------

const updateUser = async (formData) => {
  try {
    const res = await axios.patch("/api/user/me", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Update failed:", err);
    throw err;
  }
};

const UserProfile = () => {
  const { setUser, user } = useAuth();
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
  const navigate = useNavigate();

  // ---------------- FETCH USER ----------------
  useEffect(() => {
   

        setForm({
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          email: user.email || "",
          birthday: user.birthday ? user.birthday.split("T")[0] : "",
          address: {
            location: user.address?.location || "",
            city: user.address?.city || "",
            country: user.address?.country || "",
          },
          image: user.profileImage
        });

        setPreview(user.profileImage
      ? user.profileImage 
      : noImage
    );
    setLoading(false)
  
  }, [user]);

  // ---------------- VALIDATION ----------------
  const validateField = (name, value) => {
    switch (name) {
      case "firstname":
      case "lastname":
        if (!value || value.length < 3) return "Must be at least 3 characters";
        if (!letterRegex.test(value)) return "Letters only";
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

    // IMAGE PREVIEW
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        // Clean up previous object URL on unmount
        return () => URL.revokeObjectURL(previewUrl);
      }
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

    const formData = new FormData();
    formData.append("firstname", form.firstname);
    formData.append("lastname", form.lastname);
    formData.append("birthday", form.birthday);
    formData.append("address", JSON.stringify(form.address)); // send address as JSON
    if (form.image) formData.append("image", form.image);

    try {
      const updated=await updateUser(formData);
      console.log(updated)
      setUser((prev) => ({
      ...prev,
      ...updated.updateUser,                // update ALL changed fields
      profileImage: updated.updateUser.profileImage 
      }));

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.errors || "Update failed");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden w-8/12">

          <div className="w-full md:w-1/2 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div></div>
                <h2 className="text-2xl font-semibold">Edit Profile</h2>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Back
                </button>
              </div>

              <div className="flex items-center gap-6 mb-6">
                
              {/* PROFILE IMAGE */}
                <div className="w-full flex justify-center mb-6">
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <img
                  src={preview}
                  alt="Preview"
                  className="w-28 h-28 rounded-full object-cover border hover:opacity-80 transition" />
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
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
                  placeholder="Street / Location"
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

          <div className="w-full md:w-1/2">
            <SideImage />
          </div>

        </div>
      </div>
    </>
  );
};

export default UserProfile;
