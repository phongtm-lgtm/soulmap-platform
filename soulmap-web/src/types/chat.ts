/** Types for the dedicated SoulMap AI Chat page (ChatGPT-style layout). */

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
  /** Static mock transcript for past conversations (phase 1 — no backend yet).
   *  The live/active session (`isLive: true`) instead reads from App.tsx state. */
  messages?: ChatMessage[];
  isLive?: boolean;
}
