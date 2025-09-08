// src/components/RedirectHandler.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Container, CircularProgress } from '@mui/material';

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const [message, setMessage] = useState('Redirecting...');

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem('urls')) || [];
    const urlData = storedUrls.find(url => url.shortCode === shortCode);

    if (urlData) {
      // Check if the link has expired
      const isExpired = new Date() > new Date(urlData.expiresAt);
      if (isExpired) {
        setMessage('This link has expired.');
        return;
      }

      // Update click analytics
      urlData.clicks += 1;
      urlData.clickDetails.push({
        timestamp: new Date().toISOString(),
        source: document.referrer || 'Direct', // document.referrer can be empty
        location: 'Unknown', // Mocked as per requirements
      });

      // Find the index and update the item in the array
      const urlIndex = storedUrls.findIndex(url => url.shortCode === shortCode);
      storedUrls[urlIndex] = urlData;
      localStorage.setItem('urls', JSON.stringify(storedUrls));

      // Perform the redirection
      window.location.replace(urlData.longUrl);

    } else {
      setMessage('Link not found. Please check the URL.');
    }
  }, [shortCode]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10 }}>
      <Box>
        {message === 'Redirecting...' && <CircularProgress sx={{ mb: 2 }} />}
        <Typography variant="h5">{message}</Typography>
      </Box>
    </Container>
  );
};

export default RedirectHandler;