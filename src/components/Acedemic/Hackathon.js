import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import UserContext from '../../UserContext';  
import Swal from 'sweetalert2';
import api from '../../api';

function Hackathon() {
  const [isConducted, setIsConducted] = useState(true);
  const [fromDate, setDate] = useState('');
  const [toDate, setEndDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState(null);
  const [report, setReport] = useState(null);

  const [hasCoordinator, setHasCoordinator] = useState(false);
  const [coordinatorId, setCoordinatorId] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const { user } = useContext(UserContext);
  const posterInput = useRef(null); 
  const reportInput = useRef(null); 

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };
  
  const handleCoordinatorChange = async (e) => {
    setCoordinatorId(e.target.value);
    if (e.target.value) {
      try {
        const response = await api.get(`/get-employee-name/${e.target.value}`);
        if (response.status === 200) {
          setCoordinatorName(response.data.name);
        } else {
          setCoordinatorName('');
        }
      } catch (error) {
        console.error('Error fetching coordinator name:', error);
        setCoordinatorName('');
      }
    } else {
      setCoordinatorName('');
    }
  };


  const clearFileInputs = () => {
    if (posterInput.current) {
      posterInput.current.value = null;
    }
    if (reportInput.current) {
      reportInput.current.value = null;
    }
    setPoster(null);
    setReport(null);
    setDate('');
    setEndDate('');
    setFromTime('');
    setToTime('');
    setTitle('');
    
    setHasCoordinator(false);
    setCoordinatorId('');
    setCoordinatorName('');
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You need to be logged in to submit Hackathon details');
      return;
    }

    if (!fromDate || !toDate || !fromTime || !toTime || !title || !poster || !report || (hasCoordinator && !coordinatorId)) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
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
        formData.append('conducted', isConducted);
        formData.append('fromDate', fromDate);
        formData.append('toDate', toDate);
        formData.append('fromTime', fromTime);
        formData.append('toTime', toTime);
        formData.append('title', title);
        formData.append('hasCoordinator', hasCoordinator);
        formData.append('coordinatorId', coordinatorId);
       
        if (poster) formData.append('poster', poster);
        if (report) formData.append('report', report);

        try {
          const response = await api.post('/upload-hackathon-details', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status === 200 || response.status === 201) {
            Swal.fire('Request Sent to Dean!', '', 'success');
            clearFileInputs(); // Clear file inputs and reset state
          } else {
            throw new Error('Failed to upload Hackathon details');
          }
        } catch (error) {
          console.error('Error uploading Hackathon details:', error);
          Swal.fire('Error', 'Failed to upload Hackathon details', 'error');
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  return (
    <div className='bg-gray-100'>
      <h3 className="text-2xl flex font-bold justify-left pl-10 mt-4 p-2 border-t-2 border-stone-300">
        Hackathon
      </h3>
      <div className="flex justify-left pl-10">
        <label>Is Hackathon conducted?</label>
        <input
          type="checkbox"
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ml-2"
          checked={isConducted}
          onChange={(e) => setIsConducted(e.target.checked)}
        />
      </div>
      {isConducted && (
        <div className="flex flex-col justify-left pl-10 mt-4">
          <label className="block w-full mb-2">Hackathon Started Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />

          <label className="block w-full mb-2">Hackathon Ended Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setEndDate(e.target.value)}
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

          <label className="block w-full mb-2">Hackathon Conducted On:</label>
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

          <div className="flex justify-left items-center mt-4 gap-9 ">
            <label className="text-sm font-bold">Upload Poster</label>
            <input
              ref={posterInput}
              className="text-sm font-semibold"
              type="file"
              onChange={(e) => handleFileChange(e, setPoster)}
            />
          </div>
          <div className="flex justify-left items-center mt-4 gap-9 ">
            <label className="text-sm font-bold">Upload Report</label>
            <input
              ref={reportInput}
              className="text-sm font-semibold"
              type="file"
              onChange={(e) => handleFileChange(e, setReport)}
            />
          </div>

          <div className="flex justify-left items-center mt-4 gap-9">
              <label className="text-sm font-bold">Is there a coordinator?</label>
              <input
                type="radio"
                checked={hasCoordinator}
                onChange={() => setHasCoordinator(true)}
              />
              <label className="text-sm font-bold">Yes</label>
              <input
                type="radio"
                checked={!hasCoordinator}
                onChange={() => setHasCoordinator(false)}
              />
              <label className="text-sm font-bold">No</label>
          </div>
            {hasCoordinator && (
              <div className="flex flex-col justify-left pl-10 mt-4">
                <label className="block w-full mb-2">Coordinator Employee ID:</label>
                <input
                  type="text"
                  value={coordinatorId}
                  onChange={handleCoordinatorChange}
                  className="w-full p-2 pl-10 text-sm text-gray-700"
                  style={{
                    maxWidth: '70%',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #ccc',
                  }}
                />
                {coordinatorName && (
                  <div className="mt-2">
                    <strong>Coordinator Name:</strong> {coordinatorName}
                  </div>
                )}
              </div>
            )}

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
    </div>
  );
}

export default Hackathon;
