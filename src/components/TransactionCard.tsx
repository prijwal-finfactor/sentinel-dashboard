import React from 'react';
import { Transaction } from '@/types';
import { DollarSign, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-status-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-support-negative" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-text-secondary" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-support-negative bg-red-50 border-support-negative/20';
    if (score >= 60) return 'text-text-warning bg-support-warning border-text-warning/20';
    if (score >= 40) return 'text-status-info bg-blue-50 border-status-info/20';
    return 'text-status-success bg-surface-linked border-status-success/20';
  };

  return (
    <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-4 hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-action-primary to-stroke-accent-selected p-2 rounded-lg">
            <DollarSign className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-text-primary">
              {transaction.currency} {transaction.amount.toLocaleString()}
            </p>
            <p className="text-xs text-text-secondary">{transaction.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(transaction.status)}
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(transaction.riskScore)}`}>
            Risk: {transaction.riskScore}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">From:</span>
          <span className="font-mono text-text-primary">{transaction.fromAccount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">To:</span>
          <span className="font-mono text-text-primary">{transaction.toAccount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Time:</span>
          <span className="text-text-primary">{new Date(transaction.timestamp).toLocaleString()}</span>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-3">{transaction.description}</p>

      {transaction.flaggedReasons.length > 0 && (
        <div className="border-t border-stroke-default pt-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-text-warning" />
            <span className="text-xs font-medium text-text-secondary">FLAGGED REASONS</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {transaction.flaggedReasons.map((reason, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full text-xs font-medium bg-support-warning text-text-warning border border-text-warning/20"
              >
                {reason}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}