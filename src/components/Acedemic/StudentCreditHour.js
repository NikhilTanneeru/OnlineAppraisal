function StudentCreditHour() {
  let creditHour = Number("100");
  let points;

  if (creditHour > 280) points = 5;
  if (creditHour > 200 && creditHour <= 280) points = 4;
  if (creditHour > 90 && creditHour <= 200) points = 3;
  if (creditHour > 15 && creditHour <= 90) points = 2;
  if (creditHour <= 15) points = 0;

  return (
    <>
      <h3 className="text-2xl flex font-bold justify-left pl-10 mt-4 p-2 border-t-2 border-stone-300">
        Student Credit Hours
      </h3>
      <div className="flex justify-left pl-10 items-center mt-3 gap-7">
        <div className="flex items-center gap-2">
          <label className="block w-full mb-2">Credit Hours:</label>
          <input
            className="text-sm font-semibold bg-white mx-3"
            type="number"
            value={creditHour}
            disabled
            style={{
              maxWidth: "70%",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div className="flex justify-left pl-10 items-center mt-3 gap-7">
          <label className="block w-full mb-2">Points:</label>
          <input
            className="text-sm font-semibold bg-white mx-3"
            type="number"
            value={points}
            disabled
            style={{
              maxWidth: "70%",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
            }}
          />
        </div>
      </div>
    </>
  );
}

export default StudentCreditHour;