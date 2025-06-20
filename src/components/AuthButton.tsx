import React, { useState } from 'react';
import { Lock, LockOpen, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import { useAppContext } from '@/contexts/AppContext';

export function AuthButton() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, authUser, logout } = useAppContext();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={handleAuthClick}
        variant="outline"
        size="sm"
        className={`flex items-center space-x-2 transition-all duration-200 ${
          isAuthenticated
            ? 'border-status-success text-status-success hover:bg-surface-linked'
            : 'border-text-warning text-text-warning hover:bg-support-warning'
        }`}
      >
        {isAuthenticated ? (
          <>
            <LockOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{authUser?.username}</span>
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Authenticate</span>
          </>
        )}
      </Button>

      {/* User Menu Dropdown */}
      {showUserMenu && isAuthenticated && (
        <div className="absolute right-0 mt-2 w-48 bg-surface-header rounded-lg shadow-lg border border-stroke-default z-50">
          <div className="p-3 border-b border-stroke-default">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-text-secondary" />
              <div>
                <p className="text-sm font-medium text-text-primary">{authUser?.username}</p>
                <p className="text-xs text-text-secondary">User ID: {authUser?.userId}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-support-negative hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}