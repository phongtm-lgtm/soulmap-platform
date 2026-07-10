import { useMemo } from 'react';
import { BriefcaseBusiness, ChevronRight, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { APP_ASSETS } from '../../assets';
import type { ChatConversationSummary, ChatHistoryGroup } from '../../types/chat';

const GROUP_LABELS: Record<ChatHistoryGroup, string> = {
  today: 'Hôm nay',
  yesterday: 'Hôm qua',
  previous: '7 ngày trước',
};

const GROUP_ORDER: ChatHistoryGroup[] = ['today', 'yesterday', 'previous'];

const MOCK_CONVERSATIONS: ChatConversationSummary[] = [
  { id: 'career', title: 'Sự nghiệp của tôi', preview: 'Bạn: Điểm mạnh tiềm ẩn của mình là gì?', group: 'today', time: '10:45 AM' },
  { id: 'journey', title: 'Hành trình nghề nghiệp', preview: 'Bạn: Mình hợp môi trường nào?', group: 'today', time: '09:30 AM' },
  { id: 'plan3y', title: 'Kế hoạch 3 năm tới', preview: 'Bạn: Làm sao để đạt mục tiêu?', group: 'today', time: '08:15 AM' },
  { id: 'decision', title: 'Chuyển việc hay ở lại?', preview: 'Bạn: Nên cân nhắc những yếu tố nào?', group: 'yesterday', time: '09:20 PM' },
  { id: 'direction2024', title: 'Định hướng 2024', preview: 'Bạn: Công việc phù hợp với mình?', group: 'previous', time: 'Thứ 5' },
  { id: 'strength', title: 'Phân tích điểm mạnh', preview: 'Bạn: Mình cần cải thiện điều gì?', group: 'previous', time: 'Thứ 4' },
];

interface ChatSidebarProps {
  conversations: ChatConversationSummary[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  currentUser: { name: string; email: string } | null;
}

/** Left sidebar for the chat page: new chat, search, grouped history, profile. */
export default function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
}: ChatSidebarProps) {
  const groupedConversations = useMemo(() => {
    const filtered = conversations.length ? conversations : MOCK_CONVERSATIONS;

    return GROUP_ORDER.map((group) => ({
      group,
      items: filtered.filter((c) => c.group === group),
    })).filter((section) => section.items.length > 0);
  }, [conversations]);

  return (
    <aside className="relative z-[2] hidden h-full w-[300px] shrink-0 flex-col border-r border-[#E6DDCE] bg-[#FFFDF8]/94 backdrop-blur-xl lg:flex">
      <div className="space-y-4 px-5 pt-6">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-3 rounded-xl border-none bg-[#24533E] px-4 py-3.5 font-sans text-sm font-semibold text-white shadow-[0_14px_30px_-22px_rgba(36,83,62,0.75)] transition hover:bg-[#173124] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#173124]/25 active:translate-y-0"
        >
          <Plus className="h-5 w-5" />
          Bắt đầu trò chuyện mới
        </button>

        <label className="relative block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA098]" />
          <input
            type="search"
            placeholder="Tìm trong lịch sử trò chuyện..."
            className="w-full rounded-xl border border-[#EEE7DD] bg-white py-3 pl-10 pr-10 font-sans text-sm text-[#173124] shadow-sm outline-none placeholder:text-[#9AA098] focus:ring-1 focus:ring-[#B68A2F]"
          />
          <SlidersHorizontal className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA098]" />
        </label>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto px-5 pb-4 custom-scrollbar">
        {groupedConversations.length === 0 && (
          <p className="px-3 py-6 text-center font-sans text-[0.8rem] text-[#9A9587]">
            Không tìm thấy cuộc trò chuyện nào.
          </p>
        )}

        {groupedConversations.map(({ group, items }) => (
          <div key={group} className="mb-6">
            <p className="px-2 pb-3 font-sans text-sm font-bold text-[#22251F]">
              {GROUP_LABELS[group]}
            </p>
            <div className="flex flex-col gap-2">
              {items.map((conversation) => {
                const isActive = conversation.id === activeConversationId || (!activeConversationId && conversation.id === 'career');
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`group relative flex items-start gap-3 rounded-xl border px-3 py-3 text-left shadow-[0_10px_28px_-26px_rgba(23,49,36,0.65)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24533E]/20 ${
                      isActive ? 'border-[#9DB6A4] bg-[#EFF7EC] text-[#173124]' : 'border-[#F0E8DE] bg-white/72 text-[#424844] hover:border-[#D7CBBB] hover:bg-white'
                    }`}
                  >
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isActive ? 'bg-[#F4E6C9] text-[#7C5730]' : 'bg-transparent text-[#7C5730]'}`}>
                      <BriefcaseBusiness className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-sans text-sm font-semibold text-[#22251F]">
                        {conversation.title}
                      </span>
                      <span className="mt-1 block truncate font-sans text-[0.72rem] text-[#7B817B]">{conversation.preview}</span>
                    </span>
                    <span className="whitespace-nowrap font-sans text-[0.68rem] font-medium text-[#7B817B]">
                      {conversation.time}
                    </span>
                    {isActive && <span className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-[#2F8F5B]" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 pb-4">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl border border-[#E8D3B8] bg-[#FBF1E1]/78 px-4 py-3 font-sans text-sm font-semibold text-[#22251F] transition hover:bg-[#FFF8EC]"
        >
          <span className="flex items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4 text-[#7C5730]" />
            Xem toàn bộ lịch sử chat
          </span>
          <ChevronRight className="h-4 w-4 text-[#7C5730]" />
        </button>
      </div>

      <div className="px-5 pb-5">
        <div className="relative overflow-hidden rounded-2xl border border-[#F0E7DB] bg-[#F8F1E8] px-4 py-5 shadow-[0_18px_36px_-32px_rgba(23,49,36,0.5)]">
          <div className="flex items-center gap-3">
            <span className="h-16 w-16 shrink-0 overflow-visible">
              <img src={APP_ASSETS.linhNhiMascot} alt="Linh Nhi" className="h-full w-full scale-[1.9] object-contain" draggable={false} />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 font-sans text-sm font-bold text-[#173124]">
                Linh Nhi
                <span className="h-2 w-2 rounded-full bg-[#2F8F5B]" aria-label="Đang hoạt động" />
              </span>
              <span className="mt-1 block font-sans text-xs text-[#7B817B]">AI Mentor của bạn</span>
            </span>
          </div>
          <p className="mt-4 text-center font-sans text-xs text-[#7B817B]">Luôn đồng hành cùng bạn</p>
          <img src={APP_ASSETS.pillars.decorLeaf} alt="" className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 opacity-35" draggable={false} />
        </div>
      </div>

    </aside>
  );
}
