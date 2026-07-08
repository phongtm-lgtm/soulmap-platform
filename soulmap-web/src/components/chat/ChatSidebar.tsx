import { useMemo, useState } from 'react';
import { Leaf, Plus, Search, Settings, LogOut, ChevronUp } from 'lucide-react';
import type { ChatConversationSummary, ChatHistoryGroup } from '../../types/chat';

const GROUP_LABELS: Record<ChatHistoryGroup, string> = {
  today: 'Hôm nay',
  yesterday: 'Hôm qua',
  previous: 'Trước đó',
};

const GROUP_ORDER: ChatHistoryGroup[] = ['today', 'yesterday', 'previous'];

interface ChatSidebarProps {
  conversations: ChatConversationSummary[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onExit: () => void;
  currentUser: { name: string; email: string } | null;
  onOpenSettings?: () => void;
}

/** Left sidebar for the SoulMap AI Chat page — logo, new chat, search, grouped history, profile. */
export default function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onExit,
  currentUser,
  onOpenSettings,
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const groupedConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = term
      ? conversations.filter(
          (c) => c.title.toLowerCase().includes(term) || c.preview.toLowerCase().includes(term),
        )
      : conversations;

    return GROUP_ORDER.map((group) => ({
      group,
      items: filtered.filter((c) => c.group === group),
    })).filter((section) => section.items.length > 0);
  }, [conversations, searchTerm]);

  const displayName = currentUser?.name || 'Người lữ hành';
  const initials = displayName.slice(0, 1).toUpperCase();

  return (
    <aside className="hidden h-screen w-[320px] shrink-0 flex-col border-r border-[#E8DFCF] bg-[#F8F6F1] lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pb-5 pt-6">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-3 rounded-xl transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#24533E]/8 text-[#35684D]">
            <Leaf className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <span className="font-display text-[1.15rem] font-bold tracking-[-0.02em] text-[#24533E]">
            SoulMap AI
          </span>
        </button>
      </div>

      {/* New Chat */}
      <div className="px-4">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#24533E] px-4 py-3 font-sans text-[0.88rem] font-bold text-white shadow-[0_10px_22px_-12px_rgba(33,77,59,0.55)] transition hover:-translate-y-0.5 hover:bg-[#1D4433] active:translate-y-0"
        >
          <Plus className="h-4 w-4" />
          Trò chuyện mới
        </button>
      </div>

      {/* Search */}
      <div className="mt-4 px-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A9587]" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm cuộc trò chuyện"
            className="w-full rounded-xl border border-[#E8DFCF] bg-[#FFFDF8] py-2.5 pl-10 pr-3 font-sans text-[0.82rem] text-[#24533E] outline-none transition placeholder:text-[#A59C8C] focus:border-[#C8A15A]"
          />
        </div>
      </div>

      {/* History */}
      <nav className="mt-5 flex-1 overflow-y-auto px-3 pb-3 custom-scrollbar">
        {groupedConversations.length === 0 && (
          <p className="px-3 py-6 text-center font-sans text-[0.8rem] text-[#9A9587]">
            Không tìm thấy cuộc trò chuyện nào.
          </p>
        )}

        {groupedConversations.map(({ group, items }) => (
          <div key={group} className="mb-4">
            <p className="px-3 pb-1.5 font-sans text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[#9A9587]">
              {GROUP_LABELS[group]}
            </p>
            <div className="flex flex-col gap-0.5">
              {items.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`group flex flex-col rounded-lg px-3 py-2.5 text-left transition-colors ${
                      isActive ? 'bg-[#24533E]/8' : 'hover:bg-[#24533E]/5'
                    }`}
                  >
                    <span
                      className={`truncate font-sans text-[0.85rem] font-semibold ${
                        isActive ? 'text-[#24533E]' : 'text-[#3F4440]'
                      }`}
                    >
                      {conversation.title}
                    </span>
                    <span className="mt-0.5 truncate font-sans text-[0.74rem] text-[#8B9088]">
                      {conversation.preview}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: profile + settings */}
      <div className="relative border-t border-[#E8DFCF] p-3">
        <button
          type="button"
          onClick={() => setIsProfileMenuOpen((open) => !open)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#24533E]/5"
          aria-haspopup="menu"
          aria-expanded={isProfileMenuOpen}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C8A15A]/35 bg-[#C8A15A]/12 font-sans text-[0.82rem] font-bold text-[#B17922]">
            {initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-sans text-[0.85rem] font-bold text-[#24533E]">
              {displayName}
            </span>
            <span className="block truncate font-sans text-[0.72rem] text-[#8B9088]">
              {currentUser?.email || 'Chưa đăng nhập'}
            </span>
          </span>
          <ChevronUp
            className={`h-3.5 w-3.5 shrink-0 text-[#9A9587] transition-transform ${
              isProfileMenuOpen ? '' : 'rotate-180'
            }`}
          />
        </button>

        {isProfileMenuOpen && (
          <div className="absolute inset-x-3 bottom-[calc(100%-4px)] z-10 overflow-hidden rounded-xl border border-[#E8DFCF] bg-[#FFFDF8] py-1.5 shadow-[0_18px_40px_-20px_rgba(33,77,59,0.4)]">
            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen(false);
                onOpenSettings?.();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 font-sans text-[0.82rem] font-semibold text-[#24533E] transition hover:bg-[#24533E]/5"
            >
              <Settings className="h-4 w-4 text-[#B68A2F]" />
              Cài đặt
            </button>
            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen(false);
                onExit();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 font-sans text-[0.82rem] font-semibold text-[#24533E] transition hover:bg-[#24533E]/5"
            >
              <LogOut className="h-4 w-4 text-[#B68A2F]" />
              Thoát trò chuyện
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
