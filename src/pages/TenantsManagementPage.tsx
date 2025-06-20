import React, { useState, useEffect } from 'react';
import { TenantCard } from '@/components/TenantCard';
import { TenantFormModal } from '@/components/TenantFormModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Tenant, FiuRequestDto } from '@/types';
import { api } from '@/utils/api';
import { useAppContext } from '@/contexts/AppContext';
import { Search, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function TenantsManagementPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { isAuthenticated } = useAppContext();

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
        tenant.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTenants(filtered);
  }, [searchTerm, tenants]);

  const handleTenantClick = (tenant: Tenant) => {
    // Navigate to tenant details or show tenant info
    console.log('Tenant clicked:', tenant);
  };

  const handleCreateTenant = async (tenantData: FiuRequestDto) => {
    if (!isAuthenticated) {
      alert('Please authenticate first to create tenants');
      return;
    }

    try {
      const newTenant = await api.createTenant(tenantData);
      setTenants(prev => [...prev, newTenant]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create tenant:', error);
      alert('Failed to create tenant. Please try again.');
    }
  };

  const handleDeleteTenant = async (tenantId: string) => {
    if (!isAuthenticated) {
      alert('Please authenticate first to delete tenants');
      return;
    }

    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(tenantId);
    try {
      await api.deleteTenant(tenantId);
      setTenants(prev => prev.filter(t => t.id !== tenantId));
    } catch (error) {
      console.error('Failed to delete tenant:', error);
      alert('Failed to delete tenant. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      alert('Please authenticate first to create new tenants');
      return;
    }
    setShowCreateModal(true);
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading tenants..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-text-primary">Tenant Management</h1>
          <p className="text-text-secondary mt-2">
            Manage all tenant organizations in the system
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-start animate-slide-in-right">
          <Button
            onClick={handleCreateClick}
            className={`flex items-center space-x-2 ${
              isAuthenticated 
                ? 'bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface' 
                : 'bg-button-disabled text-text-secondary cursor-not-allowed'
            }`}
            disabled={!isAuthenticated}
          >
            <Plus className="h-4 w-4" />
            <span>Create New Tenant</span>
            {!isAuthenticated && <span className="text-xs">(Login Required)</span>}
          </Button>
        </div>

        {/* Search */}
        <div className="animate-slide-in-right">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-icon-default" />
            <Input
              placeholder="Search tenants by name or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-surface-header border-stroke-default focus:border-stroke-accent-selected focus:ring-action-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Tenants List */}
      {filteredTenants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-text-secondary text-lg">No tenants found</div>
          <p className="text-text-secondary text-sm mt-2">
            {searchTerm
              ? 'Try adjusting your search criteria'
              : 'No tenants have been added yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant, index) => (
            <div key={tenant.id} style={{ animationDelay: `${index * 100}ms` }} className="relative">
              {deleteLoading === tenant.id && (
                <div className="absolute inset-0 bg-surface-header/80 rounded-xl flex items-center justify-center z-10">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-support-negative border-t-transparent"></div>
                    <span className="text-sm text-support-negative">Deleting...</span>
                  </div>
                </div>
              )}
              <TenantCard
                tenant={tenant}
                onClick={() => handleTenantClick(tenant)}
                onDelete={isAuthenticated ? handleDeleteTenant : undefined}
                showActions={isAuthenticated}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <TenantFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTenant}
          title="Create New Tenant"
        />
      )}
    </div>
  );
}