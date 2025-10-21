import React from 'react';

function Stat({ label, value, sub }) {
  return (
    <div style={{ color: 'white' }}>
      <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9 }}>{label}</div>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{value}</div>
      {sub && <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9 }}>{sub}</div>}
    </div>
  );
}

function StatsWidget({ callsToday = 0, target = 45, avgHandle = '—', csat = '—' }) {
  const pct = Math.min(100, Math.round((callsToday / target) * 100));
  return (
    <div className="stats-widget" style={{
      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      color: '#fff', borderRadius: 16, padding: 'var(--space-6)',
      boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Today’s Progress</div>
        <div style={{ fontWeight: 600 }}>{pct}%</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Stat label="Calls" value={`${callsToday}/${target}`} />
        <Stat label="Avg Handle" value={avgHandle} />
        <Stat label="CSAT" value={csat} />
        <div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 999 }}>
            <div style={{ width: `${pct}%`, height: 8, borderRadius: 999, background: '#fff' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsWidget;

