import React from 'react';
import { Building2, Calendar, Trash2 } from 'lucide-react';
import { Tenant } from '@/types';
import { Button } from '@/components/ui/button';

interface TenantCardProps {
  tenant: Tenant;
  onClick: () => void;
  onDelete?: (tenantId: string) => void;
  showActions?: boolean;
}

export function TenantCard({ tenant, onClick, onDelete, showActions = false }: TenantCardProps) {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(tenant.id);
    }
  };

  return (
    <div className="group bg-surface-header rounded-xl shadow-sm border border-stroke-default p-6 hover:shadow-xl hover:border-stroke-accent-selected transition-all duration-300 animate-fade-in hover:scale-[1.02] hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div 
          onClick={onClick}
          className="flex items-center space-x-3 cursor-pointer flex-1"
        >
          <div className="bg-gradient-to-br from-action-primary to-stroke-accent-selected p-3 rounded-xl shadow-lg group-hover:shadow-action-primary/25 transition-all duration-300">
            <Building2 className="h-6 w-6 text-text-on-surface" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary group-hover:text-action-primary transition-colors duration-200">{tenant.name}</h3>
            <p className="text-sm text-text-secondary mt-1">{tenant.description}</p>
          </div>
        </div>
        
        {/* Always visible delete button when showActions is true */}
        {showActions && onDelete && (
          <Button
            onClick={handleDeleteClick}
            variant="outline"
            size="sm"
            className="ml-3 border-support-negative text-support-negative hover:bg-red-50 hover:border-support-negative/50 transition-all duration-200"
            title="Delete Tenant"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div 
        onClick={onClick}
        className="space-y-2 text-sm cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Country:</span>
          <span className="font-medium text-text-primary">{tenant.country}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Processes:</span>
          <span className="font-medium text-text-primary">{tenant.processCount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Created:</span>
          <span className="font-medium text-text-primary">{new Date(tenant.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-shimmer-gradient bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-shimmer rounded-xl transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}