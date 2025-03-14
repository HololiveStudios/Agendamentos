import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from './components/ui/toaster';
import AdminDashboard from './pages/admin/Dashboard';
import ClientBooking from './pages/client/Booking';
import LandingPage from './pages/LandingPage';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Admin Routes - Using business slug */}
            <Route path="/:slug/*" element={<AdminDashboard />} />
            
            {/* Client Booking Routes - Using business slug */}
            <Route path="/:slug/agendar" element={<ClientBooking />} />
          </Routes>
        </AnimatePresence>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;