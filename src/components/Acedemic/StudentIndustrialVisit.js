import React, { useState, useContext, useRef } from "react";
import axios from 'axios';
import UserContext from '../../UserContext'; // Adjust the path to where your UserContext is defined
import Swal from 'sweetalert2';

function StudentIndustrialVisit() {
  const [isChecked, setIsChecked] = useState(true);
  const [placeOfVisit, setPlaceOfVisit] = useState("");
  const [mediumOfTransport, setMediumOfTransport] = useState("");
  const [costOfTransport, setCostOfTransport] = useState("");
  const [additionalCharges, setAdditionalCharges] = useState("");
  const [bills, setBills] = useState([]);
  
  const [hasCoordinator, setHasCoordinator] = useState(false);
  const [coordinatorId, setCoordinatorId] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');


  const billsFile = useRef(null);
  const { user } = useContext(UserContext);



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

  function handleIsChecked() {
    setIsChecked(!isChecked);
  }

  function handlePlaceOfVisitChange(e) {
    setPlaceOfVisit(e.target.value);
  }

  function handleMediumOfTransportChange(e) {
    setMediumOfTransport(e.target.value);
  }

  function handleCostOfTransportChange(e) {
    setCostOfTransport(e.target.value);
  }

  function handleAdditionalChargesChange(e) {
    setAdditionalCharges(e.target.value);
  }

  function handleBillsChange(e) {
    setBills(e.target.files);
  }

  const clearFileInputs = () => {
    if (billsFile.current) {
      billsFile.current.value = null;
    }

    setPlaceOfVisit('');
    setMediumOfTransport('');
    setCostOfTransport('');
    setAdditionalCharges('');
    setBills([]);

    
    setHasCoordinator(false);
    setCoordinatorId('');
    setCoordinatorName('');
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('You need to be logged in to submit Industrial Visit details');
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
        formData.append('placeOfVisit', placeOfVisit);
        formData.append('mediumOfTransport', mediumOfTransport);
        formData.append('costOfTransport', costOfTransport);
        formData.append('additionalCharges', additionalCharges);
        formData.append('hasCoordinator', hasCoordinator);
        formData.append('coordinatorId', coordinatorId);
       
        Array.from(bills).forEach((bill, index) => {
          formData.append(`bills`, bill);
        });

        try {
          const response = await axios.post('/upload-industrialVisit-details', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status === 200 || response.status === 201) {
            Swal.fire('Request sent to Dean!', '', 'success');
            clearFileInputs(); // Clear file inputs and reset state
          } else {
            throw new Error('Failed to upload Industrial Visit details');
          }
        } catch (error) {
          console.error('Error uploading Industrial Visit details:', error);
          Swal.fire('Error', 'Failed to upload Industrial Visit details', 'error');
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
            Student Industrial Visit
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
        <div className="flex flex-col justify-left pl-10 mt-4">
          <label className="block w-full mb-2">Place of Visit:</label>
          <input
            type="text"
            value={placeOfVisit}
            onChange={handlePlaceOfVisitChange}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2">Medium of Transport:</label>
          <input
            type="text"
            value={mediumOfTransport}
            onChange={handleMediumOfTransportChange}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2">Cost of Transport:</label>
          <input
            type="number"
            value={costOfTransport}
            onChange={handleCostOfTransportChange}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2">Additional Charges:</label>
          <input
            type="number"
            value={additionalCharges}
            onChange={handleAdditionalChargesChange}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          <label className="block w-full mb-2">Upload Bills (Multiple Images or PDF):</label>
          <input
            type="file"
            ref={billsFile}
            multiple
            accept=".jpg,.jpeg,.pdf"
            onChange={handleBillsChange}
            className="w-full p-2 pl-10 text-sm text-gray-700"
            style={{
              maxWidth: '70%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #ccc',
            }}
          />
          {bills.length > 0 && (
            <div>
              <h4>Uploaded Bills:</h4>
              <ul>
                {Array.from(bills).map((bill, index) => (
                  <li key={index}>{bill.name}</li>
                ))}
              </ul>
            </div>
          )}
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

export default StudentIndustrialVisit;
