import React, { useState, useContext, useEffect, useRef } from 'react';
import UserContext from '../UserContext';
import Footer from '../components/ui/Footer';
import Swal from 'sweetalert2';

function Research({ activeTab, setActiveTab }) {
  const { user } = useContext(UserContext); // Get user from context
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [expectedEndDate, setExpectedEndDate] = useState('');
  const [numScholars, setNumScholars] = useState(0);
  const [scholars, setScholars] = useState([]);
  const [reportFile, setReportFile] = useState(null);
  const [researchCount, setResearchCount] = useState(0); // State to hold the number of researches
  const [researches, setResearches] = useState([]); // State to hold the list of researches
  const [selectedResearchId, setSelectedResearchId] = useState(null);
  const reportFileInputRef = useRef(null);  

  const fetchResearchCount = async () => {
    try {
      const response = await fetch('/get-research-count', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setResearchCount(data.count);
    } catch (error) {
      console.error('Error fetching research count:', error.message);
    }
  };

  const fetchResearches = async () => {
    try {
      const response = await fetch('/get-researches', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setResearches(data.researches);
    } catch (error) {
      console.error('Error fetching researches:', error.message);
    }
  };

  useEffect(() => {
    // Fetch the number of researches conducted
    fetchResearchCount();
    // Fetch the list of researches
    fetchResearches();
  }, []);

  const handleAddResearch = () => {
    setShowForm(true); // Show the form when the button is clicked
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleExpectedEndDateChange = (e) => {
    setExpectedEndDate(e.target.value);
  };

  const handleNumScholarsChange = (e) => {
    const count = e.target.value;
    setNumScholars(count);
    const newScholars = Array.from({ length: count }, () => ({ name: '', scholarId: '' }));
    setScholars(newScholars);
  };

  const handleScholarNameChange = (index, e) => {
    const newScholars = [...scholars];
    newScholars[index].name = e.target.value;
    setScholars(newScholars);
  };

  const handleScholarIdChange = (index, e) => {
    const newScholars = [...scholars];
    newScholars[index].scholarId = e.target.value.toUpperCase();
    setScholars(newScholars);
  };

  const handleReportFileChange = (e) => {
    setReportFile(e.target.files[0]);
  };

  const clearFile = () => {
    // Clear form states
    setTitle('');
    setStartDate('');
    setExpectedEndDate('');
    setNumScholars(0);
    setScholars([]);
    setReportFile(null);

    // Clear file input field
    if (reportFileInputRef.current) {
      reportFileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    Swal.fire({
      title: 'Do you want to save the Research?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('startDate', startDate);
        formData.append('expectedEndDate', expectedEndDate);
        formData.append('scholars', JSON.stringify(scholars));
        formData.append('reportFile', reportFile);

        try {
          const response = await fetch('/upload-research-details', {
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

          // Fetch updated research count and list
          fetchResearchCount();
          fetchResearches();
        } catch (error) {
          console.error('Error uploading research details:', error.message);
          Swal.fire('Error', error.message, 'error');
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
        clearFile();
      }
    });
  };

  const handleViewDetails = (research) => {
    setSelectedResearchId(selectedResearchId === research ? null : research);
  };

  if (!user) {
    return <div className="text-gray-500">You are not logged in</div>;
  }

  return (
    <div className="px-96 pb-[8vh]">
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">List of Researches: {researchCount}</h3>
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">S.No</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Report File</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {researches.map((research, index) => (
              research.status === 'Approved' && (
                <React.Fragment key={research.id}>
                  <tr>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{research.title}</td>
                    <td className="border px-4 py-2">{research.status}</td>
                    <td className="border px-4 py-2">{research.reportFile.filename}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleViewDetails(research._id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        {selectedResearchId === research._id ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                  {selectedResearchId === research._id && (
                    <tr>
                      <td className="border px-4 py-2" colSpan="5">
                        <table className="w-full bg-white border border-gray-200">
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2 font-bold">Title:</td>
                              <td className="border px-4 py-2">{research.title}</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-bold">Start Date:</td>
                              <td className="border px-4 py-2">{research.startDate}</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-bold">Expected End Date:</td>
                              <td className="border px-4 py-2">{research.expectedEndDate}</td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-bold">Scholars:</td>
                              <td className="border px-4 py-2">
                                <ul>
                                  {research.scholars.map((scholar, index) => (
                                    <li key={index}>{scholar.name} - {scholar.scholarId}</li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <td className="border px-4 py-2 font-bold">Report File:</td>
                              <td className="border px-4 py-2">{research.reportFile.filename}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleAddResearch}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded"
      >
        Add Research
      </button>
            {showForm && (
        <div className="p-4 bg-white shadow-md rounded">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Research Title:</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Expected End Date:</label>
            <input
              type="date"
              value={expectedEndDate}
              onChange={handleExpectedEndDateChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">No. of Scholars: (1 to 4)</label>
            <input
              type="number"
              value={numScholars}
              onChange={handleNumScholarsChange}
              min="1"
              max="4"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {scholars.map((scholar, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Scholar {index + 1} Name:</label>
              <input
                type="text"
                value={scholar.name}
                onChange={(e) => handleScholarNameChange(index, e)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <label className="block text-gray-700 text-sm font-bold mb-2 mt-2">Scholar {index + 1} ID:</label>
              <input
                type="text"
                value={scholar.scholarId}
                onChange={(e) => handleScholarIdChange(index, e)}
                onInput={(e) => { e.target.value = e.target.value.toUpperCase() }}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Upload Report:</label>
            <input
              type="file"
              ref={reportFileInputRef}
              onChange={handleReportFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button onClick={handleUpload} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Upload Research Details
          </button>
        </div>
      )}
      <div className="flex items-center justify-center w-full h-[8vh] bg-stone-300 text-black fixed bottom-0 left-0 m-0 p-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        <Footer />
      </div>
    </div>
  );
}

export default Research;
