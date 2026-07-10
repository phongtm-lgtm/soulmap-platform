type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type AiReading = {
  id: number;
  userId?: string;
  type: 'CAREER_CHAPTER' | 'LOVE_READING' | string;
  chapterId?: string;
  chapterTitle?: string;
  content: string;
  careerPath?: CareerPath;
  growthDrivers?: GrowthDrivers;
  deepReadingMarkdown?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CareerCard = {
  title: string;
  description?: string;
};

export type CareerPath = {
  intro: string;
  cards: CareerCard[];
  quote: string;
};

export type GrowthDrivers = {
  strongWhen: CareerCard[];
  notFitWith: CareerCard[];
};

export type CareerReadingRequest = {
  userId?: string;
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
    throw new Error(`API request failed with status ${response.status}`);
  }

  const body = (await response.json()) as ApiResponse<T>;
  return body.data;
}

export async function generateCareerReading(input: CareerReadingRequest): Promise<AiReading> {
  return request<AiReading>('/ai/career/readings', {
    method: 'POST',
    body: JSON.stringify(input),
    timeoutMs: AI_READING_TIMEOUT_MS,
  });
}

export async function fetchAiReading(id: number): Promise<AiReading> {
  return request<AiReading>(`/ai/readings/${id}`);
}
