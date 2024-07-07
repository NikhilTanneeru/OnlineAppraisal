// src/landingpage/Login.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import '../css/style.css'

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing errors before attempting login
    try {
      const response = await axios.post('http://localhost:5000/login', { employeeId, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user); // Set user in context
      navigate('/home/profile');
      console.log('Login Success')
    } catch (err) {
      console.error('Login failed:', err.response || err.message);
      setError(err.response ? 'Invalid credentials' : 'An error occurred. Please try again.');
      console.log('Try again with correct credentials')
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <header>
            <img src="logo-icon.png" alt="Icon" />
          </header>
          <div id="box">
            <h3>Login</h3>
            <hr /><br />
            <label htmlFor="uname">Employee ID:</label>
            <input
              type="text"
              id="uname"
              name="uname"
              placeholder="Enter Employee ID Here"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
            <label htmlFor="pass">Password:</label>
            <input
              type="password"
              id="pass"
              name="pass"
              placeholder="Enter Password Here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button id="sbmtbtn" onClick={handleLogin}>Login</button><br /><br />
            {error && <div className="error-message">{error}</div>}
            <hr /><br />
            <div id="bottom">
              <Link to="/forgotpassword">Forgot Password?</Link>
              <Link to="/signup">Sign Up</Link>
            </div>
          </div>
          <footer>
            <p>&copy; Copyright 2024, All Rights Reserved</p>
          </footer>
        </div>
      </form>
    </div>
  );
};

export default Login;