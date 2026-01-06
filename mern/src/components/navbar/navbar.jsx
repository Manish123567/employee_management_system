import React from "react";

const navbar = () => {
 
  return (
    <div>
      <div className=" text-white  w-full flex items-center  px-8 py-2">
        <div className="flex items-center ">
          <h2 className="font-bold text-xl text-gray-500 text-center">Employee Management Dashboard</h2>
          <div className="md:hidden flex items-center">
            <button id="menuBtn">
              <i className="fas fa-bars text-gray-500 text-lg"></i>
            </button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default navbar;
