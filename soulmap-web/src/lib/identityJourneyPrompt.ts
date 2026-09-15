export type IdentityJourneyPromptInput = {
  name: string;
  age?: number;
  mbtiType?: string;
  goal?: string;
  currentConcern?: string;
  tuViChart: unknown;
  currentMajorCycle?: string;
};

export type IdentityJourneyChapter = {
  order: number;
  title: string;
  strength: {
    title: string;
    content: string;
  };
  watchOut: {
    title: string;
    content: string;
  };
};

export type IdentityJourneyReading = {
  id?: number;
  type?: string;
  journeyTitle: 'Tôi là ai';
  tagline: string;
  coreNarrative: string;
  chapters: IdentityJourneyChapter[];
  closing: string;
};

/**
 * Server-side prompt contract for the personalized identity journey.
 * Keep the chart as structured data so every chapter stays personalized.
 */
export function buildIdentityJourneyPrompt(input: IdentityJourneyPromptInput): string {
  return `Bạn là người luận giải Tử Vi theo hướng tự nhận thức cho SoulMap.

Nhiệm vụ: tạo hành trình “Tôi là ai” dành riêng cho ${input.name}, dựa chủ yếu trên lá số Tử Vi. MBTI chỉ dùng để đối chiếu hoặc diễn đạt dễ hiểu hơn, không được thay thế căn cứ từ lá số.

## Nguyên tắc bắt buộc

- Không dùng một bộ tiêu đề chapter chung cho mọi người. Tiêu đề phải được tạo từ cung, sao, tam phương tứ chính, tứ hóa và vận hiện tại nổi bật trong chính lá số này.
- Mỗi chapter bắt buộc có cả điểm đáng phát huy (strength) và mặt dễ mất cân bằng (watchOut).
- Không tâng bốc, không hù dọa, không phán định số mệnh và không dùng kết luận tuyệt đối.
- Với mặt cần lưu ý, dùng ngôn ngữ “có thể”, “dễ”, “khi thiếu cân bằng”, rồi nêu hướng điều chỉnh thực tế.
- Không liệt kê thuật ngữ Tử Vi dày đặc trong strength hoặc watchOut; hãy giải thích bằng ngôn ngữ đời thường.
- Không chẩn đoán sức khỏe. Nếu dùng cung Tật Ách, chỉ luận về áp lực, nhịp sống và nhu cầu hồi phục.
- Viết 8 đến 10 chapter, mỗi chapter là một insight khác nhau và tạo thành một mạch truyện.
- Ưu tiên: cung Mệnh, cung Thân, tam phương Mệnh - Quan Lộc - Tài Bạch - Thiên Di, Phúc Đức, bộ sao nổi bật, Tứ Hóa và đại vận hiện tại.

## Tiêu đề chapter

Tiêu đề phải cụ thể, nói trực tiếp với đúng người này. Ví dụ đạt yêu cầu: “Bạn không hợp sống trong một khuôn có sẵn”, “Bạn dễ mệt khi phải mạnh quá lâu”.
Không dùng các tên chung chung như “Chân dung cốt lõi”, “La bàn giá trị”, “Điểm mạnh của bạn”, “Vết thương bên trong”.

## Dữ liệu người dùng

- Tên: ${input.name}
- Tuổi: ${input.age ?? 'Chưa cung cấp'}
- MBTI: ${input.mbtiType ?? 'Chưa cung cấp'}
- Mục tiêu hiện tại: ${input.goal ?? 'Chưa cung cấp'}
- Điều đang băn khoăn: ${input.currentConcern ?? 'Chưa cung cấp'}
- Đại vận hiện tại: ${input.currentMajorCycle ?? 'Hãy suy ra từ dữ liệu lá số nếu có'}

## Dữ liệu lá số Tử Vi

${JSON.stringify(input.tuViChart)}

## Đầu ra

Chỉ trả về JSON hợp lệ, không markdown, đúng schema sau:
{
  "journeyTitle": "Tôi là ai",
  "tagline": "Một câu ngắn được viết riêng cho người này",
  "coreNarrative": "Tóm tắt 2-3 câu về trục phát triển nổi bật nhất.",
  "chapters": [
    {
      "order": 1,
      "title": "Tiêu đề cá nhân hóa",
      "strength": {
        "title": "Điểm đáng phát huy",
        "content": "Diễn giải đời thường, có ích và bám căn cứ lá số."
      },
      "watchOut": {
        "title": "Mặt cần giữ cân bằng",
        "content": "Diễn giải không phán xét, kèm hướng điều chỉnh thực tế."
      },
    }
  ],
  "closing": "Lời kết 80-120 từ, không định mệnh hóa."
}`;
}
