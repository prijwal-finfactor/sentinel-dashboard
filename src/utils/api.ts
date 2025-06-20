import axios from 'axios';
import { Tenant, Process, ProcessRun, ProcessRunDetail, User, UserTriggerSummary, TriggerDetail, Transaction, TriggerSummary, FiuRequestDto } from '@/types';
import { SENTINEL_URLS } from '@/constants/apiEndpoints';

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Don't reload the page, just clear the auth state
    }
    return Promise.reject(error);
  }
);

// Mock data (keep for fallback)
const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Global Financial Services',
    description: 'International banking and financial services organization',
    status: 'active',
    createdAt: '2023-01-15',
    processCount: 12,
    country: 'USA',
  },
  {
    id: '2',
    name: 'European Investment Bank',
    description: 'Regional investment banking institution',
    status: 'active',
    createdAt: '2023-03-22',
    processCount: 8,
    country: 'Germany',
  },
  {
    id: '3',
    name: 'Asia Pacific Credit Union',
    description: 'Credit union serving Asia Pacific region',
    status: 'inactive',
    createdAt: '2023-02-10',
    processCount: 5,
    country: 'Singapore',
  },
  {
    id: '4',
    name: 'Middle East Banking Corp',
    description: 'Corporate banking solutions for Middle East',
    status: 'active',
    createdAt: '2023-04-05',
    processCount: 15,
    country: 'UAE',
  },
  {
    id: '5',
    name: 'South American Financial',
    description: 'Regional financial services provider',
    status: 'suspended',
    createdAt: '2023-01-30',
    processCount: 3,
    country: 'Brazil',
  },
  {
    id: '6',
    name: 'Nordic Banking Solutions',
    description: 'Scandinavian financial technology company',
    status: 'active',
    createdAt: '2023-05-12',
    processCount: 9,
    country: 'Sweden',
  },
];

const mockProcesses: Process[] = [
  {
    id: 'p1',
    tenantId: '1',
    name: 'Anti-Money Laundering Check',
    description: 'Automated AML screening for all transactions',
    startDate: '2023-01-20',
    endDate: '2024-01-20',
    lastRunDate: '2024-01-15',
    status: 'running',
    runCount: 1250,
    category: 'Compliance',
  },
  {
    id: 'p2',
    tenantId: '1',
    name: 'Transaction Monitoring',
    description: 'Real-time transaction pattern analysis',
    startDate: '2023-02-01',
    endDate: '2024-02-01',
    lastRunDate: '2024-01-14',
    status: 'running',
    runCount: 2840,
    category: 'Monitoring',
  },
  {
    id: 'p3',
    tenantId: '1',
    name: 'Customer Due Diligence',
    description: 'Enhanced customer background verification',
    startDate: '2023-01-25',
    endDate: '2024-01-25',
    lastRunDate: '2024-01-13',
    status: 'completed',
    runCount: 856,
    category: 'Verification',
  },
  {
    id: 'p4',
    tenantId: '2',
    name: 'Sanctions Screening',
    description: 'Automated sanctions list checking',
    startDate: '2023-03-25',
    endDate: '2024-03-25',
    lastRunDate: '2024-01-15',
    status: 'running',
    runCount: 945,
    category: 'Compliance',
  },
  {
    id: 'p5',
    tenantId: '2',
    name: 'Risk Assessment',
    description: 'Comprehensive risk evaluation process',
    startDate: '2023-04-01',
    endDate: '2024-04-01',
    lastRunDate: '2024-01-12',
    status: 'paused',
    runCount: 234,
    category: 'Assessment',
  },
];

const mockProcessRuns: Record<string, ProcessRun[]> = {
  'p1': [
    { id: 'r1', processId: 'p1', runDate: '2024-01-15', status: 'success', duration: 45, usersInvolved: 3, recordsProcessed: 1250, totalTriggerHits: 47 },
    { id: 'r2', processId: 'p1', runDate: '2024-01-14', status: 'success', duration: 42, usersInvolved: 2, recordsProcessed: 1180, totalTriggerHits: 32 },
    { id: 'r3', processId: 'p1', runDate: '2024-01-13', status: 'failed', duration: 12, usersInvolved: 1, recordsProcessed: 450, totalTriggerHits: 8 },
    { id: 'r4', processId: 'p1', runDate: '2024-01-12', status: 'success', duration: 48, usersInvolved: 3, recordsProcessed: 1320, totalTriggerHits: 56 },
  ],
  'p2': [
    { id: 'r5', processId: 'p2', runDate: '2024-01-14', status: 'success', duration: 180, usersInvolved: 5, recordsProcessed: 2840, totalTriggerHits: 89 },
    { id: 'r6', processId: 'p2', runDate: '2024-01-13', status: 'success', duration: 175, usersInvolved: 4, recordsProcessed: 2650, totalTriggerHits: 73 },
    { id: 'r7', processId: 'p2', runDate: '2024-01-12', status: 'in-progress', duration: 90, usersInvolved: 3, recordsProcessed: 1400, totalTriggerHits: 34 },
  ],
};

