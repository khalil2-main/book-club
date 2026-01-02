import { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import api from '../api/axiosInterceptor'
import noImage from "../assets/images/no-picture.png";
import BookCard from './BookCard';

export default function UserProfile({ mode }) {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(true);
  //determine user fetch  endpoint
  const userEndpoint = mode === 'self' ? '/user/me' : `/user/${id}`;

  useEffect(() => {
    setLoadingUser(true);
    api.get(userEndpoint)
      .then(res => {
        setUser(res.data.user);
        setLoadingUser(false);
      })
      .catch(err => {
        console.error('Error fetching user:', err);
        setLoadingUser(false);
      });
  }, [userEndpoint]);

  useEffect(() => {
    if (!user) return;
    setLoadingBooks(true);

    let booksEndpoint = '';
    if (activeTab === 'favorites') booksEndpoint = `/user/books/favorites/${user._id}`;
    else if (activeTab === 'currentlyReading') booksEndpoint = `/user/books/currentlyReading/${user._id}`;
    else if (activeTab === 'created') booksEndpoint = `/user/CreatedBooks/${user._id}`;

    api.get(booksEndpoint)
      .then(res => {
        if (activeTab === 'favorites') setBooks(res.data.favoriteBooks || []);
        else if (activeTab === 'currentlyReading') setBooks(res.data.readingBooks || []);
        else if (activeTab === 'created') setBooks(res.data.books || []);
        setLoadingBooks(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setBooks([]);
        setLoadingBooks(false);
      });
  }, [activeTab, user]);

  if (loadingUser) return <div>Loading user...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', padding: 24 }}>
      {/* Left panel: Books Section */}
      <div style={{ flex: 2, paddingRight: 16 }}>
        <BooksNavbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
        {loadingBooks ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>{getEmptyStateText(activeTab, user.firstname)}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {books.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* Right panel: User Info */}
      <div style={{ flex: 1, position: 'sticky', top: 24, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
        <UserInfoPanel user={user} showEmail={mode === 'self'} />
      </div>
    </div>
  );
}

function UserInfoPanel({ user, showEmail }) {
  return (
    <div>
      <img src={user.profileImage|| noImage} alt="Profile" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 16 }} />
      <h2>{user.firstname} {user.lastname}</h2>
      {showEmail && <p>Email: {user.email}</p>}
      <p>Birthday: {new Date(user.birthday).toLocaleDateString()}</p>
    </div>
  );
}

function BooksNavbar({ activeTab, setActiveTab, user }) {
  const tabs = [
    { key: 'favorites', label: 'Favorites' },
    { key: 'currentlyReading', label: 'Currently Reading' },
    { key: 'created', label: `Books added by ${user.firstname}` }
  ];

  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          style={{ padding: '8px 16px', borderBottom: activeTab === tab.key ? '2px solid black' : 'none', background: 'transparent', cursor: 'pointer' }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}


function getEmptyStateText(tab, firstname) {
  switch(tab) {
    case 'favorites': return 'No favorite books yet';
    case 'currentlyReading': return 'Not reading any book yet';
    case 'created': return `No books added by ${firstname} yet`;
    default: return '';
  }
}
