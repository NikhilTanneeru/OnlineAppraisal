import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../css/signup.css'

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: 'Dr',
        firstName: '',
        lastName: '',
        school: 'SCOPE',
        employeeId: '',
        designation: '',
        facultyType: '',
        engType: '',
        joiningDate: '',
        dob: '',
        email: '',
        state: "",
        city: "",
        district: "",
        pincode: "",
        officeNumber: '',
        personalNumber: '',
    });

    const goBack = () => {
        navigate(-1);
    };

    const [showFacultyType, setShowFacultyType] = useState(false);
    const [showEngType, setShowEngType] = useState(false);
    const [showSchool, setShowSchool] = useState(false);
    const [profileImage, setProfileImage] = useState('profile-icon.png');
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [pincodeValid, setPincodeValid] = useState(true);

    const apiKey = process.env.REACT_APP_COUNTRY_STATE_CITY_API_KEY;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'designation') {
            setShowFacultyType(value === 'Faculty');
            setShowEngType(value === 'Faculty' && formData.facultyType === 'Engineering');
            setShowSchool(value === 'dean' || (value === 'Faculty' && formData.facultyType === 'Engineering'));
        } else if (name === 'facultyType') {
            setShowEngType(value === 'Engineering');
        }
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        const queryString = new URLSearchParams(formData).toString();
        navigate(`/review?${queryString}`); // Navigate to Review page with query parameters
    };
      const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage('profile-icon.png');
  };

  
  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countryList = response.data.map(country => ({
          name: country.name.common,
          code: country.cca2
        })).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countryList = response.data.map(country => ({
          name: country.name.common,
          code: country.cca2
        })).sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      })
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countries.find(country => country.name === formData.country);
      if (selectedCountry) {
        axios.get(`https://api.countrystatecity.in/v1/countries/${selectedCountry.code}/states`, {
          headers: {
            'X-CSCAPI-KEY': apiKey
          }
        })
        .then(response => {
          const sortedStates = response.data.map(state => state.name).sort((a, b) => a.localeCompare(b));
          setStates(sortedStates);
        })
        .catch(error => console.error('Error fetching states:', error));
      }
    } else {
      setStates([]);
      setDistricts([]);
    }
  }, [formData.country, countries, apiKey]);

  useEffect(() => {
    if (formData.state) {
      const selectedCountry = countries.find(country => country.name === formData.country);
      if (selectedCountry) {
        axios.get(`https://api.countrystatecity.in/v1/countries/${selectedCountry.code}/states`, {
          headers: {
            'X-CSCAPI-KEY': apiKey
          }
        })
        .then(response => {
          const selectedState = response.data.find(state => state.name === formData.state);
          if (selectedState) {
            axios.get(`https://api.countrystatecity.in/v1/countries/${selectedCountry.code}/states/${selectedState.iso2}/cities`, {
              headers: {
                'X-CSCAPI-KEY': apiKey
              }
            })
            .then(response => {
              const sortedDistricts = response.data.map(district => district.name).sort((a, b) => a.localeCompare(b));
              setDistricts(sortedDistricts);
            })
            .catch(error => console.error('Error fetching districts:', error));
          }
        })
        .catch(error => console.error('Error fetching states:', error));
      }
    } else {
      setDistricts([]);
    }
  }, [formData.state, countries, apiKey]);

  const handleCountryChange = (e) => {
    setFormData({ ...formData, country: e.target.value, state: "", district: "" });
  };

  const handleStateChange = (e) => {
    setFormData({ ...formData, state: e.target.value, district: "" });
  };

  const verifyPincode = () => {
    const isValid = /^\d{6}$/.test(formData.pincode);
    setPincodeValid(isValid);
  };


    return (
        <div className="signup-container ">
            
            <form onSubmit={handleSubmit} className="space-y-4 signup-form">
            <center><h1 className="text-3xl font-bold mb-4 bg-blue-500 text-white p-2 rounded">Signup Page</h1></center>

            <div className="profile-image-container">
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                id="profileImageUpload"
                style={{ display: 'none' }} 
            />
            <label htmlFor="profileImageUpload">
                <img 
                src={profileImage} 
                alt="Profile" 
                className="profile-image" 
                onClick={() => document.getElementById('profileImageUpload').click()}
                />
            </label>
            <div className="upload-remove-container">
                <div className="upload-label bg-green-500 text-white" onClick={() => document.getElementById('profileImageUpload').click()}>Upload Image</div>
                {profileImage !== 'profile-icon.png' && (
                <div className="upload-label bg-red-500 text-white" onClick={handleRemoveImage}>
                    Remove
                </div>
                )}
            </div>
            </div>
                <div>
                    <label htmlFor="title" className=" mb-2">Title:</label>
                    <select id="title" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-black">
                        <option value="Dr">Dr</option>
                        <option value="Miss">Miss</option>
                        <option value="Mr">Mr</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="firstName" className="block mb-2">First Name:</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder='Enter your First Name Here' className="w-full p-2 border border-black" required />
                </div>

                <div>
                    <label htmlFor="lastName" className="block mb-2">Last Name:</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder='Enter your Last Name Here' className="w-full p-2 border border-black" required />
                </div>

                <div>
                    <label htmlFor="school" className="block mb-2">School:</label>
                    <select id="school" name="school" value={formData.school} onChange={handleChange} className="w-full p-2 border border-black">
                        <option value="SCOPE">SCOPE</option>
                        <option value="SENSE">SENSE</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="employeeId" className="block mb-2">Employee ID (5 digits):</label>
                    <input type="text" id="employeeId" name="employeeId" value={formData.employeeId} pattern="\d{5}" placeholder='Enter your Employee ID Here' title="Please enter 5 digits" onChange={handleChange} className="w-full p-2 border border-black" required />
                </div>

                <div>
                    <label htmlFor="designation" className="block mb-2">Designation:</label>
                    <select id="designation" name="designation" value={formData.designation} onChange={handleChange} className="w-full p-2 border border-black">
                        <option value="select">--Select--</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Staff">Staff</option>
                        <option value="Dean">Dean</option>
                    </select>
                </div>

                {showFacultyType && (
                    <div>
                        <label htmlFor="facultyType" className="block mb-2">Faculty Type:</label>
                        <select id="facultyType" name="facultyType" value={formData.facultyType} onChange={handleChange} className="w-full p-2 border border-black">
                            <option value="select">--Select--</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Non Engineering">Non Engineering</option>
                        </select>
                    </div>
                )}
                {showEngType && (
                    <div>
                        <label htmlFor="engType" className="block mb-2">Engineering Faculty Role:</label>
                        <select id="engType" name="engType" value={formData.engType} onChange={handleChange} className="w-full p-2 border border-black">
                            <option value="select">--Select--</option>
                            <option value="Academic">Academic</option>
                            <option value="Research">Research</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                )}

                {showSchool && (
                    <div>
                        <label htmlFor="school" className="block mb-2">School:</label>
                        <select id="school" name="school" value={formData.school} onChange={handleChange} className="w-full p-2 border border-black">
                            <option value="SCOPE">SCOPE</option>
                            <option value="SENSE">SENSE</option>
                        </select>
                    </div>
                )}

                <div>
                    <label htmlFor="joiningDate" className="block mb-2">Date of Joining:</label>
                    <input type="date" id="joiningDate" name="joiningDate" value={formData.joiningDate} onChange={handleChange} placeholder='Enter your Date of Joining Here' className="w-full p-2 border border-black" required />
                </div>

                <div>
                    <label htmlFor="dob" className="block mb-2">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} placeholder='Enter your Date of Birth Here' className="w-full p-2 border border-black" required />
                </div>

                <div>
                    <label htmlFor="email" className="block mb-2">Email (VITAP mail):</label>
                    <input type="email" id="email" name="email" placeholder='Enter your VIT-AP Mail ID here' value={formData.email} pattern=".+@vitap\.ac\.in" title="Please use VITAP email" onChange={handleChange} className="w-full p-2 border border-black" required />
                </div>
                <div>
                    <label>Country:</label>
                    <select name="country" value={formData.country} onChange={handleCountryChange} className="w-full p-2 border border-black" required>
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                        <option key={country.code} value={country.name}>{country.name}</option>
                        ))}
                    </select>
                    
                </div>
                <div>
                    <label>
                    State:
                    <select name="state" value={formData.state} onChange={handleStateChange} className="w-full p-2 border border-black" required>
                        <option value="">Select State</option>
                        {states.map((state, index) => (
                        <option key={index} value={state}>{state}</option>
                        ))}
                    </select>
                    </label>
                </div>
                <div>
                    <label>
                    District:
                    <select name="district" value={formData.district} onChange={handleChange} className="w-full p-2 border border-black" required>
                        <option value="">Select District</option>
                        {districts.map((district, index) => (
                        <option key={index} value={district}>{district}</option>
                        ))}
                    </select>
                    </label>
                </div>
                
                <div>
                    <label>
                    Pincode:
                    <input type="text" placeholder='Enter your Pincode' name="pincode" value={formData.pincode} onChange={handleChange}  onBlur={verifyPincode} className="w-full p-2 border border-black" required />
                    {!pincodeValid && <span className="invalid-pincode">Invalid pincode</span>}
                    </label>
                </div>

                <div>
                    <label htmlFor="officeNumber" className="block mb-2">Office Number:</label>
                    <input type="tel" id="officeNumber" placeholder='Enter your Office Number Here' name="officeNumber" value={formData.officeNumber} pattern="[0-9]{10}" title="Please enter a valid 10-digit number" onChange={handleChange} className="w-full p-2 border border-black" />
                </div>

                <div>
                    <label htmlFor="personalNumber" className="block mb-2">Personal Number:</label>
                    <input type="tel" id="personalNumber" placeholder='Enter your Personal Number Here' name="personalNumber" value={formData.personalNumber} pattern="[0-9]{10}" title="Please enter a valid 10-digit number" onChange={handleChange} className="w-full p-2 border border-black" />
                </div>

                <div className="flex justify-center mx-3 gap-4 mt-6">
                    <button type="button" onClick={goBack} className="bg-red-500 text-white px-4 py-2 rounded">Go Back</button>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default Signup;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../css/signup.css';
