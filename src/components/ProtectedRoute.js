// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;



// // src/components/ProtectedRoute.js
// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import UserContext from '../UserContext';

// const ProtectedRoute = ({ children }) => {
//   const { user } = useContext(UserContext);

//   if (!user) {
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtectedRoute;