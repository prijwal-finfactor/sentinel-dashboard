import React from 'react';
import { TriggerSummary } from '@/types';
import { AlertTriangle, Target, Clock, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TriggerDetailCardProps {
  trigger: TriggerSummary;
  onClick: () => void;
  onViewTransactions?: () => void;
}

export function TriggerDetailCard({ trigger, onClick, onViewTransactions }: TriggerDetailCardProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-support-negative" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-text-warning" />;
      case 'medium':
        return <Target className="h-5 w-5 text-status-info" />;
      case 'low':
        return <TrendingUp className="h-5 w-5 text-status-success" />;
      default:
        return <Target className="h-5 w-5 text-text-secondary" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 text-support-negative border-support-negative/20 shadow-support-negative/10';
      case 'high':
        return 'bg-support-warning text-text-warning border-text-warning/20 shadow-text-warning/10';
      case 'medium':
        return 'bg-blue-50 text-status-info border-status-info/20 shadow-status-info/10';
      case 'low':
        return 'bg-surface-linked text-status-success border-status-success/20 shadow-status-success/10';
      default:
        return 'bg-surface-accent text-text-secondary border-stroke-default';
    }
  };

  const getBorderColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-support-negative';
      case 'high':
        return 'border-l-text-warning';
      case 'medium':
        return 'border-l-status-info';
      case 'low':
        return 'border-l-status-success';
      default:
        return 'border-l-stroke-default';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group bg-surface-header rounded-lg shadow-sm border border-stroke-default border-l-4 ${getBorderColor(trigger.severity)} p-4 hover:shadow-lg hover:border-stroke-accent-selected cursor-pointer transition-all duration-300 animate-slide-in-right hover:scale-[1.01]`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="transform group-hover:scale-110 transition-transform duration-200">
            {getSeverityIcon(trigger.severity)}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary group-hover:text-action-primary transition-colors duration-200">{trigger.name}</h3>
            <p className="text-sm text-text-secondary">{trigger.type}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getSeverityColor(trigger.severity)} transform group-hover:scale-105 transition-all duration-200`}>
          {trigger.severity.toUpperCase()}
        </span>
      </div>

      <p className="text-sm text-text-secondary mb-3 group-hover:text-text-primary transition-colors duration-200">{trigger.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-text-secondary" />
          <span className="text-sm text-text-secondary">Hit Count:</span>
          <span className="text-sm font-semibold text-action-primary">{trigger.hitCount}</span>
        </div>
        {onViewTransactions && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onViewTransactions();
            }}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 text-xs border-stroke-accent-selected text-action-primary hover:bg-surface-accent-brand"
          >
            <Eye className="h-3 w-3" />
            <span>View Transactions</span>
          </Button>
        )}
      </div>
    </div>
  );
}