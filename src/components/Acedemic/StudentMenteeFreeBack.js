import { useState } from "react";

function StudentMenteeFeedBack() {
  const [points, setPoints] = useState(0);
  const [count, setCount] = useState(0);

  const calculatePercentage = () => {
    if (count === 0) return 0;
    return (points / count) * 100;
  };

  return (
    <>
      <h3 className="text-2xl flex font-bold justify-left pl-10 mt-4 p-2 border-t-2 border-stone-300">
      Student Mentee FeedBack
      </h3>
      <div className="flex flex-wrap items-center gap-7 mt-5 ml-10">
        <div className="w-full md:w-1/3">
          <label className="block w-full mb-2">Points:</label>
          <input
            className="text-sm font-semibold bg-white w-full p-2 border rounded"
            type="number"
            value={points}
            min="0"
            max="5"
            onChange={(e) => setPoints(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/3">
          <label className="block w-full mb-2">Count:</label>
          <input
            className="text-sm font-semibold bg-white w-full p-2 border rounded"
            type="number"
            value={count}
            min="0"
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/3">
          <label className="block w-full mb-2">Percentage:</label>
          <input
            className="text-sm font-semibold bg-white w-full p-2 border rounded"
            type="text"
            value={calculatePercentage() + "%"}
            disabled
          />
        </div>
      </div>
    </>
  );
}

export default StudentMenteeFeedBack;
