// import React, { useState, useContext, useRef } from 'react';
// import axios from 'axios';
// import UserContext from '../../UserContext'; // Adjust the path to where your UserContext is defined
// import Swal from 'sweetalert2';

// function IndustrialExpertLecture() {
//   const [isChecked, setIsChecked] = useState(true);
//   const [instructor, setInstructor] = useState('');
//   const [title, setTitle] = useState('');
//   const [poster, setPoster] = useState(null);
//   const [report, setReport] = useState(null);
//   const { user } = useContext(UserContext);
//   const posterInput = useRef(null); // Ref for poster file input
//   const reportInput = useRef(null); // Ref for report file input

//   function handleIsChecked() {
//     setIsChecked(!isChecked);
//   }

//   const handleFileChange = (e, setFile) => {
//     setFile(e.target.files[0]);
//   };

//   const clearFileInputs = () => {
//     if (posterInput.current) {
//       posterInput.current.value = null;
//     }
//     if (reportInput.current) {
//       reportInput.current.value = null;
//     }
//     setPoster(null);
//     setReport(null);
//     setTitle('');
//     setInstructor('');
//   };

//   const handleSubmit = async () => {
//     if (!user) {
//       alert('You need to be logged in to submit expert lecture details');
//       return;
//     }
//     Swal.fire({
//       title: 'Do you want to save the changes?',
//       showDenyButton: true,
//       showCancelButton: true,
//       confirmButtonText: 'Save',
//       denyButtonText: "Don't save"
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         const formData = new FormData();
//         formData.append('checked', isChecked);
//         formData.append('title', title);
//         formData.append('instructor', instructor);
//         if (poster) formData.append('poster', poster);
//         if (report) formData.append('report', report);

//         try {
//           const response = await axios.post('/upload-expertlecture-details', formData, {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem('token')}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           });

//           if (response.status === 200 || response.status === 201) {
//             Swal.fire('Saved!', '', 'success');
//             clearFileInputs(); // Clear file inputs and reset state
//           } else {
//             throw new Error('Failed to upload expert lecture details');
//           }
//         } catch (error) {
//           console.error('Error uploading Expert Lecture details:', error);
//           Swal.fire('Error', 'Failed to upload Expert Lecture details', 'error');
//         }
//       } else if (result.isDenied) {
//         Swal.fire('Changes are not saved', '', 'info');
//       }
//     });
//   };

//   return (
//     <>
//       <div className="flex justify-left pl-10 items-center mt-4 border-t-2 border-stone-300">
//         <div className="flex mt-4 gap-4 items-center">
//           <h3 className="text-2xl flex font-bold justify-center">
//             Industry Expert Lecture
//           </h3>
//           <input
//             className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//             type="checkbox"
//             checked={isChecked}
//             onChange={handleIsChecked}
//           />
//         </div>
//       </div>
//       {isChecked && (
//         <div>
//           <div className="flex flex-col justify-left pl-10 mt-4">
//             <label className="block w-full mb-2">Instructor:</label>
//             <input
//               type="text"
//               value={instructor}
//               onChange={(e) => setInstructor(e.target.value)}
//               className="w-full p-2 pl-10 text-sm text-gray-700"
//               style={{
//                 maxWidth: '70%',
//                 padding: '0.5rem',
//                 borderRadius: '0.5rem',
//                 border: '1px solid #ccc',
//               }}
//             />
//             <label className="block w-full mb-2">Title of Lecture:</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-full p-2 pl-10 text-sm text-gray-700"
//               style={{
//                 maxWidth: '70%',
//                 padding: '0.5rem',
//                 borderRadius: '0.5rem',
//                 border: '1px solid #ccc',
//               }}
//             />
//             <div className="flex justify-left items-center mt-4 gap-9 ">
//               <label className="text-sm font-bold">Upload Poster</label>
//               <input
//                 ref={posterInput}
//                 className="text-sm font-semibold"
//                 type="file"
//                 onChange={(e) => handleFileChange(e, setPoster)}
//               />
//             </div>
//             <div className="flex justify-left items-center mt-4 gap-9 ">
//               <label className="text-sm font-bold">Upload Report</label>
//               <input
//                 ref={reportInput}
//                 className="text-sm font-semibold"
//                 type="file"
//                 onChange={(e) => handleFileChange(e, setReport)}
//               />
//             </div>
//             <div className="flex justify-left items-center mt-4 gap-9">
//               <button
//                 className="bg-green-400 text-sm uppercase font-semibold rounded-full px-2 py-1"
//                 onClick={handleSubmit}
//               >
//                 Upload
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default IndustrialExpertLecture;


import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import UserContext from '../../UserContext'; // Adjust the path to where your UserContext is defined
import Swal from 'sweetalert2';

function IndustrialExpertLecture() {
  const [isChecked, setIsChecked] = useState(true);
  const [instructor, setInstructor] = useState('');
  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState(null);
  const [report, setReport] = useState(null);
  const [hasCoordinator, setHasCoordinator] = useState(false);
  const [coordinatorId, setCoordinatorId] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const { user } = useContext(UserContext);
  const posterInput = useRef(null);
  const reportInput = useRef(null);

  function handleIsChecked() {
    setIsChecked(!isChecked);
  }

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
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
    setTitle('');
    setInstructor('');
    setHasCoordinator(false);
    setCoordinatorId('');
    setCoordinatorName('');
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

  const handleSubmit = async () => {
    if (!user) {
      alert('You need to be logged in to submit expert lecture details');
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
        formData.append('instructor', instructor);
        formData.append('hasCoordinator', hasCoordinator);
        formData.append('coordinatorId', coordinatorId);
        if (poster) formData.append('poster', poster);
        if (report) formData.append('report', report);

        try {
          const response = await axios.post('/upload-expertlecture-details', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 200 || response.status === 201) {
            Swal.fire('Saved!', '', 'success');
            clearFileInputs(); // Clear file inputs and reset state
          } else {
            throw new Error('Failed to upload expert lecture details');
          }
        } catch (error) {
          console.error('Error uploading Expert Lecture details:', error);
          Swal.fire('Error', 'Failed to upload Expert Lecture details', 'error');
        }
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info');
      }
    });
  };

  return (
    <>
      <div className="flex justify-left pl-10 items-center mt-4 border-t-2 border-stone-300">
        <div className="flex mt-4 gap-4 items-center">
          <h3 className="text-2xl flex font-bold justify-center">
            Industry Expert Lecture
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
        <div>
          <div className="flex flex-col justify-left pl-10 mt-4">
            <label className="block w-full mb-2">Instructor:</label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full p-2 pl-10 text-sm text-gray-700"
              style={{
                maxWidth: '70%',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
              }}
            />
            <label className="block w-full mb-2">Title of Lecture:</label>
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
        </div>
      )}
    </>
  );
}

export default IndustrialExpertLecture;
