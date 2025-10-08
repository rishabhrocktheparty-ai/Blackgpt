/**
 * API Service
 * Handles all backend API calls
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface CreateSignalInput {
  scriptName: string;
  dateFrom: string;
  dateTo: string;
  gistText: string;
  provenanceTags: string[];
  sourceType: string;
  uploaderUserId: number;
  confidenceScore?: number;
}

export interface VerifySignalInput {
  reviewerId: number;
  action: 'accept' | 'reject' | 'followup';
  notes?: string;
}

/**
 * Create a new signal
 */
export const createSignal = async (input: CreateSignalInput) => {
  const response = await api.post('/signals/upload', input);
  return response.data.data;
};

/**
 * Get signal by ID
 */
export const getSignal = async (id: number) => {
  const response = await api.get(`/signals/${id}`);
  return response.data.data;
};

/**
 * List signals with filters
 */
export const listSignals = async (filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  minConfidence?: number;
  limit?: number;
  offset?: number;
}) => {
  const response = await api.get('/signals', { params: filters });
  return response.data;
};

/**
 * Verify a signal
 */
export const verifySignal = async (id: number, input: VerifySignalInput) => {
  const response = await api.post(`/signals/${id}/verify`, input);
  return response.data.data;
};

/**
 * Trigger public web research
 */
export const researchPublic = async (id: number, actorId: number) => {
  const response = await api.post(`/signals/${id}/research-public`, { actorId });
  return response.data.data;
};

/**
 * Get audit log for a signal
 */
export const getAuditLog = async (id: number) => {
  const response = await api.get(`/signals/${id}/audit`);
  return response.data.data;
};

export default api;
