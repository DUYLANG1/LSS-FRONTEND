import React, { useState } from 'react';
import { useExchanges, ExchangeFilters } from '@/hooks/useExchanges';

export default function ExchangeList() {
  const {
    exchanges,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    respondToExchange,
    refreshExchanges,
    createExchangeRequest,
  } = useExchanges();

  const [selectedSkillId, setSelectedSkillId] = useState<string>('');

  // Filter exchanges by status
  const handleStatusFilter = (status: 'pending' | 'accepted' | 'rejected' | '') => {
    if (status === '') {
      // If empty status, remove the status filter
      const { status, ...restFilters } = filters;
      updateFilters(restFilters);
    } else {
      updateFilters({ status });
    }
  };

  // Filter exchanges by skill
  const handleSkillFilter = () => {
    if (selectedSkillId) {
      updateFilters({ skillId: selectedSkillId });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    clearFilters();
    setSelectedSkillId('');
  };

  if (loading) return <div>Loading exchanges...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="exchange-list">
      <h2>Your Exchange Requests</h2>
      
      {/* Filter controls */}
      <div className="filters">
        <div>
          <label>Filter by status:</label>
          <select 
            value={filters.status || ''} 
            onChange={(e) => handleStatusFilter(e.target.value as any)}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <label>Filter by skill:</label>
          <input 
            type="text" 
            value={selectedSkillId} 
            onChange={(e) => setSelectedSkillId(e.target.value)}
            placeholder="Enter skill ID"
          />
          <button onClick={handleSkillFilter}>Apply</button>
        </div>
        
        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>
      
      {/* Exchange list */}
      {exchanges.length === 0 ? (
        <p>No exchanges found.</p>
      ) : (
        <ul className="exchanges">
          {exchanges.map((exchange) => (
            <li key={exchange.id} className={`exchange-item status-${exchange.status}`}>
              <div className="exchange-details">
                <h3>Exchange #{exchange.id.substring(0, 8)}</h3>
                <p>Status: <span className="status">{exchange.status}</span></p>
                <p>From: {exchange.fromUser.name}</p>
                <p>To: {exchange.toUser.name}</p>
                <p>Offered Skill ID: {exchange.offeredSkillId}</p>
                <p>Requested Skill ID: {exchange.requestedSkillId}</p>
                <p>Created: {new Date(exchange.createdAt).toLocaleDateString()}</p>
              </div>
              
              {exchange.status === 'pending' && (
                <div className="exchange-actions">
                  <button 
                    onClick={() => respondToExchange(exchange.id, true)}
                    className="accept-btn"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => respondToExchange(exchange.id, false)}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      
      <button onClick={refreshExchanges} className="refresh-btn">
        Refresh Exchanges
      </button>
    </div>
  );
}