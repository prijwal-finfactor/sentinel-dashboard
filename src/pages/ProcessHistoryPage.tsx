import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProcessRunCard } from '@/components/ProcessRunCard';
import { UserTriggerCard } from '@/components/UserTriggerCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ProcessRun, ProcessRunDetail, Process } from '@/types';
import { api } from '@/utils/api';
import { useAppContext } from '@/contexts/AppContext';
import { Activity, Calendar, Clock, Users, ArrowLeft, FileText, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProcessHistoryPage() {
  const { processId } = useParams<{ processId: string }>();
  const [process, setProcess] = useState<Process | null>(null);
  const [processRuns, setProcessRuns] = useState<ProcessRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<ProcessRunDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [runDetailLoading, setRunDetailLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      if (!processId) return;

      try {
        const [processData, runsData] = await Promise.all([
          api.fetchProcess(processId),
          api.fetchProcessRuns(processId),
        ]);

        if (processData) setProcess(processData);
        setProcessRuns(runsData);
      } catch (error) {
        console.error('Failed to fetch process history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [processId]);

  const handleRunClick = async (run: ProcessRun) => {
    setRunDetailLoading(true);
    try {
      const runDetail = await api.fetchProcessRunDetail(run.id);
      setSelectedRun(runDetail);
    } catch (error) {
      console.error('Failed to fetch run details:', error);
    } finally {
      setRunDetailLoading(false);
    }
  };

  const handleUserClick = (userId: string, sessionId: string) => {
    navigate(`/tenants/${processId}/${sessionId}/${userId}`);
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading process history..." />;
  }

  if (!process) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-support-negative text-lg">Process not found</div>
        <p className="text-text-secondary text-sm mt-2">
          The requested process could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-surface-header to-surface-accent rounded-xl shadow-sm border border-stroke-default p-6 animate-fade-in">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-gradient-to-br from-action-primary to-stroke-accent-selected p-3 rounded-xl shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{process.name}</h1>
            <p className="text-text-secondary">{process.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-text-secondary" />
            <div>
              <p className="text-xs text-text-secondary">Last Run</p>
              <p className="text-sm font-medium text-text-primary">{new Date(process.lastRunDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-text-secondary" />
            <div>
              <p className="text-xs text-text-secondary">Total Runs</p>
              <p className="text-sm font-medium text-text-primary">{process.runCount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-text-secondary" />
            <div>
              <p className="text-xs text-text-secondary">Status</p>
              <p className="text-sm font-medium capitalize text-text-primary">{process.status}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-text-secondary" />
            <div>
              <p className="text-xs text-text-secondary">Category</p>
              <p className="text-sm font-medium text-text-primary">{process.category}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Process Runs List - Left Side */}
        <div className="flex-1 animate-slide-in-left">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">Recent Runs</h2>
            <span className="text-sm text-text-secondary">{processRuns.length} runs shown</span>
          </div>

          <div className="space-y-3">
            {processRuns.length === 0 ? (
              <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-8 text-center">
                <Activity className="h-8 w-8 text-icon-default mx-auto mb-3" />
                <div className="text-text-secondary">No runs found</div>
                <p className="text-text-secondary text-sm mt-1">
                  This process hasn't been executed yet.
                </p>
              </div>
            ) : (
              processRuns.map((run, index) => (
                <div key={run.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <ProcessRunCard
                    run={run}
                    onClick={() => handleRunClick(run)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Run Details - Right Side */}
        <div className="flex-1 animate-slide-in-right">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Run Details</h2>
          
          {runDetailLoading ? (
            <LoadingSpinner size="md" text="Loading run details..." />
          ) : selectedRun ? (
            <div className="space-y-4">
              {/* Run Info */}
              <div className="bg-gradient-to-r from-surface-header to-surface-accent rounded-lg shadow-sm border border-stroke-default p-4">
                <h3 className="font-medium text-text-primary mb-3">Run #{selectedRun.id}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text-secondary">Date</p>
                    <p className="font-medium text-text-primary">{new Date(selectedRun.runDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Duration</p>
                    <p className="font-medium text-text-primary">{selectedRun.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Status</p>
                    <p className="font-medium capitalize text-text-primary">{selectedRun.status}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Records</p>
                    <p className="font-medium text-text-primary">{selectedRun.recordsProcessed.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-stroke-default">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-text-warning" />
                    <span className="text-sm text-text-secondary">Total Trigger Hits:</span>
                    <span className="text-sm font-semibold text-text-warning">{selectedRun.totalTriggerHits}</span>
                  </div>
                </div>
              </div>

              {/* Users with Triggers */}
              <div>
                <h4 className="font-medium text-text-primary mb-3 flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Users with Trigger Hits ({selectedRun.users.length})</span>
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedRun.users.map((userTrigger, index) => (
                    <div key={userTrigger.user.id} style={{ animationDelay: `${index * 150}ms` }}>
                      <UserTriggerCard
                        userTrigger={userTrigger}
                        onClick={() => handleUserClick(userTrigger.user.id, selectedRun.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Logs */}
              <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-4">
                <h4 className="font-medium text-text-primary mb-3">Process Logs</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedRun.logs.map((log, index) => (
                    <div key={index} className="text-sm text-text-secondary bg-surface-accent p-2 rounded animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-8 text-center">
              <Activity className="h-8 w-8 text-icon-default mx-auto mb-3" />
              <div className="text-text-secondary">Select a run to view details</div>
              <p className="text-text-secondary text-sm mt-1">
                Click on any run from the list to see detailed information and trigger hits.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}