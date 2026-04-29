import { useEffect, useState } from "react";
import axios from "axios";
import './ShowDetails.css';
import CreateDetails from "./CreateDetails";

function ShowDetails() {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSubmissions = () => {
    axios.get("http://127.0.0.1:8000/api/details/")
      .then((res) => {
        setData(res.data.responses);
        setKeys(res.data.keys);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  function deleteDetails(id) {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      axios.delete(`http://127.0.0.1:8000/api/details/${id}/`)
        .then((res) => {
          console.log(res.data);
          setData((prevData) =>
            prevData.filter((item) => item.id !== id)
          );
        })
        .catch((err) => {
          console.log(err);
          alert("Error deleting submission");
        });
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchSubmissions(); // Refresh data after edit
  };

  if (showForm) {
    return (
      <CreateDetails 
        editItem={editingItem} 
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="show-details-container">
      <div className="details-header">
        <h1>📋 KoboToolbox Submissions</h1>
        <p className="subtitle">View and manage all form submissions</p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading submissions...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="no-data-card">
          <p className="no-data-icon">📭</p>
          <p className="no-data-text">No submissions yet.</p>
          <p className="no-data-hint">Submissions will appear here once they are received</p>
        </div>
      ) : (
        <div className="submissions-grid">
          {data.map((response) => (
            <div key={response.id} className="submission-card">
              <div className="card-header">
                <div className="submission-number">
                  <span className="icon">📝</span>
                  <span className="text">Submission #{response.id}</span>
                </div>
                <div className="card-actions">
                  <button
                    onClick={() => handleEdit(response)}
                    className="edit-btn"
                    title="Edit this submission"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteDetails(response.id)}
                    className="delete-btn"
                    title="Delete this submission"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="card-content">
                <table className="details-table">
                  <tbody>
                    {Object.entries(response.metadata)
                      .filter(([key]) => keys.includes(key))
                      .map(([key, value]) => (
                        <tr key={key} className="detail-row">
                          <td className="detail-key">{key}</td>
                          <td className="detail-value">{value || "—"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ShowDetails;
