import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

import Header from './components/Header';
import Footer from './components/Footer';
import VoiceChat from './components/VoiceChat';
import About from './pages/About';
import Contact from './pages/Contact';
import Support from './pages/Support';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Guidelines from './pages/Guidelines';
import NavBar from './components/NavBar';

export const SocketContext = createContext();

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF',
    },
    secondary: {
      main: '#50C878',
    },
    background: {
      default: '#1a1a2e',
      paper: '#242444',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SocketContext.Provider value={socket}>
        <Router>
          <div className="App">
            <NavBar socket={socket} />
            <main style={{ minHeight: 'calc(100vh - 64px - 300px)', padding: '24px 0' }}>
              <Routes>
                <Route path="/" element={<VoiceChat socket={socket} />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/guidelines" element={<Guidelines />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SocketContext.Provider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ThemeProvider>
  );
}

export default App;
