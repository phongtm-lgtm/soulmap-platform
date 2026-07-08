import type { ChatConversationSummary } from '../types/chat';

/**
 * Mock sidebar conversation history for the AI Chat page (phase 1 — no backend yet).
 * Grouped by Today / Yesterday / Previous, newest first within each group.
 */
export const MOCK_CONVERSATIONS: ChatConversationSummary[] = [
  {
    id: 'career-orientation',
    title: 'Định hướng sự nghiệp',
    preview: 'Với năng lượng của một Người Bảo Hộ...',
    group: 'today',
    isLive: true,
  },
  {
    id: 'love-path',
    title: 'Đường tình duyên của tôi',
    preview: 'Trong tình duyên, bạn là người tìm kiếm...',
    group: 'yesterday',
    messages: [
      { sender: 'user', text: 'Đường tình duyên của tôi cần lưu ý gì?' },
      {
        sender: 'assistant',
        text: 'Trong tình duyên, bạn là người tìm kiếm sự kết nối "tâm giao" - sâu sắc, chân thành và thấu hiểu lẫn nhau ở cấp độ linh hồn. Hãy học cách bày tỏ mong muốn của mình rõ ràng hơn nhé! 🌟',
      },
    ],
  },
  {
    id: 'element-reading',
    title: 'Ngũ hành & lá số Tử Vi',
    preview: 'Bạn có lá số hộ mệnh được chiếu sáng...',
    group: 'yesterday',
    messages: [
      { sender: 'user', text: 'Lá số Tử Vi và bản mệnh ngũ hành của tôi mang năng lượng gì?' },
      {
        sender: 'assistant',
        text: 'Bạn có lá số hộ mệnh được chiếu sáng bởi những vì tinh tú mang năng lượng ổn định. Hệ Mộc thúc đẩy bạn luôn hướng thượng, thích che chở và lan tỏa giá trị tốt đẹp. 🎋',
      },
    ],
  },
  {
    id: 'daily-advice',
    title: 'Lời khuyên hôm nay',
    preview: 'Hãy tin vào trực giác của mình...',
    group: 'previous',
    messages: [
      { sender: 'user', text: 'Cho tôi một lời khuyên cho hôm nay.' },
      {
        sender: 'assistant',
        text: 'Hãy tin vào trực giác của mình. Đôi khi thế giới bên ngoài quá ồn ào khiến bạn nghi ngờ bản thân. Hãy dành ra 10 phút tĩnh lặng cuối ngày để kết nối lại với nội tâm nhé! 🧘‍♀️',
      },
    ],
  },
  {
    id: 'overthinking',
    title: 'Vượt qua overthinking',
    preview: 'Linh Nhi rất hiểu chia sẻ của bạn...',
    group: 'previous',
    messages: [
      { sender: 'user', text: 'Tôi hay suy nghĩ quá nhiều, phải làm sao?' },
      {
        sender: 'assistant',
        text: 'Linh Nhi rất hiểu chia sẻ của bạn. Hãy nhớ rằng hành trình khám phá bản thân là một chặng đường dài đầy thú vị, hãy bước từng bước nhẹ nhàng và tận hưởng hiện tại nhé. 🌸',
      },
    ],
  },
  {
    id: 'goal-setting',
    title: 'Đặt mục tiêu 3 tháng tới',
    preview: 'Hãy bắt đầu với 1-2 mục tiêu nhỏ...',
    group: 'previous',
    messages: [
      { sender: 'user', text: 'Giúp tôi đặt mục tiêu cho 3 tháng tới.' },
      {
        sender: 'assistant',
        text: 'Hãy bắt đầu với 1-2 mục tiêu nhỏ, cụ thể và có thể đo lường được. Điều này giúp bạn duy trì động lực mà không cảm thấy quá tải. Bạn muốn tập trung vào khía cạnh nào trước?',
      },
    ],
  },
];
