import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Flags from 'country-flag-icons/react/3x2';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#8FE5FF',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '100%',
  },
}));

const CloseButton = styled(IconButton)({
  position: 'absolute',
  right: 8,
  top: 8,
  color: '#000',
});

const ReportButton = styled(Button)({
  backgroundColor: '#FF4B4B',
  color: '#fff',
  padding: '8px 24px',
  borderRadius: '20px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#E53E3E',
  },
});

const Report = ({ open, onClose, reportData, onReport }) => {
  const handleReport = () => {
    if (reportData && onReport) {
      onReport(reportData);
    }
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ color: '#000', fontWeight: 'bold' }}>
          Report ID
        </Typography>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ color: '#000', mb: 1 }}>
            {reportData?.id || 'No ID available'}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#000', mb: 1 }}>
            Origin Country
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {reportData?.countryCode && React.createElement(Flags[reportData.countryCode], {
              style: { width: 24, height: 24 }
            })}
            <Typography variant="body1" sx={{ color: '#000' }}>
              {reportData?.countryCode || 'Unknown'}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ color: '#000', mb: 2 }}>
          If you find any prohibited activities on the website that require immediate attention, please file a report and also email (info@airtalk.live) us with the Report ID.
        </Typography>

        <Typography variant="body1" sx={{ color: '#000', mb: 3 }}>
          False reports may result in penalties for both parties. We store information for proper investigation.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ReportButton onClick={handleReport}>
            Report
          </ReportButton>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default Report;
