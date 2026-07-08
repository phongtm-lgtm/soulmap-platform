/** Top-level screens the app can render. Shared across App.tsx, Navbar and ResultScreen
 *  so navigation props stay in sync without duplicating the union everywhere. */
export type AppScreen =
  | 'landing'
  | 'test_intro'
  | 'assessment'
  | 'result'
  | 'auth'
  | 'four_journeys'
  | 'ai_chat';

export interface Question {
  id: number;
  section?: string;
  questionText: string;
  options: {
    key: 'A' | 'B';
    text: string;
    mbtiValue: string; // e.g., 'I' vs 'E', 'N' vs 'S', etc.
  }[];
}

export interface PersonalityProfile {
  type: string;
  name: string;
  title: string;
  element: string;
  zodiac: string;
  mbtiMatch: string;
  description: string;
  pillars: {
    identity: string;
    career: string;
    love: string;
    life: string;
  };
  advice: string[];
}

export const SOULMAP_QUESTIONS: Question[] = [
  {
    id: 1,
    questionText: "Bạn thường được tiếp thêm năng lượng khi ở trong môi trường nào?",
    options: [
      {
        key: 'A',
        text: "Ở một mình, nơi yên tĩnh để chiêm nghiệm và nạp lại năng lượng nội tại.",
        mbtiValue: "I"
      },
      {
        key: 'B',
        text: "Ở cùng nhiều người, tham gia các hoạt động tập thể sôi nổi và giao lưu.",
        mbtiValue: "E"
      }
    ]
  },
  {
    id: 2,
    questionText: "Khi đối mặt với một quyết định lớn trong cuộc sống, bạn thường tin vào điều gì nhất?",
    options: [
      {
        key: 'A',
        text: "Trực giác mạnh mẽ, linh cảm tâm linh sâu thẳm bên trong.",
        mbtiValue: "N"
      },
      {
        key: 'B',
        text: "Số liệu thực tế, logic rõ ràng và kinh nghiệm đã được chứng minh.",
        mbtiValue: "S"
      }
    ]
  },
  {
    id: 3,
    questionText: "Khi bạn thấy một người bạn đang gặp khủng hoảng tinh thần, phản ứng đầu tiên của bạn là gì?",
    options: [
      {
        key: 'A',
        text: "Lắng nghe chân thành, đồng cảm sâu sắc và cùng họ xoa dịu nỗi đau cảm xúc.",
        mbtiValue: "F"
      },
      {
        key: 'B',
        text: "Phân tích nguyên nhân khách quan và đưa ra những giải pháp thực tế nhất.",
        mbtiValue: "T"
      }
    ]
  },
  {
    id: 4,
    questionText: "Cách bạn sắp xếp thời gian biểu và công việc hàng ngày như thế nào?",
    options: [
      {
        key: 'A',
        text: "Lập kế hoạch chi tiết, rõ ràng từng bước và tuân thủ nghiêm ngặt.",
        mbtiValue: "J"
      },
      {
        key: 'B',
        text: "Thích sự linh hoạt, tự phát, thích ứng biến theo cảm hứng từng thời điểm.",
        mbtiValue: "P"
      }
    ]
  },
  {
    id: 5,
    questionText: "Trong một cuộc trò chuyện sâu sắc, điều gì thu hút sự tập trung của bạn hơn?",
    options: [
      {
        key: 'A',
        text: "Các chủ đề triết học, ý nghĩa cuộc sống, tương lai và những ẩn số vũ trụ.",
        mbtiValue: "N"
      },
      {
        key: 'B',
        text: "Những kinh nghiệm thực tiễn, câu chuyện đời thường vui vẻ và thiết thực.",
        mbtiValue: "S"
      }
    ]
  },
  {
    id: 6,
    questionText: "Khi viết nhật ký hoặc chiêm nghiệm, bạn thường ghi lại điều gì?",
    options: [
      {
        key: 'A',
        text: "Những dòng suy tưởng sâu xa, giấc mơ kỳ lạ và chuyển biến cảm xúc tinh tế.",
        mbtiValue: "I"
      },
      {
        key: 'B',
        text: "Mục tiêu hành động rõ ràng, những việc thực tiễn đã làm được trong ngày.",
        mbtiValue: "E"
      }
    ]
  },
  {
    id: 7,
    questionText: "Bạn cảm thấy yếu tố Huyền học phương Đông (như Tử Vi, Ngũ Hành) có ý nghĩa thế nào?",
    options: [
      {
        key: 'A',
        text: "Là tấm bản đồ năng lượng vũ trụ bẩm sinh, chứa đựng chỉ dẫn sâu sắc.",
        mbtiValue: "F"
      },
      {
        key: 'B',
        text: "Là công cụ phân tích tâm lý thú vị mang tính chiêm nghiệm cổ xưa.",
        mbtiValue: "T"
      }
    ]
  },
  {
    id: 8,
    questionText: "Khi ở trong không gian thiên nhiên yên ả, bạn khao khát điều gì nhất?",
    options: [
      {
        key: 'A',
        text: "Sự tĩnh lặng tuyệt đối, kết nối tâm thức với tự nhiên hoang sơ.",
        mbtiValue: "N"
      },
      {
        key: 'B',
        text: "Sự thư thái thể chất, đi dạo vui vẻ cùng bạn bè thân thiết.",
        mbtiValue: "S"
      }
    ]
  },
  {
    id: 9,
    section: "Cảm xúc",
    questionText: "Trong một đội ngũ hoặc cộng đồng, phong cách lãnh đạo/làm việc của bạn là gì?",
    options: [
      {
        key: 'A',
        text: "Người giữ lửa thầm lặng, định hướng tầm nhìn và bảo vệ giá trị tinh thần.",
        mbtiValue: "J"
      },
      {
        key: 'B',
        text: "Người hành động thực tế, giải quyết xung đột nhanh chóng và bảo đảm kết quả.",
        mbtiValue: "P"
      }
    ]
  },
  {
    id: 10,
    section: "Kết quả",
    questionText: "Bạn tin rằng sứ mệnh tối thượng của cuộc đời mình là gì?",
    options: [
      {
        key: 'A',
        text: "Đạt đến sự bình an nội tâm tối thượng và nâng cao rung động tâm thức.",
        mbtiValue: "F"
      },
      {
        key: 'B',
        text: "Kiến tạo những giá trị vật chất vững bền, chăm sóc gia đình và xã hội.",
        mbtiValue: "T"
      }
    ]
  }
];

