import React, { useState } from "react";
import { X, Lock, User, Key, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/contexts/AppContext";
import { LoginRequest } from "@/types";
import { api } from "@/utils/api";
import { todo } from "node:test";

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const [credentials, setCredentials] = useState({
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAppContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload: LoginRequest = {
        userId: credentials.userId.trim(),
        password: credentials.password.trim(),
      };

      if (!payload.userId || !payload.password) {
        setError("Please enter both User ID and password.");
        setLoading(false);
        return;
      }

      const response = await api.login(payload);

      const token = response?.token;

      if (token === undefined || token === null) {
        //todo : show error here and fix this modal to center.
        setError("Authentication failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      login(token);
      onClose();
    } catch (error: any) {
      console.error("Authentication failed:", error);
      setError("Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-header rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-stroke-default">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-action-primary to-stroke-accent-selected p-2 rounded-lg">
              <Lock className="h-5 w-5 text-text-on-surface" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">
              Authentication Required
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center mb-6">
            <p className="text-text-secondary text-sm">
              Please enter your credentials to access the FIU Management System
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-support-negative/20 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-support-negative flex-shrink-0 mt-0.5" />
              <p className="text-support-negative text-sm">{error}</p>
            </div>
          )}

          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <User className="h-4 w-4 inline mr-2" />
              User ID
            </label>
            <Input
              type="text"
              name="userId"
              value={credentials.userId}
              onChange={handleInputChange}
              placeholder="Enter your user ID"
              required
              autoComplete="username"
              className="bg-surface-header border-stroke-default focus:border-stroke-accent-selected"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <Key className="h-4 w-4 inline mr-2" />
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="bg-surface-header border-stroke-default focus:border-stroke-accent-selected"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-stroke-default text-text-secondary hover:text-text-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !credentials.userId || !credentials.password}
              className="bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface"
            >
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </div>
        </form>

        <div className="px-6 pb-6">
          <div className="bg-surface-accent rounded-lg p-4">
            <p className="text-xs text-text-secondary">
              <strong>Demo Mode:</strong> Enter any credentials to access the
              system. Your session will be maintained until you explicitly
              logout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
