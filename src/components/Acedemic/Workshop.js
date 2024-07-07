import React, { useState, useContext, useRef, useEffect } from 'react';
import UserContext from '../../UserContext';
import Swal from 'sweetalert2';

function Workshop() {
  const { user } = useContext(UserContext); // Get user from context
  const [isConducted, setIsConducted] = useState(true);
  const [files, setFiles] = useState([]);
  const [duration, setDuration] = useState('');
  const [poster, setPoster] = useState(null);
  const fileInputRef = useRef(null); // Ref for the file input
  const posterInputRef = useRef(null); // Ref for the poster input
  const [workshopCount, setWorkshopCount] = useState(0); // State to hold the number of workshops

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
        formData.append('duration', duration);
        if (poster) {
          formData.append('poster', poster); // Add the poster file
        }

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
          Swal.fire('Saved!', '', 'success');

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
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            checked={isConducted}
            onChange={(e) => setIsConducted(e.target.checked)}
          />
        </div>
      </div>

      {isConducted && (
        <div className="mt-4">
          <div className="text-sm font-bold mb-2">Duration:</div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="duration"
                value="D-1"
                onChange={handleDurationChange}
                checked={duration === 'D-1'}
                className="form-radio text-blue-600"
              />
              1 Day
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="duration"
                value="D-2"
                onChange={handleDurationChange}
                checked={duration === 'D-2'}
                className="form-radio text-blue-600"
              />
              2 Day
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="duration"
                value="D-5"
                onChange={handleDurationChange}
                checked={duration === 'D-5'}
                className="form-radio text-blue-600"
              />
              5 Day
            </label>
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
            <button className="bg-green-400 text-sm uppercase font-semibold rounded-full px-2 py-1" onClick={handleUpload}>
              Upload
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Workshop;
