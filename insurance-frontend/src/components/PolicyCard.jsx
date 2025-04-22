import React from 'react';
import "../styles/policy.css";
import { useNavigate } from "react-router-dom";
import '../styles/policy-card.css'

export default function PolicyCard({ id, name, description, amount, type, count }) {
    const navigate = useNavigate();

    function handleBuyClick() {
        navigate("/payment", {
            state: {
                policyId: id,
                policyName: name,
                monthlyAmount: amount
            }
        });
    }

    return (
        <div className="policy-card">
            <h2>{name}</h2>
            <div>
                <p>{description}</p>
                <p>Monthly amount: {amount}</p>
                <p>Type : {type}</p>
                <p>Holders count : {count}</p>
            </div>
            <button className="buy-button" onClick={handleBuyClick}>Buy</button>
        </div>
    );
}
