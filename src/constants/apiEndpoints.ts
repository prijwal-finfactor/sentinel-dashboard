const SENTINEL_BASE_URL = "http://localhost:8080/";
const RULES_BASE_URL = "http://localhost:8081/";

export const SENTINEL_URLS = {
  LOGIN: `${SENTINEL_BASE_URL}api/v1/auth/login`,
  GET_ALL_TENANTS: `${SENTINEL_BASE_URL}api/v1/tenants`,
  GET_TENANT_PROCESSES: (tenantId: string) =>
    `${SENTINEL_BASE_URL}api/v1/tenants/${tenantId}/processes`,
};

export const RULES_URLS = {
  GET_ALL_RULES: `${RULES_BASE_URL}api/v1/rules`,
};
