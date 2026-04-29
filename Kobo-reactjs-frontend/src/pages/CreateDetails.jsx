import { useState, useEffect } from "react";
import axios from "axios";
import "./CreateDetails.css";

function CreateDetails({ editItem, onClose }) {
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    gender: "",
    age: "",
    family_no: ""
  });

  // Load edit data when editItem prop changes
  useEffect(() => {
    if (editItem) {
      setEditId(editItem.id);
      setFormData({
        name: editItem.metadata?.name || "",
        contact: editItem.metadata?.contact || "",
        gender: editItem.metadata?.gender || "",
        age: editItem.metadata?.age || "",
        family_no: editItem.metadata?.family_no || ""
      });
    }
  }, [editItem]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Validate form
    if (!formData.name || !formData.contact) {
      setErrorMessage("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // UPDATE
    if (editId) {
      axios.put(
        `http://127.0.0.1:8000/api/details/${editId}/`,
        formData
      )
      .then((res) => {
        setSuccessMessage("✓ Data updated successfully!");
        console.log(res.data);
        setTimeout(() => {
          resetForm();
          if (onClose) onClose();
        }, 1500);
      })
      .catch((err) => {
        setErrorMessage("✕ Error updating data. Please try again.");
        console.log(err);
      })
      .finally(() => setLoading(false));
    }

    // CREATE
    else {
      axios.post(
        "http://127.0.0.1:8000/api/create/",
        formData
      )
      .then((res) => {
        setSuccessMessage("✓ Data created successfully!");
        console.log(res.data);
        setTimeout(() => resetForm(), 2000);
      })
      .catch((err) => {
        setErrorMessage("✕ Error creating data. Please try again.");
        console.log(err);
      })
      .finally(() => setLoading(false));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contact: "",
      gender: "",
      age: "",
      family_no: ""
    });

    setEditId(null);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCancel = () => {
    resetForm();
    if (onClose) onClose();
  };

  return (
    <div className="create-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">
            {editId ? "📝 Update User Details" : "➕ Create User Details"}
          </h1>
          <p className="form-subtitle">
            {editId ? "Update the user information below" : "Enter new user information below"}
          </p>
        </div>

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number *</label>
            <input
              id="contact"
              type="text"
              name="contact"
              placeholder="Enter contact number"
              value={formData.contact}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="family_no">Family Number</label>
              <input
                id="family_no"
                type="number"
                name="family_no"
                placeholder="Enter family number"
                value={formData.family_no}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {editId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {editId ? "💾 Update Data" : "➕ Create Data"}
                </>
              )}
            </button>

            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                ✕ Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDetails;