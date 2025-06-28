import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdatePassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { employeeID } = location.state; // Get employeeID from state

    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.password !== passwordData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Passwords do not match',
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/update-password', {
                employeeID, // Sending employeeID and Password to backend
                password: passwordData.password
            });

            // Clear token and captcha from local storage
            localStorage.removeItem('token');
            // Assuming the captcha data is also stored in local storage
            localStorage.removeItem('recaptcha');
            
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message,
            }).then(() => {
                navigate('/');
            });

        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Failed to change password';
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Create your Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Enter New Password:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={passwordData.password} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                            required 
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password:</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            value={passwordData.confirmPassword} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" 
                            required 
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
