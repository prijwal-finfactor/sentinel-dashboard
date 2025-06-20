import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TriggerDetailCard } from '@/components/TriggerDetailCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProcessRunDetail, User, UserTriggerSummary } from '@/types';
import { api } from '@/utils/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User as UserIcon, Target, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UserTriggersPage() {
  const { processId, sessionId, userId } = useParams<{ processId: string; sessionId: string; userId: string }>();
  const [runDetail, setRunDetail] = useState<ProcessRunDetail | null>(null);
  const [userTrigger, setUserTrigger] = useState<UserTriggerSummary | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!sessionId || !userId) return;

      try {
        const runData = await api.fetchProcessRunDetail(sessionId);
        setRunDetail(runData);
        
        const userTriggerData = runData.users.find(ut => ut.user.id === userId);
        if (userTriggerData) {
          setUserTrigger(userTriggerData);
        }
      } catch (error) {
        console.error('Failed to fetch user trigger data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, userId]);

  const handleTriggerClick = (trigger: any) => {
    setSelectedTrigger(trigger);
  };

  const handleViewTransactions = (triggerId: string) => {
    navigate(`/tenants/${processId}/${sessionId}/${userId}/${triggerId}`);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page in browser history
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading user trigger data..." />;
  }

  if (!userTrigger || !runDetail) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-support-negative text-lg">User trigger data not found</div>
        <p className="text-text-secondary text-sm mt-2">
          The requested user trigger information could not be found.
        </p>
      </div>
    );
  }

  const { user, triggers, triggerHitCount } = userTrigger;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-surface-header to-surface-accent rounded-xl shadow-sm border border-stroke-default p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 ring-4 ring-action-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-action-primary to-stroke-accent-selected text-white text-lg font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
              <p className="text-text-secondary">{user.role} • {user.department}</p>
              <p className="text-sm text-text-secondary">{user.email}</p>
            </div>
          </div>
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="flex items-center space-x-2 border-stroke-accent-selected text-action-primary hover:bg-surface-accent-brand"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-text-warning/20">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-text-warning" />
              <span className="text-sm font-medium text-text-warning">Total Trigger Hits</span>
            </div>
            <div className="text-2xl font-bold text-text-warning">{triggerHitCount}</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-status-info/20">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-status-info" />
              <span className="text-sm font-medium text-status-info">Active Triggers</span>
            </div>
            <div className="text-2xl font-bold text-status-info">{triggers.length}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-action-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <UserIcon className="h-5 w-5 text-action-primary" />
              <span className="text-sm font-medium text-action-primary">Session ID</span>
            </div>
            <div className="text-sm font-mono text-action-primary">{sessionId}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Triggers List - Left Side */}
        <div className="flex-1 animate-slide-in-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Triggered Rules</h2>
              <p className="text-text-secondary text-sm mt-1">
                Click on any trigger to view details or transactions
              </p>
            </div>
            <div className="text-sm text-text-secondary">
              {triggers.length} triggers found
            </div>
          </div>

          {triggers.length === 0 ? (
            <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-icon-default mx-auto mb-4" />
              <div className="text-text-secondary text-lg">No triggers found</div>
              <p className="text-text-secondary text-sm mt-2">
                This user has no active triggers for this session.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {triggers.map((trigger, index) => (
                <div key={trigger.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <TriggerDetailCard
                    trigger={trigger}
                    onClick={() => handleTriggerClick(trigger)}
                    onViewTransactions={() => handleViewTransactions(trigger.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trigger Details - Right Side */}
        <div className="flex-1 animate-slide-in-right">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Trigger Details</h2>
          
          {selectedTrigger ? (
            <div className="space-y-4">
              <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-3">{selectedTrigger.name}</h3>
                <p className="text-text-secondary mb-4">{selectedTrigger.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Type:</span>
                    <span className="font-medium text-text-primary">{selectedTrigger.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Severity:</span>
                    <span className={`font-medium capitalize ${
                      selectedTrigger.severity === 'critical' ? 'text-support-negative' :
                      selectedTrigger.severity === 'high' ? 'text-text-warning' :
                      selectedTrigger.severity === 'medium' ? 'text-status-info' :
                      'text-status-success'
                    }`}>
                      {selectedTrigger.severity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Hit Count:</span>
                    <span className="font-medium text-text-primary">{selectedTrigger.hitCount}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() => handleViewTransactions(selectedTrigger.id)}
                    className="w-full bg-action-primary hover:bg-stroke-accent-selected text-white"
                  >
                    View Transactions ({selectedTrigger.hitCount})
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-8 text-center">
              <AlertTriangle className="h-8 w-8 text-icon-default mx-auto mb-3" />
              <div className="text-text-secondary">Select a trigger to view details</div>
              <p className="text-text-secondary text-sm mt-1">
                Click on any trigger from the list to see detailed information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}