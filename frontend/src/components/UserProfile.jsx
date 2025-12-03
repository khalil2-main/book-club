import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "./Header";
import SideImage from "./sideimage";
import Input from "./Input";
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
      location:"",
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
  ///use effect reloaded when the component is mounted
  //refaiche
  useEffect(() => {
    const fetchUser = async () => {
      try {
        //get user information
    
          const res = await axios.get("/api/user/me", { withCredentials: true });
        const data = res.data.user;
       

       setForm({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        email: data.email || "",
        birthday: data.birthday ? data.birthday.split("T")[0] : "",
        address: {
          location: data.address?.location || "",
          city: data.address?.city || "",
          country: data.address?.country || "",
        },
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
      case "location":
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
    if (["location","city", "country"].includes(name)) {
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
      "address.location": form.address.location || "",
      "address.city": form.address.city || "",
      "address.country": form.address.country || "",
    };

    delete payload.image;

    try {
     
      await updateUser(payload);
     
    } catch (err) {
      alert(err);
    }
  };

  // ---------------- UI ----------------
  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden w-8/12">

          <div className="w-full md:w-1/2 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Edit Profile</h2>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Back
                </button>
              </div>

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
