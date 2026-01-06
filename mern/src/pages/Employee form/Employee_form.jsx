
import React, { useState, useEffect, useCallback } from "react";
import Dropdown from "../../utils/dropdown/dropdown";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
import Actionbutton from "../../utils/actionbutton/actionbutton";
import AddCandidate from "../../components/AddEmployeeModal/AddEmployeeModal";
import axios from "axios";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [search, setSearch] = useState("");



  const fetchAllEmployees = useCallback(async () => {
    try {
      console.log("🔄 Refreshing all employees...");
      const response = await axios.get("http://localhost:8009/forms/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("✅ Forms API Response:", response.data);
      const data = response.data.data || [];
      setAllEmployees(data);

      // // Reset filters to show all data
      // if (!status && !gender) {
      //   setEmployees(data);
      // }
    } catch (error) {
      console.error("❌ Forms Error:", error);
    }
  }, []);



  useEffect(() => {
    fetchAllEmployees();
  }, [fetchAllEmployees]);



  useEffect(() => {
    if (status || gender) {
      fetchEmployees();
    } else {
      setEmployees(allEmployees);
    }
  }, [status, gender, allEmployees]);

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (gender) params.append('gender', gender);

      const response = await axios.get(`http://localhost:8009/forms/search?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("✅ Filtered Results:", response.data.data);
      setEmployees(response.data.data || []);
    } catch (error) {
      console.error("❌ Filter Error:", error);
    }
  };

  const handleEdit = (employee) => {
    setEditData(employee);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axios.delete(`http://localhost:8009/forms/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchAllEmployees();
      alert("Employee deleted successfully!");
    } catch (error) {
      console.error("❌ Delete Error:", error);
      alert("Error deleting employee");
    }
  };

  // Client-side search (name, state, status, gender)
  const filteredEmployees = employees.filter(emp =>
    !search ||
    emp.name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.state?.toLowerCase().includes(search.toLowerCase()) ||
    emp.status?.toLowerCase().includes(search.toLowerCase()) ||
    emp.gender?.toLowerCase().includes(search.toLowerCase())
  );

  // Default placeholder image (same color as your theme)
  const defaultImage = "https://via.placeholder.com/64x64/4D007D/FFFFFF?text=?";





  const generatePrintHTML = (empList) => `
<!DOCTYPE html>
<html>
<head>
  <title>Employee Directory - ${empList.length} Employees</title>
  <meta charset="UTF-8">
  <style>
    @page { margin: 1cm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 20px; color: #333; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4D007D; padding-bottom: 20px; }
    .header h1 { color: #4D007D; margin: 0; font-size: 28px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: linear-gradient(135deg, #4D007D, #7C3AED); color: white; font-weight: 600; }
    tr:hover { background: #f8f9ff; }
    .status-active { color: #10B981; font-weight: bold; }
    .status-inactive { color: #EF4444; font-weight: bold; }
    .print-btn { background: #4D007D; color: white; padding: 12px 24px; border: none; border-radius: 25px; cursor: pointer; font-weight: 600; margin: 20px auto; display: block; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Employee Directory</h1>
    <p>Total Employees: ${empList.length} | Generated: ${new Date().toLocaleDateString('en-IN')}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>ID</th>
        <th>Email</th>
        <th>Gender</th>
        <th>State</th>
        <th>DOB</th>
        <th>Status</th>
        <th>Image</th>
      </tr>
    </thead>
    <tbody>
      ${empList.map(emp => `
        <tr>
          <td><strong>${emp.name || 'N/A'}</strong></td>
          <td>${emp._id?.slice(-6) || 'N/A'}</td>
          <td>${emp.name || 'N/A'}</td>
          <td>${emp.gender || 'N/A'}</td>
          <td>${emp.state || 'N/A'}</td>
          <td>${emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString('en-IN') : 'N/A'}</td>
          <td><span class="status-${emp.status?.toLowerCase()}">${emp.status || 'N/A'}</span></td>
           <td>${emp.image ? '<img src="' + emp.image + '" style="width:50px;height:50px;object-fit:cover;border-radius:4px">' : 'No Image'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <button class="print-btn" onclick="window.print()">
    <i class="fas fa-print"></i> Print Directory
  </button>
  <p style="text-align: center; font-size: 12px; color: #64748b; margin-top: 30px;">
    HR Management System | ${new Date().toLocaleDateString('en-IN')}
  </p>
</body>
</html>
`;

  const handlePrintAll = async (empList) => {
    console.log('🖨️ Printing:', empList?.length || 0, 'employees');

    if (!empList || empList.length === 0) {
      alert('No employees to print! Add some employees first.');
      return;
    }

    // Try popup first
    let printWindow = window.open('', '_blank', 'width=1000,height=700,scrollbars=yes,resizable=yes');

    if (!printWindow) {
      // Popup blocked - download HTML instead
      const htmlContent = generatePrintHTML(empList);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Employee_Directory_${new Date().toISOString().split('T')[0]}.html`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    printWindow.document.write(generatePrintHTML(empList));
    printWindow.document.close();
    console.log('✅ Print window opened');
  };







  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <Navbar />

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 bg-white border-b shadow-sm gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            <Dropdown
              label="Status"
              menuItems={[
                { label: "All Status", onClick: () => setStatus("") },
                { label: "Active", onClick: () => setStatus("Active") },
                { label: "Inactive", onClick: () => setStatus("Inactive") },
              ]}
            />
            <Dropdown
              label="Gender"
              menuItems={[
                { label: "All Gender", onClick: () => setGender("") },
                { label: "Male", onClick: () => setGender("Male") },
                { label: "Female", onClick: () => setGender("Female") },
                { label: "Trans", onClick: () => setGender("Trans") },
              ]}
            />
            <div className="relative flex-1 max-w-md">
              <input
                className="w-full h-12 pl-12 pr-5 border-2 rounded-3xl focus:outline-none focus:border-[#4D007D] focus:ring-4 focus:ring-purple-100 shadow-sm transition-all"
                type="search"
                placeholder="Search by name, state, status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <span className="px-4 py-2 bg-[#4D007D]/10 text-[#4D007D] rounded-full text-sm font-semibold border border-[#4D007D]/20">
              {filteredEmployees.length} results
            </span>
          </div>

          {/* <button
    onClick={() => handlePrintAll(employees)}  // Use 'employees' state!
    disabled={employees.length === 0}
    className="px-6 py-2 bg-gradient-to-r from-[#4D007D] to-[#7B2CBF] text-white rounded-full hover:shadow-xl shadow-lg transition-all font-semibold text-sm flex items-center gap-2 hover:scale-[1.02]"
    title={`${employees.length} employees`}
  >
    <i className="fas fa-print"></i>
    Print List ({employees.length})
  </button> */}
          <button
            onClick={() => handlePrintAll(filteredEmployees || employees)}
            disabled={(filteredEmployees || employees)?.length === 0}
            className="px-4 py-2 bg-[#4D007D] text-white rounded-full hover:bg-indigo-600 disabled:opacity-50 shadow-lg transition-all font-semibold flex items-center gap-2"
          >
            <i className="fas fa-print"></i>
            Print Employee List ({(filteredEmployees || employees)?.length || 0})
          </button>


          <AddCandidate
            showModal={showModal}
            setShowModal={setShowModal}
            editData={editData}
            refreshData={fetchAllEmployees}
          // showDepartment={false}
          // showDate={false}
          />
        </div>

        {/* Employees Table */}
        <div className="w-full h-full p-1 sm:p-3 lg:p-6 flex flex-col">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-gray-200 shadow-2xl flex-1 overflow-hidden">

            {/* Mobile Cards (hidden on desktop) */}
            <div className="lg:hidden overflow-y-auto h-full p-4 space-y-3">
              {filteredEmployees.map((emp, index) => (
                <div
                  key={emp._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:border-[#4D007D]/30 hover:-translate-y-0.5 transition-all duration-300 p-4"
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={emp.image ? `http://localhost:8009/uploads/${emp.image}` : 'https://via.placeholder.com/64x64/4D007D/FFFFFF?text=?'}
                          alt={emp.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md hover:shadow-lg transition-all"
                          onError={(e) => {
                            console.error('Image failed:', e.target.src);
                            e.target.src = 'https://via.placeholder.com/64x64/4D007D/FFFFFF?text=?';
                          }}
                        />
                      </div>
                      {/* Name + Sr */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-lg text-gray-900 truncate">{emp.name || 'N/A'}</h3>
                        <p className="text-xs text-[#4D007D] font-mono">#{index + 1}</p>
                      </div>
                    </div>
                    {/* Status Badge */}
                    <span className={`px-2.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${emp.status === 'Active'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-orange-100 text-orange-800 border border-orange-200'
                      }`}>
                      {emp.status || 'Pending'}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                    <div><span className="font-semibold text-gray-900">Gender:</span> {emp.gender || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-900">State:</span> {emp.state || 'N/A'}</div>
                    <div><span className="font-semibold text-gray-900">DOB:</span> {emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString('en-IN') : 'N/A'}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-2 border-t border-gray-100">
                    <Actionbutton
                      menuItems={[
                        { label: "Edit", onClick: () => handleEdit(emp), icon: "fas fa-edit" },
                        { label: "Delete", onClick: () => handleDelete(emp._id), icon: "fas fa-trash", className: "text-red-500 hover:bg-red-50" },
                        { label: 'Print', onClick: () => handlePrint(emp), icon: 'fas fa-print', className: 'text-blue-500 hover:bg-blue-50' },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (hidden on mobile) */}
            <div className="hidden lg:block h-full overflow-x-auto ">
              <table className="w-full text-sm table-fixed">
                <thead className="bg-gradient-to-r from-[#4D007D] via-[#7B2CBF] to-[#A855F7] text-white sticky top-0">
                  <tr className="divide-x divide-white/20 ">
                    <th className="w-12 px-3 py-4 text-left font-bold text-xs">Sr</th>
                    <th className="w-20 px-3 py-4 text-left font-bold text-xs">Image</th>
                    <th className="w-[200px] px-4 py-4 text-left font-bold">Name</th>
                    <th className="w-20 px-3 py-4 text-left font-bold text-xs">Gender</th>
                    <th className="w-24 px-3 py-4 text-left font-bold text-xs">State</th>
                    <th className="w-28 px-4 py-4 text-left font-bold text-xs">DOB</th>
                    <th className="w-24 px-3 py-4 text-left font-bold text-xs">Status</th>
                    <th className="w-36 px-4 py-4 text-left font-bold text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEmployees.map((emp, index) => (
                    <tr
                      key={emp._id}
                      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50/50 hover:shadow-lg transition-all duration-200 divide-x divide-gray-100 border-b hover:border-[#4D007D]/20"
                    >
                      <td className="w-12 px-3 py-4 text-center">
                        <span className="font-mono font-semibold text-[#4D007D] text-sm">{index + 1}</span>
                      </td>
                      <td className="w-20 px-2 py-3">
                        <img
                          src={emp.image ? `http://localhost:8009/uploads/${emp.image}` : 'https://via.placeholder.com/48x48/4D007D/FFFFFF?text=?'}
                          alt={emp.name}
                          className="w-12 h-12 rounded-xl object-cover border shadow-sm mx-auto hover:shadow-md transition-all"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48x48/4D007D/FFFFFF?text=?';
                          }}
                        />
                      </td>
                      <td className="w-[200px] px-4 py-4">
                        <div className="font-semibold text-gray-900 hover:text-[#4D007D] transition-colors truncate">
                          {emp.name || 'N/A'}
                        </div>
                      </td>
                      <td className="w-20 px-3 py-4 capitalize text-gray-700 font-medium text-sm">{emp.gender || 'N/A'}</td>
                      <td className="w-24 px-3 py-4 text-gray-600 text-sm">{emp.state || 'N/A'}</td>
                      <td className="w-28 px-4 py-4 text-gray-600 text-sm">
                        {emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td className="w-24 px-3 py-4">
                        <span className={`px-2.5 py-1.5 rounded-full text-xs font-bold shadow-sm inline-block ${emp.status === 'Active'
                            ? 'bg-green-100 text-green-800 border border-green-200 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200'
                          } transition-all whitespace-nowrap`}>
                          {emp.status || 'Pending'}
                        </span>
                      </td>
                      <td className="w-36 px-4 py-4">
                        <Actionbutton
                          menuItems={[
                            { label: "Edit", onClick: () => handleEdit(emp), icon: "fas fa-edit" },
                            { label: "Delete", onClick: () => handleDelete(emp._id), icon: "fas fa-trash", className: "text-red-500 hover:bg-red-50" },
                            { label: 'Print', onClick: () => handlePrint(emp), icon: 'fas fa-print', className: 'text-blue-500 hover:bg-blue-50' },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}

                  {/* Empty State */}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-20 px-4">
                        <div className="space-y-4 max-w-md mx-auto">
                          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[#4D007D]/20 to-[#7B2CBF]/20 rounded-3xl flex items-center justify-center">
                            <i className="fas fa-users text-3xl text-[#4D007D] opacity-50"></i>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Employees Found</h3>
                            <p className="text-gray-500 text-lg">Try adjusting your search or filters</p>
                          </div>
                          <button
                            onClick={() => { setSearch(""); setStatus(""); setGender(""); }}
                            className="px-8 py-3 bg-gradient-to-r from-[#4D007D] to-[#7B2CBF] text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Employees;







const handlePrint = async (emp) => {
  // [Keep existing image conversion code unchanged]
  let imageSrc = 'https://via.placeholder.com/120x120/4D007D/FFFFFF?text=?';

  if (emp.image) {
    try {
      const fullImageUrl = emp.image.startsWith('http')
        ? emp.image
        : `http://localhost:8009/uploads/${emp.image}`;

      const response = await fetch(fullImageUrl);
      if (response.ok) {
        const blob = await response.blob();
        imageSrc = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }
    } catch (error) {
      console.warn('Image load failed for print:', error);
    }
  }

  const printWindow = window.open('', '_blank', 'width=794,height=1123'); // A4 dimensions
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Employee Profile - ${emp.name}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
      <style>
        @page { size: A4; margin: 15mm; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          color: #2c3e50; 
          line-height: 1.4;
          font-size: 11pt;
          max-height: 100vh;
          overflow: hidden;
        }
        .container { 
          height: 100vh; 
          display: flex; 
          flex-direction: column;
          background: white; 
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .company-header { 
          background: linear-gradient(135deg, #4D007D, #7B2CBF); 
          color: white; 
          padding: 20px 25px; 
          text-align: center; 
          flex-shrink: 0;
        }
        .company-header h1 { 
          font-size: 22px; 
          margin-bottom: 5px; 
          font-weight: 600; 
        }
        .company-header p { 
          font-size: 12px; 
          opacity: 0.9; 
        }
        .content { 
          flex: 1; 
          padding: 25px; 
          display: flex; 
          flex-direction: column;
          overflow: hidden;
        }
        .profile-header { 
          display: flex; 
          gap: 20px; 
          margin-bottom: 20px; 
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .profile-image { 
          width: 100px; 
          height: 100px; 
          border-radius: 12px; 
          object-fit: cover; 
          border: 3px solid white; 
          box-shadow: 0 5px 15px rgba(77,0,125,0.3); 
          flex-shrink: 0;
        }
        .profile-info h2 { 
          color: #4D007D; 
          font-size: 24px; 
          margin-bottom: 5px; 
          font-weight: 700; 
          line-height: 1.1;
        }
        .profile-subtitle { 
          color: #7f8c8d; 
          font-size: 13px; 
          display: flex; align-items: center; gap: 6px;
          font-weight: 500;
        }
        .details-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 15px; 
          flex: 1;
        }
        .detail-card { 
          background: #f8f9fa; 
          padding: 15px 12px; 
          border-radius: 10px; 
          border-left: 4px solid #4D007D;
          display: flex; flex-direction: column;
        }
        .detail-icon { 
          width: 36px; 
          height: 36px; 
          border-radius: 8px; 
          background: linear-gradient(135deg, #4D007D, #7B2CBF); 
          color: white; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 14px; 
          margin-bottom: 8px;
          align-self: flex-start;
        }
        .detail-label { 
          font-size: 10px; 
          font-weight: 600; 
          color: #4D007D; 
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
          margin-bottom: 4px;
        }
        .detail-value { 
          font-size: 14px; 
          font-weight: 600; 
          color: #2c3e50; 
          line-height: 1.3;
        }
        .status-badge { 
          display: inline-flex; align-items: center; gap: 6px; 
          padding: 6px 14px; 
          border-radius: 18px; 
          font-weight: 600; 
          font-size: 11px; 
          align-self: flex-start;
        }
        .status-active { 
          background: #d4edda; 
          color: #155724; 
          border: 1px solid #28a745; 
        }
        .status-inactive { 
          background: #f8d7da; 
          color: #721c24; 
          border: 1px solid #dc3545; 
        }
        .action-section { 
          padding: 15px 25px; 
          background: #f8f9fa; 
          text-align: center;
          flex-shrink: 0;
        }
        .print-btn { 
          background: linear-gradient(135deg, #4D007D, #7B2CBF); 
          color: white; 
          padding: 10px 25px; 
          border: none; 
          border-radius: 25px; 
          font-size: 12px; 
          font-weight: 600; 
          cursor: pointer; 
          box-shadow: 0 4px 12px rgba(77,0,125,0.3);
          display: inline-flex; align-items: center; gap: 8px;
        }

        /* Single Page Print Optimization */
        @media print { 
          body { 
            -webkit-print-color-adjust: exact; 
            color-adjust: exact; 
            print-color-adjust: exact;
          }
          .container { 
            height: auto !important; 
            box-shadow: none !important; 
            margin: 0 !important;
          }
          .action-section, .print-btn { display: none !important; }
          .content { padding: 20px !important; }
          * { break-inside: avoid !important; page-break-inside: avoid !important; }
          @page { margin: 10mm !important; }
        }

        /* Screen Responsiveness (compact for preview) */
        @media (max-width: 600px) {
          .details-grid { grid-template-columns: 1fr; gap: 12px; }
          .profile-header { flex-direction: column; align-items: center; text-align: center; gap: 15px; }
          .profile-image { width: 90px; height: 90px; }
          body { font-size: 10pt; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="company-header">
          <i class="fas fa-users" style="font-size: 28px; margin-bottom: 8px; opacity: 0.9;"></i>
          <h1>Employee Profile</h1>
          <p>Employee Management System</p>
        </div>
        
        <div class="content">
          <div class="profile-header">
            <img src="${imageSrc}" alt="${emp.name}" class="profile-image">
            <div style="flex: 1;">
              <h2>${emp.name || 'N/A'}</h2>
              <div class="profile-subtitle">
                <i class="fas fa-briefcase" style="font-size: 13px;"></i> 
                Employee ID: ${emp.id || 'N/A'}
              </div>
            </div>
          </div>
          
          <div class="details-grid">
            <div class="detail-card">
              <div class="detail-icon"><i class="fas fa-venus-mars"></i></div>
              <div class="detail-label">Gender</div>
              <div class="detail-value">${emp.gender || 'N/A'}</div>
            </div>
            <div class="detail-card">
              <div class="detail-icon"><i class="fas fa-map-marker-alt"></i></div>
              <div class="detail-label">State</div>
              <div class="detail-value">${emp.state || 'N/A'}</div>
            </div>
            <div class="detail-card">
              <div class="detail-icon"><i class="fas fa-calendar-alt"></i></div>
              <div class="detail-label">Date of Birth</div>
              <div class="detail-value">${emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString('en-IN') : 'N/A'}</div>
            </div>
            <div class="detail-card">
              <div class="detail-icon"><i class="fas fa-circle-check"></i></div>
              <div class="detail-label">Status</div>
              <div class="detail-value">
                <span class="status-badge ${emp.status === 'Active' ? 'status-active' : 'status-inactive'}">
                  <i class="fas fa-${emp.status === 'Active' ? 'check-circle' : 'times-circle'}" style="font-size: 11px;"></i>
                  ${emp.status || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="action-section">
          <button class="print-btn" onclick="window.print()">
            <i class="fas fa-print"></i> Print
          </button>
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
};





const handlePrintAll = async () => {
  console.log('🚀 Print clicked! Employees count:', employees.length);

  if (employees.length === 0) {
    console.error('❌ No employees');
    alert('No employees to print!');
    return;
  }

  // Try popup first
  let printWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');

  // Check if popup blocked
  if (!printWindow || printWindow.closed || typeof printWindow.closed === 'undefined') {
    console.warn('🚫 Popup blocked! Using data URL fallback');
    // Fallback: Create blob and download
    const htmlContent = generatePrintHTML(employees);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Employee_Directory_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  console.log('✅ Popup opened successfully');
  printWindow.document.write(generatePrintHTML(employees));
  printWindow.document.close();
};
