import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
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
    <div className="max-w-4xl mx-auto p-4 pt-6 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-4">Profile Page</h1>
      <p className="text-lg mb-6 w-full">Welcome <b>{userData.firstName} {userData.lastName}</b></p>
      <table className="w-full table-auto">
        <tbody>
          <tr>
            <td className="px-4 py-2">Employee id:</td>
            <td className="px-4 py-2">{userData.employeeId}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Email:</td>
            <td className="px-4 py-2">{userData.email}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">School:</td>
            <td className="px-4 py-2">{userData.school}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Designation:</td>
            <td className="px-4 py-2">{userData.designation}</td>
          </tr>
          {
            userData.facultyType!=='' &&
            <tr>
              <td className="px-4 py-2">Faculty Type:</td>
              <td className="px-4 py-2">{userData.facultyType}</td>
          </tr>
            
          }

          {
             userData.engType!=='' &&
             <tr>
                <td className="px-4 py-2">Engineering Type:</td>
                <td className="px-4 py-2">{userData.engType}</td>
            </tr>

          }
          <tr>
            <td className="px-4 py-2">Joining Date:</td>
            <td className="px-4 py-2">{new Date(userData.joiningDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Date of Birth:</td>
            <td className="px-4 py-2">{new Date(userData.dob).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Office Number:</td>
            <td className="px-4 py-2">{userData.officeNumber}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Personal Number:</td>
            <td className="px-4 py-2">{userData.personalNumber}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Homepage;
