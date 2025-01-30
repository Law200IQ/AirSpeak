import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(36, 36, 68, 0.95)',
  backdropFilter: 'blur(10px)',
  marginTop: theme.spacing(4),
}));

const About = () => {
  return (
    <Container>
      <StyledPaper>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          About YallahLive
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="body1" paragraph>
              YallahLive is a platform that enables meaningful connections through voice conversations. 
              We believe in the power of genuine human interaction and aim to create a safe space for 
              people to connect, share stories, and build relationships.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                To break down barriers and foster genuine connections between people worldwide through 
                the power of voice communication.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Our Vision
              </Typography>
              <Typography variant="body1" paragraph>
                To create a global community where meaningful conversations flourish and cultural 
                boundaries dissolve through authentic voice interactions.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Community Guidelines
            </Typography>
            <Typography variant="body1" paragraph>
              • Be respectful and kind to others<br />
              • Maintain appropriate conversation<br />
              • Protect your privacy and personal information<br />
              • Report any inappropriate behavior<br />
              • Help create a positive environment
            </Typography>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default About;
