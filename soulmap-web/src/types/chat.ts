/** Types for the dedicated chat page (ChatGPT-style layout). */

export type ChatSender = 'user' | 'assistant';

export interface ChatMessage {
  sender: ChatSender;
  text: string;
}

export type ChatHistoryGroup = 'today' | 'yesterday' | 'previous';

/** A single row in the sidebar conversation history list. */
export interface ChatConversationSummary {
  id: string;
  title: string;
  preview: string;
  group: ChatHistoryGroup;
  time?: string;
}
