import React, { useMemo } from 'react';

function StatusDropdown({ currentStatus, onChange, disabled = false, isUpdating = false }) {
  const options = useMemo(() => ([
    { key: 'Available', label: 'Available', className: 'available' },
    { key: 'Busy', label: 'Busy', className: 'busy' },
    { key: 'Break', label: 'Break', className: 'break' },
    { key: 'Offline', label: 'Offline', className: 'offline' }
  ]), []);

  return (
    <div className={`status-dropdown ${disabled ? 'disabled' : ''}`} aria-live="polite">
      <button
        className={`status-trigger ${currentStatus.toLowerCase()}`}
        onClick={(e) => {
          e.stopPropagation();
          const menu = e.currentTarget.nextSibling;
          if (menu) menu.classList.toggle('open');
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <span className={`dot ${currentStatus.toLowerCase()}`}></span>
        <span className="label">{currentStatus}</span>
        {isUpdating ? <span className="spinner" aria-label="Updating status" /> : <span className="chevron">▾</span>}
      </button>
      <ul className="status-menu" role="listbox" onClick={(e)=>e.stopPropagation()}>
        {options.map(opt => (
          <li
            key={opt.key}
            role="option"
            aria-selected={opt.key === currentStatus}
            className={`item ${opt.className} ${opt.key === currentStatus ? 'selected' : ''}`}
            onClick={(e) => {
              e.currentTarget.parentElement.classList.remove('open');
              if (opt.key !== currentStatus) onChange(opt.key);
            }}
          >
            <span className={`dot ${opt.className}`}></span>
            <span className="text">{opt.label}</span>
            {opt.key === currentStatus && <span className="check">✓</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StatusDropdown;