// require('dotenv').config();

// const Signup = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         title: 'Dr',
//         firstName: '',
//         lastName: '',
//         school: 'SCOPE',
//         employeeId: '',
//         designation: '',
//         facultyType: '',
//         engType: '',
//         joiningDate: '',
//         dob: '',
//         email: '',
//         officeNumber: '',
//         personalNumber: '',
//         country: '',
//         state: '',
//         city: '',
//         district: '',
//         pincode: '',
//     });

//     const [countries, setCountries] = useState([]);
//     const [states, setStates] = useState([]);
//     const [districts, setDistricts] = useState([]);
//     const [pincodeValid, setPincodeValid] = useState(true);
//     const [profileImage, setProfileImage] = useState('profile-icon.png');
//     const apiKey = process.env.REACT_APP_COUNTRY_STATE_CITY_API_KEY;

//     const goBack = () => {
//         navigate(-1);
//     };

//     const [showFacultyType, setShowFacultyType] = useState(false);
//     const [showEngType, setShowEngType] = useState(false);
//     const [showSchool, setShowSchool] = useState(false);

//     useEffect(() => {
//         // Fetch the list of countries with their codes
//         axios.get('https://restcountries.com/v3.1/all')
//             .then(response => {
//                 const countryList = response.data.map(country => ({
//                     name: country.name.common,
//                     code: country.cca2
//                 })).sort((a, b) => a.name.localeCompare(b.name));
//                 setCountries(countryList);
//             })
//             .catch(error => console.error('Error fetching countries:', error));
//     }, []);
    
