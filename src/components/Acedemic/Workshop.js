import React, { useState, useContext, useRef, useEffect } from 'react';
import UserContext from '../../UserContext';
import Swal from 'sweetalert2';
import axios from 'axios';


function Workshop() {
  const { user } = useContext(UserContext); // Get user from context
  const [isConducted, setIsConducted] = useState(true);
  const [files, setFiles] = useState([]);
  const [duration, setDuration] = useState('');
  const [poster, setPoster] = useState(null);
  const fileInputRef = useRef(null); // Ref for the file input
  const posterInputRef = useRef(null); // Ref for the poster input
  const [workshopCount, setWorkshopCount] = useState(0); // State to hold the number of workshops
  const [title, setTitle] = useState('');
  const [fromDate, setDate] = useState('');
  const [toDate, setEndDate] = useState('');

  
  const [hasCoordinator, setHasCoordinator] = useState(false);
  const [coordinatorId, setCoordinatorId] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');

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

  useEffect(() => {
    // Fetch the number of workshops conducted
    const fetchWorkshopCount = async () => {
      try {
        const response = await fetch('/get-workshop-count', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setWorkshopCount(data.count);
      } catch (error) {
        console.error('Error fetching workshop count:', error.message);
      }
    };

    fetchWorkshopCount();
  }, []);

  const handleDurationChange = (e) => {
    setDuration(e.target.value);
  };

  const handlePosterChange = (e) => {
    setPoster(e.target.files[0]);
  };

  const handleFilesChange = (e) => {
    setFiles(e.target.files);
  };

  const clearFile = () => {
    // Clear form states
    setFiles([]);
    setDuration('');
    setPoster(null);
    setTitle('')

    setHasCoordinator(false);
    setCoordinatorId('');
    setCoordinatorName('');

    // Clear file input fields
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (posterInputRef.current) {
      posterInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    Swal.fire({
      title: "Do you want to save the Workshop Details?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append('files', file); // Use 'files' as the field name
        });
        formData.append('title', title);
        formData.append('duration', duration);
        if (poster) {
          formData.append('poster', poster); // Add the poster file
        }
        formData.append('hasCoordinator', hasCoordinator); // Convert boolean to string
        formData.append('coordinatorId', coordinatorId);
        formData.append('fromDate', fromDate);
        formData.append('toDate', toDate);
  
        try {
          const response = await fetch('/upload-workshop-files', {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
          }
  
          const data = await response.json();
          console.log(data);
          Swal.fire('Request Sent to Dean!', '', 'success');
  
          clearFile();
        } catch (error) {
          console.error('Error uploading files:', error.message);
          Swal.fire('Error', error.message, 'error');
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  

  if (!user) {
    return <div className="text-gray-500">You are not logged in</div>;
  }

  return (
    <div className="p-10 ">
      <h3 className="text-2xl font-bold">Workshop</h3>
      <div className="mt-3 text-lg">
        Number of workshops already conducted: {workshopCount}
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Is Workshop Conducted?</span>
          <input
            type="checkbox"
            className="w-5 h-5 text-blue-600 bg-gray-100 rounded focus:ring-blue-500 focus:ring-2"
            checked={isConducted}
            onChange={(e) => setIsConducted(e.target.checked)}
          />
        </div>
      </div>

      {isConducted && (
        <div className="mt-4">
          <label className="block w-full mb-2">Workshop Conducted On:</label>
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
          <div className="text-sm font-bold mb-2">Duration:</div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="duration"
                value="1"
                onChange={handleDurationChange}
                checked={duration === '1'}
                className="form-radio text-blue-600"
              />
              1 Day
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="duration"
                value="2"
                onChange={handleDurationChange}
                checked={duration === '2'}
                className="form-radio text-blue-600"
              />
              2 Day
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="duration"
                value="5"
                onChange={handleDurationChange}
                checked={duration === '5'}
                className="form-radio text-blue-600"
              />
              5 Day
            </label>
            <label className="block w-full mb-2">Workshop Started Date:</label>
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

          <label className="block w-full mb-2">Workshop Ended Date:</label>
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
          </div>

          <div className="mt-4">
            <label className="block text-sm font-bold mb-2">Upload Images (jpg/jpeg):</label>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg"
              onChange={handleFilesChange}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-700 bg-gray-200 rounded"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-bold mb-2">Upload Poster (only pdf):</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePosterChange}
              ref={posterInputRef}
              className="block w-full text-sm text-gray-700 bg-gray-200 rounded"
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
            <button className="bg-green-400 text-sm uppercase font-semibold roundefull px-2 py-1" onClick={handleUpload}>
              Upload
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Workshop;
