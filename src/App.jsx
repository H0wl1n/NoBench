import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import CreateProfile from './pages/CreateProfile';
import Players from './pages/Players';
import { UserContext } from './context';
import { useState, useEffect } from 'react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tf_user')); } catch { return null; }
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem('tf_user', JSON.stringify(currentUser));
    else localStorage.removeItem('tf_user');
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/posts/new" element={<CreatePost />} />
              <Route path="/players" element={<Players />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/register" element={<CreateProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
