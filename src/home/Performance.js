/* eslint-disable react/prop-types */
import AveragePassPercentage from "../components/Acedemic/AveragePassPercentage";
import StudentCreditHour from "../components/Acedemic/StudentCreditHour";
import StudentFeedBack from "../components/Acedemic/StudentFeedBack";
import StudentMenteeFeedBack from "../components/Acedemic/StudentMenteeFreeBack";
import Footer from "../components/ui/Footer";
import SmartBoardUse from "../components/Acedemic/SmartBoardUse";


function Acedemic() {
  return (
    <div>
      <div className="px-96 pb-[8vh]">
        <div className="flex-col justify-center bg-stone-200">
          <StudentFeedBack />
          <StudentMenteeFeedBack />
          <AveragePassPercentage />
          <StudentCreditHour />
          <SmartBoardUse />
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-[8vh] bg-stone-300 text-black fixed bottom-0 left-0 m-0 p-0" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
        <Footer />
      </div>
    </div>
  );
}

export default Acedemic;