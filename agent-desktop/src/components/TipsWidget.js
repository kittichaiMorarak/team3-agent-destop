import React from 'react';

function TipsWidget() {
  return (
    <div className="tips-card">
      <div className="tips-title">💡 Tip of the Day</div>
      <div className="tips-body">
        Use keyboard shortcuts to work faster:
        <ul>
          <li>F2 → Available</li>
          <li>F3 → Busy</li>
          <li>F4 → Break</li>
          <li>Ctrl+M → Messages</li>
        </ul>
      </div>
    </div>
  );
}

export default TipsWidget;

