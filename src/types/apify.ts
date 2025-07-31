export interface Actor {
  id: string;
  name: string;
  title: string;
  description?: string;
  username: string;
  createdAt: string;
  modifiedAt: string;
  stats: {
    totalRuns: number;
  };
}

export interface ActorSchema {
  title: string;
  type: string;
  schemaVersion: number;
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

export interface SchemaProperty {
  title: string;
  type: string;
  description?: string;
  default?: any;
  enum?: any[];
  items?: SchemaProperty;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
}

export interface ExecutionResult {
  id: string;
  status: string;
  startedAt: string;
  finishedAt?: string;
  stats: {
    inputBodyLen: number;
    restartCount: number;
    resurrectCount: number;
    memAvgBytes: number;
    memMaxBytes: number;
    memCurrentBytes: number;
    cpuAvgUsage: number;
    cpuMaxUsage: number;
    cpuCurrentUsage: number;
    netRxBytes: number;
    netTxBytes: number;
    durationMillis: number;
    runTimeSecs: number;
    metamorph: number;
    computeUnits: number;
  };
  output?: any;
  error?: string;
}

export interface ApifyApiResponse<T> {
  data: T;
  total?: number;
  offset?: number;
  limit?: number;
  count?: number;
}