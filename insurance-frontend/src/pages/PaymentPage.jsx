import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "../styles/payment.css"

export default function PaymentPage() {
  const location = useLocation();
  const { policyId, policyName, monthlyAmount } = location.state || {};

  const [form, setForm] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [bookingSummary, setBookingSummary] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setPaymentStatus('❌ No user email found. Please log in.');
        return;
      }
      setUserEmail(email);
      try {
        const { data } = await axios.get(`http://localhost:5000/policies/user/email/${email}`);
        if (data.userId) setUserId(data.userId);
      } catch (err) {
        setPaymentStatus('❌ Failed to fetch user ID.');
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayment = async () => {
    if (!form.cardNumber || !form.expiry || !form.cvv) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const { data } = await axios.patch(`http://localhost:5000/policies/${policyId}/buy`, {
        userId,
        userEmail,
      });

      setPaymentStatus('✅ Booking Confirmed!');
      setBookingSummary({
        policyName,
        monthlyAmount,
        email: userEmail,
        date: new Date().toLocaleString(),
      });
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('❌ Booking Failed. Please try again.');
    }
  };

  const downloadSummary = () => {
    const content = `
      Booking Summary\n
      --------------------
      Policy: ${bookingSummary.policyName}
      Amount: ₹${bookingSummary.monthlyAmount}
      Email: ${bookingSummary.email}
      Date: ${bookingSummary.date}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'booking_summary.txt';
    a.click();

    URL.revokeObjectURL(url);
  };

  const emailSummary = () => {
    alert("📧 Email sent with booking summary (simulated)");
  };

  return (
    <div className="payment-container">
      <h1>Payment Page</h1>
      {policyId ? (
        <>
          <p><strong>Policy Name:</strong> {policyName}</p>
          <p><strong>Monthly Amount:</strong> ₹{monthlyAmount}</p>

          <h3>Card Details</h3>
          <input name="cardNumber" placeholder="Card Number" onChange={handleChange} />
          <input name="expiry" placeholder="MM/YY" onChange={handleChange} />
          <input name="cvv" placeholder="CVV" type="password" onChange={handleChange} />

          <button onClick={handlePayment}>
            Pay ₹{monthlyAmount}
          </button>
        </>
      ) : <p>No policy selected.</p>}

      {paymentStatus && (
        <div className="payment-status">
          <h3>Status: {paymentStatus}</h3>

          {bookingSummary && (
            <>
              <button onClick={downloadSummary}>📄 Download Summary</button>
              <button onClick={emailSummary}>
                📧 Email Summary
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
