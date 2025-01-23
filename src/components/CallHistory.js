import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Call as CallIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import * as Flags from 'country-flag-icons/react/3x2';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#1C1C2D',
    color: 'white',
    minWidth: '400px',
    maxWidth: '500px',
  },
}));

const CallHistoryItem = styled(ListItem)(({ theme }) => ({
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '16px',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const CallButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '8px',
  '&:hover': {
    backgroundColor: '#388E3C',
  },
}));

const CallHistory = ({ open, onClose, callHistory = [], onCallUser }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const renderFlag = (countryCode) => {
    if (!countryCode) return null;
    const Flag = Flags[countryCode];
    return Flag ? (
      <Box
        component="span"
        sx={{
          display: 'inline-block',
          width: '24px',
          height: '16px',
          marginRight: '8px',
          verticalAlign: 'middle'
        }}
      >
        <Flag />
      </Box>
    ) : null;
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <Typography variant="h6">Call History</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch 
              defaultChecked 
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#6C5DD3',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#6C5DD3',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Allow Incoming Call Requests
            </Typography>
          </Box>
        </Box>
        {callHistory.length === 0 ? (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No call history available
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {callHistory.map((call, index) => (
              <CallHistoryItem key={index} disableGutters>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {renderFlag(call.participantCountries[1])}
                  <ListItemText
                    primary={call.participantCountries[1]}
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(call.startTime)}
                      </Typography>
                    }
                  />
                </Box>
                <ListItemSecondaryAction>
                  <CallButton
                    size="small"
                    onClick={() => onCallUser(call.participants[1])}
                  >
                    <CallIcon fontSize="small" />
                  </CallButton>
                </ListItemSecondaryAction>
              </CallHistoryItem>
            ))}
          </List>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default CallHistory;
