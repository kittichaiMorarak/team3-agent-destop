import React, { useMemo, useState, useEffect } from 'react';
import MessagePanel from './MessagePanel';

function MessageCenter({ messages, agentCode, loading, onSend }) {
  const [filter, setFilter] = useState('all'); // all | unread | urgent
  const [recipient, setRecipient] = useState('SP001');
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('normal');

  const unreadCount = useMemo(() => messages.filter(m => !m.isRead).length, [messages]);

  const filtered = useMemo(() => {
    if (filter === 'unread') return messages.filter(m => !m.isRead);
    if (filter === 'urgent') return messages.filter(m => (m.priority || '').toLowerCase() === 'high');
    return messages;
  }, [messages, filter]);

  // Templates
  const applyTemplate = (t) => setText(t);

  // Compose send (placeholder: no backend endpoint provided)
  const handleSend = () => {
    if (!recipient || !text.trim()) return;
    onSend?.({ toCode: recipient, content: text.trim(), priority });
    setText('');
    setPriority('normal');
  };

  // Close menu on outside click for menu used inside MessagePanel if any
  useEffect(() => {
    const closeMenus = (e) => {
      // Do not close if clicking inside any status dropdown
      const target = e.target;
      const withinDropdown = target && typeof target.closest === 'function' && target.closest('.status-dropdown');
      if (withinDropdown) return;
      document.querySelectorAll('.status-menu.open').forEach(el => el.classList.remove('open'));
    };
    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

  return (
    <div className="message-center" aria-label="Messages Center">
      <div className="mc-header">
        <div>
          <strong>Messages ({messages.length})</strong>
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </div>
      </div>
      <div className="filters">
        {['all','unread','urgent'].map(f => (
          <button key={f} className={`pill ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : 'Urgent'}
          </button>
        ))}
      </div>
      <div className="mc-list">
        <MessagePanel messages={filtered} agentCode={agentCode} loading={loading} />
      </div>
      <div className="mc-footer">
        <div className="compose">
          <label htmlFor="to" style={{fontSize:'var(--text-sm)', color:'var(--gray-700)'}}>Quick Compose</label>
          <select id="to" value={recipient} onChange={(e)=>setRecipient(e.target.value)}>
            <option value="SP001">SP001 (Supervisor)</option>
            <option value="AG002">AG002</option>
          </select>
          <textarea rows={3} placeholder="Type message..." value={text} onChange={(e)=>setText(e.target.value)} />
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:'var(--text-sm)',color:'var(--gray-700)'}}>Priority:</span>
            <select value={priority} onChange={(e)=>setPriority(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="high">Urgent</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="template-row">
            <button type="button" className="template-btn" onClick={()=>{applyTemplate('Need help with a customer issue.'); setPriority('high');}}>Need help</button>
            <button type="button" className="template-btn" onClick={()=>applyTemplate('Taking a short break (15 mins).')}>Taking break</button>
            <button type="button" className="template-btn" onClick={()=>applyTemplate('Technical issue on my station.')}>Technical issue</button>
          </div>
          <button className="send-btn" disabled={!recipient || !text.trim()} onClick={handleSend}>Send →</button>
        </div>
      </div>
    </div>
  );
}

export default MessageCenter;
