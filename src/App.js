// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './landingpage/Login';
import Signup from './landingpage/Signup';
import Review from './landingpage/Review';
import PasswordPage from './landingpage/CreatePassword';
import ProfilePage from './home/Profile';
import Layout from './home/Layout';
import Homepage from './home/Homepage';
import Academic from './home/Academic';
import Research from './home/Research';
import Performance from './home/Performance';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './landingpage/ForgotPassword';
import { UserProvider } from './UserContext';
import PointDisplay from './home/PointDisplay';
import RequestsDisplay from './home/RequestsDisplay';
import Submissions from './home/Submissions'

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/review" element={<Review />} />
            <Route path="/createpassword" element={<PasswordPage />} />
            <Route path="/forgotpassword" element={<ForgotPassword/>} />
            <Route path="/home" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="" element={<ProfilePage />} />
              <Route path="academic" element={<Academic />} />
              <Route path="profile" element={<Homepage />} />
              <Route path="research" element={<Research />} />
              <Route path="performance" element={<Performance />} />
              <Route path="pointsearned" element={<PointDisplay />} />
              <Route path='requests' element ={<RequestsDisplay/>} />
              <Route path='submissions' element ={<Submissions/>} />

            </Route>
            <Route path="/logout" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
