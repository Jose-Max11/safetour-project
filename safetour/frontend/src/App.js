import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LocationProvider } from './context/LocationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Weather from './pages/Weather';
import Emergency from './pages/Emergency';
import Assistant from './pages/Assistant';
import SafetyTips from './pages/SafetyTips';
import Currency from './pages/Currency';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 2 } }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/"          element={<Home />} />
                <Route path="/weather"   element={<Weather />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/tips"      element={<SafetyTips />} />
                <Route path="/currency"  element={<Currency />} />
              </Routes>
            </main>
          </div>
          <ToastContainer position="top-right" theme="dark" />
        </Router>
      </LocationProvider>
    </QueryClientProvider>
  );
}
