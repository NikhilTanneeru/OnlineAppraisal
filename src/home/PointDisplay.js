import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import Submissions from '../home/Submissions';
import RejectionsDisplay from './RejectionsDisplay';
import api from '../api'; // add this at the top if not already


function PointDisplay() {
  const { user } = useContext(UserContext); 
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsLog, setPointsLog] = useState([]);

  const fetchPointsData = async () => {
    try {
      const response = await api.get('/get-user-points'); // Axios response

      // Axios automatically parses JSON, so just use:
      const data = response.data;

      setTotalPoints(data.totalPoints);
      setPointsLog(data.pointsLog);
    } catch (error) {
      console.error('Error fetching points data:', error.message);
      Swal.fire('Error', 'Failed to fetch points data', 'error');
    }
  };


  useEffect(() => {
    fetchPointsData();
  }, []);

  if (!user) {
    return <div className="text-gray-500">You are not logged in</div>;
  }

  return (
    <div className="px-96 pb-[6vh]">
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Total Points Earned: {totalPoints}</h3>
        <h3 className="text-xl font-bold mb-4">Points Log</h3>
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">S.No</th>
              <th className="border px-4 py-2">Activity Type</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">From Date</th>
              <th className="border px-4 py-2">To Date</th>
              <th className="border px-4 py-2">Points Earned</th>
            </tr>
          </thead>
          <tbody>
            {pointsLog.map((log, index) => (
              <tr key={log.id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{log.activityType}</td>
                <td className="border px-4 py-2">{log.title}</td>
                <td className="border px-4 py-2">{new Date(log.fromDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(log.toDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{log.pointsEarned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full">
        <Submissions />
        <RejectionsDisplay />
      </div> 
    </div>
  );
}

export default PointDisplay;
