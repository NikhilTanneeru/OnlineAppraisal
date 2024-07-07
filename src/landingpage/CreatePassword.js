// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const CreatePassword = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const email = location.state?.email;
//     console.log(email)

//     // useEffect(() => {
//     //     console.log('Email in CreatePassword:', email);
//     // }, [email]);

//     const [passwordData, setPasswordData] = useState({
//         password: '',
//         confirmPassword: ''
//     });

//     const [passwordCreated, setPasswordCreated] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setPasswordData({ ...passwordData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (passwordData.password !== passwordData.confirmPassword) {
//             alert('Passwords do not match');
//             return;
//         }

//         try {
//             const response = await axios.post('http://localhost:5000/create-password', { email, password: passwordData.password });
//             console.log(response);
//             setPasswordCreated(true);
//             setTimeout(() => {
//                 navigate('/');
//             }, 3000);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     return (
//         <div className="container mx-auto mt-8 p-8 bg-white shadow-md">
//             <center><h2 className="text-3xl font-bold mb-4 bg-green-500 text-white p-2 rounded">Create your Password</h2></center>
//             <hr className="mb-4" />
            // <form id="signupForm" onSubmit={handleSubmit} className="space-y-4">
            //     <div>
            //         <label htmlFor="password" className="block mb-2 w-full">Enter New Password:</label>
            //         <input type="password" id="password" name="password" value={passwordData.password} onChange={handleChange} className="w-full p-2 border border-black" required />
            //     </div>

            //     <div>
            //         <label htmlFor="confirmPassword" className="block mb-2">Confirm Password:</label>
            //         <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-black" required />
            //     </div>

            //     <center><button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button></center>
            // </form>
            
//             {passwordCreated && (
//                 <div className="popup mt-4 p-4 bg-green-100 border border-green-300 rounded">
//                     <p>Password created successfully!</p>
//                     <center><button className="mt-2"><Link to='/' className="text-green-500">Go to Login Page</Link></button></center>
//                     <p className="mt-2"><b>Note: </b> You will be redirected to Home Page in 3 seconds</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CreatePassword;


import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreatePassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

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
            const response = await axios.post('http://localhost:5000/create-password', { email, password: passwordData.password });
            console.log(response);

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Password created successfully!\nRedirecting to Login Page',
            }).then(() => {
                navigate('/');
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to create password',
            });
        }
    };

    return (
        <div className="container" id='box1'>
            <center><h2 id="heading">Create your Password</h2></center>
            <hr /><br />
            <form id="signupForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block mb-2 w-full">Enter New Password:</label>
                    <input type="password" id="password" name="password" value={passwordData.password} onChange={handleChange} className="w-full p-2 border border-black" required />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block mb-2">Confirm Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-black" required />
                </div>

                <center><button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button></center>
            </form>
        </div>
    );
};

export default CreatePassword;
