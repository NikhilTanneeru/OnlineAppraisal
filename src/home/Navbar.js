import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../css/navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [userDesignation, setUserDesignation] = useState('');

  useEffect(() => {
    // Fetch user designation from localStorage or API upon component mount
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserDesignation(user.designation);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'No, stay',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token'); // Clear the token
        localStorage.removeItem('user');
        navigate('/', { replace: true }); // Redirect to the root URL and replace the current entry
        console.log('Logout Success');
      }
    });
  };

  return (
    <>
      <div id="topnav" className="topnav">
        <div className="left">
          <Link to="/home/profile" className="home-link">Home</Link>
          <Link to="/home/academic" className="about-link">Academic</Link>
          <Link to="/home/performance">Performance</Link>
          <Link to="/home/research">Research</Link>
          <Link to="/home/pointsearned">Points Earned</Link>
          {userDesignation === 'Dean' && <Link to="/home/requests">Requests</Link>}
        </div>
        <div className="cntr">
          <img src="/logo-icon.png" alt="Icon" id='logo' />
        </div>
        <div className="right">
          <button onClick={handleLogout} className="logout-link">Logout</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;