import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login submission
    console.log('Login submitted:', formData);
    
    // Check for admin credentials
    if (formData.username === 'farm_solution_@_2026' && formData.password === 'admin@farm') {
      // Store admin authentication
      localStorage.setItem('authToken', 'admin-token');
      localStorage.setItem('user', JSON.stringify({ username: formData.username, role: 'admin' }));
      // Navigate to admin page
      navigate('/admin');
    } else {
      // For other users, you can add API call here
      // For now, show error message
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="back-button" onClick={handleBack} aria-label="Go back">
          <FaArrowLeft />
          <span>Back</span>
        </button>
        
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? <a href="#signup">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
