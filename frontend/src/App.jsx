import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Chat from './components/Chat';
import './App.css';

// API URL configuration - use Render backend URL in production
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000'
  : 'https://portfolio-backend-1slt.onrender.com';
console.log('Current API URL:', API_URL); // Debug log

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Test API connection first
        console.log('Testing API connection...');
        const testResponse = await fetch(`${API_URL}/health`);
        console.log('API health check response:', await testResponse.json());

        console.log('Fetching profile data from:', `${API_URL}/api/profile`);
        // Fetch profile data
        const profileResponse = await fetch(`${API_URL}/api/profile`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        console.log('Profile response status:', profileResponse.status);
        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error('Profile error response:', errorText);
          throw new Error(`Failed to fetch profile data: ${profileResponse.status} - ${errorText}`);
        }
        
        const profileData = await profileResponse.json();
        console.log('Profile data received:', profileData);
        setProfile(profileData);

        console.log('Fetching projects data from:', `${API_URL}/api/projects`);
        // Fetch projects data
        const projectsResponse = await fetch(`${API_URL}/api/projects`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        console.log('Projects response status:', projectsResponse.status);
        if (!projectsResponse.ok) {
          const errorText = await projectsResponse.text();
          console.error('Projects error response:', errorText);
          throw new Error(`Failed to fetch projects data: ${projectsResponse.status} - ${errorText}`);
        }
        
        const projectsData = await projectsResponse.json();
        console.log('Projects data received:', projectsData);
        setProjects(projectsData || []); // Backend returns the array directly

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
    return (
      <div className="loading">
        <h2>Loading...</h2>
        <p>Please wait while we fetch your data...</p>
        <p>API URL: {API_URL}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <p>API URL: {API_URL}</p>
        <p>Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
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