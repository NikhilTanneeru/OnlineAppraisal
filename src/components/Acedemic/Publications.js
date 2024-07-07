import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import UserContext from '../../UserContext';  // Adjust the path to where your UserContext is defined
import Swal from 'sweetalert2';

function Publications() {
  const [isChecked, setIsChecked] = useState(true);
  const [publicationTitle, setPublicationTitle] = useState('');
  const [publicationID, setPublicationID] = useState('');
  const [publicationURL, setPublicationURL] = useState('');
  const [description, setDescription] = useState('');
  const [publicationFile, setPublicationFile] = useState(null);


  
  const [hasCoordinator, setHasCoordinator] = useState(false);
  const [coordinatorId, setCoordinatorId] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');

  const publicationFileRef = useRef(null);

  const { user } = useContext(UserContext);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleCoordinatorChange = async (e) => {
    setCoordinatorId(e.target.value);
    if (e.target.value) {
      try {
        const response = await axios.get(`/get-employee-name/${e.target.value}`);
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
    if (publicationFileRef.current) {
      publicationFileRef.current.value = null;
    }
    setPublicationTitle('');
    setPublicationID('');
    setPublicationURL('');
    setDescription('');
    setPublicationFile(null);

    
    setHasCoordinator(false);
    setCoordinatorId('');
    setCoordinatorName('');
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You need to be logged in to submit Publication details');
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
        formData.append('isChecked', isChecked);
        formData.append('publicationTitle', publicationTitle);
        formData.append('publicationID', publicationID);
        formData.append('publicationURL', publicationURL);
        formData.append('description', description);
        formData.append('hasCoordinator', hasCoordinator);
        formData.append('coordinatorId', coordinatorId);
       
        if (publicationFile) formData.append('publicationFile', publicationFile);

        try {
          const response = await axios.post('/upload-publication-details', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status === 200 || response.status === 201) {
            Swal.fire('Request sent to Dean!', '', 'success');
            clearFileInputs(); // Clear file inputs and reset state
          } else {
            throw new Error('Failed to upload Publication details');
          }
        } catch (error) {
          console.error('Error uploading Publication details:', error);
          Swal.fire('Error', 'Failed to upload Publication details', 'error');
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  return (
    <>
      <h3 className="text-2xl flex font-bold justify-left pl-10 mt-4 p-2 border-t-2 border-stone-300">
        Publication
      </h3>
      <div className="flex justify-left pl-10">
        <label>Is Publication made?</label>
        <input
          type="checkbox"
          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ml-2"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
      </div>
      {isChecked && (
        <div className="flex flex-col justify-left pl-10 mt-4">
          <label className="block w-full mb-2" style={{ width: '100%' }}>
            Publication Title
          </label>
          <input
            type="text"
            value={publicationTitle}
            onChange={(e) => setPublicationTitle(e.target.value)}
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2" style={{ width: '100%' }}>
            Publication ID
          </label>
          <input
            type="text"
            value={publicationID}
            onChange={(e) => setPublicationID(e.target.value)}
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2" style={{ width: '100%' }}>
            Publication URL
          </label>
          <input
            type="text"
            value={publicationURL}
            onChange={(e) => setPublicationURL(e.target.value)}
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2" style={{ width: '100%' }}>
            Enter a brief description about the Publication
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
            Upload Publication File
          </label>
          <input
            type="file"
            ref={publicationFileRef}
            onChange={(e) => handleFileChange(e, setPublicationFile)}
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
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
            <button className="bg-green-400 text-sm uppercase font-semibold rounded-full px-2 py-1" onClick={handleSubmit}>
              Upload
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Publications;
