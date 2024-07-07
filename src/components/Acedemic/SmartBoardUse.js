import { useState } from "react";

function SmartBoardUse() {
  const [yesVotes, setYesVotes] = useState(0);
  const [noVotes, setNoVotes] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  function handleVote(vote) {
    if (vote === "yes") {
      setYesVotes(yesVotes + 1);
    } else {
      setNoVotes(noVotes + 1);
    }
    setTotalVotes(totalVotes + 1);
  }

  const yesPercentage = totalVotes > 0? (yesVotes / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0? (noVotes / totalVotes) * 100 : 0;

  return (
    <div className="flex mt-4 pt-2 justify-left pl-10 border-t-2 border-stone-300">
      <div className="justify-center mb-4">
        <h3 className="text-2xl flex font-bold">
          Smart Board Use
        </h3>
        <div className="flex justify-center gap-9 mt-4">
          <div className="flex item-center gap-2 justify-between">
            <span className="text-sm font-semibold">Yes</span>
            <div
              className="w-40 h-7 bg-gray-200 rounded border border-black"
              style={{ borderColor: "black", borderWidth: 1, borderRadius: 4 }}
            >
              <div
                className="h-7 bg-green-500 rounded"
                style={{ width: `${yesPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold">{yesPercentage.toFixed(2)}%</span>
          </div>
          <div className="flex item-center gap-2 justify-between">
            <span className="text-sm font-semibold">No</span>
            <div
              className="w-40 h-7 bg-gray-200 rounded border border-black"
              style={{ borderColor: "black", borderWidth: 1, borderRadius: 4 }}
            >
              <div
                className="h-7 bg-red-500 rounded"
                style={{ width: `${noPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold">{noPercentage.toFixed(2)}%</span>
          </div>
        </div>
        <div className="flex justify-left gap-4 mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 my-4 rounded"
            onClick={() => handleVote("yes")}
            style={{ marginRight: 16 }}
          >
            Vote Yes
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 my-4 rounded"
            onClick={() => handleVote("no")}
          >
            Vote No
          </button>
        </div>
        <div className="text-sm font-semibold text-left mt-4">
          Total Votes: {totalVotes}
        </div>
      </div>
    </div>
  );
}

export default SmartBoardUse;