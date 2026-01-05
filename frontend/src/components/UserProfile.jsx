import { useEffect, useState } from "react";
import { useParams,} from "react-router-dom";
import api from "../api/axiosInterceptor";
import noImage from "../assets/images/no-picture.png";
import BookCard from "./BookCard";
import UserReviewCard from "./UserReviewCard";

/* =========================
   MAIN PAGE
========================= */

export default function UserProfile({ mode }) {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("favorites");
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const userEndpoint = mode === "self" ? "/user/me" : `/user/${id}`;

  /* -------- Fetch user -------- */
  useEffect(() => {
    setLoadingUser(true);
    api
      .get(userEndpoint)
      .then((res) => {
        setUser(res.data.user);
        setLoadingUser(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoadingUser(false);
      });
  }, [userEndpoint]);

  /* -------- Fetch books / reviews -------- */
  useEffect(() => {
    if (!user) return;
    setLoadingBooks(true);

    let endpoint = "";
    if (activeTab === "favorites")
      endpoint = `/user/books/favorites/${user._id}`;
    else if (activeTab === "currentlyReading")
      endpoint = `/user/books/currentlyReading/${user._id}`;
    else if (activeTab === "created")
      endpoint = `/user/CreatedBooks/${user._id}`;
    else if (activeTab === "reviews")
      endpoint = `/user/books/reviews/${user._id}`;

    api
      .get(endpoint)
      .then((res) => {
        if (activeTab === "favorites")
          setBooks(res.data.favoriteBooks || []);
        else if (activeTab === "currentlyReading")
          setBooks(res.data.readingBooks || []);
        else if (activeTab === "created")
          setBooks(res.data.books || []);
        else if (activeTab === "reviews")
          setBooks(res.data.reviewedBooks || []);
        setLoadingBooks(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setBooks([]);
        setLoadingBooks(false);
      });
  }, [activeTab, user]);

  if (loadingUser) return <p>Loading user...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", padding: 24 }}>
      {/* LEFT PANEL */}
      <div style={{ flex: 2, paddingRight: 16 }}>
        <BooksNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
        />

        {loadingBooks ? (
          <p>Loading...</p>
        ) : books.length === 0 ? (
          <p>{getEmptyStateText(activeTab, user.firstname)}</p>
        ) : activeTab === "reviews" ? (
          <div className="flex flex-col gap-4">
            {books.map((book) => (
              <UserReviewCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          flex: 1,
          position: "sticky",
          top: 24,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 8,
          height: "fit-content",
        }}
      >
        <UserInfoPanel user={user} showEmail={mode === "self"} />
      </div>
    </div>
  );
}

/* =========================
   USER INFO PANEL
========================= */

function UserInfoPanel({ user, showEmail }) {
  return (
    <div>
      <img
        src={user.profileImage || noImage}
        alt="Profile"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: 16,
        }}
      />
      <h2>
        {user.firstname} {user.lastname}
      </h2>
      {showEmail && <p>Email: {user.email}</p>}
      <p>Birthday: {new Date(user.birthday).toLocaleDateString()}</p>
    </div>
  );
}

/* =========================
   NAVBAR
========================= */

function BooksNavbar({ activeTab, setActiveTab, user }) {
  const tabs = [
    { key: "favorites", label: "Favorites" },
    { key: "currentlyReading", label: "Currently Reading" },
    { key: "created", label: `Books added by ${user.firstname}` },
    { key: "reviews", label: "Reviews" },
  ];

  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          style={{
            padding: "8px 16px",
            borderBottom:
              activeTab === tab.key ? "2px solid black" : "none",
            background: "transparent",
            cursor: "pointer",
            fontWeight: activeTab === tab.key ? "bold" : "normal",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}



/* =========================
   EMPTY STATES
========================= */

function getEmptyStateText(tab, firstname) {
  switch (tab) {
    case "favorites":
      return "No favorite books yet";
    case "currentlyReading":
      return "Not reading any book yet";
    case "created":
      return `No books added by ${firstname} yet`;
    case "reviews":
      return "No reviews yet";
    default:
      return "";
  }
}
