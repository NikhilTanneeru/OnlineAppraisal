import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Review = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const data = {
            title: params.get('title'),
            firstName: params.get('firstName'),
            lastName: params.get('lastName'),
            school: params.get('school'),
            employeeId: params.get('employeeId'),
            designation: params.get('designation'),
            facultyType: params.get('facultyType'),
            engType: params.get('engType'),
            joiningDate: params.get('joiningDate'),
            dob: params.get('dob'),
            email: params.get('email'),
            officeNumber: params.get('officeNumber'),
            personalNumber: params.get('personalNumber')
        };
        setFormData(data);
    }, [location.search]);

    const goBack = () => {
        navigate(-1);
    };

    const handleSaveAndContinue = () => {
        axios.post('http://localhost:5000/signup', formData)
            .then((response) => {
                console.log('Signup Response:', response);
                navigate('/createpassword', { state: { email: formData.email } });
            })
            .catch((error) => {
                console.error('Signup Error:', error);
            });
    };

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="container mx-auto mt-8 p-8 bg-white shadow-md">
            <h2 className="text-3xl font-bold mb-4 bg-green-500 text-white p-2 rounded">Review Information</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <tbody>
                        {Object.entries(formData).map(([key, value]) => (
                            <tr key={key} className="border-b border-gray-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{capitalize(key)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between">
                <button onClick={goBack} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Go Back</button>
                <button onClick={handleSaveAndContinue} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Continue</button>
            </div>
        </div>
    );
};

export default Review;
