import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch all employees from your existing API
      const response = await axios.get("http://localhost:8009/forms/get", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const employees = response.data.data || [];
      const total = employees.length;
      const active = employees.filter(emp => emp.status === "Active").length;
      const inactive = employees.filter(emp => emp.status === "Inactive").length;

      setStats({ total, active, inactive });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex h-screen bg-white ">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Employee Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Overview of your workforce statistics</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Employees Card */}
              <div className="bg-white  p-8 rounded-2xl shadow-lg border border-gray-200  hover:shadow-xl transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100  rounded-xl">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <p className="text-sm font-medium text-gray-600  uppercase tracking-wide">Total Employees</p>
                    <p className="text-4xl font-bold text-gray-900  mt-1">{stats.total}</p>
                  </div>
                </div>
              </div>

              {/* Active Employees Card */}
              <div className="bg-white  p-8 rounded-2xl shadow-lg border border-gray-200  hover:shadow-xl transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100  rounded-xl">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <p className="text-sm font-medium text-gray-600  uppercase tracking-wide">Active Employees</p>
                    <p className="text-4xl font-bold text-gray-900  mt-1">{stats.active}</p>
                  </div>
                </div>
              </div>

              {/* Inactive Employees Card */}
              <div className="bg-white  p-8 rounded-2xl shadow-lg border border-gray-200  hover:shadow-xl transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100  rounded-xl">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 0l-6.849-6.848a9 9 0 00-12.728 0l6.849 6.849a9 9 0 0012.728 0zm-9.9 0a9 9 0 0012.728 0L13.111 5.636a9 9 0 00-12.728 0z" />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <p className="text-sm font-medium text-gray-600  uppercase tracking-wide">Inactive Employees</p>
                    <p className="text-4xl font-bold text-gray-900  mt-1">{stats.inactive}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
