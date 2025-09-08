// src/pages/ShortenerPage.jsx

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton, Paper, Container, Link, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { nanoid } from 'nanoid';

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([{ longUrl: '', validity: '', customShortcode: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleAddUrlField = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { longUrl: '', validity: '', customShortcode: '' }]);
    }
  };

  const handleRemoveUrlField = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleInputChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index][event.target.name] = event.target.value;
    setInputs(newInputs);
  };

  // ** MAIN LOGIC IS HERE **
  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setResults([]);

    const storedUrls = JSON.parse(localStorage.getItem('urls')) || [];
    const newUrlsToSave = [];
    const newResultsToShow = [];

    for (const input of inputs) {
      // 1. Validate the long URL format
      try {
        new URL(input.longUrl);
      } catch (_) {
        setError(`Invalid URL format: "${input.longUrl}"`);
        return;
      }
      
      // 2. Handle the shortcode
      let shortCode = input.customShortcode.trim();
      if (!shortCode) {
        shortCode = nanoid(7); // Generate a random one if not provided
      }

      // 3. Check for shortcode collision
      if (storedUrls.some(url => url.shortCode === shortCode) || newUrlsToSave.some(url => url.shortCode === shortCode)) {
        setError(`The custom shortcode "${shortCode}" is already taken. Please choose another.`);
        return;
      }

      // 4. Calculate expiry date
      const now = new Date();
      const validityMinutes = input.validity ? parseInt(input.validity, 10) : 30; // Default to 30 mins
      const expiresAt = new Date(now.getTime() + validityMinutes * 60000);

      // 5. Create the new URL data object
      const newUrlData = {
        shortCode,
        longUrl: input.longUrl,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        clicks: 0,
        clickDetails: [],
      };
      
      newUrlsToSave.push(newUrlData);
      newResultsToShow.push(newUrlData);
    }

    // 6. Save all new URLs to localStorage
    localStorage.setItem('urls', JSON.stringify([...storedUrls, ...newUrlsToSave]));
    setResults(newResultsToShow); // Set state to display results on the page
    setInputs([{ longUrl: '', validity: '', customShortcode: '' }]); // Reset form
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Create Short URLs
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          {inputs.map((input, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <TextField name="longUrl" label="Original Long URL" variant="outlined" fullWidth required value={input.longUrl} onChange={(e) => handleInputChange(index, e)} />
              <TextField name="validity" label="Validity (mins)" variant="outlined" type="number" sx={{ width: 150 }} value={input.validity} onChange={(e) => handleInputChange(index, e)} />
              <TextField name="customShortcode" label="Custom Code" variant="outlined" sx={{ width: 150 }} value={input.customShortcode} onChange={(e) => handleInputChange(index, e)} />
              <IconButton onClick={() => handleRemoveUrlField(index)} disabled={inputs.length === 1}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleAddUrlField} disabled={inputs.length >= 5}>
              Add URL
            </Button>
            <Button type="submit" variant="contained" size="large">Shorten URLs</Button>
          </Box>
        </form>
      </Paper>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {results.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Shortened URLs:
          </Typography>
          {results.map((result, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Original: {result.longUrl}</Typography>
              <Typography>
                Short Link: <Link href={`/${result.shortCode}`} target="_blank">{`${window.location.origin}/${result.shortCode}`}</Link>
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Container>
  );
};

export default ShortenerPage;