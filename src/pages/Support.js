import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(36, 36, 68, 0.95)',
  backdropFilter: 'blur(10px)',
  marginTop: theme.spacing(4),
}));

const PlanCard = styled(Card)(({ theme, featured }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: featured ? 'rgba(108, 99, 255, 0.2)' : 'rgba(36, 36, 68, 0.95)',
  border: featured ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(255, 255, 255, 0.1)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const Support = () => {
  const plans = [
    {
      title: 'Basic',
      price: '$5',
      period: '/month',
      features: [
        'Ad-free experience',
        'Basic profile customization',
        'Standard support',
      ],
      icon: <FavoriteIcon />,
    },
    {
      title: 'Premium',
      price: '$10',
      period: '/month',
      features: [
        'All Basic features',
        'Priority matching',
        'Advanced profile customization',
        'Priority support',
      ],
      featured: true,
      icon: <StarIcon />,
    },
    {
      title: 'VIP',
      price: '$20',
      period: '/month',
      features: [
        'All Premium features',
        'Exclusive badges',
        'Custom room creation',
        '24/7 VIP support',
        'Early access to new features',
      ],
      icon: <DiamondIcon />,
    },
  ];

  return (
    <Container>
      <StyledPaper>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Support YallahLive
        </Typography>

        <Typography variant="body1" paragraph align="center" sx={{ mb: 6 }}>
          Help us maintain and improve YallahLive by becoming a supporter.
          Choose the plan that best suits you and enjoy exclusive benefits!
        </Typography>

        <Grid container spacing={4}>
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.title}>
              <PlanCard featured={plan.featured}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="center" mb={2}>
                    {plan.icon}
                  </Box>
                  <Typography variant="h5" component="div" align="center" gutterBottom>
                    {plan.title}
                  </Typography>
                  <Box display="flex" justifyContent="center" alignItems="baseline" mb={2}>
                    <Typography variant="h4" component="span">
                      {plan.price}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {plan.period}
                    </Typography>
                  </Box>
                  <Box>
                    {plan.features.map((feature) => (
                      <Typography
                        key={feature}
                        variant="body2"
                        color="text.secondary"
                        paragraph
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        • {feature}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant={plan.featured ? 'contained' : 'outlined'}
                    color="primary"
                    size="large"
                  >
                    Choose Plan
                  </Button>
                </CardActions>
              </PlanCard>
            </Grid>
          ))}
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default Support;
