// import React, { useState } from 'react';
// import '../css/profile.css';
// // import logo from 'logo-icon.png';

// const ProfilePage = () => {
  // const [sideNavWidth, setSideNavWidth] = useState(0);
  // const [mainMarginLeft, setMainMarginLeft] = useState(0);

  // const openNav = () => {
  //   setSideNavWidth(250);
  //   setMainMarginLeft(250);
  // };

  // const closeNav = () => {
  //   setSideNavWidth(0);
  //   setMainMarginLeft(0);
  // };

//   return (
//     <div>
      // <div id="topnav" className={`topnav ${sideNavWidth === 250 ? 'open' : ''}`}>
      //   <div className="left">
      //     <button className="openbtn" onClick={openNav}>&#9776; Menu</button>
      //     <a href="#home" className="home-link">Home</a>
      //     <a href="#about" className="about-link">About</a>
      //   </div>
      //   <div className="center">
      //     {/* <img src={logo} alt="Logo" /> */}
      //   </div>
      //   <div className="right">
      //     <div className="dropdown">
      //       <button className="dropbtn">Dropdown</button>
      //       <div className="dropdown-content">
      //         <a href="#link1">Link 1</a>
      //         <a href="#link2">Link 2</a>
      //         <a href="#link3">Link 3</a>
      //       </div>
      //     </div>
      //   </div>
      // </div>
      
      // <div id="mySidenav" className="sidenav" style={{ width: sideNavWidth }}>
      //   <button className="closebtn" onClick={closeNav}>&times;</button>
      //   <a href="#profile">Profile</a>
      //   <a href="#services">Academic</a>
      //   <a href="#clients">Performance</a>
      //   <a href="#contact">Contact</a>
      // </div>
      
//       <div id="main" style={{ marginLeft: mainMarginLeft }}>
//         <h2>Profile Page</h2>
//         <p>Welcome to the profile page.</p>
//         <h3>Your Information:</h3>
//         <p>Name: John Doe</p>
//         <p>Email: john.doe@example.com</p>
//         <p>Bio: A short bio about John Doe...</p>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;


// src/components/ProfilePage.js

import React from 'react';
import Navbar from './Navbar';
import Homepage from './Homepage';
import '../css/profile.css';

const ProfilePage = () => {

  return (
    <div>
      <Navbar />
      <Homepage/>
    </div>
  );
}

export default ProfilePage;