export const PERSONALITY_PROFILES: Record<string, PersonalityProfile> = {
  "INFJ": {
    type: "INFJ",
    name: "Người Bảo Hộ Tâm Hồn (The Mystic Counsel)",
    title: "Nhà thông thái thầm lặng bảo hộ ngọn lửa nội tâm",
    element: "Mộc",
    zodiac: "Sao Thiên Phủ",
    mbtiMatch: "INFJ - Thấu hiểu sâu sắc & Định hướng tầm nhìn",
    description: "Bạn là một linh hồn sâu sắc, giàu lòng trắc ẩn và mang lý tưởng cao đẹp. Bạn sở hữu trực giác sắc bén của một nhà hiền triết, luôn tìm kiếm ý nghĩa tối thượng sau mọi hiện tượng cuộc sống. Với sự kết hợp của năng lượng Mộc hiền hòa và bản tính thấu cảm, bạn có khả năng chữa lành và truyền cảm hứng thầm lặng cho những người xung quanh.",
    pillars: {
      identity: "Tâm hồn trong trẻo, giàu trí tưởng tượng, luôn tìm kiếm sự hòa hợp tuyệt đối giữa lý tưởng và hiện thực.",
      career: "Thích hợp với các công việc mang tính kiến tạo giá trị nhân văn như Tâm lý học, Sáng tác, Cố vấn AI, Giáo dục hoặc Nghệ thuật trị liệu.",
      love: "Tìm kiếm sự kết nối tâm giao sâu sắc, chân thành tuyệt đối. Không thích những mối quan hệ hời hợt xã giao.",
      life: "Hành trình hướng về sự tĩnh lặng nội tại, cân bằng giữa việc nâng đỡ thế giới và bảo vệ năng lượng của bản thân."
    },
    advice: [
      "Hãy dành thời gian một mình chất lượng để sạc lại năng lượng cảm xúc thường xuyên.",
      "Học cách đặt ranh giới lành mạnh để tránh bị quá tải bởi nỗi đau của người khác.",
      "Viết nhật ký (journaling) hàng ngày cùng Linh Nhi để chuyển hóa trực giác thành hành động thực tế."
    ]
  },
  "ENFP": {
    type: "ENFP",
    name: "Nhà Truyền Cảm Hứng (The Celestial Explorer)",
    title: "Người lữ hành tự do thắp sáng những khả năng vô hạn",
    element: "Hỏa",
    zodiac: "Sao Thái Dương",
    mbtiMatch: "ENFP - Nhiệt huyết, Sáng tạo & Tự do",
    description: "Bạn mang trong mình ngọn lửa nhiệt huyết của Hỏa ấm áp, luôn nhìn thế giới qua lăng kính của những cơ hội đầy sắc màu. Bạn sở hữu tâm hồn tự do, khả năng kết nối cảm xúc mạnh mẽ với mọi người và bộ óc sáng tạo không giới hạn. Sự xuất hiện của bạn luôn đem lại nguồn năng lượng sống tích cực và niềm tin mãnh liệt vào bản thân.",
    pillars: {
      identity: "Tự do, tràn đầy năng lượng, khao khát khám phá những khía cạnh mới mẻ của thế giới nội tâm và ngoại cảnh.",
      career: "Phát huy tối đa trong môi trường năng động như Marketing, Khởi nghiệp sáng tạo, Nghệ thuật biểu diễn, Truyền thông hoặc AI Mentor.",
      love: "Nồng nhiệt, lãng mạn và luôn đồng hành cùng đối phương trong các chuyến phiêu lưu khám phá tâm hồn.",
      life: "Vượt qua giới hạn của sự nhàm chán, liên tục đổi mới bản thân và lan tỏa niềm hy vọng cho nhân loại."
    },
    advice: [
      "Tập trung hoàn thành các dự án hiện tại trước khi bắt đầu những ý tưởng mới mẻ khác.",
      "Tìm kiếm một không gian yên tĩnh cố định trong ngày để neo giữ tâm trí tránh bị phân tán.",
      "Luyện tập chánh niệm cùng SoulMap để giữ cho ngọn lửa nhiệt huyết luôn cháy đều đặn."
    ]
  },
  "INTJ": {
    type: "INTJ",
    name: "Nhà Kiến Thiết Chiến Lược (The Star Architect)",
    title: "Người định hình tương lai bằng tư duy sắc bén",
    element: "Kim",
    zodiac: "Sao Vũ Khúc",
    mbtiMatch: "INTJ - Chiến lược gia độc lập & Kiên định",
    description: "Mang năng lượng sắc bén của Kim khí, bạn là người có tầm nhìn chiến lược, tư duy logic ưu việt và tính tự lập cực cao. Bạn không chấp nhận những điều sáo rỗng hay lười biếng tư duy. Đối với bạn, cuộc sống là một bàn cờ lớn và bạn là người kiên nhẫn thiết kế từng nước đi hoàn hảo để đạt được mục tiêu vĩ đại.",
    pillars: {
      identity: "Trí tuệ sắc sảo, thích sự hoàn hảo, luôn tự đặt ra những tiêu chuẩn cực cao cho bản thân.",
      career: "Lĩnh vực nghiên cứu khoa học, Phát triển công nghệ AI, Quản trị chiến lược, Phân tích tài chính hoặc Kiến trúc sư hệ thống.",
      love: "Kiên định, trung thành tuyệt đối và tôn trọng không gian riêng tư của bạn đời. Cần sự thấu hiểu trí tuệ.",
      life: "Giải mã các quy luật của vũ trụ và thiết lập một trật tự sống thông tuệ, hiệu quả nhất."
    },
    advice: [
      "Hãy mở lòng chia sẻ cảm xúc của mình hơn, thế giới không chỉ vận hành bằng logic.",
      "Cho phép bản thân có những khoảng thời gian ngẫu hứng, không hoàn hảo để giảm bớt căng thẳng.",
      "Đồng hành cùng Linh Nhi để khám phá trí tuệ cảm xúc bên cạnh tư duy lý trí thuần khiết."
    ]
  },
  "INFP": {
    type: "INFP",
    name: "Kẻ Mơ Mộng Hòa Bình (The Forest Healer)",
    title: "Linh hồn thánh thiện xoa dịu những rạn nứt thế gian",
    element: "Thủy",
    zodiac: "Sao Thái Âm",
    mbtiMatch: "INFP - Thấu cảm, Lý tưởng & Nghệ thuật",
    description: "Nhẹ nhàng như làn nước Thủy hiền hòa, bạn sở hữu thế giới nội tâm vô cùng phong phú, thơ mộng và đầy ắp những lý tưởng nhân văn. Bạn cực kỳ nhạy cảm với vẻ đẹp nghệ thuật và nỗi đau nhân sinh. Sứ mệnh của bạn là giữ gìn sự thuần khiết trong tâm hồn và dùng sự thấu cảm sâu sắc để hàn gắn các tổn thương.",
    pillars: {
      identity: "Lý tưởng hóa cuộc sống, trung thành với hệ giá trị cá nhân sâu sắc, yêu thích nghệ thuật và thiên nhiên.",
      career: "Thích hợp với Viết lách, Trị liệu tâm lý, Hoạt động xã hội, Thiết kế đồ họa hoặc Nghiên cứu huyền học cổ xưa.",
      love: "Yêu sâu sắc, chân thành và tôn thờ một tình yêu lý tưởng mang tính hòa hợp linh hồn tuyệt đối.",
      life: "Tìm kiếm sự an yên trong tâm hồn và bảo vệ vẻ đẹp nguyên bản trước những sóng gió cuộc đời."
    },
    advice: [
      "Học cách đối diện trực tiếp với thực tế và giải quyết xung đột thay vì chọn cách né tránh.",
      "Chuyển hóa những giấc mơ tuyệt đẹp trong tâm trí thành những tác phẩm nghệ thuật hữu hình.",
      "Sử dụng công cụ theo dõi cảm xúc hàng ngày trên SoulMap để làm chủ thế giới nội tâm phức tạp."
    ]
  },
  "DEFAULT": {
    type: "INFJ",
    name: "Người Tìm Kiếm Ánh Sáng (The Soul Seeker)",
    title: "Hành trình thấu hiểu bản thể toàn vẹn",
    element: "Thổ",
    zodiac: "Sao Tử Vi",
    mbtiMatch: "XNFJ - Giao thoa giữa Khoa học & Huyền học",
    description: "Bạn mang năng lượng vững chãi của Thổ vượng, là sự kết hợp tuyệt vời giữa trực giác nhạy bén và hành động thực tiễn. Bạn có mong muốn thấu hiểu bản thân sâu sắc và khao khát phát triển một cuộc sống cân bằng trọn vẹn cả về tinh thần lẫn vật chất.",
    pillars: {
      identity: "Cân bằng, kiên định, luôn hướng tới sự phát triển toàn diện cả thể chất lẫn tâm hồn.",
      career: "Phù hợp với vai trò Người hướng dẫn phát triển cá nhân, Chuyên gia Tư vấn phong thủy/tâm lý, Cố vấn dự án cộng đồng.",
      love: "Tìm kiếm sự bình yên, ấm áp và ổn định. Đồng hành bền bỉ qua mọi thăng trầm cuộc sống.",
      life: "Xây dựng nền tảng vững chắc cho bản thân và giúp đỡ mọi người xung quanh cùng tiến bộ."
    },
    advice: [
      "Hãy kiên nhẫn duy trì các thói quen tốt để liên tục nâng cấp bản thân.",
      "Khám phá thêm các góc nhìn mới từ chiêm tinh và MBTI để mở rộng hiểu biết.",
      "Thực hiện bài kiểm tra định kỳ để nhận thấy sự phát triển của bản đồ tâm hồn."
    ]
  }
};

