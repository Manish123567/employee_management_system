import React from "react";

function ConfirmModal({ visible, onConfirm, onCancel }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onCancel}></div>

      {/* Modal Box */}
      <div className="relative bg-white  rounded-2xl w-full max-w-2xl mx-auto pb-6 z-50 shadow-lg">
        {/* Close Button */}
        <button onClick={onCancel} className="absolute top-3 right-3">
          <svg
            className="h-5 w-5 text-gray-400 hover:text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586..."
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="text-center">
          <div className="p-3 bg-[#4D007D] text-white rounded-t-2xl">
            <h2 className="text-2xl font-semibold">Confirm Logout</h2>
          </div>
          <p className="text-black  mt-4">Are you sure you want to logout?</p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-center gap-6">
          <button
            onClick={onCancel}
            className="px-8 py-1 bg-[#4D007D] text-white hover:bg-[#421a5a] rounded-full transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-1 bg-white text-red-800 rounded-full  transition border-2 border-red-800 "
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
