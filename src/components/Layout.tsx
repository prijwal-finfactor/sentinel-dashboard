import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Shield } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/processes';
  const isTenantsPage = location.pathname === '/tenants';

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page in browser history
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-accent to-surface-body">
      <header className="bg-surface-header shadow-sm border-b border-stroke-default backdrop-blur-sm bg-surface-header/95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <Link 
                to="/processes" 
                className="flex items-center space-x-3 text-action-primary hover:text-stroke-accent-selected transition-all duration-200 group"
              >
                <div className="bg-gradient-to-br from-action-primary to-stroke-accent-selected p-2 rounded-lg shadow-lg group-hover:shadow-action-primary/25 transition-all duration-200">
                  <Shield className="h-6 w-6 text-text-on-surface" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">FIU Management</h1>
                  <p className="text-xs text-text-secondary">Financial Intelligence Unit</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Authentication Button */}
              <AuthButton />
              
              {/* Back Button */}
              {!isHomePage && !isTenantsPage && (
                <button
                  onClick={handleBackClick}
                  className="flex items-center space-x-2 text-text-secondary hover:text-action-primary transition-all duration-200 px-3 py-2 rounded-lg hover:bg-surface-accent-brand"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-surface-header border-t border-stroke-default mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-text-secondary">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">© 2024 FIU Management System</span>
            </div>
            <div className="text-sm text-text-secondary">
              Secure • Compliant • Efficient
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}