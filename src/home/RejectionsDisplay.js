import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const RejectionsDisplay = () => {
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
      const [hackathonsResponse, lecturesResponse, trainingsResponse, valAddCourseResponse, researchResponse, extraClassResponse, moocResponse] = await Promise.all([
        axios.get('/get-rejected-hackathons', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-rejected-expert-lectures', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-rejected-trainings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-rejected-valAddCourses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-rejected-researches', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-rejected-extra-classes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('/get-rejected-mooc', {
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
          .map((request, index) => ({ ...request, type: 'Extra Class', index: index + 1 })),
        ...moocResponse.data
          .filter((request) => request.userId === userId)
          .map((request, index) => ({ ...request, type: 'MOOC', index: index + 1 })),  
      ];

      console.log('Combined Requests:', combinedRequests); // Log combined requests
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

  useEffect(() => {
    console.log('Requests:', requests);
  }, [requests]);

  return (
    <div className="pb-[5vh]">
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Rejected Requests</h3>
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
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <React.Fragment key={request.index}>
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
                    <td className="border px-4 py-2 text-red-500">{request.status}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(request._id, request.type)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {selectedRequest && selectedRequest.index === request.index && (
                    <tr>
                      <td colSpan="6" className="border px-4 py-2">
                        <h4 className="text-lg font-bold mb-2">Details:</h4>
                        <table className="w-full">
                          <tbody>
                            {selectedRequest.type === 'Hackathon' && (
                              <>
                                <TableRow label="Rejection Reason" value={request.reason} />
                                <TableRow label="Title" value={selectedRequest.title} />
                                <TableRow label="Start Date" value={formatDate(selectedRequest.fromDate)} />
                                <TableRow label="End Date" value={formatDate(selectedRequest.toDate)} />
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
                                <TableRow label="From Date" value={selectedRequest.fromDate} />
                                <TableRow label="To Date" value={selectedRequest.toDate} />
                                <TableRow label="Duration" value={selectedRequest.duration} />
                                <TableRow label="Number of Days" value={selectedRequest.noOfDays} />
                                <TableRow label="Topic" value={selectedRequest.topic} />
                              </>
                            )}
                            {selectedRequest.type === 'Value Added Course' && (
                              <>
                                <TableRow label="Course Name" value={selectedRequest.courseName} />
                                <TableRow label="Credits" value={selectedRequest.credits} />
                                <TableRow label="Description" value={selectedRequest.description} />
                              </>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border px-4 py-2 text-center">
                  No rejected requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RejectionsDisplay;