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

const Terms = () => {
  return (
    <Container>
      <StyledPaper>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Terms of Service
        </Typography>

        <Section>
          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing or using AirSpeak, you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, you may not access the service.
          </Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            2. User Eligibility
          </Typography>
          <Typography variant="body1" paragraph>
            You must be at least 18 years old to use AirSpeak. By using our service, you represent 
            and warrant that you are at least 18 years of age and have the legal capacity to enter 
            into these terms.
          </Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            3. User Conduct
          </Typography>
          <Typography variant="body1" paragraph>
            You agree not to:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Harass, abuse, or harm other users<br />
            • Share inappropriate or illegal content<br />
            • Impersonate others or create false identities<br />
            • Use the service for commercial purposes<br />
            • Attempt to circumvent any security measures
          </Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            4. Service Modifications
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to:
          </Typography>
          <Typography variant="body1" component="div" sx={{ ml: 2 }}>
            • Modify or discontinue any part of the service<br />
            • Remove content that violates our policies<br />
            • Suspend or terminate accounts<br />
            • Update these terms at any time
          </Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            5. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All content, features, and functionality of AirSpeak are owned by us and protected 
            by international copyright, trademark, and other intellectual property laws.
          </Typography>
        </Section>

        <Section>
          <Typography variant="h6" gutterBottom>
            6. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            AirSpeak is provided "as is" without warranties of any kind. We are not liable for 
            any damages arising from your use of the service or any user-generated content.
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

export default Terms;
