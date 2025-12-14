import { useState } from "react";
import axios from "axios";
import noImage from "../assets/images/add.png";
import Input from "../components/Input";

export default function BookForm() {
  const genreOptions = [
  "Fantasy", "High Fantasy", "Urban Fantasy", "Science Fiction", "Cyberpunk", "Dystopian", "Post-Apocalyptic", "Space Opera", "Romance", "Historical Romance", "Contemporary Romance", "Thriller", "Mystery", "Crime", "Detective", "Psychological Thriller", "Horror", "Gothic Horror", "Paranormal", "Adventure", "Action", "Drama", "Literary Fiction", "Classics", "Young Adult", "New Adult", "Children's Literature", "Fairy Tales", "Mythology", "Magical Realism", "Humor", "Satire", "Short Stories", "Western", "War Fiction", "Military Science Fiction",

  "Biography", "Autobiography", "Memoir", "Self-Help", "Personal Development", "Philosophy", "Psychology", "Sociology", "Anthropology", "History", "Military History", "World History", "Politics", "Economics", "Business", "Finance", "Entrepreneurship", "Marketing", "Leadership", "Education", "Parenting", "Religion", "Spirituality", "True Crime", "Travel", "Cookbooks", "Food & Nutrition", "Health & Wellness", "Fitness", "Art", "Photography", "Music", "Film Studies", "Writing", "Linguistics", "Poetry", "Essays", "Journalism", "Crafts & DIY",

  "Science", "Biology", "Ecology", "Evolution", "Chemistry", "Physics", "Astronomy", "Earth Science", "Geology", "Neuroscience", "Mathematics", "Statistics", "Engineering", "Computer Science", "Information Technology", "Software Engineering", "Programming", "Web Development", "Backend Development", "Frontend Development", "Mobile Development", "Artificial Intelligence", "Machine Learning", "Data Science", "Cybersecurity", "Cloud Computing", "DevOps", "Networking", "Databases", "Algorithms", "Operating Systems", "Law", "Medicine", "Nursing", "Public Health", "Architecture", "Design"
].sort();

  const [form, setForm] = useState({
    title: "",
    author: "",
    language: "",
    pageNumbers: "",
    genres: [],
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
         
        if (Number.isNaN(Number(value))) return "Only numbers are allowed.";
        if (Number(value) < 5 || Number(value) > 3000) return "Pages must be between 5 and 3000.";
        return "";


      case "genres":
      return value.length === 0 ? "Genres cannot be empty." : "";


      case "isbn":
        return value && !/^\d{10}(\d{3})?$/.test(value)
          ? "ISBN must be 10 or 13 digits."
          : "";

      case "publishedYear":
        if (Number.isNaN(Number(value)))  return "Please insert year in numbers.";
        if (value < 1700 || value > new Date().getFullYear()) return "Invalid published year."
          return "";

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
      setSubmitError(err?.response?.data?.errors || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className="min-h-screen bg-gray-50 py-10">
    <div className="w-4/5 mx-auto bg-gray-70 p-8 rounded-2xl shadow">
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
        {/** Title */}
        <Input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          onBlur={handleChange}
          error={errors.title}
        />
         {/** Auther */}
        <Input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          onBlur={handleChange}
          error={errors.author}
        />
         {/** Language */}
        <Input
          name="language"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
          onBlur={handleChange}
          error={errors.language}
        />
         {/** Number of pages */}
        <Input
          name="pageNumbers"
          type="number"
          placeholder="Pages"
          value={form.pageNumbers}
          onChange={handleChange}
          onBlur={handleChange}
          error={errors.pageNumbers}
        />

        {/* GENRE SELECTOR */}
        <div className="md:col-span-2">
         

          <div className="flex gap-2">
            <select
              className="border border-gray-400 rounded p-2 flex-1"
              onChange={(e) => {
                const selected = e.target.value;
                if (!selected) return;

                if (!form.genres.includes(selected)) {
                  setForm(prev => ({
                    ...prev,
                    genres: [...prev.genres, selected]
                  }));
                }

                e.target.value = "";
              }}
            >
              <option value="">Select genre…</option>
              {genreOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {form.genres
              .map((g) => (
                <span
                  key={g}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {g}
                  <button
                    type="button"
                    className="text-red-500 font-bold"
                    onClick={() => {
                    
                        setForm(prev => ({
                          ...prev,
                          genres: prev.genres.filter(item => item !== g)
                        }));

                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>

          {errors.genres && (
            <p className="text-red-500 text-sm mt-1">{errors.genres}</p>
          )}

          {/* Hidden field to preserve backend format */}
          <input type="hidden" name="genres" value={form.genres} />
        </div>

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

        {/* SUMMARY */}
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
