import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import monitoringManager from '../utils/monitoring';

const ErrorContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  background: 'linear-gradient(45deg, #FF5252 30%, #FF1744 90%)',
  color: 'white',
  textAlign: 'center',
});

const ErrorIcon = styled(ErrorOutlineIcon)({
  fontSize: '64px',
  marginBottom: '1rem',
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log the error to our metrics system
    monitoringManager.recordError('react_error', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon />
          <Typography variant="h4" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1" paragraph>
            We've encountered an unexpected error. Our team has been notified and is working on it.
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.7)" paragraph>
            Error: {this.state.error && this.state.error.toString()}
          </Typography>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <Typography
              variant="body2"
              color="rgba(255,255,255,0.7)"
              component="pre"
              sx={{
                maxWidth: '100%',
                overflow: 'auto',
                padding: '1rem',
                background: 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}
            >
              {this.state.errorInfo.componentStack}
            </Typography>
          )}
          <Button
            variant="contained"
            color="inherit"
            onClick={this.handleReload}
            sx={{ mt: 2 }}
          >
            Reload Application
          </Button>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
