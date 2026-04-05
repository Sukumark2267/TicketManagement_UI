import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import AppLayout from '../layouts/AppLayout';
import LoginPage from '../pages/auth/LoginPage';

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/*"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;