const mockUsers: User[] = [
  { id: 'u1', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'Compliance Analyst', department: 'Risk Management', lastActivity: '2024-01-15 14:30' },
  { id: 'u2', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'Senior Analyst', department: 'Fraud Detection', lastActivity: '2024-01-15 12:15' },
  { id: 'u3', name: 'Emma Rodriguez', email: 'emma.rodriguez@example.com', role: 'AML Specialist', department: 'Compliance', lastActivity: '2024-01-15 16:45' },
  { id: 'u4', name: 'David Kim', email: 'david.kim@example.com', role: 'Risk Analyst', department: 'Risk Management', lastActivity: '2024-01-14 09:20' },
  { id: 'u5', name: 'Lisa Thompson', email: 'lisa.thompson@example.com', role: 'Compliance Manager', department: 'Compliance', lastActivity: '2024-01-14 17:30' },
];

const mockTriggers: TriggerSummary[] = [
  { id: 't1', name: 'Large Cash Transaction', type: 'Amount Threshold', severity: 'high', hitCount: 15, description: 'Transactions exceeding $10,000 in cash' },
  { id: 't2', name: 'Rapid Fire Transactions', type: 'Velocity', severity: 'medium', hitCount: 8, description: 'Multiple transactions within short time frame' },
  { id: 't3', name: 'Sanctions List Match', type: 'Watchlist', severity: 'critical', hitCount: 3, description: 'Customer matches sanctions database' },
  { id: 't4', name: 'Unusual Geographic Pattern', type: 'Geographic', severity: 'medium', hitCount: 12, description: 'Transactions from high-risk countries' },
  { id: 't5', name: 'Round Number Pattern', type: 'Pattern', severity: 'low', hitCount: 22, description: 'Frequent round number transactions' },
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    amount: 15000,
    currency: 'USD',
    fromAccount: 'ACC-001-2024',
    toAccount: 'ACC-002-2024',
    timestamp: '2024-01-15 10:30:00',
    description: 'Wire transfer to offshore account',
    status: 'completed',
    riskScore: 85,
    flaggedReasons: ['Large amount', 'Offshore destination', 'Cash intensive business']
  },
  {
    id: 'tx2',
    amount: 12500,
    currency: 'USD',
    fromAccount: 'ACC-001-2024',
    toAccount: 'ACC-003-2024',
    timestamp: '2024-01-15 11:45:00',
    description: 'Business payment',
    status: 'completed',
    riskScore: 72,
    flaggedReasons: ['Large amount', 'Rapid succession']
  },
  {
    id: 'tx3',
    amount: 10000,
    currency: 'USD',
    fromAccount: 'ACC-004-2024',
    toAccount: 'ACC-001-2024',
    timestamp: '2024-01-15 14:20:00',
    description: 'Cash deposit',
    status: 'completed',
    riskScore: 78,
    flaggedReasons: ['Exact threshold amount', 'Cash transaction']
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

export const api = {
  // Fetch all tenants
  async fetchTenants(): Promise<Tenant[]> {
    try {
      // Try API call first if authenticated
      if (isAuthenticated()) {
        const response = await apiClient.get(SENTINEL_URLS.GET_ALL_TENANTS);

        // Transform API response to frontend Tenant format
        const tenants = response.data.tenants || response.data;

        return tenants.map((t: any, index: number) => ({
          id: t.id || String(index + 1),
          name: t.tenantId || t.name || `Tenant ${index + 1}`,
          description: t.description || `Tenant for ${t.fiuId || 'Financial Institution'}`,
          status: t.status || (index % 2 === 0 ? 'active' : 'inactive'),
          createdAt: t.createdAt || '2023-01-15',
          processCount: t.processCount || Math.floor(Math.random() * 5) + 1,
          country: t.country || 'India',
        }));
      }
    } catch (error: any) {
      console.error('Failed to fetch tenants from API:', error);
    }
    
    // Always fall back to mock data for viewing
    await delay(800);
    return mockTenants;
  },

  // Create new tenant
  async createTenant(tenantData: FiuRequestDto): Promise<Tenant> {
    if (!isAuthenticated()) {
      throw new Error('Authentication required for creating tenants');
    }

    try {
      const response = await apiClient.post(SENTINEL_URLS.GET_ALL_TENANTS, tenantData);
      
      // Transform API response to frontend format
      return {
        id: response.data.id || `tenant-${Date.now()}`,
        name: tenantData.tenantId,
        description: `Tenant for ${tenantData.fiuId}`,
        status: 'active',
        createdAt: new Date().toISOString(),
        processCount: 0,
        country: 'India',
      };
    } catch (error: any) {
      console.error('Failed to create tenant:', error);
      throw error;
    }
  },

  // Delete tenant
  async deleteTenant(tenantId: string): Promise<void> {
    if (!isAuthenticated()) {
      throw new Error('Authentication required for deleting tenants');
    }

    try {
      await apiClient.delete(`${SENTINEL_URLS.GET_ALL_TENANTS}/${tenantId}`);
    } catch (error: any) {
      console.error('Failed to delete tenant:', error);
      throw error;
    }
  },

  // Fetch all processes (for /processes route)
  async fetchAllProcesses(): Promise<Process[]> {
    try {
      // Try API call first if authenticated
      if (isAuthenticated()) {
        // This would be your actual API call
        // const response = await apiClient.get('/api/v1/processes');
        // return response.data;
      }
    } catch (error: any) {
      console.error('Failed to fetch processes from API:', error);
    }
    
    // Always fall back to mock data for viewing
    await delay(600);
    return mockProcesses;
  },

  // Fetch processes for a specific tenant
  async fetchProcesses(tenantId: string): Promise<Process[]> {
    try {
      // Try API call first if authenticated
      if (isAuthenticated()) {
        // This would be your actual API call
        // const response = await apiClient.get(SENTINEL_URLS.GET_TENANT_PROCESSES(tenantId));
        // return response.data;
      }
    } catch (error: any) {
      console.error('Failed to fetch tenant processes from API:', error);
    }
    
    // Always fall back to mock data for viewing
    await delay(600);
    return mockProcesses.filter(p => p.tenantId === tenantId);
  },

  // Fetch process runs for a specific process
  async fetchProcessRuns(processId: string): Promise<ProcessRun[]> {
    await delay(500);
    return mockProcessRuns[processId] || [];
  },

  // Fetch detailed information about a specific process run
  async fetchProcessRunDetail(runId: string): Promise<ProcessRunDetail> {
    await delay(400);
    
    // Find the run
    let foundRun: ProcessRun | undefined;
    let processId = '';
    
    for (const [pId, runs] of Object.entries(mockProcessRuns)) {
      foundRun = runs.find(run => run.id === runId);
      if (foundRun) {
        processId = pId;
        break;
      }
    }

    if (!foundRun) {
      throw new Error('Process run not found');
    }

    // Generate user trigger summaries
    const shuffledUsers = [...mockUsers].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffledUsers.slice(0, foundRun.usersInvolved);
    
    const userTriggerSummaries: UserTriggerSummary[] = selectedUsers.map(user => {
      const userTriggers = [...mockTriggers].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);
      const triggerHitCount = userTriggers.reduce((sum, trigger) => sum + trigger.hitCount, 0);
      
      return {
        user,
        triggerHitCount,
        triggers: userTriggers
      };
    });

    return {
      id: foundRun.id,
      processId: processId,
      runDate: foundRun.runDate,
      status: foundRun.status,
      duration: foundRun.duration,
      users: userTriggerSummaries,
      recordsProcessed: foundRun.recordsProcessed,
      totalTriggerHits: foundRun.totalTriggerHits,
      logs: [
        'Process started successfully',
        'Data validation completed',
        'AML screening initiated',
        `${foundRun.totalTriggerHits} triggers detected`,
        foundRun.status === 'success' ? 'Process completed successfully' : 'Process encountered errors',
      ],
    };
  },

  // Fetch trigger details with transactions
  async fetchTriggerDetail(triggerId: string, userId: string, sessionId: string): Promise<TriggerDetail> {
    await delay(600);
    
    const trigger = mockTriggers.find(t => t.id === triggerId);
    if (!trigger) {
      throw new Error('Trigger not found');
    }

    // Generate transactions for this trigger
    const triggerTransactions = [...mockTransactions].sort(() => 0.5 - Math.random()).slice(0, trigger.hitCount);

    return {
      id: trigger.id,
      name: trigger.name,
      type: trigger.type,
      severity: trigger.severity,
      description: trigger.description,
      ruleDefinition: `IF transaction.amount > 10000 AND transaction.type = 'CASH' THEN flag = TRUE`,
      transactions: triggerTransactions,
      createdAt: '2023-01-15',
      lastTriggered: '2024-01-15 14:30:00'
    };
  },

  // Fetch tenant by ID
  async fetchTenant(tenantId: string): Promise<Tenant | null> {
    await delay(300);
    return mockTenants.find(tenant => tenant.id === tenantId) || null;
  },

  // Fetch process by ID
  async fetchProcess(processId: string): Promise<Process | null> {
    await delay(300);
    return mockProcesses.find(process => process.id === processId) || null;
  },

  // Upload new process (requires authentication)
  async uploadProcess(formData: FormData): Promise<Process> {
    if (!isAuthenticated()) {
      throw new Error('Authentication required for uploading processes');
    }

    try {
      const response = await apiClient.post('http://localhost:8080/api/v1/ews/consents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Failed to upload process:', error);
      throw error;
    }
  },
};