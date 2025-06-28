import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Footer from "../components/ui/Footer";

import UserContext from '../UserContext';

const Homepage = () => {
  const { user } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token && user) {
        try {
          const response = await axios.post(
            'http://localhost:5000/get-user',
            { employeeId: user.employeeId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserData(response.data);
        } catch (err) {
          console.error('Error fetching user:', err);
          setError(err.response ? err.response.data.message : 'Error fetching user data');
        }
      }
    };

    fetchUser();
  }, [user]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userData) {
    return <div className="text-gray-500">You are not logged in</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <p className="text-lg mb-6 font-bold w-full">
        <b>Welcome</b> <span className="text-4xl text-green-500 mx-2">{userData.firstName} {userData.lastName}</span>
      </p>
      <table className="w-full table-auto border-collapse border border-black">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-2 border border-black">Attribute</th>
            <th className="px-4 py-2 border border-black">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr>
            <td className="px-4 py-2 border border-black">Employee id:</td>
            <td className="px-4 py-2 border border-black">{userData.employeeId}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-black">Email:</td>
            <td className="px-4 py-2 border border-black">{userData.email}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-black">School:</td>
            <td className="px-4 py-2 border border-black">{userData.school}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-black">Designation:</td>
            <td className="px-4 py-2 border border-black">{userData.designation}</td>
          </tr>
          {userData.facultyType !== '' && (
            <tr>
              <td className="px-4 py-2 border border-black">Faculty Type:</td>
              <td className="px-4 py-2 border border-black">{userData.facultyType}</td>
            </tr>
          )}
          {userData.engType !== '' && (
            <tr>
              <td className="px-4 py-2 border border-black">Engineering Type:</td>
              <td className="px-4 py-2 border border-black">{userData.engType}</td>
            </tr>
          )}
          <tr>
            <td className="px-4 py-2 border border-black">Joining Date:</td>
            <td className="px-4 py-2 border border-black">{new Date(userData.joiningDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-black">Date of Birth:</td>
            <td className="px-4 py-2 border border-black">{new Date(userData.dob).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-black">Office Number:</td>
            <td className="px-4 py-2 border border-black">{userData.officeNumber}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 border border-black">Personal Number:</td>
            <td className="px-4 py-2 border border-black">{userData.personalNumber}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex items-center justify-center w-full h-[8vh] bg-stone-300 text-black fixed bottom-0 left-0 m-0 p-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;
