
// import { useState, useContext } from 'react';
// import ExtraClass from '../components/Acedemic/ExtraClass';
// import IndistrialExpertLecture from '../components/Acedemic/IndustrialExpertLecture';
// import MOOC from '../components/Acedemic/MOOC';
// import StudentIndustrialVisit from '../components/Acedemic/StudentIndustrialVisit';
// import ValueAddedCourse from '../components/Acedemic/ValueAddedCourse';
// import Workshop from '../components/Acedemic/Workshop';
// import Footer from '../components/ui/Footer';
// import Hackathon from '../components/Acedemic/Hackathon';
// import Publications from '../components/Acedemic/Publications';
// import Training from '../components/Acedemic/Training'; // Import the Training component
// import UserContext from '../UserContext';

// function Acedemic({ activeTab, setActiveTab }) {
//   const { user } = useContext(UserContext); // Get user from context
  // const [isTrainingCompleted, setIsTrainingCompleted] = useState(false); // State to track training completion

//   const handleTrainingCompletion = () => {
//     setIsTrainingCompleted(true);
//   };

//   return (
//     <div>
//       <div className="px-96 pb-[8vh]">
//         <div className="flex-col justify-center bg-stone-200">
//           {!isTrainingCompleted && (
//             <Training onTrainingComplete={handleTrainingCompletion} />
//           )}
//           {isTrainingCompleted && (
//             <>
//               <Workshop userId={user} />
//               <Hackathon />
//               <IndistrialExpertLecture />
//               <ValueAddedCourse />
//               <ExtraClass />
//               <MOOC />
//               <Publications />
//               <StudentIndustrialVisit />
//             </>
//           )}
//         </div>
//       </div>
//       <div className="flex items-center justify-center w-full h-[8vh] bg-stone-300 text-black fixed bottom-0 left-0 m-0 p-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default Acedemic;













import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AcademicBox from '../components/Acedemic/AcademicBox';
import UserContext from '../UserContext';
import axios from 'axios';
import Footer from "../components/ui/Footer";

function Academic() {
  const { user } = useContext(UserContext);
  const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);

  useEffect(() => {
    const fetchTrainingStatus = async () => {
      if (user) {
        try {
          const response = await axios.get('/get-training-status', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setIsTrainingCompleted(response.data.isTrainingCompleted);
        } catch (error) {
          console.error('Error fetching training status:', error);
        }
      }
    };

    fetchTrainingStatus();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Horizontal scrollable boxes section */}
      <div className="m-0 p-4 overflow-x-auto whitespace-nowrap bg-stone-200">
        <div className="inline-flex space-x-4">
        {!isTrainingCompleted && (
          <AcademicBox title="Training" path="/home/academic/training" />
        )}
          {isTrainingCompleted && (
            <>
              <AcademicBox title="Workshop" path="/home/academic/workshop" />
              <AcademicBox title="Hackathon" path="/home/academic/hackathon" />
              <AcademicBox title="Industrial Expert Lecture" path="/home/academic/indistrialExpertLecture" />
              <AcademicBox title="Value Added Course" path="/home/academic/valueAddedCourse" />
              <AcademicBox title="Extra Class" path="/home/academic/extraClass" />
              <AcademicBox title="MOOC" path="/home/academic/mooc" />
              <AcademicBox title="Publications" path="/home/academic/publications" />
              <AcademicBox title="Student Industrial Visit" path="/home/academic/studentIndustrialVisit" />
            </>
          )}
        </div>
      </div>

      {/* Outlet section with partial width */}
      <div className="max-w-6xl mx-auto p-4 mb-20 mt-10 border border-black rounded-lg ">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center w-full h-[8vh] bg-stone-300 text-black fixed bottom-0 left-0 m-0 p-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        <Footer />
      </div>
    </div>
  );
}

export default Academic;
