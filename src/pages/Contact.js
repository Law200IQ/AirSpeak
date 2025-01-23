import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(36, 36, 68, 0.95)',
  backdropFilter: 'blur(10px)',
  marginTop: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.23)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setSubmitStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Container>
      <StyledPaper>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Contact Us
        </Typography>

        {submitStatus === 'success' && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Thank you for your message! We'll get back to you soon.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Send Message
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Other Ways to Reach Us
          </Typography>
          <Typography variant="body1" paragraph>
            Email: airspeak@gmail.com<br />
            Hours: Monday - Friday, 9:00 AM - 5:00 PM (GMT)
          </Typography>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Contact;
