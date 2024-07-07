// // src/home/Layout.js
// import React, { useState } from 'react';
// import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar';

// const Layout = () => {
//     const [sideNavWidth, setSideNavWidth] = useState(0);

//     return (
//         <div>
//             <Navbar sideNavWidth={sideNavWidth} setSideNavWidth={setSideNavWidth} />
//             <div id="main" style={{ marginLeft: sideNavWidth }}>
//                 <Outlet />
//             </div>
//         </div>
//     );
// };

// export default Layout;



// src/home/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div>
            <Navbar />
            <div id="main" >
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;