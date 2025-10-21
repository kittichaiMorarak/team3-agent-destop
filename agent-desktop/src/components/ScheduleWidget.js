import React from 'react';

function ScheduleWidget() {
  return (
    <div className="schedule-card">
      <div className="schedule-title">Schedule</div>
      <div className="schedule-item">
        <div className="time">10:30</div>
        <div className="event">Break (15 mins)</div>
      </div>
      <div className="schedule-item">
        <div className="time">11:00</div>
        <div className="event">Team Meeting — Conf. B</div>
      </div>
      <div className="schedule-item">
        <div className="time">15:00</div>
        <div className="event">Break (15 mins)</div>
      </div>
    </div>
  );
}

export default ScheduleWidget;

