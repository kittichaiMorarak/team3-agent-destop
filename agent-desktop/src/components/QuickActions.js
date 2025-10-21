import React from 'react';

function Action({ icon, label, onClick }) {
  return (
    <button className="qa-btn" onClick={onClick}>
      <span style={{ fontSize: 18, marginRight: 8 }}>{icon}</span>
      {label}
    </button>
  );
}

function QuickActions() {
  return (
    <div className="qa-card">
      <div className="qa-grid">
        <Action icon="📋" label="Knowledge Base" onClick={()=>{}} />
        <Action icon="📞" label="Call History" onClick={()=>{}} />
        <Action icon="📊" label="My Reports" onClick={()=>{}} />
        <Action icon="❓" label="Request Help" onClick={()=>{}} />
      </div>
    </div>
  );
}

export default QuickActions;

