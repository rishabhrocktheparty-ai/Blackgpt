import axios from 'axios';
import type { Signal, Audit } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  // Signal operations
  createSignal: (data: {
    scriptName: string;
    dateFrom: Date;
    dateTo: Date;
    gistText: string;
    provenanceTags: string[];
    createdBy: string;
  }) => apiClient.post<{ success: boolean; data: Signal }>('/signals/upload', data),

  getSignal: (id: string) => 
    apiClient.get<{ success: boolean; data: Signal }>(`/signals/${id}`),

  listSignals: (filters?: any) =>
    apiClient.get<{ success: boolean; data: Signal[]; pagination: any }>('/signals', { params: filters }),

  verifySignal: (id: string, data: {
    reviewerId: string;
    action: 'accept' | 'reject' | 'followup';
    notes?: string;
  }) => apiClient.post<{ success: boolean; data: Signal }>(`/signals/${id}/verify`, data),

  researchPublic: (id: string, initiatedBy: string) =>
    apiClient.post<{ success: boolean; data: any }>(`/signals/${id}/research-public`, { initiatedBy }),

  // Audit operations
  getAuditTrail: (signalId: string) =>
    apiClient.get<{ success: boolean; data: Audit[] }>(`/audit/${signalId}`)
};

export default api;
