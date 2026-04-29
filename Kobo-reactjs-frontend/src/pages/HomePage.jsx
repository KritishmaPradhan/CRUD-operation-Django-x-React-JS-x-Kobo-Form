import { useState, useCallback } from "react";
import axios from "axios";
import DisplayTableKoboStu from "../components/KoboFormStuDetail";
import FacultyChart from "../components/FacultyChart";
import "./HomePage.css";

function HomePage() {
  const [view, setView] = useState("");
  const [studentId, setStudentId] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [facultyChartData, setFacultyChartData] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!studentId.trim()) {
      setError("Please enter a student ID");
      return;
    }

    setLoading(true);
    setError("");
    setSearchResults(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/student_details/search/${studentId}/`
      );
      setSearchResults(response.data);
      setView("search");
    } catch (err) {
      setError(err.response?.data?.message || "Student not found. Please check the ID.");
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setStudentId("");
    setSearchResults(null);
    setError("");
    setView("");
  };

  // Extract faculty distribution from student data
  const processFacultyData = useCallback((studentData) => {
    console.log("Processing faculty data:", studentData);
    
    if (!studentData || studentData.length === 0) {
      setFacultyChartData([]);
      return;
    }

    const facultyCount = {};

    // Count students by faculty
    studentData.forEach((student) => {
      const faculty = student.Faculty || "Unknown";
      facultyCount[faculty] = (facultyCount[faculty] || 0) + 1;
    });

    // Convert to chart format
    const chartData = Object.entries(facultyCount)
      .map(([name, count]) => ({
        name,
        value: count,
      }))
      .sort((a, b) => b.value - a.value); // Sort by count descending

    console.log("Chart data:", chartData);
    setFacultyChartData(chartData);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Search Section */}
      <div className="search-hero">
        <div className="search-content">
          <h1 className="search-title">Find Student Records</h1>
          <p className="search-subtitle">Search by Student ID to view details and fee information</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <span>🔍</span>
                    Search
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Search Results */}
      {view === "search" && searchResults && (
        <div className="search-results-section">
          <div className="results-header">
            <h2>Student Record</h2>
            <button onClick={handleClear} className="close-results-btn">
              ✕ Close
            </button>
          </div>

          {searchResults.student_details && (
            <div className="detail-card">
              <h3 className="detail-title">📋 Student Details</h3>
              <div className="detail-grid">
                {Object.entries(searchResults.student_details).map(([key, value]) => (
                  <div key={key} className="detail-item">
                    <span className="detail-label">{key}</span>
                    <span className="detail-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.fee_details && searchResults.fee_details.length > 0 && (
            <div className="detail-card">
              <h3 className="detail-title">💰 Fee Details</h3>
              <div className="fee-table-wrapper">
                <table className="fee-table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th>Fee Amount</th>
                      <th>Paid Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.fee_details.map((fee, index) => {
                      const remaining = fee.Fee_amount - fee.Paid_amount;
                      const isPaid = remaining === 0;
                      return (
                        <tr key={fee.id || index}>
                          <td className="semester-cell">{fee.Semester}</td>
                          <td className="amount-cell">₹{fee.Fee_amount}</td>
                          <td className="amount-cell">₹{fee.Paid_amount}</td>
                          <td className="status-cell">
                            <span className={`status-badge ${isPaid ? 'paid' : 'pending'}`}>
                              {isPaid ? '✓ Paid' : `₹${remaining} Due`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {searchResults.fee_details && searchResults.fee_details.length === 0 && (
            <div className="detail-card">
              <p className="no-fee-message">📭 No fee details found for this student.</p>
            </div>
          )}
        </div>
      )}

      {/* View All Data Buttons */}
      <div className="view-section">
        <h2 className="section-title">Browse All Records</h2>
        <div className="button-group">
          <button 
            onClick={() => setView("student")} 
            className={`view-btn ${view === "student" ? "active" : ""}`}
          >
            <span className="btn-icon">👥</span>
            <span>All Students</span>
          </button>

          <button 
            onClick={() => setView("fee")} 
            className={`view-btn ${view === "fee" ? "active" : ""}`}
          >
            <span className="btn-icon">💵</span>
            <span>All Fees</span>
          </button>
        </div>
      </div>

      {/* Tables */}
      {view === "student" && (
        <>
          <DisplayTableKoboStu
            apiUrl="http://127.0.0.1:8000/api/student_details/display/"
            dataKey="student_details"
            title="📚 Student Details"
            onDataLoad={processFacultyData}
          />
          {facultyChartData.length > 0 && (
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <FacultyChart data={facultyChartData} />
            </div>
          )}
        </>
      )}

      {view === "fee" && (
        <DisplayTableKoboStu
          apiUrl="http://127.0.0.1:8000/api/fee_details/display/"
          dataKey="fee_details"
          title="💳 Fee Details"
        />
      )}
    </div>
  );
}

export default HomePage;