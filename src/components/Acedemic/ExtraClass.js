import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../../UserContext'; // Adjust the path to where your UserContext is defined
import Swal from 'sweetalert2';

function ExtraClass() {
  const [isExtraClass, setIsExtraClass] = useState(true);
  const [date, setDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [title, setTitle] = useState('');
  const { user } = useContext(UserContext);

  const clearFormInputs = () => {
    setDate('');
    setFromTime('');
    setToTime('');
    setTitle('');
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You need to be logged in to submit extra class details');
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
        formData.append('date', date);
        formData.append('fromTime', fromTime);
        formData.append('toTime', toTime);
        formData.append('title', title);
  
        try {
          const response = await axios.post('/upload-extra-class-details', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });
  
          if (response.status === 200) {
            Swal.fire('Request sent to Dean!', '', 'success');
            clearFormInputs(); // Clear form inputs and reset state
          } else {
            throw new Error('Failed to upload extra class details');
          }
        } catch (error) {
          console.error('Error uploading extra class details:', error);
          Swal.fire('Error', 'Failed to upload extra class details', 'error');
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  

  return (
    <>
      <h3 className="text-2xl flex font-bold justify-left pl-10 mt-4 p-2 border-t-2 border-stone-300">
        Extra Class
      </h3>
      <div className="flex justify-left pl-10">
        <label>Is Extra Class taken?</label>
        <input
          type="checkbox"
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ml-2"
          checked={isExtraClass}
          onChange={(e) => setIsExtraClass(e.target.checked)}
        />
      </div>
      {isExtraClass && (
        <div className="flex flex-col justify-left pl-10 mt-4">
          <label className="block w-full mb-2">Date of Extra Class:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />

          <label className="block w-full mb-2">From Time:</label>
          <input
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2">To Time:</label>
          <input
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />

          <label className="block w-full mb-2">Topic Covered:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />

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

export default ExtraClass;
