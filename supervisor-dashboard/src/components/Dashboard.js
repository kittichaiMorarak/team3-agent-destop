import React, { useState } from 'react';
import {
  Grid, AppBar, Toolbar, Typography, Button, Box, 
  Chip, IconButton, Tooltip
} from '@mui/material';
import { 
  Logout, People, Message, Refresh, Circle 
} from '@mui/icons-material';
import TeamOverview from './TeamOverview';
import MetricsDashboard from './MetricsDashboard';
import AlertPanel from './AlertPanel';
import AgentDetailModal from './AgentDetailModal';
import FilterBar from './FilterBar';
import AgentCard from './AgentCard';
import MessagePanel from './MessagePanel';
import StatusFilter from './StatusFilter';

function Dashboard({ 
  supervisor, 
  teamData, 
  messages, 
  socketConnected,
  onSendMessage, 
  onLogout 
}) {
  // State
  const [statusFilter, setStatusFilter] = useState('All');
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('status'); // status | name | calls
  const [view, setView] = useState('grid'); // grid | list
  const [hideOffline, setHideOffline] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [busySince, setBusySince] = useState({}); // { AG001: timestamp }
  const [breakSince, setBreakSince] = useState({});
  const [detailAgent, setDetailAgent] = useState(null);
  const [historyMap, setHistoryMap] = useState({}); // { AG001: [{status,timestamp}] }

  // ===========================================
  // คำนวณข้อมูล
  // ===========================================
  
  // กรองข้อมูล agent ตาม status filter
  let filteredAgents = teamData.filter(agent => (
    (statusFilter === 'All' || agent.currentStatus === statusFilter) &&
    (!hideOffline || agent.isOnline) &&
    ((agent.agentName || '').toLowerCase().includes(search.toLowerCase()) || (agent.agentCode || '').toLowerCase().includes(search.toLowerCase()))
  ));

  filteredAgents = filteredAgents.sort((a,b) => {
    if (sortBy === 'name') return (a.agentName||'').localeCompare(b.agentName||'');
    if (sortBy === 'status') return (a.currentStatus||'').localeCompare(b.currentStatus||'');
    if (sortBy === 'calls') return (b.callsToday||0) - (a.callsToday||0);
    return 0;
  });

  // สถิติทีม
  const teamStats = {
    total: teamData.length,
    online: teamData.filter(a => a.isOnline).length,
    available: teamData.filter(a => a.currentStatus === 'Available').length,
    busy: teamData.filter(a => a.currentStatus === 'Busy').length,
    break: teamData.filter(a => a.currentStatus === 'Break').length,
    offline: teamData.filter(a => a.currentStatus === 'Offline').length
  };

  // ===========================================
  // Handlers
  // ===========================================
  
  const handleRefresh = () => {
    window.location.reload();
  };

  // Track status changes for alerts + history
  React.useEffect(() => {
    if (!window.socket) return;
    const socket = window.socket;
    const onUpdate = (data) => {
      const { agentCode, status, timestamp } = data;
      setHistoryMap(prev => ({ ...prev, [agentCode]: [ ...(prev[agentCode]||[]), { status, timestamp } ] }));
      if (status === 'Busy') setBusySince(prev => ({ ...prev, [agentCode]: timestamp })); else setBusySince(prev => { const p={...prev}; delete p[agentCode]; return p; });
      if (status === 'Break') setBreakSince(prev => ({ ...prev, [agentCode]: timestamp })); else setBreakSince(prev => { const p={...prev}; delete p[agentCode]; return p; });
    };
    socket.on('agent_status_update', onUpdate);
    return () => socket.off('agent_status_update', onUpdate);
  }, []);

  // Alert generation timer
  React.useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const newAlerts = [];
      Object.entries(busySince).forEach(([code, ts]) => {
        if (ts && now - new Date(ts).getTime() > 10*60*1000) {
          newAlerts.push({ id: `long_call_${code}`, kind: 'long_call', agent: code, severity: 'warning', title: `${code} long call`, description: 'Current call exceeds 10 minutes' });
        }
      });
      Object.entries(breakSince).forEach(([code, ts]) => {
        if (ts && now - new Date(ts).getTime() > 20*60*1000) {
          newAlerts.push({ id: `break_overtime_${code}`, kind: 'break_overtime', agent: code, severity: 'info', title: `${code} long break`, description: 'Break duration exceeds expected time' });
        }
      });
      setAlerts(prev => {
        const map = new Map(prev.map(a => [a.id, a]));
        newAlerts.forEach(a => map.set(a.id, a));
        return Array.from(map.values());
      });
    }, 30000);
    return () => clearInterval(id);
  }, [busySince, breakSince]);

  return (
    <Box>
      {/* App Bar (Header) */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {/* Team Icon */}
          <People sx={{ mr: 1 }} />
          
          {/* Supervisor Name & Team */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">
              {supervisor.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {supervisor.teamName}
            </Typography>
          </Box>
          
          {/* Connection Status */}
          <Tooltip title={socketConnected ? 'Connected' : 'Disconnected'}>
            <Circle 
              sx={{ 
                fontSize: 12, 
                color: socketConnected ? 'success.light' : 'error.light',
                mr: 2
              }} 
            />
          </Tooltip>
          
          {/* Online Count */}
          <Chip 
            label={`${teamStats.online}/${teamStats.total} Online`}
            color="success"
            variant="outlined"
            sx={{ mr: 2, color: 'white', borderColor: 'white' }}
          />
          
          {/* Message Button */}
          <Button 
            color="inherit" 
            startIcon={<Message />}
            onClick={() => setShowMessagePanel(true)}
            sx={{ mr: 1 }}
          >
            Send Message
          </Button>
          
          {/* Refresh Button */}
          <Tooltip title="Refresh">
            <IconButton color="inherit" onClick={handleRefresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
          
          {/* Logout Button */}
          <Button 
            color="inherit" 
            startIcon={<Logout />}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Dashboard Content */}
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Team Overview */}
          <Grid item xs={12}>
            <MetricsDashboard stats={teamStats} performance={{ callsToday: 0, avgTime: '—', csat: '—' }} />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={12}>
            <StatusFilter 
              currentFilter={statusFilter}
              onFilterChange={setStatusFilter}
              stats={teamStats}
            />
          </Grid>

          {/* Advanced Filter Bar */}
          <Grid item xs={12}>
            <FilterBar
              search={search} onSearch={setSearch}
              hideOffline={hideOffline} onHideOffline={setHideOffline}
              sortBy={sortBy} onSortBy={setSortBy}
              view={view} onView={setView}
            />
          </Grid>

          {/* Alerts Panel */}
          <Grid item xs={12}>
            <AlertPanel
              alerts={alerts}
              onDismiss={(id)=>setAlerts(prev=>prev.filter(a=>a.id!==id))}
              onMessage={(code)=>onSendMessage({ type:'direct', toCode: code, content: 'Need assistance?', priority: 'high' })}
              onView={(agent)=>{
                const ag = teamData.find(a=>a.agentCode===agent);
                if (ag) setDetailAgent(ag);
              }}
            />
          </Grid>

          {/* Agent Cards Grid or List */}
          <Grid item xs={12}>
            {filteredAgents.length > 0 ? (
              <Grid container spacing={2}>
                {filteredAgents.map(agent => {
                  const inds = alerts.filter(a=>a.agent===agent.agentCode).map(a=>a.kind);
                  return (
                  <Grid item xs={12} sm={view==='grid'?6:12} md={view==='grid'?4:12} lg={view==='grid'?3:12} key={agent.agentCode}>
                    <AgentCard 
                      agent={agent}
                      onSendMessage={(content) => onSendMessage({
                        type: 'direct',
                        toCode: agent.agentCode,
                        content
                      })}
                      onOpenDetail={(ag) => setDetailAgent(ag)}
                      indicators={inds}
                    />
                  </Grid>
                )})}
              </Grid>
            ) : (
              <Box textAlign="center" py={5}>
                <Typography variant="h6" color="text.secondary">
                  No agents found with status: {statusFilter}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Message Panel Modal */}
      <MessagePanel
        open={showMessagePanel}
        onClose={() => setShowMessagePanel(false)}
        teamData={teamData}
        onSendMessage={onSendMessage}
        supervisor={supervisor}
      />

      {/* Agent Detail Modal */}
      <AgentDetailModal
        open={!!detailAgent}
        onClose={() => setDetailAgent(null)}
        agent={detailAgent}
        history={detailAgent ? (historyMap[detailAgent.agentCode]||[]) : []}
      />
    </Box>
  );
}

export default Dashboard;
