import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProcessAccordion } from '@/components/ProcessAccordion';
import { ProcessUploadModal } from '@/components/ProcessUploadModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Process, Tenant } from '@/types';
import { api } from '@/utils/api';
import { useAppContext } from '@/contexts/AppContext';
import { Activity, Search, Upload, Settings, Building2, TrendingUp, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ProcessesHomePage() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredProcesses, setFilteredProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tenantFilter, setTenantFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();
  const { setSelectedProcess, isAuthenticated } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [processesData, tenantsData] = await Promise.all([
          api.fetchAllProcesses(),
          api.fetchTenants()
        ]);
        setProcesses(processesData);
        setTenants(tenantsData);
        setFilteredProcesses(processesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

    // Apply tenant filter
    if (tenantFilter !== 'all') {
      filtered = filtered.filter(process => process.tenantId === tenantFilter);
    }

    setFilteredProcesses(filtered);
  }, [searchTerm, statusFilter, tenantFilter, processes]);

  const handleProcessClick = (processId: string) => {
    const process = processes.find(p => p.id === processId);
    if (process) {
      setSelectedProcess(process);
      navigate(`/processes/${processId}`);
    }
  };

  const handleUploadSuccess = (newProcess: Process) => {
    setProcesses(prev => [...prev, newProcess]);
    setShowUploadModal(false);
  };

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      alert('Please authenticate first to upload new processes');
      return;
    }
    setShowUploadModal(true);
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

  const getTenantCounts = () => {
    return {
      all: tenants.length,
      active: tenants.filter(t => t.status === 'active').length,
      inactive: tenants.filter(t => t.status === 'inactive').length,
    };
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading processes..." />;
  }

  const statusCounts = getStatusCounts();
  const tenantCounts = getTenantCounts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        {/* Dashboard Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-text-primary">Process Management Dashboard</h1>
          <p className="text-text-secondary mt-2">
            Monitor and manage all financial intelligence processes across tenants
          </p>
        </div>

        {/* Tenant Dashboard */}
        <div className="bg-gradient-to-r from-surface-header to-surface-accent rounded-xl shadow-sm border border-stroke-default p-6 animate-slide-in-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Tenant Overview</h3>
              <p className="text-sm text-text-secondary">Current tenant status across the system</p>
            </div>
            <Button
              onClick={() => navigate('/tenants')}
              variant="outline"
              className="flex items-center space-x-2 border-stroke-accent-selected text-action-primary hover:bg-surface-accent-brand"
            >
              <Settings className="h-4 w-4" />
              <span>Manage Tenants</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-surface-linked to-green-100 rounded-lg p-4 border border-status-success/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-status-success/10 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-status-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-status-success">{tenantCounts.active}</div>
                  <div className="text-sm text-text-secondary">Active Tenants</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-text-secondary/20 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-text-secondary/10 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-text-secondary">{tenantCounts.inactive}</div>
                  <div className="text-sm text-text-secondary">Inactive Tenants</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-slide-in-left">
          <div className="bg-gradient-to-br from-surface-header to-surface-accent rounded-lg p-4 border border-stroke-default shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-2xl font-bold text-action-primary">{statusCounts.all}</div>
            <div className="text-sm text-text-secondary">Total Processes</div>
          </div>
          <div className="bg-gradient-to-br from-surface-linked to-green-100 rounded-lg p-4 border border-status-success/20 shadow-sm hover:shadow-md transition-all duration-300">
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
          <div className="bg-gradient-to-br from-support-warning to-orange-100 rounded-lg p-4 border border-text-warning/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-2xl font-bold text-text-warning">{statusCounts.paused}</div>
            <div className="text-sm text-text-secondary">Paused</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-start animate-slide-in-right">
          <Button
            onClick={handleUploadClick}
            className={`flex items-center space-x-2 ${
              isAuthenticated 
                ? 'bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface' 
                : 'bg-button-disabled text-text-secondary cursor-not-allowed'
            }`}
            disabled={!isAuthenticated}
          >
            <Upload className="h-4 w-4" />
            <span>Upload New Process</span>
            {!isAuthenticated && <span className="text-xs">(Login Required)</span>}
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col space-y-2 animate-slide-in-right">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-icon-default" />
            <Input
              placeholder="Search processes by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-surface-header border-stroke-default focus:border-stroke-accent-selected focus:ring-action-primary/20"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Status Filter */}
            <div className="flex space-x-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={`transition-all duration-200 hover:scale-105 ${
                  statusFilter === 'all' 
                    ? 'bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface' 
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
                    ? 'bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface' 
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
                    ? 'bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface' 
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
                    ? 'bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface' 
                    : 'border-stroke-default text-text-secondary hover:text-action-primary hover:bg-surface-accent-brand'
                }`}
              >
                Failed ({statusCounts.failed})
              </Button>
            </div>

            {/* Tenant Filter */}
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-text-secondary" />
              <select
                value={tenantFilter}
                onChange={(e) => setTenantFilter(e.target.value)}
                className="px-3 py-1 border border-stroke-default rounded-lg bg-surface-header text-text-primary focus:border-stroke-accent-selected focus:ring-2 focus:ring-action-primary/20 text-sm"
              >
                <option value="all">All Tenants</option>
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Processes List */}
      {filteredProcesses.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-text-secondary text-lg">No processes found</div>
          <p className="text-text-secondary text-sm mt-2">
            {searchTerm || statusFilter !== 'all' || tenantFilter !== 'all'
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
                onViewHistory={handleProcessClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <ProcessUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}