import React, { useState, useContext, useRef } from 'react';
import api from '../../api';
import UserContext from '../../UserContext'; // Adjust the path to where your UserContext is defined
import Swal from 'sweetalert2';

function MOOC() {
  const [isChecked, setIsChecked] = useState(true);
  const detailsInput = useRef(null); // Ref for details file input
  const [details, setDetails] = useState(null);
  const [title, setTitle] = useState('');
  const [hasCoordinator, setHasCoordinator] = useState(false);
  const [coordinatorId, setCoordinatorId] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const { user } = useContext(UserContext);

  function handleIsChecked() {
    setIsChecked(!isChecked);
  }

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const clearFileInputs = () => {
    if (detailsInput.current) {
      detailsInput.current.value = null;
    }
    setDetails(null);
    setHasCoordinator(false);
    setCoordinatorId('');
    setCoordinatorName('');
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

  const handleSubmit = async () => {
    if (!user) {
      alert('You need to be logged in to submit MOOC details');
      return;
    }
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: "Don't save",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (hasCoordinator && !coordinatorName) {
          Swal.fire('Error', 'Invalid Coordinator ID', 'error');
          return;
        }

        const formData = new FormData();
        formData.append('checked', isChecked);
        formData.append('title', title);
        formData.append('hasCoordinator', hasCoordinator);
        formData.append('coordinatorId', coordinatorId);
        if (details) formData.append('details', details);

        try {
          const response = await api.post('/upload-mooc-details', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 200 || response.status === 201) {
            Swal.fire('Saved!', '', 'success');
            clearFileInputs(); // Clear file inputs and reset state
          } else {
            throw new Error('Failed to upload MOOC details');
          }
        } catch (error) {
          console.error('Error uploading MOOC details:', error);
          Swal.fire('Error', 'Failed to upload MOOC details', 'error');
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  return (
    <div className='bg-gray-100 pb-4'>
      <div className="flex justify-left pl-10 items-center mt-4 border-t-2 border-stone-300">
        <div className="flex mt-4 gap-4 items-center">
          <h3 className="text-2xl flex font-bold justify-center">
            MOOC Lectures
          </h3>
          <input
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            type="checkbox"
            checked={isChecked}
            onChange={handleIsChecked}
          />
        </div>
      </div>
      {isChecked && (
        <div className="pl-10 mt-4">
          <div className="flex flex-col mb-4">
            <label className="block w-full mb-2">MOOC Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 pl-10 text-sm text-gray-700 mb-3"
              style={{
                maxWidth: '70%',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
              }}
            />
            <label className="text-sm font-bold mb-2">Upload Lecture Details</label>
            <input
              ref={detailsInput}
              className="text-sm font-semibold my-2"
              type="file"
              onChange={(e) => handleFileChange(e, setDetails)}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="text-sm font-bold mr-4">Is there a coordinator?</label>
            <div className="flex items-center">
              <input
                type="radio"
                checked={hasCoordinator}
                onChange={() => setHasCoordinator(true)}
                className="mr-2"
              />
              <label className="text-sm font-bold mr-4">Yes</label>
              <input
                type="radio"
                checked={!hasCoordinator}
                onChange={() => setHasCoordinator(false)}
                className="mr-2"
              />
              <label className="text-sm font-bold">No</label>
            </div>
          </div>
          {hasCoordinator && (
            <div className="flex flex-col mb-4">
              <label className="text-sm font-bold mb-2">Coordinator Employee ID:</label>
              <input
                type="text"
                value={coordinatorId}
                onChange={handleCoordinatorChange}
                className="p-2 border rounded"
                style={{ maxWidth: '70%' }}
              />
              {coordinatorName && (
                <div className="mt-2">
                  <strong>Coordinator Name:</strong> {coordinatorName}
                </div>
              )}
            </div>
          )}
          <div className="flex">
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

export default MOOC;