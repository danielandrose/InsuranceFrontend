import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/dashboard.css';  // Import the separate CSS file for dashboard styling

export default function Dashboard() {
  const [userPolicies, setUserPolicies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPolicies = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        setError('No user email found.');
        setLoading(false);
        return;
      }

      try {
        // Fetch the user data based on email (to get userId)
        const { data: userData } = await axios.get(`http://localhost:5000/policies/user/email/${userEmail}`);
        const userId = userData.userId;

        // Fetch all policies
        const { data: allPolicies } = await axios.get('http://localhost:5000/policies');

        // Filter the policies where the userId is in the holdersId array
        const userPolicies = allPolicies.filter(policy => policy.holdersId.includes(userId));

        setUserPolicies(userPolicies);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user policies.');
        setLoading(false);
      }
    };

    fetchUserPolicies();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Your Policies</h1>
      {userPolicies.length > 0 ? (
        <div className="policies-list">
          {userPolicies.map((policy) => (
            <div key={policy._id} className="policy-item">
              <h3>{policy.policyName}</h3>
              <p><strong>Type:</strong> {policy.type}</p>
              <p><strong>Amount:</strong> ₹{policy.monthlyAmount}</p>
              <p><strong>Description:</strong> {policy.description}</p>
              <p><strong>Holders count:</strong> {policy.holdersId.length}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No policies found.</p>
      )}
    </div>
  );
}
