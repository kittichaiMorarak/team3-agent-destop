import React from 'react';

const map = {
  Available: { colorVar: 'var(--status-available)', label: 'Available' },
  Busy: { colorVar: 'var(--status-busy)', label: 'Busy' },
  Break: { colorVar: 'var(--status-break)', label: 'Break' },
  Offline: { colorVar: 'var(--status-offline)', label: 'Offline' },
};

function FloatingStatus({ status = 'Offline' }) {
  const style = { backgroundColor: map[status]?.colorVar || 'var(--status-offline)' };
  return (
    <div className="floating-status" aria-live="polite">
      <span className="pulse" style={style}></span>
      <span style={{ fontWeight: 600 }}>{status}</span>
      <span style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>F2-F4 to change</span>
    </div>
  );
}

export default FloatingStatus;

