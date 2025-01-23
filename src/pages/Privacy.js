import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(36, 36, 68, 0.95)',
  backdropFilter: 'blur(10px)',
  marginTop: theme.spacing(4),
}));

const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const Privacy = () => {
  return (
    <Container>
      <StyledPaper>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Privacy Policy
        </Typography>

        <Section>
          <Typography variant="h6" gutterBottom>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect the following types of information:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Voice data during calls (not stored)<br />
            • Technical information (IP address, device info)<br />
            • Usage statistics and preferences
          </Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            Your information is used to:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Provide and improve our voice chat service<br />
            • Match you with other users<br />
            • Ensure platform safety and security<br />
            • Send important updates and notifications
          </Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            3. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement industry-standard security measures to protect your data:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • End-to-end encryption for voice calls<br />
            • Secure data transmission (SSL/TLS)<br />
            • Regular security audits<br />
            • Restricted access to personal information
          </Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            4. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Access your personal data<br />
            • Request data deletion<br />
            • Opt-out of non-essential communications<br />
            • Update your information
          </Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            5. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            For privacy-related concerns, contact us at:<br />
            Email: airspeak@gmail.com
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

export default Privacy;
