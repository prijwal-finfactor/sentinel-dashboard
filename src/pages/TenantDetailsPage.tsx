import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProcessAccordion } from '@/components/ProcessAccordion';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Process, Tenant } from '@/types';
import { api } from '@/utils/api';
import { useAppContext } from '@/contexts/AppContext';
import { Building2, Activity, Calendar, Globe } from 'lucide-react';

export function TenantDetailsPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { state, setSelectedProcess } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      if (!tenantId) return;

      try {
        const [tenantData, processesData] = await Promise.all([
          api.fetchTenant(tenantId),
          api.fetchProcesses(tenantId),
        ]);

        if (tenantData) {
          setTenant(tenantData);
        }
        setProcesses(processesData);
      } catch (error) {
        console.error('Failed to fetch tenant data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenantId]);

  const handleViewHistory = (processId: string) => {
    const process = processes.find(p => p.id === processId);
    if (process) {
      setSelectedProcess(process);
      navigate(`/fiu/${tenantId}/process/${processId}`);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading tenant details..." />;
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <div className="text-support-negative text-lg">Tenant not found</div>
        <p className="text-text-secondary text-sm mt-2">
          The requested tenant could not be found.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-status-success text-white';
      case 'inactive':
        return 'bg-text-secondary text-white';
      case 'suspended':
        return 'bg-support-negative text-white';
      default:
        return 'bg-surface-accent text-text-primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tenant Header */}
      <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-surface-accent-brand p-3 rounded-lg">
              <Building2 className="h-8 w-8 text-action-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{tenant.name}</h1>
              <p className="text-text-secondary mt-1">{tenant.description}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tenant.status)}`}>
            {tenant.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Activity className="h-5 w-5 text-text-secondary" />
            <div>
              <p className="text-sm text-text-secondary">Active Processes</p>
              <p className="text-lg font-semibold text-text-primary">{tenant.processCount}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-text-secondary" />
            <div>
              <p className="text-sm text-text-secondary">Country</p>
              <p className="text-lg font-semibold text-text-primary">{tenant.country}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-text-secondary" />
            <div>
              <p className="text-sm text-text-secondary">Created</p>
              <p className="text-lg font-semibold text-text-primary">{new Date(tenant.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processes Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Processes</h2>
            <p className="text-text-secondary text-sm mt-1">
              Monitor and manage all processes for this tenant
            </p>
          </div>
          <div className="text-sm text-text-secondary">
            {processes.length} total processes
          </div>
        </div>

        {processes.length === 0 ? (
          <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default p-12 text-center">
            <Activity className="h-12 w-12 text-icon-default mx-auto mb-4" />
            <div className="text-text-secondary text-lg">No processes found</div>
            <p className="text-text-secondary text-sm mt-2">
              This tenant doesn't have any processes configured yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {processes.map((process) => (
              <ProcessAccordion
                key={process.id}
                process={process}
                onViewHistory={handleViewHistory}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}