/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
function Header({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-between gap-12 font-bold">
      <h1
        onClick={() => setActiveTab("Research")}
        className="text-4xl flex items-center hover:cursor-pointer"
      >
        Research
      </h1>
      <h1
        onClick={() => setActiveTab("Acedemic")}
        className="text-4xl flex items-center hover:cursor-pointer"
      >
        Academic
      </h1>
      <h1
        onClick={() => setActiveTab("Administrative")}
        className="text-4xl flex items-center hover:cursor-pointer"
      >
        Administrative
      </h1>
    </div>
  );
}

export default Header;
