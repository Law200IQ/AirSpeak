import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(36, 36, 68, 0.95)',
  backdropFilter: 'blur(10px)',
  marginTop: theme.spacing(4),
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
  },
}));

const Guidelines = () => {
  return (
    <Container>
      <StyledPaper>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Community Guidelines
        </Typography>

        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          Our community guidelines are designed to ensure AirSpeak remains a safe and 
          welcoming space for everyone. Please follow these guidelines to maintain a 
          positive environment.
        </Typography>

        <Section>
          <IconWrapper>
            <SecurityIcon />
            <Typography variant="h6">Safety First</Typography>
          </IconWrapper>
          <Typography variant="body1" paragraph>
            Protect yourself and others:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Never share personal information (address, phone number, etc.)<br />
            • Don't arrange in-person meetings<br />
            • Keep conversations within the platform<br />
            • Report suspicious behavior immediately
          </Typography>
        </Section>

        <Section>
          <IconWrapper>
            <BlockIcon />
            <Typography variant="h6">Prohibited Content</Typography>
          </IconWrapper>
          <Typography variant="body1" paragraph>
            The following are not allowed:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Hate speech or discrimination<br />
            • Harassment or bullying<br />
            • Sexual content or nudity<br />
            • Violence or threats<br />
            • Illegal activities<br />
            • Spam or solicitation
          </Typography>
        </Section>

        <Section>
          <IconWrapper>
            <ThumbUpIcon />
            <Typography variant="h6">Best Practices</Typography>
          </IconWrapper>
          <Typography variant="body1" paragraph>
            To create the best experience:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Be respectful and kind to others<br />
            • Listen actively and engage meaningfully<br />
            • Keep conversations appropriate<br />
            • Respect others' privacy and boundaries<br />
            • Use appropriate language
          </Typography>
        </Section>

        <Section>
          <IconWrapper>
            <ReportIcon />
            <Typography variant="h6">Reporting Violations</Typography>
          </IconWrapper>
          <Typography variant="body1" paragraph>
            If you encounter violations:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Use the in-app reporting feature<br />
            • Provide specific details about the incident<br />
            • Block users who violate guidelines<br />
            • Contact support for serious issues
          </Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            Consequences of Violations
          </Typography>
          <Typography variant="body1" paragraph>
            Violations may result in:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Warnings<br />
            • Temporary suspension<br />
            • Permanent account termination<br />
            • Legal action in serious cases
          </Typography>
        </Section>

        <Box mt={4}>
          <Typography variant="body2" color="textSecondary">
            Last updated: January 2025
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Guidelines;
