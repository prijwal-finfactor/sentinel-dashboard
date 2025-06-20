import React, { useState } from 'react';
import { X, Building2, Globe, FileText, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiuRequestDto } from '@/types';

interface TenantFormModalProps {
  onClose: () => void;
  onSubmit: (data: FiuRequestDto) => void;
  title: string;
}

export function TenantFormModal({ onClose, onSubmit, title }: TenantFormModalProps) {
  const [formData, setFormData] = useState<FiuRequestDto>({
    tenantId: '',
    password: '',
    fiuId: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-header rounded-xl shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-stroke-default">
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tenant ID */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <Building2 className="h-4 w-4 inline mr-2" />
              Tenant ID
            </label>
            <Input
              type="text"
              name="tenantId"
              value={formData.tenantId}
              onChange={handleInputChange}
              placeholder="Enter unique tenant identifier"
              required
              className="bg-surface-header border-stroke-default focus:border-stroke-accent-selected"
            />
          </div>

          {/* FIU ID */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <Globe className="h-4 w-4 inline mr-2" />
              FIU ID
            </label>
            <Input
              type="text"
              name="fiuId"
              value={formData.fiuId}
              onChange={handleInputChange}
              placeholder="Enter Financial Intelligence Unit ID"
              required
              className="bg-surface-header border-stroke-default focus:border-stroke-accent-selected"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <Key className="h-4 w-4 inline mr-2" />
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter tenant password"
              required
              className="bg-surface-header border-stroke-default focus:border-stroke-accent-selected"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-stroke-default">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-stroke-default text-text-secondary hover:text-text-primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-action-primary hover:bg-stroke-accent-selected text-text-on-surface"
            >
              {loading ? 'Creating...' : 'Create Tenant'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}