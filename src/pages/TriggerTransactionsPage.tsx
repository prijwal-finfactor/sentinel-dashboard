import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TransactionCard } from '@/components/TransactionCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TriggerDetail } from '@/types';
import { api } from '@/utils/api';
import { AlertTriangle, Target, Calendar, ArrowLeft, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TriggerTransactionsPage() {
  const { processId, sessionId, userId, triggerId } = useParams<{ 
    processId: string; 
    sessionId: string; 
    userId: string; 
    triggerId: string; 
  }>();
  const [triggerDetail, setTriggerDetail] = useState<TriggerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!triggerId || !userId || !sessionId) return;

      try {
        const data = await api.fetchTriggerDetail(triggerId, userId, sessionId);
        setTriggerDetail(data);
      } catch (error) {
        console.error('Failed to fetch trigger details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [triggerId, userId, sessionId]);

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page in browser history
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-6 w-6 text-support-negative" />;
      case 'high':
        return <AlertTriangle className="h-6 w-6 text-text-warning" />;
      case 'medium':
        return <Target className="h-6 w-6 text-status-info" />;
      case 'low':
        return <Target className="h-6 w-6 text-status-success" />;
      default:
        return <Target className="h-6 w-6 text-text-secondary" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 text-support-negative border-support-negative/20';
      case 'high':
        return 'bg-support-warning text-text-warning border-text-warning/20';
      case 'medium':
        return 'bg-blue-50 text-status-info border-status-info/20';
      case 'low':
        return 'bg-surface-linked text-status-success border-status-success/20';
      default:
        return 'bg-surface-accent text-text-secondary border-stroke-default';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading trigger transactions..." />;
  }

  if (!triggerDetail) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-support-negative text-lg">Trigger details not found</div>
        <p className="text-text-secondary text-sm mt-2">
          The requested trigger information could not be found.
        </p>
      </div>
    );
  }

  const totalAmount = triggerDetail.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const avgRiskScore = triggerDetail.transactions.reduce((sum, tx) => sum + tx.riskScore, 0) / triggerDetail.transactions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-surface-header to-surface-accent rounded-xl shadow-sm border border-stroke-default p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-action-primary to-stroke-accent-selected p-3 rounded-xl shadow-lg">
              {getSeverityIcon(triggerDetail.severity)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{triggerDetail.name}</h1>
              <p className="text-text-secondary">{triggerDetail.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(triggerDetail.severity)}`}>
                  {triggerDetail.severity.toUpperCase()}
                </span>
                <span className="text-xs text-text-secondary">Type: {triggerDetail.type}</span>
              </div>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-action-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-action-primary" />
              <span className="text-sm font-medium text-action-primary">Total Amount</span>
            </div>
            <div className="text-xl font-bold text-action-primary">
              ${totalAmount.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-text-warning/20">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-text-warning" />
              <span className="text-sm font-medium text-text-warning">Avg Risk Score</span>
            </div>
            <div className="text-xl font-bold text-text-warning">{Math.round(avgRiskScore)}</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-status-info/20">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-status-info" />
              <span className="text-sm font-medium text-status-info">Last Triggered</span>
            </div>
            <div className="text-sm font-medium text-status-info">
              {new Date(triggerDetail.lastTriggered).toLocaleString()}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-status-success/20">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-status-success" />
              <span className="text-sm font-medium text-status-success">Transactions</span>
            </div>
            <div className="text-xl font-bold text-status-success">{triggerDetail.transactions.length}</div>
          </div>
        </div>
      </div>

      {/* Rule Definition */}
      <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-6 animate-slide-in-left">
        <h3 className="text-lg font-semibold text-text-primary mb-3">Rule Definition</h3>
        <div className="bg-surface-accent rounded-lg p-4 font-mono text-sm text-text-primary border-l-4 border-action-primary">
          {triggerDetail.ruleDefinition}
        </div>
      </div>

      {/* Transactions */}
      <div className="animate-slide-in-right">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Flagged Transactions</h2>
            <p className="text-text-secondary text-sm mt-1">
              Transactions that triggered this rule
            </p>
          </div>
          <div className="text-sm text-text-secondary">
            {triggerDetail.transactions.length} transactions
          </div>
        </div>

        {triggerDetail.transactions.length === 0 ? (
          <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-12 text-center">
            <DollarSign className="h-12 w-12 text-icon-default mx-auto mb-4" />
            <div className="text-text-secondary text-lg">No transactions found</div>
            <p className="text-text-secondary text-sm mt-2">
              No transactions have triggered this rule yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {triggerDetail.transactions.map((transaction, index) => (
              <div key={transaction.id} style={{ animationDelay: `${index * 100}ms` }}>
                <TransactionCard transaction={transaction} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}