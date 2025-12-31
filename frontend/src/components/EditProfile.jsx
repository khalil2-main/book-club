import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import SideImage from "./sideimage";
import Input from "./Input";
import { useAuth } from "../context/AuthContext";
import noImage from "../assets/images/no-picture.png";

const letterRegex = /^[\p{L}\p{M} ]+$/u;

const EditProfile = ({ mode }) => {
  const { user, setUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(noImage);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    birthday: "",
    address: { location: "", city: "", country: "" },
    image: null,
  });

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    const loadUser = async () => {
      try {
        let target;

        if (mode === "self") {
          if (!user) return;
          target = user;
        } else {
          const res = await axios.get(`/api/user/${id}`, {
            withCredentials: true,
          });
          target = res.data.user;
        }

        setForm({
          firstname: target.firstname || "",
          lastname: target.lastname || "",
          email: target.email || "",
          birthday: target.birthday
            ? target.birthday.split("T")[0]
            : "",
          address: {
            location: target.address?.location || "",
            city: target.address?.city || "",
            country: target.address?.country || "",
          },
          image: null,
        });

        setPreview(target.profileImage || noImage);
        setLoading(false);
      } catch {
        toast.error("Failed to load profile");
        navigate(-1);
      }
    };

    loadUser();
  }, [mode, id, user, navigate]);

  /* ---------------- CLEANUP PREVIEW ---------------- */
  useEffect(() => {
    return () => {
      if (preview && preview !== noImage) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ---------------- VALIDATION ---------------- */
  const validateField = (name, value) => {
    if (["firstname", "lastname"].includes(name)) {
      if (!value || value.length < 3) return "Minimum 3 characters";
      if (!letterRegex.test(value)) return "Letters only";
    }
    if (["city", "country"].includes(name)) {
      if (value && !letterRegex.test(value)) return "Letters only";
    }
    return "";
  };

  const validateForm = () => {
    const next = {
      firstname: validateField("firstname", form.firstname),
      lastname: validateField("lastname", form.lastname),
      city: validateField("city", form.address.city),
      country: validateField("country", form.address.country),
    };
    setErrors(next);
    return Object.values(next).every((e) => !e);
  };

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        setForm((p) => ({ ...p, image: file }));
        setPreview(URL.createObjectURL(file));
      }
      return;
    }

    if (["location", "city", "country"].includes(name)) {
      setForm((p) => ({
        ...p,
        address: { ...p.address, [name]: value },
      }));
      setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const fd = new FormData();
    fd.append("firstname", form.firstname);
    fd.append("lastname", form.lastname);
    fd.append("birthday", form.birthday);
    fd.append("address", JSON.stringify(form.address));
    if (form.image) fd.append("image", form.image);

    try {
      const endpoint =
        mode === "self" ? "/api/user/me" : `/api/user/${id}`;

      const res = await axios.patch(endpoint, fd, {
        withCredentials: true,
      });

      if (mode === "self") {
        setUser((prev) => ({ ...prev, ...res.data.updateUser }));
      }

      toast.success("Profile updated");
      navigate(-1);
    } catch (err) {
      console.log(err)
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  /* ---------------- UI ---------------- */
  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50">
      <div className="flex w-10/12 overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="w-full p-8 md:w-1/2">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Edit Profile</h2>
            <button
              onClick={() => navigate(-1)}
              className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
            >
              Back
            </button>
          </div>

          <div className="mb-6 flex justify-center">
            <label className="cursor-pointer">
              <img
                src={preview}
                alt="Profile"
                className="h-28 w-28 rounded-full border object-cover"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                hidden
                onChange={handleChange}
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <Input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                error={errors.firstname}
                placeholder="First name"
              />
              <Input
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                error={errors.lastname}
                placeholder="Last name"
              />
            </div>

            <Input name="email" value={form.email} disabled />

            <Input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
            />

            <Input
              name="location"
              value={form.address.location}
              onChange={handleChange}
              placeholder="Street"
            />

            <div className="flex gap-4">
              <Input
                name="city"
                value={form.address.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="City"
              />
              <Input
                name="country"
                value={form.address.country}
                onChange={handleChange}
                error={errors.country}
                placeholder="Country"
              />
            </div>

            <button className="w-full rounded bg-indigo-600 py-2 text-white hover:bg-indigo-700">
              Save Changes
            </button>
          </form>
        </div>

        <div className="hidden md:block md:w-1/2">
          <SideImage />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
