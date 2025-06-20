import React, { useState } from 'react';
import { X, Upload, Calendar, Tag, Building2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Process, Tenant } from '@/types';
import { api } from '@/utils/api';

interface ProcessUploadModalProps {
  onClose: () => void;
  onSuccess: (process: Process) => void;
}

export function ProcessUploadModal({ onClose, onSuccess }: ProcessUploadModalProps) {
  const [formData, setFormData] = useState({
    tenantId: '',
    startsOn: '',
    endsOn: '',
    freq: '0 0 0 * * ?',
    productName: '',
    groupName: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    // Fetch tenants for dropdown
    const fetchTenants = async () => {
      try {
        const data = await api.fetchTenants();
        setTenants(data);
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
      }
    };
    fetchTenants();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for multipart/form-data request
      const uploadData = new FormData();
      uploadData.append('tenantId', formData.tenantId);
      uploadData.append('startsOn', formData.startsOn);
      uploadData.append('endsOn', formData.endsOn);
      uploadData.append('freq', formData.freq);
      uploadData.append('productName', formData.productName);
      uploadData.append('groupName', formData.groupName);
      
      if (file) {
        uploadData.append('file', file);
      }

      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create mock process object
      const newProcess: Process = {
        id: `process-${Date.now()}`,
        tenantId: formData.tenantId,
        name: `${formData.productName} - ${formData.groupName}`,
        description: `Process for ${formData.productName} in ${formData.groupName} group`,
        startDate: formData.startsOn,
        endDate: formData.endsOn,
        lastRunDate: new Date().toISOString(),
        status: 'running',
        runCount: 0,
        category: formData.groupName,
      };

      onSuccess(newProcess);
    } catch (error) {
      setError('Failed to upload process. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-header rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-stroke-default">
          <h2 className="text-xl font-semibold text-text-primary">Upload New Process</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-support-negative/20 rounded-lg p-4">
              <p className="text-support-negative text-sm">{error}</p>
            </div>
          )}

          {/* Tenant Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <Building2 className="h-4 w-4 inline mr-2" />
              Tenant
            </label>
            <select
              name="tenantId"
              value={formData.tenantId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-stroke-default rounded-lg bg-surface-header text-text-primary focus:border-stroke-accent-selected focus:ring-2 focus:ring-action-primary/20"
            >
              <option value="">Select a tenant</option>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Start Date
              </label>
              <Input
                type="date"
                name="startsOn"
                value={formData.startsOn}
                onChange={handleInputChange}
                required
                className="bg-surface-header border-stroke-default focus:border-stroke-accent-selected"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                End Date
              </label>
              <Input
                type="date"
                name="endsOn"
                value={formData.endsOn}
                onChange={handleInputChange}
                required
                className="bg-surface-header border-stroke-default focus:border-stroke-accent-selected"
              />
            </div>
          </div>

          {/* Process Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Tag className="h-4 w-4 inline mr-2" />
                Product Name
              </label>
              <Input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="e.g., car loan"
                required
                className="bg-surface-header border-stroke-default focus:border-stroke-accent-selected"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Tag className="h-4 w-4 inline mr-2" />
                Group Name
              </label>
              <Input
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                placeholder="e.g., risky loan"
                required
                className="bg-surface-header border-stroke-default focus:border-stroke-accent-selected"
              />
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Frequency (Cron Expression)
            </label>
            <Input
              type="text"
              name="freq"
              value={formData.freq}
              onChange={handleInputChange}
              placeholder="0 0 0 * * ?"
              required
              className="bg-surface-header border-stroke-default focus:border-stroke-accent-selected"
            />
            <p className="text-xs text-text-secondary mt-1">
              Default: Daily at midnight (0 0 0 * * ?)
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Data File (CSV)
            </label>
            <div className="border-2 border-dashed border-stroke-default rounded-lg p-6 text-center hover:border-stroke-accent-selected transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                required
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-icon-default" />
                <span className="text-text-secondary">
                  {file ? file.name : 'Click to upload CSV file'}
                </span>
              </label>
            </div>
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
              {loading ? 'Uploading...' : 'Upload Process'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}