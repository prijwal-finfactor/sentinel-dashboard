import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessAccordion } from '@/components/ProcessAccordion';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Process } from '@/types';
import { api } from '@/utils/api';
import { useAppContext } from '@/contexts/AppContext';
import { Activity, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function TenantsPage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { setSelectedProcess } = useAppContext();

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const data = await api.fetchAllProcesses();
        setProcesses(data);
        setFilteredProcesses(data);
      } catch (error) {
        console.error('Failed to fetch processes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();
  }, []);

  useEffect(() => {
    let filtered = processes;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(process =>
        process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(process => process.status === statusFilter);
    }

    setFilteredProcesses(filtered);
  }, [searchTerm, statusFilter, processes]);

  const handleViewHistory = (processId: string) => {
    const process = processes.find(p => p.id === processId);
    if (process) {
      setSelectedProcess(process);
      navigate(`/tenants/${processId}`);
    }
  };

  const getStatusCounts = () => {
    return {
      all: processes.length,
      running: processes.filter(p => p.status === 'running').length,
      completed: processes.filter(p => p.status === 'completed').length,
      failed: processes.filter(p => p.status === 'failed').length,
      paused: processes.filter(p => p.status === 'paused').length,
    };
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading processes..." />;
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-text-primary">All Processes</h1>
          <p className="text-text-secondary mt-2">
            Monitor and manage all financial intelligence processes across tenants
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-slide-in-left">
          <div className="bg-gradient-to-br from-surface-header to-surface-accent rounded-lg p-4 border border-stroke-default shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-2xl font-bold text-action-primary">{statusCounts.all}</div>
            <div className="text-sm text-text-secondary">Total Processes</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-status-success/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-2xl font-bold text-status-success">{statusCounts.running}</div>
            <div className="text-sm text-text-secondary">Running</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-status-info/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-2xl font-bold text-status-info">{statusCounts.completed}</div>
            <div className="text-sm text-text-secondary">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-support-negative/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-2xl font-bold text-support-negative">{statusCounts.failed}</div>
            <div className="text-sm text-text-secondary">Failed</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-text-warning/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-2xl font-bold text-text-warning">{statusCounts.paused}</div>
            <div className="text-sm text-text-secondary">Paused</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 animate-slide-in-right">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search processes by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-surface-header border-stroke-default focus:border-stroke-accent-selected focus:ring-action-primary/20"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className={`transition-all duration-200 hover:scale-105 ${
                statusFilter === 'all' 
                  ? 'bg-action-primary hover:bg-stroke-accent-selected text-white' 
                  : 'border-stroke-default text-text-secondary hover:text-action-primary hover:bg-surface-accent-brand'
              }`}
            >
              All ({statusCounts.all})
            </Button>
            <Button
              variant={statusFilter === 'running' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('running')}
              className={`transition-all duration-200 hover:scale-105 ${
                statusFilter === 'running' 
                  ? 'bg-action-primary hover:bg-stroke-accent-selected text-white' 
                  : 'border-stroke-default text-text-secondary hover:text-action-primary hover:bg-surface-accent-brand'
              }`}
            >
              Running ({statusCounts.running})
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
              className={`transition-all duration-200 hover:scale-105 ${
                statusFilter === 'completed' 
                  ? 'bg-action-primary hover:bg-stroke-accent-selected text-white' 
                  : 'border-stroke-default text-text-secondary hover:text-action-primary hover:bg-surface-accent-brand'
              }`}
            >
              Completed ({statusCounts.completed})
            </Button>
            <Button
              variant={statusFilter === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('failed')}
              className={`transition-all duration-200 hover:scale-105 ${
                statusFilter === 'failed' 
                  ? 'bg-action-primary hover:bg-stroke-accent-selected text-white' 
                  : 'border-stroke-default text-text-secondary hover:text-action-primary hover:bg-surface-accent-brand'
              }`}
            >
              Failed ({statusCounts.failed})
            </Button>
          </div>
        </div>
      </div>

      {/* Processes List */}
      {filteredProcesses.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-text-secondary text-lg">No processes found</div>
          <p className="text-text-secondary text-sm mt-2">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No processes have been configured yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProcesses.map((process, index) => (
            <div key={process.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
              <ProcessAccordion
                process={process}
                onViewHistory={handleViewHistory}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}