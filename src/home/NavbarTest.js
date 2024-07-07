// import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/navbar.css';

const Navbar = () => {
  // const [sideNavWidth, setSideNavWidth] = useState(0);

  // const openNav = () => {
  //   setSideNavWidth(250);
  // };

  // const closeNav = () => {
  //   setSideNavWidth(0);
  // };

  return (
    <>
      {/* <div id="topnav" className={`topnav ${sideNavWidth === 250 ? 'open' : ''}`}> */}
      <div id="topnav" className='topnav'>
        <div className="left">
          {/* <button className="openbtn" onClick={openNav}>&#9776; Menu</button> */}
          <Link to="/home" className="home-link">Home</Link>
          <Link to="/home/academic" className="about-link">Academic</Link>
          <Link to="/home/profile">Profile</Link>
          <Link to="#performance">Performance</Link>
          <Link to="#contact">Contact</Link>
        </div>
        <div className="center">
          {/* <img src={logo} alt="Logo" /> */}
        </div>
        {/* <div className="right">
          <div className="dropdown">
            <a className="dropbtn">&#9776; Dropdown</a>
            <div className="dropdown-content">
              <Link to="#link1">Link 1</Link>
              <Link to="#link2">Link 2</Link>
              <Link to="#link3">Link 3</Link>
            </div>
          </div>
        </div> */}
      </div>

      {/* <div id="mySidenav" className="sidenav" style={{ width: sideNavWidth }}>
        <button className="closebtn" onClick={closeNav}>&times;</button>
        <Link to="/home/profile">Profile</Link>
        <Link to="/home/academic">Academic</Link>
        <Link to="#performance">Performance</Link>
        <Link to="#contact">Contact</Link>
      </div> */}
    </>
  );
};

export default Navbar;
