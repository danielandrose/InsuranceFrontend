import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/admin.css";

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    policyName: '',
    type: 'health',
    description: '',
    monthlyAmount: '',
    duration: ''
  });

  const validPassword = "admin123"; // For dev only, change this in production

  useEffect(() => {
    if (authenticated) fetchPolicies();
  }, [authenticated]);

  const fetchPolicies = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/policies');
      setPolicies(data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/policies/${id}`);
      fetchPolicies();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleEdit = (policy) => {
    setFormData({
      _id: policy._id,
      policyName: policy.policyName,
      type: policy.type,
      description: policy.description,
      monthlyAmount: policy.monthlyAmount,
      duration: policy.duration
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await axios.put(`http://localhost:5000/policies/${formData._id}`, formData);
      } else {
        await axios.post(`http://localhost:5000/policies`, formData);
      }
      setFormData({
        policyName: '',
        type: 'health',
        description: '',
        monthlyAmount: '',
        duration: ''
      });
      fetchPolicies();
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  if (!authenticated) {
    return (
      <div className="admin-login">
        <h2>Enter Admin Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={() => setAuthenticated(password === validPassword)}>Login</button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h2>Admin Panel</h2>

      <form className="policy-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Policy Name"
          value={formData.policyName}
          onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
          required
        />
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="life">Life</option>
          <option value="health">Health</option>
          <option value="auto">Auto</option>
          <option value="home">Home</option>
          <option value="travel">Travel</option>
          <option value="other">Other</option>
        </select>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        ></textarea>
        <input
          type="number"
          placeholder="Monthly Amount"
          value={formData.monthlyAmount}
          onChange={(e) => setFormData({ ...formData, monthlyAmount: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Duration (in months)"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          required
        />
        <button type="submit">{formData._id ? "Update Policy" : "Add Policy"}</button>
      </form>

      <div className="policy-list">
        {policies.map(policy => (
          <div className="policy-card" key={policy._id}>
            <h3>{policy.policyName}</h3>
            <p>Type: {policy.type}</p>
            <p>Amount: ₹{policy.monthlyAmount}</p>
            <p>Duration: {policy.duration} months</p>
            <p>{policy.description}</p>
            <button onClick={() => handleEdit(policy)}>Edit</button>
            <button onClick={() => handleDelete(policy._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
