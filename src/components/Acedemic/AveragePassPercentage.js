function AveragePassPercentage() {
  // CHANGE value to P1 to P5 to manually change feedback checkbox
  let points;
  const avgPercentage = Number("75");

  if (avgPercentage > 80) points = 6;
  if (avgPercentage > 70 && avgPercentage <= 80) points = 6;
  if (avgPercentage > 60 && avgPercentage <= 70) points = 4;
  if (avgPercentage > 50 && avgPercentage <= 60) points = 2;
  if (avgPercentage <= 50) points = 0;

  return (
    <>
      <h3 className="text-2xl flex font-bold justify-left pl-10 mt-4 p-2 border-t-2 border-stone-300">
        Student Average Pass Percentage
      </h3>
      <div className="flex justify-left pl-10 items-center mt-3 gap-7">
        <label className="block w-full mb-2">Average Percentage:</label>
        <input
          className="text-sm font-semibold bg-white mx-3"
          type="text"
          value={avgPercentage + "%"}
          disabled
          style={{
            maxWidth: '70%',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div className="flex justify-left pl-10 items-center mt-3 gap-7">
        <label className="block w-full mb-2">Points:</label>
        <input
          className="text-sm font-semibold bg-white mx-3"
          type="text"
          value={points}
          
          style={{
            maxWidth: '70%',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
          }}
        />
      </div>
    </>
  );
}

export default AveragePassPercentage;