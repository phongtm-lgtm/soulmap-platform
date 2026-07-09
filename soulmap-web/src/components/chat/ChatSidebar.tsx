import { useMemo } from 'react';
import { MessageCircle, Plus, Sprout } from 'lucide-react';
import type { ChatConversationSummary, ChatHistoryGroup } from '../../types/chat';
import { APP_ASSETS } from '../../assets';

const GROUP_LABELS: Record<ChatHistoryGroup, string> = {
  today: 'Hôm nay',
  yesterday: 'Hôm qua',
  previous: '7 ngày trước',
};

const GROUP_ORDER: ChatHistoryGroup[] = ['today', 'yesterday', 'previous'];

const MOCK_CONVERSATIONS: ChatConversationSummary[] = [
  { id: 'career', title: 'Định hướng sự nghiệp', preview: 'Mình cảm thấy chán công việc hiện tại...', group: 'today', time: '10:30' },
  { id: 'goals', title: 'Mục tiêu và kế hoạch', preview: 'Lập kế hoạch 90 ngày', group: 'today', time: '09:15' },
  { id: 'decode', title: 'Giải mã SoulMap', preview: 'Giải nghĩa các điểm mạnh', group: 'today', time: '08:45' },
  { id: 'love', title: 'Chuyện tình cảm', preview: 'Thấu hiểu kết nối hiện tại', group: 'yesterday', time: '20:30' },
  { id: 'strength', title: 'Phân tích điểm mạnh', preview: 'Tư duy chiến lược và đồng cảm', group: 'yesterday', time: '18:20' },
  { id: 'worry', title: 'Vượt qua lo âu', preview: 'Bài tập thở ngắn', group: 'yesterday', time: '16:10' },
  { id: 'habit', title: 'Thói quen mỗi ngày', preview: 'Xây dựng ritual buổi sáng', group: 'previous', time: '22:15' },
  { id: 'plan90', title: 'Lập kế hoạch 90 ngày', preview: 'Ưu tiên mục tiêu chính', group: 'previous', time: '19:50' },
  { id: 'selflove', title: 'Học cách yêu bản thân', preview: 'Viết nhật ký biết ơn', group: 'previous', time: '18:30' },
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
    <aside className="relative z-[2] hidden h-screen w-[304px] shrink-0 flex-col border-r border-[#E6DDCE] bg-[#F8F4EC]/92 pt-20 backdrop-blur-xl lg:flex">
      <div className="px-6 pt-7">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-3 rounded-full border-none bg-[#5C7C69] px-4 py-3.5 font-sans text-[0.9rem] font-bold text-white shadow-[0_14px_28px_-18px_rgba(92,124,105,0.8)] transition hover:-translate-y-0.5 hover:bg-[#526F5E] hover:shadow-[0_18px_32px_-18px_rgba(92,124,105,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C7C69]/25 active:translate-y-0"
        >
          <Plus className="h-5 w-5" />
          Cuộc trò chuyện mới
        </button>
      </div>

      <nav className="mt-7 flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        {groupedConversations.length === 0 && (
          <p className="px-3 py-6 text-center font-sans text-[0.8rem] text-[#9A9587]">
            Không tìm thấy cuộc trò chuyện nào.
          </p>
        )}

        {groupedConversations.map(({ group, items }) => (
          <div key={group} className="mb-6">
            <p className="px-3 pb-2 font-sans text-[0.82rem] font-semibold text-[#60635D]">
              {GROUP_LABELS[group]}
            </p>
            <div className="flex flex-col gap-1">
              {items.map((conversation) => {
                const isActive = conversation.id === activeConversationId || (!activeConversationId && conversation.id === 'career');
                const Icon = isActive ? Sprout : MessageCircle;
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24533E]/20 ${
                      isActive ? 'border-transparent bg-[#5C7C69] text-white shadow-[0_10px_22px_-18px_rgba(92,124,105,0.75)]' : 'border border-transparent bg-transparent text-[#2E5D46] hover:border-[#D9CFBE] hover:bg-[#F7F4EC]'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[#2E5D46]'}`} />
                    <span className={`min-w-0 flex-1 truncate font-sans text-[0.86rem] font-bold ${isActive ? 'text-white' : 'text-[#141A16]'}`}>
                      {conversation.title}
                    </span>
                    <span className={`font-sans text-[0.78rem] font-medium ${isActive ? 'text-white/85' : 'text-[#4F534F]'}`}>
                      {conversation.time}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative border-t border-[#E6DDCE] bg-[#FBF8F1]/78 px-5 py-5">
        <div className="flex w-full items-center gap-3 rounded-2xl border border-[#E4DAC9] bg-[#FFFDFB] px-3.5 py-3.5 text-left shadow-[0_14px_32px_-24px_rgba(33,77,59,0.48)]">
          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#F2E8D8] ring-1 ring-[#E8DFCF]">
            <img src={APP_ASSETS.linhNhiMascot} alt="Linh Nhi" className="h-11 w-11 rounded-full object-contain" draggable={false} />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[#FFFDFB] bg-[#0E7B55]" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 truncate font-sans text-[1rem] font-extrabold text-[#0F1512]">
              Linh Nhi
              <span className="rounded-full bg-[#D49A2E] px-2 py-0.5 text-[0.62rem] font-bold text-white shadow-[0_8px_14px_-10px_rgba(180,124,28,0.8)]">AI Mentor</span>
            </span>
            <span className="mt-1.5 flex items-center gap-1.5 font-sans text-[0.72rem] font-bold text-[#24533E]">
              <span className="h-2 w-2 rounded-full bg-[#0E7B55] shadow-[0_0_0_3px_rgba(14,123,85,0.12)]" />
              Online
            </span>
          </span>
        </div>
      </div>
    </aside>
  );
}
