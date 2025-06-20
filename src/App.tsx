import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { ProcessesHomePage } from '@/pages/ProcessesHomePage';
import { TenantsManagementPage } from '@/pages/TenantsManagementPage';
import { ProcessHistoryPage } from '@/pages/ProcessHistoryPage';
import { UserTriggersPage } from '@/pages/UserTriggersPage';
import { TriggerTransactionsPage } from '@/pages/TriggerTransactionsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Default route redirects to Processes dashboard */}
          <Route path="/" element={<Navigate to="/processes" replace />} />
          
          {/* Processes Dashboard */}
          <Route path="/processes" element={<Layout />}>
            <Route index element={<ProcessesHomePage />} />
            <Route path=":processId" element={<ProcessHistoryPage />} />
            <Route path=":processId/:sessionId/:userId" element={<UserTriggersPage />} />
            <Route path=":processId/:sessionId/:userId/:triggerId" element={<TriggerTransactionsPage />} />
          </Route>
          
          {/* Tenant Management */}
          <Route path="/tenants" element={<Layout />}>
            <Route index element={<TenantsManagementPage />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;