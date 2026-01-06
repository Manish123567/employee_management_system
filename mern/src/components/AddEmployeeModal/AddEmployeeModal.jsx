
import React, { useState, useEffect } from "react";
import upload from "../../assets/Images/upload.png";
import axios from "axios";

const BillingModal = ({
  showModal,
  setShowModal,
  editData,
  refreshData,
  // showDepartment,
  // showDate,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    state: "",
    dateOfBirth: "",
    status: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  // Cleanup object URL on unmount/change
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        gender: editData.gender || "",
        state: editData.state || "",
        dateOfBirth: formatDate(editData.dateOfBirth),
        status: editData.status || "",
        image: null,
      });
      // Show existing image preview
      if (editData.image) {
        setImagePreview(editData.image);
      }
    } else {
      setFormData({
        name: "",
        gender: "",
        state: "",
        dateOfBirth: "",
        status: "",
        image: null,
      });
      setImagePreview(null);
    }
  }, [editData]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });

      // Update preview
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else if (editData?.image) {
        setImagePreview(editData.image);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    }

    try {
      if (editData?._id) {
        await axios.put(
          `http://localhost:8009/forms/update/${editData._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Candidate updated successfully!");
      } else {
        await axios.post("http://localhost:8009/forms", data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Form submitted successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        gender: "",
        state: "",
        dateOfBirth: "",
        status: "",
        image: null,
      });
      setImagePreview(null);
      setShowModal(false);
      refreshData();
    } catch (err) {
      alert("Error submitting form: " + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Open Modal Button */}


      <div className="py-1 px-8 rounded-full flex justify-start">
        <button
          onClick={() => setShowModal(true)}
          className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4D007D] mx-auto transition duration-150 ease-in-out hover:bg-indigo-600 bg-[#4D007D] text-white px-4 sm:px-8 py-2 text-xs sm:text-sm rounded-full"
        >
          Add Candidate
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 py-12 bg-gray-700 bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white shadow-xl rounded-lg border border-gray-400 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 left-0 w-full bg-[#4D007D] text-white text-center py-3 rounded-t-lg">
              <h2 className="text-xl font-bold">
                {editData?._id ? "Edit Candidate" : "Add New Candidate"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-2 text-white hover:text-gray-200 text-2xl font-bold focus:outline-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form className="p-6 pt-16 space-y-6" onSubmit={handleSubmit}>
              {/* Name & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    className="w-full border border-[#4D007D] bg-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-indigo-500"
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    name="name"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    className="w-full border border-[#4D007D] bg-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-indigo-500"
                    value={formData.gender}
                    name="gender"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Trans">Trans</option>
                  </select>
                </div>
              </div>

              {/* Status & State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border border-[#4D007D] bg-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-indigo-500"
                    value={formData.status}
                    name="status"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    className="w-full border border-[#4D007D] bg-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-indigo-500"
                    value={formData.state}
                    name="state"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select State</option>
                    <option value="U.P">U.P</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="M.P">M.P</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Assam">Assam</option>
                    <option value="Uttrakhand">Uttrakhand</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Date of Birth & Image Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    className="w-full border border-[#4D007D] bg-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:bg-white focus:border-indigo-500"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <div className="relative">
                    <input
                      className="w-full border border-[#4D007D] bg-gray-200 rounded-lg py-2 px-4 pr-12 focus:outline-none focus:bg-white focus:border-indigo-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4D007D] file:text-white hover:file:bg-indigo-600"
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <img
                      src={upload}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 opacity-50 pointer-events-none"
                      alt="Upload icon"
                    />
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-xs mx-auto h-48 object-cover rounded-lg shadow-md"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {editData?.image ? "Current image (change to update)" : "Preview"}
                    </p>
                  </div>
                </div>
              )}

              {/* Checkbox & Submit */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I declare the above information is true to the best of my knowledge
                  </span>
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2 bg-[#4D007D] text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all font-semibold"
                  >
                    {loading ? "Saving..." : (editData?._id ? "Update" : "Save")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingModal;
