import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/setup';
import axios from 'axios';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [employeeID, setEmployeeID] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        try {
            const response = await axios.post('/api/getUserByMobile', { employeeId: employeeID });
            console.log('API Response:', response.data);
            const userMobileNumber = response.data.mobileNumber;
            setMobileNumber(userMobileNumber);

            if (!userMobileNumber) {
                throw new Error('Mobile number not found');
            }

            const phoneNumber = `+91${userMobileNumber}`; // Assuming the country code is +91

            // Show confirmation alert
            const result = await Swal.fire({
                title: 'Confirm Mobile Number',
                text: `Is this your mobile number? ${phoneNumber}`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            });

            if (result.isConfirmed) {
                // Ensure recaptcha container is empty before rendering a new one
                document.getElementById('recaptcha-container').innerHTML = '';

                // Set up recaptcha
                const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'normal',
                    'callback': (response) => {
                        console.log('Recaptcha verified');
                    },
                    'expired-callback': () => {
                        console.log('Recaptcha expired');
                    }
                }, auth);

                // Make sure to call render
                await recaptchaVerifier.render();

                const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
                setConfirmationResult(confirmationResult);
                setOtpSent(true);
            }
        } catch (error) {
            Swal.fire('Error', 'Error sending OTP', 'error');
            console.error("Error sending OTP:", error);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            if (!confirmationResult) {
                throw new Error('Confirmation result is null');
            }
    
            const result = await confirmationResult.confirm(otp);
            const token = result.user.accessToken;
            localStorage.setItem('token', token);
    
            // Navigate to UpdatePassword with employeeID
            navigate('/updatepassword', { state: { employeeID } });
        } catch (error) {
            Swal.fire('Error', 'Error verifying OTP', 'error');
            console.error("Error verifying OTP", error);
        }
    };
    
      

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
                {!otpSent ? (
                    <>
                        <input
                            type="text"
                            placeholder="Enter Employee ID"
                            value={employeeID}
                            onChange={(e) => setEmployeeID(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <button
                            onClick={handleSendOtp}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        >
                            Send OTP
                        </button>
                        <div id="recaptcha-container" className="mt-4"></div>
                    </>
                ) : (
                    <>
                        <p className="mb-4">OTP sent to {mobileNumber}</p>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                        >
                            Verify OTP
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebase/setup'; // Ensure this is correct
// import axios from 'axios';
// import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
// import Swal from 'sweetalert2';

// const ForgotPassword = () => {
//     const [employeeID, setEmployeeID] = useState('');
//     const [mobileNumber, setMobileNumber] = useState('');
//     const [otpSent, setOtpSent] = useState(false);
//     const [otp, setOtp] = useState('');
//     const [confirmationResult, setConfirmationResult] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (window.recaptchaVerifier) {
//             window.recaptchaVerifier.clear();
//         }
//     }, []);

//     const handleSendOtp = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.post('/api/getUserByMobile', { employeeId: employeeID });
//             const userMobileNumber = response.data.mobileNumber;
//             setMobileNumber(userMobileNumber);

//             if (!userMobileNumber) {
//                 throw new Error('Mobile number not found');
//             }

//             const phoneNumber = `+91${userMobileNumber}`; // Assuming the country code is +91

//             const result = await Swal.fire({
//                 title: 'Confirm Mobile Number',
//                 text: `Is this your mobile number? ${phoneNumber}`,
//                 icon: 'question',
//                 showCancelButton: true,
//                 confirmButtonText: 'Yes',
//                 cancelButtonText: 'No'
//             });

//             if (result.isConfirmed) {
//                 if (window.recaptchaVerifier) {
//                     window.recaptchaVerifier.clear();
//                 }
//                 document.getElementById('recaptcha-container').innerHTML = '';

//                 window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
//                     'size': 'normal',
//                     'callback': (response) => {
//                         console.log('Recaptcha verified');
//                     },
//                     'expired-callback': () => {
//                         console.log('Recaptcha expired');
//                     }
//                 }, auth);

//                 await window.recaptchaVerifier.render();

//                 const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
//                 setConfirmationResult(confirmationResult);
//                 setOtpSent(true);
//             }
//         } catch (error) {
//             Swal.fire('Error', 'Error sending OTP: ' + error.message, 'error');
//             console.error("Error sending OTP:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleVerifyOtp = async () => {
//         setLoading(true);
//         try {
//             if (!confirmationResult) {
//                 throw new Error('Confirmation result is null');
//             }

//             const result = await confirmationResult.confirm(otp);
//             const token = result.user.accessToken;
//             localStorage.setItem('token', token);

//             navigate('/updatepassword', { state: { employeeID } });
//         } catch (error) {
//             Swal.fire('Error', 'Error verifying OTP: ' + error.message, 'error');
//             console.error("Error verifying OTP:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center h-screen bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//                 <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
//                 {!otpSent ? (
//                     <>
//                         <input
//                             type="text"
//                             placeholder="Enter Employee ID"
//                             value={employeeID}
//                             onChange={(e) => setEmployeeID(e.target.value)}
//                             className="w-full p-2 mb-4 border border-gray-300 rounded"
//                             disabled={loading}
//                         />
//                         <button
//                             onClick={handleSendOtp}
//                             className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
//                             disabled={loading}
//                         >
//                             {loading ? 'Sending OTP...' : 'Send OTP'}
//                         </button>
//                         <div id="recaptcha-container" className="mt-4"></div>
//                     </>
//                 ) : (
//                     <>
//                         <p className="mb-4">OTP sent to {mobileNumber}</p>
//                         <input
//                             type="text"
//                             placeholder="Enter OTP"
//                             value={otp}
//                             onChange={(e) => setOtp(e.target.value)}
//                             className="w-full p-2 mb-4 border border-gray-300 rounded"
//                             disabled={loading}
//                         />
//                         <button
//                             onClick={handleVerifyOtp}
//                             className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
//                             disabled={loading}
//                         >
//                             {loading ? 'Verifying OTP...' : 'Verify OTP'}
//                         </button>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ForgotPassword;
