import { useState } from "react";
import axios from "axios";
import noImage from "../assets/images/default_book_cover.jpg";
import Input from "../components/Input";

export default function BookForm() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    language: "",
    pageNumbers: "",
    genres: "",
    summary: "",
    isbn: "",
    publishedYear: "",
    status: "reading",
    image: null,  
  });

  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(noImage);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // VALIDATION
  const validateField = (name, value) => {
    switch (name) {
      case "title":
        return !value.trim() || value.length < 3
          ? "Title must be at least 3 characters."
          : "";

      case "author":
        return !value.trim() || value.length < 3
          ? "Author must be at least 3 characters."
          : "";

      case "language":
        return value && value.length < 3
          ? "Language must be at least 3 characters."
          : "";

      case "pageNumbers":
        return value && (value < 5 || value > 3000)
          ? "Pages must be between 5 and 3000."
          : "";

      case "genres":
        return !value.trim() ? "Genres cannot be empty." : "";

      case "isbn":
        return value && !/^\d{10}(\d{3})?$/.test(value)
          ? "ISBN must be 10 or 13 digits."
          : "";

      case "publishedYear":
        return value && (value < 1700 || value > new Date().getFullYear())
          ? "Invalid published year."
          : "";

      case "summary":
        return value.length > 2000
          ? "Summary cannot exceed 2000 characters."
          : "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, image: file }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Final validation
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("language", form.language);
      formData.append("summary", form.summary);
      formData.append("isbn", form.isbn);
      formData.append("status", form.status);

      if (form.pageNumbers)
        formData.append("pageNumbers", Number(form.pageNumbers));

      if (form.publishedYear)
        formData.append("publishedYear", Number(form.publishedYear));

      // Genres → array
      const genres = form.genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);

      genres.forEach((g) => formData.append("genres", g));

      // Image file
      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await axios.post("/api/book/", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res.data);

    } catch (err) {
      console.error(err);
      setSubmitError(err?.response?.data?.error || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="w-4/5 mx-auto bg-white p-8 rounded-2xl shadow">
        <h2 className="text-3xl font-bold mb-6">Add a New Book</h2>

        {/* Cover Upload */}
        <div className="mb-6">
          <label htmlFor="coverUpload" className="cursor-pointer">
            <img
              src={preview}
              alt="Cover Preview"
              className="w-40 h-56 object-cover rounded shadow"
            />
          </label>
          <input
            id="coverUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            onBlur={handleChange}
            error={errors.title}
          />

          <Input
            name="author"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
            onBlur={handleChange}
            error={errors.author}
          />

          <Input
            name="language"
            placeholder="Language"
            value={form.language}
            onChange={handleChange}
            onBlur={handleChange}
            error={errors.language}
          />

          <Input
            name="pageNumbers"
            type="number"
            placeholder="Pages"
            value={form.pageNumbers}
            onChange={handleChange}
            onBlur={handleChange}
            error={errors.pageNumbers}
          />

          <Input
            name="genres"
            className="md:col-span-2"
            placeholder="Genres (comma separated)"
            value={form.genres}
            onChange={handleChange}
            onBlur={handleChange}
            error={errors.genres}
          />

          <Input
            name="isbn"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
            onBlur={handleChange}
            error={errors.isbn}
          />

          <Input
            name="publishedYear"
            type="number"
            placeholder="Published Year"
            value={form.publishedYear}
            onChange={handleChange}
            onBlur={handleChange}
            error={errors.publishedYear}
          />

          {/* Summary */}
          <div className="md:col-span-4">
            <label className="font-medium mb-1">Summary</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className={`w-full border rounded p-2 h-28 ${
                errors.summary ? "border-red-500" : "border-gray-400"
              }`}
            />
            {errors.summary && (
              <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
            )}
          </div>

          {submitError && (
            <p className="text-red-600 md:col-span-4">{submitError}</p>
          )}

          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 md:col-span-4"
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Book"}
          </button>
        </form>
      </div>
    </main>
  );
}
