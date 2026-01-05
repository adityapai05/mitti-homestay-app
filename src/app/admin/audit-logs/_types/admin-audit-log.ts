export type AdminAuditLog = {
  id: string;
  adminId: string;
  action: string;
  entity: string;
  entityId: string;
  meta?: unknown | null; 
  createdAt: string;
  admin: {
    id: string;
    name: string;
    email?: string | null;
  };
};