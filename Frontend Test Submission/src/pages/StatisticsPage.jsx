// src/pages/StatisticsPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Collapse, Box, IconButton, Link
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// A Row component that includes the expandable details section
const Row = ({ urlData }) => {
  const [open, setOpen] = useState(false);
  const isExpired = new Date() > new Date(urlData.expiresAt);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Link href={`/${urlData.shortCode}`} target="_blank">{`${window.location.origin}/${urlData.shortCode}`}</Link>
        </TableCell>
        <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Link href={urlData.longUrl} target="_blank" rel="noopener noreferrer">{urlData.longUrl}</Link>
        </TableCell>
        <TableCell align="right">{urlData.clicks}</TableCell>
        <TableCell style={{ color: isExpired ? 'red' : 'green' }}>
          {new Date(urlData.expiresAt).toLocaleString()}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Click Details
              </Typography>
              {urlData.clickDetails.length > 0 ? (
                <Table size="small" aria-label="click details">
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {urlData.clickDetails.map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(detail.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{detail.source}</TableCell>
                        <TableCell>{detail.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography>No clicks recorded yet.</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};


const StatisticsPage = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem('urls')) || [];
    setUrls(storedUrls);
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        URL Statistics
      </Typography>
      {urls.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Short Link</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell align="right">Clicks</TableCell>
                <TableCell>Expires At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.map((url) => (
                <Row key={url.shortCode} urlData={url} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography align="center">No shortened URLs found. Go create some!</Typography>
      )}
    </Container>
  );
};

export default StatisticsPage;