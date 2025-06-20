export interface Tenant {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  processCount: number;
  country: string;
}

// API Types based on OpenAPI specification
export interface FiuRequestDto {
  tenantId: string;
  password: string;
  fiuId: string;
}

export interface TenantApiResponse {
  tenants?: FiuRequestDto[];
}

export interface Process {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  lastRunDate: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  runCount: number;
  category: string;
}

export interface ProcessRun {
  id: string;
  processId: string;
  runDate: string;
  status: 'success' | 'failed' | 'in-progress';
  duration: number; // in minutes
  usersInvolved: number;
  recordsProcessed: number;
  totalTriggerHits: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastActivity: string;
}

export interface ProcessRunDetail {
  id: string;
  processId: string;
  runDate: string;
  status: 'success' | 'failed' | 'in-progress';
  duration: number;
  users: UserTriggerSummary[];
  recordsProcessed: number;
  logs: string[];
  totalTriggerHits: number;
}

export interface UserTriggerSummary {
  user: User;
  triggerHitCount: number;
  triggers: TriggerSummary[];
}

export interface TriggerSummary {
  id: string;
  name: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  hitCount: number;
  description: string;
}

export interface TriggerDetail {
  id: string;
  name: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ruleDefinition: string;
  transactions: Transaction[];
  createdAt: string;
  lastTriggered: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  fromAccount: string;
  toAccount: string;
  timestamp: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  riskScore: number;
  flaggedReasons: string[];
}