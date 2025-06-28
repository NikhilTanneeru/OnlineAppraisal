import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const TableRow = ({ label, value }) => (
  <tr className='w-full'>
    <td className="border px-4 py-2 font-bold">{label}</td>
    <td className="border px-4 py-2">{value}</td>
  </tr>
);

const RequestsDisplay = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchRequests = async () => {
    try {
      const [workshopsResponse, hackathonsResponse, lecturesResponse, trainingsResponse, valAddCourseResponse, researchResponse, extraClassResponse, moocResponse, publicationResponse, industrialVisitResponse] = await Promise.all([
        axios.get('/get-pending-workshops', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        
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

      const combinedRequests = [
        ...workshopsResponse.data.map((request) => ({ ...request, type: 'Workshop' })),
        ...hackathonsResponse.data.map((request) => ({ ...request, type: 'Hackathon' })),
        ...lecturesResponse.data.map((request) => ({ ...request, type: 'Expert Lecture' })),
        ...trainingsResponse.data.map((request) => ({ ...request, type: 'Training' })),
        ...valAddCourseResponse.data.map((request) => ({ ...request, type: 'Value Added Course' })),
        ...researchResponse.data.map((request) => ({ ...request, type: 'Research' })),
        ...extraClassResponse.data.map((request) => ({ ...request, type: 'Extra Classes' })),
        ...moocResponse.data.map((request) => ({ ...request, type: 'MOOC' })),
        ...publicationResponse.data.map((request) => ({ ...request, type: 'Publications' })),
        ...industrialVisitResponse.data.map((request) => ({ ...request, type: 'Student Industrial Visit' })),


        // Add more requests from other activities here
      ];

      setRequests(combinedRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleApprove = async (id, type) => {
    const typeLower = type.toLowerCase().replaceAll(' ', '-'); // Handle cases with spaces
    Swal.fire({
      title: `Are you sure you want to approve this ${typeLower}?`,
      showCancelButton: true,
      confirmButtonText: 'Yes, approve',
      cancelButtonText: 'No, cancel',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`/approve-${typeLower}/${id}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          if (response.status === 200 || response.status === 201) {
            Swal.fire('Approved!', response.data.message, 'success');
            fetchRequests(); // Refresh requests after approval
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error(`Error approving ${typeLower}:`, error);
          Swal.fire('Error', `Failed to approve ${typeLower}`, 'error');
        }
      }
    });
  };

  const handleReject = async (id, type) => {
    const typeLower = type.toLowerCase().replaceAll(' ', '-');
    Swal.fire({
      title: `Are you sure you want to reject this ${typeLower}?`,
      input: 'textarea',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Enter your reason here...',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject',
      cancelButtonText: 'No, cancel',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
      preConfirm: (reason) => {
        setRejectReason(reason);
        return reason;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`/reject-${typeLower}/${id}`, { reason: rejectReason }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          if (response.status === 200 || response.status === 201) {
            Swal.fire('Rejected!', response.data.message, 'success');
            fetchRequests(); // Refresh requests after rejection
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error(`Error rejecting ${typeLower}:`, error);
          Swal.fire('Error', `Failed to reject ${typeLower}`, 'error');
        }
      }
    });
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(selectedRequest === request ? null : request);
  };

  const handleViewPoster = () => {
    if (selectedRequest && selectedRequest.poster) {
      const posterUrl = `/uploads/${encodeURIComponent(selectedRequest.poster.filename)}`;
      console.log('Opening URL:', posterUrl); // Log the URL to verify
      
      const newWindow = window.open(posterUrl, '_blank');
      if (!newWindow) {
        console.error('Failed to open new window. Check if pop-ups are blocked.');
      } else {
        newWindow.focus();
      }
    } else {
      console.error('No selected request or poster found.');
    }
  };
  

  const handleViewReport = () => {
    if (selectedRequest && selectedRequest.report) {
      const reportUrl = `/uploads/${encodeURIComponent(selectedRequest.report.filename)}`;
      window.open(reportUrl);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="px-96 pb-[8vh]">
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Pending Approvals</h3>
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">Emp Name</th>
              <th className="border px-4 py-2">Emp ID</th>
              <th className="border px-4 py-2">Activity Type</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">View Details</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td className="border px-4 py-2">{request.empName}</td>
                  <td className="border px-4 py-2">{request.empId}</td>
                  <td className="border px-4 py-2">{request.type}</td>
                  <td className="border px-4 py-2">{request.title}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handleViewDetails(request)}
                    >
                       {selectedRequest === request ? 'Hide' : 'View'}
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleApprove(request._id, request.type)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleReject(request._id, request.type)}
                    >
                      Reject
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
                              <TableRow label="Start Date" value={selectedRequest.startDate} />
                              <TableRow label="End Date" value={selectedRequest.endDate} />
                              <TableRow label="Coordinator Name" value={selectedRequest.cordName} />
                              <TableRow label="Coordinator ID" value={selectedRequest.coordId} />
                            </>
                          )}
                          {selectedRequest.type === 'Expert Lecture' && (
                            <>
                              <TableRow label="Title" value={selectedRequest.title} />
                              <TableRow label="Instructor" value={selectedRequest.instructor} />
                              <TableRow label="Coordinator Name" value={selectedRequest.cordName} />
                              <TableRow label="Coordinator ID" value={selectedRequest.coordId} />
                            </>
                          )}
                          {selectedRequest.type === 'Training' && (
                            <>
                              <TableRow label="Title" value={selectedRequest.title} />
                              <TableRow label="From Date" value={selectedRequest.fromDate} />
                              <TableRow label="To Date" value={selectedRequest.toDate} />
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
                              <TableRow label="Research Title" value={selectedRequest.researchTitle} />
                              <TableRow label="Researcher" value={selectedRequest.researcher} />
                              <TableRow label="Institution" value={selectedRequest.institution} />
                              <TableRow label="Publication Date" value={selectedRequest.publicationDate} />
                              <TableRow label="Abstract" value={selectedRequest.abstract} />
                            </>
                          )}
                          {selectedRequest.type === 'Publications' && (
                            <>
                              <TableRow label="Publication Topic" value={selectedRequest.title} />
                              <TableRow label="Publication ID" value={selectedRequest.publicationId} />
                              <TableRow label="Publication URL" value={selectedRequest.publicationURL} />
                              <TableRow label="Description" value={selectedRequest.description} />
                              <TableRow label="Coordinator Name" value={selectedRequest.cordName === '' ? 'No Coordinator Involved' : selectedRequest.cordName} />
                              <TableRow label="Coordinator Id" value={selectedRequest.coordId === '' ? 'No Coordinator Involved' : selectedRequest.coordId} />
                            </>
                          )}
                          {selectedRequest.type === 'Workshop' && (
                            <>
                              <TableRow label="Workshop On" value={selectedRequest.title} />
                              <TableRow label="Duration" value={selectedRequest.duration} />
                              <TableRow label="Coordinator Name" value={selectedRequest.cordName === '' ? 'No Coordinator Involved' : selectedRequest.cordName} />
                              <TableRow label="Coordinator Id" value={selectedRequest.coordId === '' ? 'No Coordinator Involved' : selectedRequest.coordId} />
                            </>
                          )}
                          {selectedRequest.type === 'MOOC' && (
                            <>
                              <TableRow label="MOOC Title" value={selectedRequest.title} />
                              <TableRow label="Coordinator Name" value={selectedRequest.cordName === '' ? 'No Coordinator Involved' : selectedRequest.cordName} />
                              <TableRow label="Coordinator Id" value={selectedRequest.coordId === '' ? 'No Coordinator Involved' : selectedRequest.coordId} />
                            </>
                          )}

                          {/* Add more details based on the activity type */}
                          <div className="mt-2">
                            {selectedRequest.poster && (
                              <button
                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                onClick={handleViewPoster}
                              >
                                View Poster
                              </button>
                            )}
                            {selectedRequest.report && (
                              <button
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                onClick={handleViewReport}
                              >
                                View Report
                              </button>
                            )}

                          </div>
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

export default RequestsDisplay;