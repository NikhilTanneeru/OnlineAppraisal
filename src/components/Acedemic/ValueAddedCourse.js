import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import UserContext from '../../UserContext';  // Adjust the path to where your UserContext is defined
import Swal from 'sweetalert2';

function ValueAddedCourse() {
  const [isValueAddedCourse, setIsValueAddedCourse] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [hoursRequired, setHoursRequired] = useState('');
  const [credits, setCredits] = useState('');
  const [description, setDescription] = useState('');
  const [syllabus, setSyllabus] = useState(null);
  const syllabusFile = useRef(null);

  const {user} = useContext(UserContext);


  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const clearFileInputs = () => {
    if (syllabusFile.current) {
      syllabusFile.current.value = null;
    }

    setCourseName('');
    setHoursRequired('');
    setCredits('');
    setDescription('');
    setSyllabus(null);

  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You need to be logged in to submit Value Added Course details');
      return;
    }
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('isValueAddedCourse', isValueAddedCourse);
        formData.append('courseName', courseName);
        formData.append('hoursRequired', hoursRequired);
        formData.append('credits', credits);
        formData.append('description', description);
        if (syllabus) formData.append('syllabus', syllabus);

        try {
          const response = await axios.post('/upload-valueAdd-details', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status === 200 || response.status === 201) {
            Swal.fire('Saved!', '', 'success');
            clearFileInputs(); // Clear file inputs and reset state
          } else {
            throw new Error('Failed to upload Hackathon details');
          }
        } catch (error) {
          console.error('Error uploading Expert Lecture details:', error);
          Swal.fire('Error', 'Failed to upload Hackathon details', 'error');
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };


  return (
    <div className='bg-gray-100 pb-4'>
      <h3 className="text-2xl flex font-bold justify-left pl-10 mt-4 p-2 border-t-2 border-stone-300">
        Value Added Course
      </h3>
      <div className="flex justify-left pl-10">
        <label>Is Value Added Course made?</label>
        <input
          type="checkbox"
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ml-2"
          checked={isValueAddedCourse}
          onChange={(e) => setIsValueAddedCourse(e.target.checked)}
        />
      </div>
      {isValueAddedCourse && (
        <div className="flex flex-col justify-left pl-10 mt-4">
          <label className="block w-full mb-2" style={{ width: '100%' }}>
            Name of Course
          </label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2" style={{ width: '100%' }}>
            Number of hours required
          </label>
          <input
            type="number"
            value={hoursRequired}
            onChange={(e) => setHoursRequired(e.target.value)}
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2" style={{ width: '100%' }}>
            Number of credits
          </label>
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2" style={{ width: '100%' }}>
            Enter a brief description about the course
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2" style={{ width: '100%' }}>
            Upload a syllabus copy
          </label>
          <input
            type="file"
            ref = {syllabusFile}
            onChange={(e) => handleFileChange(e, setSyllabus)}
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
           
          <div className="flex justify-left items-center mt-4 gap-9">
            <button className="bg-green-400 text-sm uppercase font-semibold rounded-full px-2 py-1" onClick={handleSubmit}>
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValueAddedCourse;