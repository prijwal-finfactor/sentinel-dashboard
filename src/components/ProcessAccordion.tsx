import React from 'react';
import { Process } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Play, Pause, CheckCircle, XCircle, Calendar, BarChart3, Tag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessAccordionProps {
  process: Process;
  onViewHistory: (processId: string) => void;
}

export function ProcessAccordion({ process, onViewHistory }: ProcessAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="h-4 w-4 text-status-success" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-status-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-support-negative" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-text-warning" />;
      default:
        return <Play className="h-4 w-4 text-text-secondary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-surface-linked text-status-success border-status-success/20';
      case 'completed':
        return 'bg-purple-50 text-action-primary border-action-primary/20';
      case 'failed':
        return 'bg-red-50 text-support-negative border-support-negative/20';
      case 'paused':
        return 'bg-support-warning text-text-warning border-text-warning/20';
      default:
        return 'bg-surface-accent text-text-secondary border-stroke-default';
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-surface-header rounded-lg shadow-sm border border-stroke-default overflow-hidden hover:border-stroke-accent-selected transition-all duration-300">
        <CollapsibleTrigger className="w-full p-6 text-left hover:bg-surface-accent transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusIcon(process.status)}
              <div>
                <h3 className="text-lg font-semibold text-text-primary hover:text-action-primary transition-colors duration-200">{process.name}</h3>
                <p className="text-sm text-text-secondary">{process.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(process.status)}`}>
                {process.status.toUpperCase()}
              </span>
              <ChevronDown className={`h-5 w-5 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6 border-t border-stroke-default bg-surface-accent/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-text-secondary" />
                <div>
                  <p className="text-xs text-text-secondary">Start Date</p>
                  <p className="text-sm font-medium text-text-primary">{new Date(process.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-text-secondary" />
                <div>
                  <p className="text-xs text-text-secondary">End Date</p>
                  <p className="text-sm font-medium text-text-primary">{new Date(process.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-text-secondary" />
                <div>
                  <p className="text-xs text-text-secondary">Last Run</p>
                  <p className="text-sm font-medium text-text-primary">{new Date(process.lastRunDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-text-secondary" />
                <div>
                  <p className="text-xs text-text-secondary">Total Runs</p>
                  <p className="text-sm font-medium text-text-primary">{process.runCount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">Category:</span>
                <span className="px-2 py-1 bg-surface-accent-brand text-action-primary text-xs rounded-full">
                  {process.category}
                </span>
              </div>
              
              <Button
                onClick={() => onViewHistory(process.id)}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 border-stroke-accent-selected text-action-primary hover:bg-surface-accent-brand"
              >
                <Eye className="h-4 w-4" />
                <span>View History</span>
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}