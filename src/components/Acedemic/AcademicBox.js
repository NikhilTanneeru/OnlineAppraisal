import React from 'react';
import { Link } from 'react-router-dom';

const AcademicBox = ({ title, path, children, isVisible }) => (
  <div className="border p-4 bg-white shadow-md w-48 h-48 flex flex-col justify-between text-wrap">
    <h3 className="text-xl font-bold">{title}</h3>
    {!isVisible && (
      <Link to={path} className="text-white bg-green-500 p-2 mt-2 text-center">
        Add
      </Link>
    )}
    {isVisible && <div className="mt-4 flex-grow overflow-auto">{children}</div>}
  </div>
);

export default AcademicBox;
