import React from 'react';
import { Card, CardContent, CardHeader, IconButton, Typography, Chip, Button, Stack } from '@mui/material';
import { WarningAmber, Close, Whatshot, Schedule, PriorityHigh } from '@mui/icons-material';

export default function AlertPanel({ alerts = [], onDismiss, onMessage, onView }) {
  if (!alerts.length) return null;
  return (
    <Card sx={{ mb: 2, bgcolor: '#FEF3C7', border: '2px solid #F59E0B' }}>
      <CardHeader
        avatar={<WarningAmber sx={{ color: '#F59E0B' }} />}
        title={<Typography sx={{ fontWeight: 700 }}>Active Alerts ({alerts.length})</Typography>}
        action={<IconButton aria-label="dismiss-all" onClick={() => alerts.forEach(a => onDismiss?.(a.id))}><Close /></IconButton>}
      />
      <CardContent>
        <Stack spacing={1.5}>
          {alerts.map(alert => (
            <Card key={alert.id} variant="outlined" sx={{ p: 1.5, borderColor: '#F59E0B' }}>
              <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  {alert.kind === 'long_call' && <Whatshot color="error" />}
                  {alert.kind === 'break_overtime' && <Schedule color="primary" />}
                  {alert.kind === 'sla_warning' && <PriorityHigh color="warning" />}
                  <Typography sx={{ fontWeight: 600 }}>{alert.title}</Typography>
                  <Chip label={alert.severity.toUpperCase()} size="small" color={alert.severity === 'critical' ? 'error' : (alert.severity === 'warning' ? 'warning' : 'info')} />
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button size="small" onClick={() => onMessage?.(alert.agent)} variant="contained">Send Message</Button>
                  <Button size="small" onClick={() => onView?.(alert.agent)} variant="outlined">View Detail</Button>
                  <IconButton onClick={() => onDismiss?.(alert.id)}><Close /></IconButton>
                </Stack>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{alert.description}</Typography>
            </Card>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

