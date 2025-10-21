import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Chip, Button, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Tooltip
} from '@mui/material';
import { Person, AccessTime, Message, Circle, Whatshot, Schedule, WarningAmber } from '@mui/icons-material';
import { getStatusColor, getStatusIcon } from '../utils/statusUtils';
import { formatTimeAgo } from '../utils/dateFormat';

function AgentCard({ agent, onSendMessage, onOpenDetail, indicators = [] }) {
  // State สำหรับ message dialog
  const [messageDialog, setMessageDialog] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  // ===========================================
  // Handlers
  // ===========================================
  
  const handleSendMessage = () => {
    if (messageContent.trim()) {
      onSendMessage(messageContent);
      setMessageContent('');
      setMessageDialog(false);
    }
  };

  // ===========================================
  // UI Properties
  // ===========================================
  
  const StatusIcon = getStatusIcon(agent.currentStatus);
  const statusColor = getStatusColor(agent.currentStatus);

  return (
    <>
      {/* Agent Card */}
      <Card 
        elevation={2}
        sx={{ 
          position: 'relative',
          border: '1px solid #E5E7EB',
          borderLeft: `4px solid ${agent.isOnline ? statusColor : '#9CA3AF'}`,
          borderRadius: '12px',
          width: 280,
          height: 180,
          overflow: 'hidden',
          opacity: agent.isOnline ? 1 : 0.8,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
            borderColor: '#3B82F6'
          },
          cursor: 'pointer'
        }}
        onClick={() => onOpenDetail && onOpenDetail(agent)}
      >
        <CardContent sx={{ p: 2 }}>
          {/* Indicators */}
          {indicators.length > 0 && (
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
              {indicators.includes('long_call') && <Whatshot fontSize="small" color="error" />}
              {indicators.includes('break_overtime') && <Schedule fontSize="small" color="primary" />}
              {indicators.includes('sla_warning') && <WarningAmber fontSize="small" color="warning" />}
            </Box>
          )}
          {/* Agent Info Row */}
          <Box display="flex" alignItems="center" mb={1}>
            {/* Avatar Icon */}
            <Person sx={{ mr: 1, color: 'text.secondary' }} />
            
            {/* Name & Code */}
            <Box flexGrow={1}>
              <Typography variant="subtitle1" noWrap fontWeight={700}>
                {agent.agentName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {agent.agentCode}
              </Typography>
            </Box>
            
            {/* Online Indicator */}
            {agent.isOnline && (
              <Tooltip title="Online">
                <Circle sx={{ fontSize: 12, color: 'success.main' }} />
              </Tooltip>
            )}
          </Box>

          {/* Current Status */}
          <Box display="flex" alignItems="center" mb={1}>
            <StatusIcon sx={{ mr: 1, color: statusColor }} />
            <Chip
              label={agent.currentStatus}
              size="small"
              sx={{ 
                backgroundColor: `${statusColor}22`,
                color: statusColor,
                fontWeight: 'bold'
              }}
            />
          </Box>

          {/* Last Update Time */}
          <Box display="flex" alignItems="center" mb={2}>
            <AccessTime sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {agent.isOnline 
                ? `Updated ${formatTimeAgo(agent.lastUpdate)}`
                : `Last seen ${formatTimeAgo(agent.lastSeen)}`
              }
            </Typography>
          </Box>

          {/* Actions */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              size="small"
              startIcon={<Message />}
              onClick={(e) => { e.stopPropagation(); setMessageDialog(true); }}
              disabled={!agent.isOnline}
            >
              Message
            </Button>
            
            <Chip
              size="small"
              label={agent.isOnline ? 'Online' : 'Offline'}
              color={agent.isOnline ? 'success' : 'default'}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Send Message Dialog */}
      <Dialog 
        open={messageDialog} 
        onClose={() => setMessageDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Message to {agent.agentName}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            margin="normal"
            placeholder="Type your message here..."
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage}
            variant="contained"
            disabled={!messageContent.trim()}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AgentCard;
