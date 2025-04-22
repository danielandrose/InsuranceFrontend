import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PolicyCard from './PolicyCard.jsx';
import '../styles/hero.css';
import ChatBot from './ChatBox.jsx';

export default function Hero() {
  const policies = useSelector((state) => state.policy);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const uniquePolicies = Array.from(new Map(policies.map(p => [p._id, p])).values());

  const filteredPolicies = uniquePolicies.filter(policy => {
    const matchesType = selectedType === 'all' || policy.type === selectedType;
    const matchesSearch = policy.policyName.toLowerCase().includes(searchText.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="hero-container">
      <div className="hero-filters">
        <input
          type="text"
          placeholder="Search policy..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
          {['all', 'life', 'health', 'auto', 'home', 'travel', 'other'].map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="hero-policies">
        {filteredPolicies.length > 0 ? (
          filteredPolicies.map(policy => (
            <PolicyCard
              key={policy._id}
              id={policy._id}
              name={policy.policyName}
              description={policy.description}
              amount={policy.monthlyAmount}
              type={policy.type}
              count={policy.holdersId.length}
            />
          ))
        ) : (
          <div className="no-results">No policies found</div>
        )}
      </div>
      <ChatBot />
    </div>
  );
}