//     useEffect(() => {
//         if (formData.country) {
//             // Find the selected country's code
//             const selectedCountry = countries.find(country => country.name === formData.country);
//             if (selectedCountry) {
//                 axios.get(`https://api.countrystatecity.in/v1/countries/${selectedCountry.code}/states`, {
//                     headers: {
//                         'X-CSCAPI-KEY': apiKey
//                     }
//                 })
//                     .then(response => {
//                         const sortedStates = response.data.map(state => state.name).sort((a, b) => a.localeCompare(b));
//                         setStates(sortedStates);
//                     })
//                     .catch(error => console.error('Error fetching states:', error));
//             }
//         } else {
//             setStates([]);
//             setDistricts([]);
//         }
//     }, [formData.country, apiKey, countries]);
    
//     useEffect(() => {
//         if (formData.state) {
//             // Find the selected state's code
//             const selectedCountry = countries.find(country => country.name === formData.country);
//             if (selectedCountry) {
//                 axios.get(`https://api.countrystatecity.in/v1/countries/${selectedCountry.code}/states`, {
//                     headers: {
//                         'X-CSCAPI-KEY': apiKey
//                     }
//                 })
//                     .then(response => {
//                         const selectedState = response.data.find(state => state.name === formData.state);
//                         if (selectedState) {
//                             axios.get(`https://api.countrystatecity.in/v1/countries/${selectedCountry.code}/states/${selectedState.iso2}/cities`, {
//                                 headers: {
//                                     'X-CSCAPI-KEY': apiKey
//                                 }
//                             })
//                                 .then(response => {
//                                     const sortedDistricts = response.data.map(district => district.name).sort((a, b) => a.localeCompare(b));
//                                     setDistricts(sortedDistricts);
//                                 })
//                                 .catch(error => console.error('Error fetching districts:', error));
//                         }
//                     })
//                     .catch(error => console.error('Error fetching states:', error));
//             }
//         } else {
//             setDistricts([]);
//         }
//     }, [formData.state, apiKey, countries]);
    

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });

