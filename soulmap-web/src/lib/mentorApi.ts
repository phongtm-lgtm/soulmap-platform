import type { ChatConversationSummary, ChatHistoryGroup, ChatMessage } from '../types/chat';

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export class MentorApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'MentorApiError';
  }
}

export type MentorMessageDto = {
  id: number;
  role: 'user' | 'assistant' | string;
  content: string;
  createdAt?: string;
};

export type MentorConversationSummaryDto = {
  id: number;
  title: string;
  activeJourney?: string | null;
  preview?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type MentorConversationDetailDto = MentorConversationSummaryDto & {
  messages: MentorMessageDto[];
};

export type MentorSendMessageDto = {
  userMessage: MentorMessageDto;
  assistantMessage: MentorMessageDto;
  conversation: MentorConversationSummaryDto;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8090/api/v1';
const MENTOR_TIMEOUT_MS = 300_000;

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
    const problem = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new MentorApiError(
      response.status,
      problem?.detail || `API request failed with status ${response.status}`,
    );
  }

  const body = (await response.json()) as ApiResponse<T>;
  return body.data;
}

export async function listMentorConversations(): Promise<MentorConversationSummaryDto[]> {
  return request<MentorConversationSummaryDto[]>('/ai/mentor/conversations');
}

export async function createMentorConversation(input?: {
  title?: string;
  activeJourney?: string;
}): Promise<MentorConversationDetailDto> {
  return request<MentorConversationDetailDto>('/ai/mentor/conversations', {
    method: 'POST',
    body: JSON.stringify(input ?? {}),
  });
}

export async function getMentorConversation(id: number): Promise<MentorConversationDetailDto> {
  return request<MentorConversationDetailDto>(`/ai/mentor/conversations/${id}`);
}

export async function sendMentorMessage(
  conversationId: number,
  content: string,
): Promise<MentorSendMessageDto> {
  return request<MentorSendMessageDto>(`/ai/mentor/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
    timeoutMs: MENTOR_TIMEOUT_MS,
  });
}

export function toChatMessages(messages: MentorMessageDto[]): ChatMessage[] {
  return messages
    .filter((message) => message.role === 'user' || message.role === 'assistant')
    .map((message) => ({
      sender: message.role as ChatMessage['sender'],
      text: message.content,
    }));
}

function startOfLocalDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function toConversationSummaries(
  conversations: MentorConversationSummaryDto[],
): ChatConversationSummary[] {
  const now = new Date();
  const todayStart = startOfLocalDay(now);
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
  const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000;

  return conversations.map((conversation) => {
    const updatedAt = conversation.updatedAt ? new Date(conversation.updatedAt) : now;
    const stamp = updatedAt.getTime();
    let group: ChatHistoryGroup = 'previous';
    if (stamp >= todayStart) group = 'today';
    else if (stamp >= yesterdayStart) group = 'yesterday';
    else if (stamp >= weekStart) group = 'previous';

    return {
      id: String(conversation.id),
      title: conversation.title,
      preview: conversation.preview || '',
      group,
      time: formatConversationTime(updatedAt, group),
    };
  });
}

function formatConversationTime(date: Date, group: ChatHistoryGroup): string {
  if (group === 'today' || group === 'yesterday') {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' });
}
