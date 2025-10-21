import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Tooltip } from '@mui/material';
import { People, Circle, Phone, AccessTime, StarRate } from '@mui/icons-material';

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <Card elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <CardContent sx={{ display: 'grid', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon sx={{ color, fontSize: 24 }} />
          <Typography variant="body2" color="text.secondary">{label}</Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color }}>{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default function MetricsDashboard({ stats = {}, performance = {} }) {
  const {
    total = 0,
    online = 0,
  } = stats;

  const callsToday = performance.callsToday ?? 0;
  const avgTime = performance.avgTime ?? '—';
  const csat = performance.csat ?? '—';

  // SLA approximation: percent Available out of Online (fallback)
  const available = stats.available ?? 0;
  const sla = online > 0 ? Math.round((available / online) * 100) : 0;

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={6} sm={4} md={2}>
          <MetricCard icon={People} label="Total Agents" value={total} color={'#374151'} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <MetricCard icon={Circle} label="Online Now" value={online} color={'#10B981'} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <MetricCard icon={Phone} label="Calls Today" value={callsToday} color={'#2563EB'} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <MetricCard icon={AccessTime} label="Avg Time" value={avgTime} color={'#F59E0B'} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <MetricCard icon={StarRate} label="CSAT" value={csat} color={'#F59E0B'} />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Real‑time SLA</Typography>
          <Typography variant="body2" color={sla >= 95 ? 'success.main' : 'warning.main'}>{sla}%</Typography>
        </Box>
        <Tooltip title={`Available ${available}/${online}`} placement="top">
          <LinearProgress variant="determinate" value={sla} sx={{ height: 8, borderRadius: 999 }} />
        </Tooltip>
      </Box>
    </Box>
  );
}
