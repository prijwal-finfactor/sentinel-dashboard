import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantCard } from '@/components/TenantCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Tenant } from '@/types';
import { api } from '@/utils/api';
import { useAppContext } from '@/contexts/AppContext';
import { Search, Activity, Building2, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function FiuHomePage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();
  const { setSelectedTenant } = useAppContext();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const data = await api.fetchTenants();
        setTenants(data);
        setFilteredTenants(data);
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  useEffect(() => {
    let filtered = tenants;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tenant =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tenant => tenant.status === statusFilter);
    }

    setFilteredTenants(filtered);
  }, [searchTerm, statusFilter, tenants]);

  const handleTenantClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    navigate(`/fiu/${tenant.id}`);
  };

  const getStatusCounts = () => {
    return {
      all: tenants.length,
      active: tenants.filter(t => t.status === 'active').length,
      inactive: tenants.filter(t => t.status === 'inactive').length,
      suspended: tenants.filter(t => t.status === 'suspended').length,
    };
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        {/* Dashboard Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-text-primary">FIU Management Dashboard</h1>
          <p className="text-text-secondary mt-2">
            Monitor and manage your financial intelligence operations across all tenants
          </p>
        </div>

        {/* Simplified Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-in-left">
          <div className="bg-gradient-to-br from-surface-header to-surface-accent rounded-lg p-6 border border-stroke-default shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-action-primary/10 p-2 rounded-lg">
                <Building2 className="h-5 w-5 text-action-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-action-primary">{statusCounts.all}</div>
                <div className="text-sm text-text-secondary">Total Tenants</div>
              </div>
            </div>
            <div className="text-xs text-text-tertiary">Across all regions</div>
          </div>

          <div className="bg-gradient-to-br from-surface-linked to-green-100 rounded-lg p-6 border border-status-success/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-status-success/10 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-status-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-status-success">{statusCounts.active}</div>
                <div className="text-sm text-text-secondary">Active Tenants</div>
              </div>
            </div>
            <div className="text-xs text-text-tertiary">Currently operational</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 animate-slide-in-right">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-icon-default" />
            <Input
              placeholder="Search tenants by name, description, or country..."
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
              className={statusFilter === 'all' 
                ? 'bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface' 
                : 'border-stroke-default text-text-secondary hover:text-action-primary hover:bg-surface-accent-brand'
              }
            >
              All ({statusCounts.all})
            </Button>
            <Button
              variant={statusFilter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('active')}
              className={statusFilter === 'active' 
                ? 'bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface' 
                : 'border-stroke-default text-text-secondary hover:text-action-primary hover:bg-surface-accent-brand'
              }
            >
              Active ({statusCounts.active})
            </Button>
            <Button
              variant={statusFilter === 'inactive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('inactive')}
              className={statusFilter === 'inactive' 
                ? 'bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface' 
                : 'border-stroke-default text-text-secondary hover:text-action-primary hover:bg-surface-accent-brand'
              }
            >
              Inactive ({statusCounts.inactive})
            </Button>
            <Button
              variant={statusFilter === 'suspended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('suspended')}
              className={statusFilter === 'suspended' 
                ? 'bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface' 
                : 'border-stroke-default text-text-secondary hover:text-action-primary hover:bg-surface-accent-brand'
              }
            >
              Suspended ({statusCounts.suspended})
            </Button>
          </div>
        </div>

        {/* Quick Access to Process Management */}
        <div className="bg-gradient-to-r from-surface-header to-surface-accent rounded-lg p-4 border border-stroke-default animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-primary">Process Management</h3>
              <p className="text-sm text-text-secondary">View and manage all processes across tenants</p>
            </div>
            <Button
              onClick={() => navigate('/tenants')}
              className="bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface"
            >
              View All Processes
            </Button>
          </div>
        </div>
      </div>

      {/* Tenants Grid */}
      {filteredTenants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-text-secondary text-lg">No tenants found</div>
          <p className="text-text-secondary text-sm mt-2">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No tenants have been added yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant, index) => (
            <div key={tenant.id} style={{ animationDelay: `${index * 100}ms` }}>
              <TenantCard
                tenant={tenant}
                onClick={() => handleTenantClick(tenant)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}