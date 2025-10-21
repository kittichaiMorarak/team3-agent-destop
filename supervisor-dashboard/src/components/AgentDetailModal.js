import React, { useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, Tabs, Tab, Box, Typography, Chip, Stack, Button } from '@mui/material';

function Row({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}

export default function AgentDetailModal({ open, onClose, agent, history = [] }) {
  const [tab, setTab] = React.useState(0);
  const safeAgent = agent || {};
  const last5 = useMemo(() => history.slice(-5).reverse(), [history]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 12, height: 12, borderRadius: 999, bgcolor: safeAgent.currentStatus === 'Available' ? '#10B981' : safeAgent.currentStatus === 'Busy' ? '#F59E0B' : safeAgent.currentStatus === 'Break' ? '#3B82F6' : '#6B7280' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{safeAgent.agentName} ({safeAgent.agentCode})</Typography>
            <Chip label={safeAgent.currentStatus || 'Unknown'} size="small" />
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined">Change Status</Button>
            <Button variant="contained">Send Message</Button>
          </Stack>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(_,v)=>setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Overview" />
          <Tab label="Performance" />
          <Tab label="Activity" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Today</Typography>
            <Row label="Status" value={safeAgent.currentStatus || '—'} />
            <Row label="Calls" value={safeAgent.callsToday ?? '—'} />
            <Row label="Avg Handle" value={safeAgent.avgHandle ?? '—'} />
            <Row label="CSAT" value={safeAgent.csat ?? '—'} />
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Typography variant="body2" color="text.secondary">Performance charts coming soon…</Typography>
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Status History (Today)</Typography>
            <Stack spacing={0.5}>
              {last5.length ? last5.map((h, idx) => (
                <Typography key={idx} variant="body2">{new Date(h.timestamp).toLocaleTimeString()} — {h.status}</Typography>
              )) : (
                <Typography variant="body2" color="text.secondary">No recent activity</Typography>
              )}
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

