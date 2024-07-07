import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import UserContext from '../../UserContext'; // Adjust the path to where your UserContext is defined
import Swal from 'sweetalert2';

function Training({ onTrainingComplete }) {
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [duration, setDuration] = useState('');
  const [title, settitle] = useState('');
  const { user } = useContext(UserContext);
  const certificateInput = useRef(null); 
  const [certificate, setCertificate] = useState(null);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const calculateNoOfDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const clearFormInputs = () => {
    
    if (certificateInput.current) {
      certificateInput.current.value = null;
    }
    setFromDate('');
    setToDate('');
    setDuration('');
    settitle('');
    setCertificate(null);
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You need to be logged in to submit training details');
      return;
    }

    const noOfDays = calculateNoOfDays(fromDate, toDate);

    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('fromDate', fromDate);
        formData.append('toDate', toDate);
        formData.append('duration', duration);
        formData.append('title', title);
        formData.append('noOfDays', noOfDays);

        try {
          // Perform validation before making the request
          if (noOfDays > 5) {
            throw new Error('Number of days cannot be greater than 5');
          }
      
          if (!certificate) {
            throw new Error('Please upload the certificate');
          }
      
          if (fromDate === '' || toDate === '' || duration === '') {
            throw new Error('Please fill in all details');
          }
      
          // Make the Axios request after validation passes
          const response = await axios.post('/upload-training-details', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            },
          });
      
          if (response.status === 200 || response.status === 201) {
            Swal.fire('Request sent to Dean!', '', 'success');
            clearFormInputs();
            onTrainingComplete(); // Notify the parent component
          } else {
            throw new Error('Failed to upload training details');
          }
        } catch (error) {
          console.error('Error uploading training details:', error);
          Swal.fire('Error', error.message, 'error');
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  return (
    <>
      <h3 className="text-2xl flex font-bold justify-left pl-10 mt-4 p-2 border-t-2 border-stone-300">
        Training
      </h3>
      <div className="flex justify-left pl-10">
        <label>Is Training Completed?</label>
        <input
          type="checkbox"
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ml-2"
          checked={isTrainingCompleted}
          onChange={(e) => setIsTrainingCompleted(e.target.checked)}
        />
      </div>
      {isTrainingCompleted && (
        <div className="flex flex-col justify-left pl-10 mt-4">
          <label className="block w-full mb-2">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />

          <label className="block w-full mb-2">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />

          <label className="block w-full mb-2">Duration (in hours):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />

          <label className="block w-full mb-2">Topics Covered:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />

          <div className="flex justify-left items-center mt-4 gap-9">
            <label className="text-sm font-bold">Upload certificate</label>
            <input
              ref={certificateInput}
              className="text-sm font-semibold"
              type="file"
              onChange={(e) => handleFileChange(e, setCertificate)}
            />
          </div>

          <div className="flex justify-left items-center mt-4 gap-9">
            <button
              className="bg-green-400 text-sm uppercase font-semibold rounded-full px-2 py-1"
              onClick={handleSubmit}
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Training;
