import React from 'react';
import { UserTriggerSummary } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Briefcase, Building, Target, AlertTriangle } from 'lucide-react';

interface UserTriggerCardProps {
  userTrigger: UserTriggerSummary;
  onClick: () => void;
}

export function UserTriggerCard({ userTrigger, onClick }: UserTriggerCardProps) {
  const { user, triggerHitCount, triggers } = userTrigger;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-support-negative bg-red-50 border-support-negative/20';
      case 'high':
        return 'text-text-warning bg-support-warning border-text-warning/20';
      case 'medium':
        return 'text-status-info bg-blue-50 border-status-info/20';
      case 'low':
        return 'text-status-success bg-surface-linked border-status-success/20';
      default:
        return 'text-text-secondary bg-surface-accent border-stroke-default';
    }
  };

  return (
    <div
      onClick={onClick}
      className="group bg-surface-header rounded-lg shadow-sm border border-stroke-default p-4 hover:shadow-lg hover:border-stroke-accent-selected cursor-pointer transition-all duration-300 animate-scale-in hover:scale-[1.02]"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-12 w-12 ring-2 ring-action-primary/20 group-hover:ring-action-primary/40 transition-all duration-200">
          <AvatarFallback className="bg-gradient-to-br from-action-primary to-stroke-accent-selected text-white font-semibold">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary group-hover:text-action-primary transition-colors duration-200">{user.name}</h3>
          <p className="text-sm text-text-secondary">{user.role}</p>
          <div className="flex items-center space-x-2 mt-1">
            <Target className="h-4 w-4 text-text-warning" />
            <span className="text-sm font-medium text-text-warning">{triggerHitCount} trigger hits</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Building className="h-4 w-4" />
          <span>{user.department}</span>
        </div>
      </div>

      {/* Trigger Summary */}
      <div className="border-t border-stroke-default pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">ACTIVE TRIGGERS</span>
          <span className="text-xs text-text-secondary">{triggers.length} types</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {triggers.slice(0, 3).map((trigger) => (
            <span
              key={trigger.id}
              className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(trigger.severity)} transform group-hover:scale-105 transition-all duration-200`}
            >
              {trigger.name} ({trigger.hitCount})
            </span>
          ))}
          {triggers.length > 3 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-accent text-text-secondary border border-stroke-default">
              +{triggers.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}