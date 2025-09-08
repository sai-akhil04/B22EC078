// src/App.jsx

import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';

import ShortenerPage from './pages/ShortenerPage';
import StatisticsPage from './pages/StatisticsPage'; // <-- IMPORT THIS
import RedirectHandler from './components/RedirectHandler';

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AffordMed URL Shortener
            </Typography>
            <Button color="inherit" component={NavLink} to="/">Shortener</Button>
            <Button color="inherit" component={NavLink} to="/stats">Statistics</Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatisticsPage />} /> {/* <-- UNCOMMENT THIS */}
          <Route path="/:shortCode" element={<RedirectHandler />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;