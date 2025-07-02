import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout/Layout';
import { LoginForm } from './components/Auth/LoginForm';
import { MFAForm } from './components/Auth/MFAForm';
import { Dashboard } from './pages/Dashboard';
import { Documents } from './pages/Documents';
import { Search } from './pages/Search';

const AppContent: React.FC = () => {
  const { isAuthenticated, mfaRequired, user } = useAuth();

  if (!isAuthenticated && !mfaRequired) {
    return <LoginForm />;
  }

  if (mfaRequired) {
    return <MFAForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/search" element={<Search />} />
        <Route path="/projects" element={<div className="p-6">Projects - Coming Soon</div>} />
        <Route path="/workflows" element={<div className="p-6">Workflows - Coming Soon</div>} />
        <Route path="/favorites" element={<div className="p-6">Favorites - Coming Soon</div>} />
        <Route path="/archive" element={<div className="p-6">Archive - Coming Soon</div>} />
        <Route path="/analytics" element={<div className="p-6">Analytics - Coming Soon</div>} />
        <Route path="/users" element={<div className="p-6">Users - Coming Soon</div>} />
        <Route path="/settings" element={<div className="p-6">Settings - Coming Soon</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </Provider>
  );
}

export default App;