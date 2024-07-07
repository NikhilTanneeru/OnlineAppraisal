// /* eslint-disable react/prop-types */
// import ExtraClass from "../components/Acedemic/ExtraClass";
// import IndistrialExpertLecture from "../components/Acedemic/IndustrialExpertLecture";
// import MOOC from "../components/Acedemic/MOOC";
// import StudentIndustrialVisit from "../components/Acedemic/StudentIndustrialVisit";
// import ValueAddedCourse from "../components/Acedemic/ValueAddedCourse";
// import Workshop from "../components/Acedemic/Workshop";
// import Footer from "../components/ui/Footer";
// import Hackathon from "../components/Acedemic/Hackathon";
// import Publications from "../components/Acedemic/Publications";
// import {useContext} from 'react';
// import UserContext from '../UserContext';


// function Acedemic({ activeTab, setActiveTab }) {
//   const { user } = useContext(UserContext); // Get user from context
//   return (
//     <div>
//       <div className="px-96 pb-[8vh]">
//         <div className="flex-col justify-center bg-stone-200">
//           <Workshop userId={user}/>
//           <Hackathon/>
//           <IndistrialExpertLecture />
//           <ValueAddedCourse />
//           <ExtraClass />
//           <MOOC />
//           <Publications/>
//           <StudentIndustrialVisit />
//         </div>
//       </div>
//       <div className="flex items-center justify-center w-full h-[8vh] bg-stone-300 text-black fixed bottom-0 left-0 m-0 p-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default Acedemic;


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
import ExtraClass from "../components/Acedemic/ExtraClass";
import IndistrialExpertLecture from "../components/Acedemic/IndustrialExpertLecture";
import MOOC from "../components/Acedemic/MOOC";
import StudentIndustrialVisit from "../components/Acedemic/StudentIndustrialVisit";
import ValueAddedCourse from "../components/Acedemic/ValueAddedCourse";
import Workshop from "../components/Acedemic/Workshop";
import Footer from "../components/ui/Footer";
import Hackathon from "../components/Acedemic/Hackathon";
import Publications from "../components/Acedemic/Publications";
import UserContext from '../UserContext';
import Training from '../components/Acedemic/Training';
import axios from 'axios';

function Acedemic({ activeTab, setActiveTab }) {
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

  const handleTrainingComplete = async () => {
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
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="px-96 pb-[8vh]">
        <div className="flex-col justify-center bg-stone-200">
          {!isTrainingCompleted && <Training onTrainingComplete={handleTrainingComplete} />}
          {isTrainingCompleted && (
            <>
              <Workshop userId={user._id} />
              <Hackathon />
              <IndistrialExpertLecture />
              <ValueAddedCourse />
              <ExtraClass />
              <MOOC />
              <Publications />
              <StudentIndustrialVisit />
            </>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-[8vh] bg-stone-300 text-black fixed bottom-0 left-0 m-0 p-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        <Footer />
      </div>
    </div>
  );
}

export default Acedemic;