//         if (name === 'designation') {
//             setShowFacultyType(value === 'Faculty');
//             setShowEngType(value === 'Faculty' && formData.facultyType === 'Engineering');
//             setShowSchool(value === 'dean' || (value === 'Faculty' && formData.facultyType === 'Engineering'));
//         } else if (name === 'facultyType') {
//             setShowEngType(value === 'Engineering');
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const queryString = new URLSearchParams(formData).toString();
//         navigate(`/review?${queryString}`); // Navigate to Review page with query parameters
//     };

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setProfileImage(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleRemoveImage = () => {
//         setProfileImage('profile-icon.png');
//     };

//     const verifyPincode = () => {
//         const isValid = /^\d{6}$/.test(formData.pincode);
//         setPincodeValid(isValid);
//     };

//     return (
//         <div className="container mx-auto mt-8 p-8 bg-white shadow-md">
//             <center><h1 className="text-3xl font-bold mb-4 bg-green-500 text-white p-2 rounded">Signup Page</h1></center>
            
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="profile-image-container">
//                     <input 
//                         type="file" 
//                         accept="image/*" 
//                         onChange={handleImageUpload} 
//                         id="profileImageUpload"
//                         style={{ display: 'none' }} 
//                     />
//                     <label htmlFor="profileImageUpload">
//                         <img 
//                             src={profileImage} 
//                             alt="Profile" 
//                             className="profile-image" 
//                             onClick={() => document.getElementById('profileImageUpload').click()}
//                         />
//                     </label>
//                     <div className="upload-remove-container">
//                         <div className="upload-label bg-green-500 text-white" onClick={() => document.getElementById('profileImageUpload').click()}>Upload Image</div>
//                         {profileImage !== 'profile-icon.png' && (
//                             <div className="upload-label bg-red-500 text-white" onClick={handleRemoveImage}>
//                                 Remove
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div>
//                     <label htmlFor="title" className="block mb-2">Title:</label>
//                     <select id="title" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-black">
//                         <option value="Dr">Dr</option>
//                         <option value="Miss">Miss</option>
//                         <option value="Mr">Mr</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label htmlFor="firstName" className="block mb-2">First Name:</label>
//                     <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border border-black" required />
//                 </div>

//                 <div>
//                     <label htmlFor="lastName" className="block mb-2">Last Name:</label>
//                     <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border border-black" required />
//                 </div>

//                 <div>
//                     <label htmlFor="school" className="block mb-2">School:</label>
//                     <select id="school" name="school" value={formData.school} onChange={handleChange} className="w-full p-2 border border-black">
//                         <option value="SCOPE">SCOPE</option>
//                         <option value="SENSE">SENSE</option>
//                     </select>
//                 </div>

//                 <div>
//                     <label htmlFor="employeeId" className="block mb-2">Employee ID (5 digits):</label>
//                     <input type="text" id="employeeId" name="employeeId" value={formData.employeeId} pattern="\d{5}" title="Please enter 5 digits" onChange={handleChange} className="w-full p-2 border border-black" required />
//                 </div>

//                 <div>
//                     <label htmlFor="designation" className="block mb-2">Designation:</label>
//                     <select id="designation" name="designation" value={formData.designation} onChange={handleChange} className="w-full p-2 border border-black">
//                         <option value="select">--Select--</option>
//                         <option value="Faculty">Faculty</option>
//                         <option value="Staff">Staff</option>
//                         <option value="Dean">Dean</option>
//                     </select>
//                 </div>

//                 {showFacultyType && (
//                     <div>
//                         <label htmlFor="facultyType" className="block mb-2">Faculty Type:</label>
//                         <select id="facultyType" name="facultyType" value={formData.facultyType} onChange={handleChange} className="w-full p-2 border border-black">
//                             <option value="select">--Select--</option>
//                             <option value="Engineering">Engineering</option>
//                             <option value="Non Engineering">Non Engineering</option>
//                         </select>
//                     </div>
//                 )}

//                 {showEngType && (
//                     <div>
//                         <label htmlFor="engType" className="block mb-2">Engineering Faculty Role:</label>
//                         <select id="engType" name="engType" value={formData.engType} onChange={handleChange} className="w-full p-2 border border-black">
//                             <option value="select">--Select--</option>
//                             <option value="Academic">Academic</option>
//                             <option value="Research">Research</option>
//                             <option value="Admin">Admin</option>
//                         </select>
//                     </div>
//                 )}

//                 {showSchool && (
//                     <div>
//                         <label htmlFor="school" className="block mb-2">School:</label>
//                         <select id="school" name="school" value={formData.school} onChange={handleChange} className="w-full p-2 border border-black">
//                             <option value="SCOPE">SCOPE</option>
//                             <option value="SENSE">SENSE</option>
//                         </select>
//                     </div>
//                 )}

//                 <div>
//                     <label htmlFor="joiningDate" className="block mb-2">Date of Joining:</label>
//                     <input type="date" id="joiningDate" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full p-2 border border-black" required />
//                 </div>

//                 <div>
//                     <label htmlFor="dob" className="block mb-2">Date of Birth:</label>
//                     <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border border-black" required />
//                 </div>

//                 <div>
//                     <label htmlFor="email" className="block mb-2">Email (VITAP mail):</label>
//                     <input type="email" id="email" name="email" value={formData.email} pattern=".+@vitap\.ac\.in" title="Please use VITAP email" onChange={handleChange} className="w-full p-2 border border-black" required />
//                 </div>

//                 <div>
//                     <label htmlFor="officeNumber" className="block mb-2">Office Number:</label>
//                     <input type="tel" id="officeNumber" name="officeNumber" value={formData.officeNumber} pattern="[0-9]{10}" title="Please enter a valid 10-digit number" onChange={handleChange} className="w-full p-2 border border-black" />
//                 </div>

//                 <div>
//                     <label htmlFor="personalNumber" className="block mb-2">Personal Number:</label>
//                     <input type="tel" id="personalNumber" name="personalNumber" value={formData.personalNumber} pattern="[0-9]{10}" title="Please enter a valid 10-digit number" onChange={handleChange} className="w-full p-2 border border-black" />
//                 </div>

//                 <div>
//                     <label htmlFor="country" className="block mb-2">Country:</label>
//                     <select id="country" name="country" value={formData.country} onChange={handleChange} className="w-full p-2 border border-black">
//                         <option value="">--Select Country--</option>
//                         {countries.map((country) => (
//                             <option key={country.code} value={country.name}>{country.name}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <label htmlFor="state" className="block mb-2">State:</label>
//                     <select id="state" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border border-black">
//                         <option value="">--Select State--</option>
//                         {states.map((state) => (
//                             <option key={state} value={state}>{state}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <label htmlFor="district" className="block mb-2">District:</label>
//                     <select id="district" name="district" value={formData.district} onChange={handleChange} className="w-full p-2 border border-black">
//                         <option value="">--Select District--</option>
//                         {districts.map((district) => (
//                             <option key={district} value={district}>{district}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <label htmlFor="pincode" className="block mb-2">Pincode:</label>
//                     <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={(e) => { handleChange(e); verifyPincode(e); }} className="w-full p-2 border border-black" required />
//                     {!pincodeValid && <p className="text-red-500">Invalid Pincode</p>}
//                 </div>

//                 <div className="flex justify-between mt-6">
//                     <button type="button" onClick={goBack} className="bg-green-500 text-white px-4 py-2 rounded">Go Back</button>
//                     <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Signup;
