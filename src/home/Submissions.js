import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Submissions = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const TableRow = ({ label, value }) => (
    <tr>
      <td className="border px-4 py-2 font-bold">{label}</td>
      <td className="border px-4 py-2">{value}</td>
    </tr>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Extracts only the date part in "YYYY-MM-DD" format
  };

  const fetchRequests = async () => {
    try {
      const [hackathonsResponse, lecturesResponse, trainingsResponse, valAddCourseResponse, researchResponse, extraClassResponse, moocResponse, publicationResponse, industrialVisitResponse] = await Promise.all([
        axios.get('/get-pending-hackathons', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-pending-expert-lectures', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-pending-trainings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-pending-valAddCourses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-pending-researches', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-pending-extraClasses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-pending-mooc', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-pending-publications', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-pending-student-industrial-visits', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      const userId = JSON.parse(localStorage.getItem('user'))._id;

      const combinedRequests = [
        ...hackathonsResponse.data
          .filter((request) => request.userId === userId)
          .map((request, index) => ({ ...request, type: 'Hackathon', index: index + 1 })),
        ...lecturesResponse.data
          .filter((request) => request.userId === userId)
          .map((request, index) => ({ ...request, type: 'Expert Lecture', index: index + 1 })),
        ...trainingsResponse.data
          .filter((request) => request.userId === userId)
          .map((request, index) => ({ ...request, type: 'Training', index: index + 1 })),
        ...valAddCourseResponse.data
          .filter((request) => request.userId === userId)
          .map((request, index) => ({ ...request, type: 'Value Added Course', index: index + 1 })),
        ...researchResponse.data
          .filter((request) => request.userId === userId)
          .map((request, index) => ({ ...request, type: 'Research', index: index + 1 })),
        ...extraClassResponse.data
          .filter((request) => request.userId === userId)
          .map((request, index) => ({ ...request, type: 'Extra Classes', index: index + 1 })),
        ...moocResponse.data
          .filter((request) => request.userId === userId)
          .map((request, index) => ({ ...request, type: 'MOOC', index: index + 1 })),
        ...publicationResponse.data
          .filter((request) => request.userId === userId)
          .map((request, index) => ({ ...request, type: 'Publication', index: index + 1 })),
        ...industrialVisitResponse.data
          .filter((request) => request.userId === userId)
          .map((request, index) => ({ ...request, type: 'Student Industrial Visit', index: index + 1 })),
      ];

      setRequests(combinedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleDelete = async (id, type) => {
    const typeLower = type.toLowerCase().replaceAll(' ', '-');
    Swal.fire({
      title: `Are you sure you want to delete this ${typeLower}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No, cancel',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`/delete-${typeLower}/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          if (response.status === 200) {
            Swal.fire('Deleted!', response.data.message, 'success');
            fetchRequests(); // Refresh requests after deletion
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error(`Error deleting ${typeLower}:`, error);
          Swal.fire('Error', `Failed to delete ${typeLower}: ${error.response ? error.response.data.message : error.message}`, 'error');
        }
      }
    });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="pb-[5vh]">
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Pending Requests</h3>
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">S.No</th>
              <th className="border px-4 py-2">Conducted</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">View Details</th>
              <th className="border px-4 py-2">Status</th> {/* Approved or Pending */}
              <th className="border px-4 py-2">Actions</th> {/* Add Actions column */}
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <React.Fragment key={request.id}>
                <tr>
                  <td className="border px-4 py-2">{index+1}</td>
                  <td className="border px-4 py-2">{request.type}</td>
                  <td className="border px-4 py-2">{request.title}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleViewDetails(request)}
                    >
                      View
                    </button>
                  </td>
                  <td className="border px-4 py-2 text-green-500">{request.status}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(request._id, request.type)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {selectedRequest && selectedRequest._id === request._id && (
                  <tr>
                    <td colSpan="6" className="border px-4 py-2">
                      <h4 className="text-lg font-bold mb-2">Details:</h4>
                      <table className="w-full">
                        <tbody>
                          {selectedRequest.type === 'Hackathon' && (
                            <>
                              <TableRow label="Title" value={selectedRequest.title} />
                              <TableRow label="Start Date" value={formatDate(selectedRequest.startDate)} />
                              <TableRow label="End Date" value={formatDate(selectedRequest.endDate)} />
                              <TableRow label="Coordinator Name" value={selectedRequest.cordName === '' ? 'No Coordinator Involved' : selectedRequest.cordName} />
                              <TableRow label="Coordinator Id" value={(!selectedRequest.cordId) ? 'No Coordinator Involved' : selectedRequest.cordId} />
                            </>
                          )}
                          {selectedRequest.type === 'Expert Lecture' && (
                            <>
                              <TableRow label="Title" value={selectedRequest.title} />
                              <TableRow label="Instructor" value={selectedRequest.instructor} />
                              <TableRow label="Coordinator Name" value={selectedRequest.cordName === '' ? 'No Coordinator Involved' : selectedRequest.cordName} />
                              <TableRow label="Coordinator Id" value={(!selectedRequest.cordId) ? 'No Coordinator Involved' : selectedRequest.cordId} />
                            </>
                          )}
                          {selectedRequest.type === 'Training' && (
                            <>
                              <TableRow label="Title" value={selectedRequest.title} />
                              <TableRow label="From Date" value={formatDate(selectedRequest.fromDate)} />
                              <TableRow label="To Date" value={formatDate(selectedRequest.toDate)} />
                              <TableRow label="Duration" value={selectedRequest.duration} />
                              <TableRow label="Number of Days" value={selectedRequest.noOfDays} />
                            </>
                          )}
                          {selectedRequest.type === 'Value Added Course' && (
                            <>
                              <TableRow label="Course Name" value={selectedRequest.courseName} />
                              <TableRow label="Credits" value={selectedRequest.credits} />
                              <TableRow label="Description" value={selectedRequest.description} />
                            </>
                          )}
                          {selectedRequest.type === 'Research' && (
                            <>
                              <TableRow label="Research Name" value={selectedRequest.title} />
                              <TableRow label="Start Date" value={selectedRequest.startDate} />
                              <TableRow label="End Date" value={selectedRequest.expectedEndDate} />
                            </>
                          )}
                          {selectedRequest.type === 'Extra Classes' && (
                            <>
                              <TableRow label="Extra Class Topic" value={selectedRequest.title} />
                              <TableRow label="Date" value={selectedRequest.date} />
                              <TableRow label="From Time" value={selectedRequest.fromTime} />
                              <TableRow label="To Time" value={selectedRequest.toTime} />

                            </>
                          )}
                          {selectedRequest.type === 'Publication' && (
                            <>
                              <TableRow label="Publication Toipc" value={selectedRequest.title} />
                              <TableRow label="Publication Id" value={selectedRequest.publicationId} />
                              <TableRow label="Publication URL" value={selectedRequest.publicationURL} />
                              <TableRow label="Description" value={selectedRequest.description} />
                              <TableRow label="Coordinator Name" value={selectedRequest.cordName === '' ? 'No Coordinator Involved' : selectedRequest.cordName} />
                              <TableRow label="Coordinator Id" value={(!selectedRequest.cordId) ? 'No Coordinator Involved' : selectedRequest.cordId} />
                            
                            </>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Submissions;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// const Submissions = () => {
//   const [requests, setRequests] = useState([]);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});

//   const fetchRequests = async () => {
//     try {
//       const [hackathonsResponse, lecturesResponse, trainingsResponse, valAddCourseResponse, researchResponse] = await Promise.all([
//         axios.get('/get-pending-hackathons', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }),
//         axios.get('/get-pending-expert-lectures', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }),
//         axios.get('/get-pending-trainings', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }),
//         axios.get('/get-pending-valAddCourses', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }),
//         axios.get('/get-pending-researches', {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//         }),
//       ]);

//       const userId = JSON.parse(localStorage.getItem('user'))._id;

//       const combinedRequests = [
//         ...hackathonsResponse.data
//           .filter((request) => request.userId === userId)
//           .map((request, index) => ({ ...request, type: 'Hackathon', index: index + 1 })),
//         ...lecturesResponse.data
//           .filter((request) => request.userId === userId)
//           .map((request, index) => ({ ...request, type: 'Expert Lecture', index: index + 1 })),
//         ...trainingsResponse.data
//           .filter((request) => request.userId === userId)
//           .map((request, index) => ({ ...request, type: 'Training', index: index + 1 })),
//         ...valAddCourseResponse.data
//           .filter((request) => request.userId === userId)
//           .map((request, index) => ({ ...request, type: 'Value Added Course', index: index + 1 })),
//           ...researchResponse.data
//           .filter((request) => request.userId === userId)
//           .map((request, index) => ({ ...request, type: 'Research', index: index + 1 })),
//       ];

//       setRequests(combinedRequests);
//     } catch (error) {
//       console.error('Error fetching requests:', error);
//     }
//   };

//   const handleViewDetails = (request) => {
//     setSelectedRequest(request);
//   };

//   const handleDelete = async (id, type) => {
//     const typeLower = type.toLowerCase().replaceAll(' ', '-');
//     Swal.fire({
//       title: `Are you sure you want to delete this ${typeLower}?`,
//       showCancelButton: true,
//       confirmButtonText: 'Yes, delete',
//       cancelButtonText: 'No, cancel',
//       customClass: {
//         confirmButton: 'swal-confirm-btn',
//         cancelButton: 'swal-cancel-btn',
//       },
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const response = await axios.delete(`/delete-${typeLower}/${id}`, {
//             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//           });
//           if (response.status === 200) {
//             Swal.fire('Deleted!', response.data.message, 'success');
//             fetchRequests(); // Refresh requests after deletion
//           } else {
//             throw new Error(response.data.message);
//           }
//         } catch (error) {
//           console.error(`Error deleting ${typeLower}:`, error);
//           Swal.fire('Error', `Failed to delete ${typeLower}: ${error.response ? error.response.data.message : error.message}`, 'error');
//         }
//       }
//     });
//   };

//   const handleEdit = (request) => {
//     setEditMode(true);
//     setFormData(request);
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     const typeLower = formData.type.toLowerCase().replaceAll(' ', '-');
//     try {
//       const response = await axios.put(`/edit-${typeLower}/${formData._id}`, formData, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
//       });
//       if (response.status === 200) {
//         Swal.fire('Updated!', response.data.message, 'success');
//         setEditMode(false);
//         fetchRequests(); // Refresh requests after edit
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error) {
//       console.error(`Error updating ${typeLower}:`, error);
//       Swal.fire('Error', `Failed to update ${typeLower}: ${error.response ? error.response.data.message : error.message}`, 'error');
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   return (
//     <div className="pb-[5vh]">
//       <div className="mt-8">
//         <h3 className="text-xl font-bold mb-4">Pending Requests</h3>
//         <table className="w-full bg-white border border-gray-200">
//           <thead>
//             <tr>
//               <th className="border px-4 py-2">S.No</th>
//               <th className="border px-4 py-2">Conducted</th>
//               <th className="border px-4 py-2">Title</th>
//               <th className="border px-4 py-2">View Details</th>
//               <th className="border px-4 py-2">Status</th> {/* Approved or Pending */}
//               <th className="border px-4 py-2">Actions</th> {/* Add Actions column */}
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map((request) => (
//               <React.Fragment key={request.index}>
//                 <tr>
//                   <td className="border px-4 py-2">{request.index}</td>
//                   <td className="border px-4 py-2">{request.type}</td>
//                   <td className="border px-4 py-2">{request.title}</td>
//                   <td className="border px-4 py-2">
//                     <button
//                       className="bg-blue-500 text-white px-2 py-1 rounded"
//                       onClick={() => handleViewDetails(request)}
//                     >
//                       View
//                     </button>
//                   </td>
//                   <td className="border px-4 py-2">{request.status}</td>
//                   <td className="border px-4 py-2">
//                     <button
//                       className="bg-red-500 text-white px-2 py-1 rounded"
//                       onClick={() => handleDelete(request._id, request.type)}
//                     >
//                       Delete
//                     </button>
//                     <button
//                       className="bg-green-500 text-white px-2 py-1 rounded ml-2"
//                       onClick={() => handleEdit(request)}
//                     >
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//                 {selectedRequest && selectedRequest._id === request._id && !editMode && (
//                   <tr>
//                     <td colSpan="6" className="border px-4 py-2">
//                       <h4 className="text-lg font-bold mb-2">Details:</h4>
//                       {selectedRequest.type === 'Hackathon' && (
//                         <>
//                           <p><strong>Title:</strong> {selectedRequest.title}</p>
//                           <p><strong>Start Date:</strong> {selectedRequest.startDate}</p>
//                           <p><strong>End Date:</strong> {selectedRequest.endDate}</p>
//                           <p><strong>Coordinator Name:</strong> {selectedRequest.cordName}</p>
//                           <p><strong>Coordinator ID:</strong> {selectedRequest.coordId}</p>
//                         </>
//                       )}
//                       {selectedRequest.type === 'Expert Lecture' && (
//                         <>
//                           <p><strong>Title:</strong> {selectedRequest.title}</p>
//                           <p><strong>Instructor:</strong> {selectedRequest.instructor}</p>
//                           <p><strong>Coordinator Name:</strong> {selectedRequest.cordName}</p>
//                           <p><strong>Coordinator ID:</strong> {selectedRequest.coordId}</p>
//                         </>
//                       )}
//                       {selectedRequest.type === 'Training' && (
//                         <>
//                           <p><strong>Title:</strong> {selectedRequest.title}</p>
//                           <p><strong>From Date:</strong> {selectedRequest.fromDate}</p>
//                           <p><strong>To Date:</strong> {selectedRequest.toDate}</p>
//                           <p><strong>Duration:</strong> {selectedRequest.duration}</p>
//                           <p><strong>Number of Days:</strong> {selectedRequest.noOfDays}</p>
//                           <p><strong>Topic:</strong> {selectedRequest.topic}</p>
//                         </>
//                         )}
//                         {selectedRequest.type === 'Value Added Course' && (
//                           <>
//                             <p><strong>Course Name:</strong> {selectedRequest.courseName}</p>
//                             <p><strong>Credits:</strong> {selectedRequest.credits}</p>
//                             <p><strong>Description:</strong> {selectedRequest.description}</p>
//                           </>
//                         )}
//                         {/* Add more details based on the activity type */}
//                       </td>
//                     </tr>
//                   )}
//                   {selectedRequest && selectedRequest._id === request._id && editMode && (
//                     <tr>
//                       <td colSpan="6" className="border px-4 py-2">
//                         <h4 className="text-lg font-bold mb-2">Edit Details:</h4>
//                         <form onSubmit={handleFormSubmit}>
//                           {/* Render form fields based on activity type */}
//                           {selectedRequest.type === 'Hackathon' && (
//                             <>
//                               <label>Title:</label>
//                               <input
//                                 type="text"
//                                 name="title"
//                                 value={formData.title}
//                                 onChange={handleFormChange}
//                                 required
//                               />
//                               {/* Add other fields as needed */}
//                             </>
//                           )}
//                           {selectedRequest.type === 'Expert Lecture' && (
//                             <>
//                               <label>Title:</label>
//                               <input
//                                 type="text"
//                                 name="title"
//                                 value={formData.title}
//                                 onChange={handleFormChange}
//                                 required
//                               />
//                               {/* Add other fields as needed */}
//                             </>
//                           )}
//                           {selectedRequest.type === 'Training' && (
//                             <>
//                               <label>Title:</label>
//                               <input
//                                 type="text"
//                                 name="title"
//                                 value={formData.title}
//                                 onChange={handleFormChange}
//                                 required
//                               />
//                               {/* Add other fields as needed */}
//                             </>
//                           )}
//                           {selectedRequest.type === 'Value Added Course' && (
//                             <>
//                               <label>Course Name:</label>
//                               <input
//                                 type="text"
//                                 name="courseName"
//                                 value={formData.courseName}
//                                 onChange={handleFormChange}
//                                 required
//                               />
//                               {/* Add other fields as needed */}
//                             </>
//                           )}
//                           {/* Add more fields based on the activity type */}
//                           <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
//                             Update
//                           </button>
//                         </form>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };
  
//   export default Submissions;
  