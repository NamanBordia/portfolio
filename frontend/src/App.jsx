import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Chat from './components/Chat';
import './App.css';

// API URL configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-1slt.onrender.com';
console.log('API URL:', API_URL); // Debug log

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching profile data...'); // Debug log
        // Fetch profile data
        const profileResponse = await fetch(`${API_URL}/api/profile`);
        console.log('Profile response:', profileResponse); // Debug log
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const profileData = await profileResponse.json();
        console.log('Profile data:', profileData); // Debug log
        setProfile(profileData);

        console.log('Fetching projects data...'); // Debug log
        // Fetch projects data
        const projectsResponse = await fetch(`${API_URL}/api/projects`);
        console.log('Projects response:', projectsResponse); // Debug log
        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects data');
        }
        const projectsData = await projectsResponse.json();
        console.log('Projects data:', projectsData); // Debug log
        setProjects(projectsData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home profile={profile} />} />
          <Route path="/about" element={<About profile={profile} />} />
          <Route path="/projects" element={<Projects projects={projects} />} />
          <Route path="/contact" element={<Contact API_URL={API_URL} />} />
          <Route path="/chat" element={<Chat API_URL={API_URL} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 
