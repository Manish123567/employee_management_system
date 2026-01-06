



import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import img2 from "../../assets/Images/logo.png";
import img3 from "../../assets/Images/employee.png";
import img4 from "../../assets/Images/star.png";
import img6 from "../../assets/Images/logout.png";
import { FaBars } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import ConfirmModal from "../../utils/cofirmmodal/confirmmodal";
import { MdOutlinePersonAdd, MdEventNote } from "react-icons/md";  // Add for Attendance

const Sidebar = () => {  // ✅ Capitalized
  const { logout, isAuthenticated, loading } = useAuth();  // ✅ Full destructuring
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ Auth protection
  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/');
  }, [isAuthenticated, loading, navigate]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogoutClick = () => setShowConfirm(true);

  const handleConfirmLogout = () => {
    setShowConfirm(false);
    logout();
    navigate("/");
  };

  const handleCancelLogout = () => setShowConfirm(false);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div>
      <div className="md:hidden p-4">
        <FaBars className="text-2xl cursor-pointer" onClick={toggleSidebar} />
      </div>

      {/* Sidebar content unchanged, but fixes below */}
      <div className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:block md:w-[280px]`}
      >
        {/* Header/search unchanged */}
        
        <nav>
          <h1 className="text-gray-400 font-medium py-2.5 pl-4 my-4">Overview</h1>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `text-gray-900 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-[#4D007D] hover:to-[#4D007D] hover:text-white flex gap-3 ${isActive ? 'bg-gradient-to-r from-[#4D007D] to-[#4D007D] text-white' : ''}`}
          >
            <MdOutlinePersonAdd className="size-6 text-gray-800" />
            Dashboard
          </NavLink>

          <h1 className="text-gray-400 font-medium py-2.5 pl-4 my-4">Employee Details</h1>
          <NavLink to="/employees" className={({ isActive }) => `block text-gray-900 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-[#4D007D] hover:to-[#4D007D] hover:text-white flex gap-3 ${isActive ? 'bg-gradient-to-r from-[#4D007D] to-[#4D007D] text-white' : ''}`}>
            <img src={img3} className="size-6" alt="Employees" />
            Employees
          </NavLink>
         
       
          <h1 className="text-gray-400 font-medium py-2.5 pl-4 my-4">Others</h1>
          <button
            className="block text-gray-900 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-[#4D007D] hover:to-[#4D007D] hover:text-white flex gap-3 w-full text-left"
            onClick={handleLogoutClick}
          >
            <img src={img6} className="size-6" alt="Logout" />
            Logout
          </button>
        </nav>
      </div>
      <ConfirmModal visible={showConfirm} onConfirm={handleConfirmLogout} onCancel={handleCancelLogout} />
    </div>
  );
};

export default Sidebar;
