// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         title: 'Dr',
//         firstName: '',
//         lastName: '',
//         school: 'SCOPE',
//         employeeId: '',
//         designation: 'select',
//         facultyType: 'select',
//         engType: 'select',
//         joiningDate: '',
//         dob: '',
//         email: '',
//         officeNumber: '',
//         personalNumber: '',
//     });

//     const goBack = () => {
//         navigate(-1);
//     };

//     const [showFacultyType, setShowFacultyType] = useState(false);
//     const [showEngType, setShowEngType] = useState(false);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });

//         if (name === 'designation') {
//             setShowFacultyType(value === 'Faculty');
//             setShowEngType(value === 'Faculty' && formData.facultyType === 'Engineering');
//         } else if (name === 'facultyType') {
//             setShowEngType(value === 'Engineering');
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const queryString = new URLSearchParams(formData).toString();
//         navigate(`/review?${queryString}`); // Navigate to Review page with query parameters
//     };

//     return (
//         <div className="container mx-auto mt-8 p-8 bg-white shadow-md">
//             <center><h1 className="text-3xl font-bold mb-4 bg-green-500 text-white p-2 rounded">Signup Page</h1></center>
            
//             <form onSubmit={handleSubmit} className="space-y-4">
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
//                         <option value="dean">Dean</option>

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

//                 <div className="flex justify-between mt-6">
//                     <button type="button" onClick={goBack} className="bg-green-500 text-white px-4 py-2 rounded">Go Back</button>
//                     <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Signup;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        officeNumber: '',
        personalNumber: '',
    });

    const goBack = () => {
        navigate(-1);
    };

    const [showFacultyType, setShowFacultyType] = useState(false);
    const [showEngType, setShowEngType] = useState(false);
    const [showSchool, setShowSchool] = useState(false);

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

    return (
        <div className="container mx-auto mt-8 p-8 bg-white shadow-md">
            <center><h1 className="text-3xl font-bold mb-4 bg-green-500 text-white p-2 rounded">Signup Page</h1></center>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block mb-2">Title:</label>
                    <select id="title" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-black">
                        <option value="Dr">Dr</option>
                        <option value="Miss">Miss</option>
                        <option value="Mr">Mr</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="firstName" className="block mb-2">First Name:</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 border border-black" required />
                </div>

                <div>
                    <label htmlFor="lastName" className="block mb-2">Last Name:</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 border border-black" required />
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
                    <input type="text" id="employeeId" name="employeeId" value={formData.employeeId} pattern="\d{5}" title="Please enter 5 digits" onChange={handleChange} className="w-full p-2 border border-black" required />
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
                    <input type="date" id="joiningDate" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="w-full p-2 border border-black" required />
                </div>

                <div>
                    <label htmlFor="dob" className="block mb-2">Date of Birth:</label>
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border border-black" required />
                </div>

                <div>
                    <label htmlFor="email" className="block mb-2">Email (VITAP mail):</label>
                    <input type="email" id="email" name="email" value={formData.email} pattern=".+@vitap\.ac\.in" title="Please use VITAP email" onChange={handleChange} className="w-full p-2 border border-black" required />
                </div>

                <div>
                    <label htmlFor="officeNumber" className="block mb-2">Office Number:</label>
                    <input type="tel" id="officeNumber" name="officeNumber" value={formData.officeNumber} pattern="[0-9]{10}" title="Please enter a valid 10-digit number" onChange={handleChange} className="w-full p-2 border border-black" />
                </div>

                <div>
                    <label htmlFor="personalNumber" className="block mb-2">Personal Number:</label>
                    <input type="tel" id="personalNumber" name="personalNumber" value={formData.personalNumber} pattern="[0-9]{10}" title="Please enter a valid 10-digit number" onChange={handleChange} className="w-full p-2 border border-black" />
                </div>

                <div className="flex justify-between mt-6">
                    <button type="button" onClick={goBack} className="bg-green-500 text-white px-4 py-2 rounded">Go Back</button>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
