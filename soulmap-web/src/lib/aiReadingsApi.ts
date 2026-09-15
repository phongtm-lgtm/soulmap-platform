type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export class SoulMapApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'SoulMapApiError';
  }
}

export type { IdentityJourneyReading } from './identityJourneyPrompt';

export type AiReading = {
  id: number;
  userId?: string;
  type: 'CAREER_CHAPTER' | 'LOVE_READING' | string;
  chapterId?: string;
  chapterTitle?: string;
  content: string;
  talentIntro?: string;
  talents?: CareerTalent[];
  combinationInsight?: string;
  balanceRisks?: CareerCard[];
  deepReadingMarkdown?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CareerCard = {
  title: string;
  description?: string;
};

export type CareerTalent = {
  title: string;
  description: string;
  workExpression: string;
  developmentTip: string;
};

export type CareerReadingRequest = {
  mbtiType?: string;
  name: string;
  day: number;
  month: number;
  year: number;
  calendar: 'solar' | 'lunar';
  gender: 'male' | 'female';
  hour: number;
  min: number;
  timezone: number;
  viewYear: number;
};

export type TuViReadingRequest = Omit<CareerReadingRequest, 'mbtiType'>;
export type LoveReadingRequest = TuViReadingRequest;
export type IdentityJourneyRequest = TuViReadingRequest & {
  mbtiType?: string;
  goal?: string;
  currentConcern?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090/api/v1';
const AI_READING_TIMEOUT_MS = 300_000;

async function request<T>(path: string, init?: RequestInit & { timeoutMs?: number }): Promise<T> {
  const { timeoutMs, signal, ...requestInit } = init ?? {};
  const controller = new AbortController();
  const timeout = timeoutMs
    ? window.setTimeout(() => controller.abort(), timeoutMs)
    : undefined;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestInit,
    credentials: 'include',
    signal: signal ?? controller.signal,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...requestInit.headers,
    },
  }).finally(() => {
    if (timeout) window.clearTimeout(timeout);
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => null) as { detail?: string } | null;
    throw new SoulMapApiError(response.status, problem?.detail || `API request failed with status ${response.status}`);
  }

  const body = (await response.json()) as ApiResponse<T>;
  return body.data;
}

export type LaSoResponse = {
  gender?: string;
  cucFull?: string;
  amDuong?: string;
  viTriCungMenh?: string;
  viTriCungThan?: string;
  cungs?: Array<{ name?: string }>;
};

/** Create or load the user's Tử Vi chart from birth data (persisted on backend). */
export async function createLaSo(input: TuViReadingRequest): Promise<LaSoResponse> {
  return request<LaSoResponse>('/la-so', {
    method: 'POST',
    body: JSON.stringify(input),
    timeoutMs: AI_READING_TIMEOUT_MS,
  });
}

export async function generateCareerReading(input: CareerReadingRequest): Promise<AiReading> {
  return request<AiReading>('/ai/career/readings', {
    method: 'POST',
    body: JSON.stringify(input),
    timeoutMs: AI_READING_TIMEOUT_MS,
  });
}

export async function generateTuViReading(
  input: TuViReadingRequest,
  signal?: AbortSignal,
): Promise<AiReading> {
  return request<AiReading>('/ai/tuvi/readings', {
    method: 'POST',
    body: JSON.stringify(input),
    timeoutMs: AI_READING_TIMEOUT_MS,
    signal,
  });
}

export async function generateLoveReading(input: LoveReadingRequest): Promise<AiReading> {
  return request<AiReading>('/ai/love/readings', {
    method: 'POST',
    body: JSON.stringify(input),
    timeoutMs: AI_READING_TIMEOUT_MS,
  });
}

/**
 * The backend derives the chart from birth data and applies the identity
 * prompt contract before returning the structured journey reading.
 */
export async function generateIdentityJourneyReading(
  input: IdentityJourneyRequest,
): Promise<import('./identityJourneyPrompt').IdentityJourneyReading> {
  return request<import('./identityJourneyPrompt').IdentityJourneyReading>('/ai/identity/readings', {
    method: 'POST',
    body: JSON.stringify(input),
    timeoutMs: AI_READING_TIMEOUT_MS,
  });
}

export async function generateCareerTalentReading(input: CareerReadingRequest): Promise<AiReading> {
  return request<AiReading>('/ai/career/chapters/03/readings', {
    method: 'POST',
    body: JSON.stringify(input),
    timeoutMs: AI_READING_TIMEOUT_MS,
  });
}

export async function fetchAiReading(id: number): Promise<AiReading> {
  return request<AiReading>(`/ai/readings/${id}`);
}