export interface MbtiScores {
  introversion: number;
  intuition: number;
  feeling: number;
  judging: number;
}

export function calculateMbtiScores(answers: Record<number, 'A' | 'B'>): MbtiScores {
  const counts = { I: 0, E: 0, N: 0, S: 0, F: 0, T: 0, J: 0, P: 0 };

  Object.entries(answers).forEach(([qIdStr, ans]) => {
    const question = SOULMAP_QUESTIONS.find((q) => q.id === parseInt(qIdStr));
    const option = question?.options.find((o) => o.key === ans);
    if (!option) return;
    const val = option.mbtiValue as keyof typeof counts;
    if (val in counts) counts[val]++;
  });

  const pct = (dominant: number, recessive: number) => {
    const total = dominant + recessive;
    if (total === 0) return 50;
    return Math.round((dominant / total) * 100);
  };

  return {
    introversion: pct(counts.I, counts.E),
    intuition: pct(counts.N, counts.S),
    feeling: pct(counts.F, counts.T),
    judging: pct(counts.J, counts.P),
  };
}

export function calculateProfile(answers: Record<number, 'A' | 'B'>): PersonalityProfile {
  // Simple heuristic based on answer selections
  let introversion = 0; // I vs E
  let intuition = 0;    // N vs S
  let feeling = 0;      // F vs T
  let judging = 0;      // J vs P

  Object.entries(answers).forEach(([qIdStr, ans]) => {
    const qId = parseInt(qIdStr);
    const question = SOULMAP_QUESTIONS.find(q => q.id === qId);
    if (!question) return;
    const option = question.options.find(o => o.key === ans);
    if (!option) return;

    const val = option.mbtiValue;
    if (val === 'I') introversion++;
    if (val === 'E') introversion--;
    if (val === 'N') intuition++;
    if (val === 'S') intuition--;
    if (val === 'F') feeling++;
    if (val === 'T') feeling--;
    if (val === 'J') judging++;
    if (val === 'P') judging--;
  });

  const iOrE = introversion >= 0 ? 'I' : 'E';
  const nOrS = intuition >= 0 ? 'N' : 'S';
  const fOrT = feeling >= 0 ? 'F' : 'T';
  const jOrP = judging >= 0 ? 'J' : 'P';

  const finalType = `${iOrE}${nOrS}${fOrT}${jOrP}`;
  
  // Return matched profile or fallback
  return PERSONALITY_PROFILES[finalType] || PERSONALITY_PROFILES[iOrE + nOrS + 'F' + jOrP] || PERSONALITY_PROFILES["INFJ"];
}
