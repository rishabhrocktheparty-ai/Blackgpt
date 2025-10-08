export type SignalStatus = 'Unverified' | 'HumanVerified' | 'Correlated';

export interface Signal {
  id: string;
  scriptName: string;
  dateFrom: string;
  dateTo: string;
  gistText: string;
  provenanceTags: string[];
  confidenceScore: number;
  status: SignalStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  audits?: Audit[];
  correlationJobs?: CorrelationJob[];
}

export interface Audit {
  id: string;
  signalId: string;
  actorId: string;
  action: string;
  notes: string | null;
  timestamp: string;
}

export interface CorrelationJob {
  jobId: string;
  signalId: string;
  startedAt: string;
  finishedAt: string | null;
  resultGist: string | null;
  correlationConfidence: number | null;
  sourcesQueried: string[];
}

export interface CorrelationSource {
  source: string;
  content: string;
  url: string;
  timestamp: string;
  relevance: number;
}
