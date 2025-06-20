import React from 'react';
import { ProcessRun } from '@/types';
import { CheckCircle, XCircle, Clock, Users, FileText, Calendar, Target } from 'lucide-react';

interface ProcessRunCardProps {
  run: ProcessRun;
  onClick: () => void;
}

export function ProcessRunCard({ run, onClick }: ProcessRunCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-status-success" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-support-negative" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-text-warning animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-text-secondary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-surface-linked text-status-success border-status-success/20 shadow-status-success/10';
      case 'failed':
        return 'bg-red-50 text-support-negative border-support-negative/20 shadow-support-negative/10';
      case 'in-progress':
        return 'bg-support-warning text-text-warning border-text-warning/20 shadow-text-warning/10';
      default:
        return 'bg-surface-accent text-text-secondary border-stroke-default';
    }
  };

  return (
    <div
      onClick={onClick}
      className="group bg-surface-header rounded-lg shadow-sm border border-stroke-default p-4 hover:shadow-lg hover:border-stroke-accent-selected cursor-pointer transition-all duration-300 animate-slide-in-left hover:scale-[1.01]"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="transform group-hover:scale-110 transition-transform duration-200">
            {getStatusIcon(run.status)}
          </div>
          <div>
            <p className="font-medium text-text-primary group-hover:text-action-primary transition-colors duration-200">Run #{run.id}</p>
            <div className="flex items-center space-x-1 text-xs text-text-secondary">
              <Calendar className="h-3 w-3" />
              <span>{new Date(run.runDate).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(run.status)} transform group-hover:scale-105 transition-all duration-200`}>
          {run.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 text-sm">
        <div className="flex items-center space-x-2 group-hover:text-action-primary transition-colors duration-200">
          <Clock className="h-4 w-4 text-text-secondary" />
          <div>
            <p className="text-xs text-text-secondary">Duration</p>
            <p className="font-medium">{run.duration}m</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 group-hover:text-stroke-accent-selected transition-colors duration-200">
          <Users className="h-4 w-4 text-text-secondary" />
          <div>
            <p className="text-xs text-text-secondary">Users</p>
            <p className="font-medium">{run.usersInvolved}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 group-hover:text-status-info transition-colors duration-200">
          <FileText className="h-4 w-4 text-text-secondary" />
          <div>
            <p className="text-xs text-text-secondary">Records</p>
            <p className="font-medium">{run.recordsProcessed.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 group-hover:text-text-warning transition-colors duration-200">
          <Target className="h-4 w-4 text-text-secondary" />
          <div>
            <p className="text-xs text-text-secondary">Triggers</p>
            <p className="font-medium text-text-warning">{run.totalTriggerHits}</p>
          </div>
        </div>
      </div>
    </div>
  );
}