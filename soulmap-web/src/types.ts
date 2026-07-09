/** Top-level screens the app can render. Shared across App.tsx, Navbar and ResultScreen
 *  so navigation props stay in sync without duplicating the union everywhere. */
export type AppScreen =
  | 'landing'
  | 'test_intro'
  | 'assessment'
  | 'result'
  | 'auth'
  | 'four_journeys'
  | 'ai_chat'
  | 'journal'
  | 'academy';

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
  "ISTJ": {
    type: "ISTJ",
    name: "Người Giữ Gìn Trật Tự (The Steady Guardian)",
    title: "Người xây nền vững chắc bằng kỷ luật và trách nhiệm",
    element: "Thổ",
    zodiac: "Sao Thiên Tướng",
    mbtiMatch: "ISTJ - Kỷ luật, Thực tế & Đáng tin cậy",
    description: "Bạn là người sống có nguyên tắc, đáng tin và luôn coi trọng trách nhiệm. Năng lượng Thổ giúp bạn bền bỉ, thực tế và kiên định với những gì đã cam kết. Bạn không dễ bị cuốn theo cảm xúc nhất thời mà thường chọn hành động dựa trên dữ kiện, kinh nghiệm và sự chuẩn bị chắc chắn.",
    pillars: {
      identity: "Bản sắc ổn định, tôn trọng quy chuẩn, luôn muốn làm đúng và làm đến nơi đến chốn.",
      career: "Phù hợp với quản trị vận hành, tài chính, kiểm toán, pháp lý, kỹ thuật, quản lý dữ liệu hoặc các vai trò cần độ chính xác cao.",
      love: "Yêu bằng sự bền bỉ, trách nhiệm và chăm sóc thực tế. Không phô trương nhưng rất đáng tin.",
      life: "Xây dựng cuộc sống có nền tảng, tích lũy từng bước và bảo vệ những giá trị lâu dài."
    },
    advice: [
      "Cho phép bản thân linh hoạt hơn khi kế hoạch thay đổi ngoài dự tính.",
      "Đừng ôm quá nhiều trách nhiệm một mình, hãy học cách chia sẻ gánh nặng.",
      "Thỉnh thoảng thử một trải nghiệm mới để làm mềm các khuôn mẫu quen thuộc."
    ]
  },
  "ISFJ": {
    type: "ISFJ",
    name: "Người Chăm Sóc Dịu Dàng (The Devoted Nurturer)",
    title: "Người gìn giữ bình yên bằng sự tận tâm âm thầm",
    element: "Thổ",
    zodiac: "Sao Thiên Đồng",
    mbtiMatch: "ISFJ - Tận tụy, Ấm áp & Chu đáo",
    description: "Bạn mang nguồn năng lượng nuôi dưỡng, kiên nhẫn và rất nhạy với nhu cầu của người khác. Bạn thường tạo cảm giác an toàn cho những người xung quanh bằng sự quan tâm tinh tế và hành động thực tế. Nội tâm của bạn sâu sắc hơn vẻ ngoài điềm tĩnh rất nhiều.",
    pillars: {
      identity: "Tận tâm, khiêm nhường, ghi nhớ chi tiết và luôn muốn bảo vệ những điều thân thương.",
      career: "Phù hợp với giáo dục, chăm sóc khách hàng, y tế, nhân sự, vận hành cộng đồng hoặc các công việc hỗ trợ con người.",
      love: "Yêu bằng sự chăm sóc đều đặn, nhớ những điều nhỏ nhặt và đặt sự ổn định lên hàng đầu.",
      life: "Tạo dựng mái ấm tinh thần, nuôi dưỡng các kết nối bền vững và sống tử tế mỗi ngày."
    },
    advice: [
      "Đừng quên nhu cầu của mình trong lúc chăm sóc người khác.",
      "Tập nói ra mong muốn thay vì kỳ vọng đối phương tự hiểu.",
      "Hãy đặt ranh giới mềm mại để lòng tốt không biến thành kiệt sức."
    ]
  },
  "ESTJ": {
    type: "ESTJ",
    name: "Người Điều Hành Thực Tế (The Grounded Commander)",
    title: "Người biến kế hoạch thành kết quả rõ ràng",
    element: "Kim",
    zodiac: "Sao Vũ Khúc",
    mbtiMatch: "ESTJ - Tổ chức, Quyết đoán & Hiệu quả",
    description: "Bạn có năng lực tổ chức mạnh, tư duy thực tế và khả năng kéo mọi thứ vào trật tự. Bạn nhìn thấy việc cần làm, phân vai nhanh và thúc đẩy tập thể tiến về kết quả. Năng lượng Kim khiến bạn sắc bén, trực diện và đề cao tiêu chuẩn.",
    pillars: {
      identity: "Quyết đoán, rõ ràng, coi trọng trách nhiệm và hiệu suất trong mọi việc.",
      career: "Phù hợp với quản lý, điều hành, kinh doanh, tài chính, logistics, pháp lý hoặc xây dựng hệ thống vận hành.",
      love: "Thẳng thắn, bảo vệ người mình yêu bằng hành động cụ thể và định hướng tương lai rõ ràng.",
      life: "Thiết lập trật tự, xây thành tựu bền vững và trở thành trụ cột đáng tin cho cộng đồng."
    },
    advice: [
      "Lắng nghe cảm xúc trước khi đưa ra giải pháp quá nhanh.",
      "Dành không gian cho người khác thử cách làm khác với tiêu chuẩn của bạn.",
      "Nghỉ ngơi cũng là một phần của hiệu suất dài hạn."
    ]
  },
  "ESFJ": {
    type: "ESFJ",
    name: "Người Kết Nối Cộng Đồng (The Heartful Host)",
    title: "Người lan tỏa sự ấm áp qua chăm sóc và gắn kết",
    element: "Hỏa",
    zodiac: "Sao Thái Dương",
    mbtiMatch: "ESFJ - Hòa đồng, Quan tâm & Trách nhiệm",
    description: "Bạn có khả năng tạo bầu không khí thân thiện, kết nối mọi người và nhận ra điều ai đó đang cần. Bạn sống giàu tình cảm, coi trọng sự hòa hợp và thường là người giữ nhịp cho tập thể. Năng lượng Hỏa giúp bạn ấm áp, chủ động và dễ truyền động lực.",
    pillars: {
      identity: "Hướng về cộng đồng, nhạy cảm với cảm xúc tập thể và thích chăm sóc bằng hành động cụ thể.",
      career: "Phù hợp với nhân sự, giáo dục, dịch vụ khách hàng, truyền thông cộng đồng, tổ chức sự kiện hoặc chăm sóc sức khỏe.",
      love: "Yêu nồng hậu, thích quan tâm chủ động và cần cảm giác được trân trọng rõ ràng.",
      life: "Xây dựng các mối quan hệ ấm áp, tạo không gian thuộc về và nuôi dưỡng tinh thần cộng đồng."
    },
    advice: [
      "Không phải mọi sự bất hòa đều là lỗi của bạn.",
      "Học cách ưu tiên bản thân mà không cảm thấy ích kỷ.",
      "Đừng đánh giá giá trị của mình chỉ qua sự công nhận từ người khác."
    ]
  },
  "ISTP": {
    type: "ISTP",
    name: "Người Thợ Giải Mã (The Quiet Tactician)",
    title: "Người xử lý thực tế bằng sự bình tĩnh và sắc bén",
    element: "Kim",
    zodiac: "Sao Thất Sát",
    mbtiMatch: "ISTP - Linh hoạt, Kỹ thuật & Bình tĩnh",
    description: "Bạn có đầu óc phân tích thực dụng, thích hiểu cách mọi thứ vận hành và thường giữ bình tĩnh trong tình huống áp lực. Bạn không nói quá nhiều nhưng quan sát rất kỹ. Khi cần hành động, bạn ra tay nhanh, gọn và hiệu quả.",
    pillars: {
      identity: "Độc lập, thực tế, thích tự do hành động và học qua trải nghiệm trực tiếp.",
      career: "Phù hợp với kỹ thuật, sản phẩm, an ninh, dữ liệu, cơ khí, thiết kế hệ thống hoặc các vai trò xử lý sự cố.",
      love: "Yêu bằng sự tôn trọng không gian cá nhân, hành động thiết thực và lòng trung thành kín đáo.",
      life: "Khám phá thế giới qua kỹ năng, trải nghiệm và khả năng ứng biến trước những điều bất ngờ."
    },
    advice: [
      "Tập diễn đạt cảm xúc trước khi người khác phải tự đoán.",
      "Đừng rút lui quá nhanh khi mối quan hệ cần một cuộc trò chuyện sâu.",
      "Xây dựng vài cam kết dài hạn sẽ giúp tự do của bạn có nền vững hơn."
    ]
  },
  "ISFP": {
    type: "ISFP",
    name: "Người Nghệ Sĩ Tự Do (The Gentle Artisan)",
    title: "Người chạm vào cuộc sống bằng cảm xúc và vẻ đẹp riêng",
    element: "Thủy",
    zodiac: "Sao Thái Âm",
    mbtiMatch: "ISFP - Nhạy cảm, Nghệ thuật & Tự do",
    description: "Bạn sống bằng cảm nhận tinh tế, yêu cái đẹp và thường có thế giới nội tâm giàu màu sắc. Bạn không thích bị ép vào khuôn cứng nhắc, mà cần không gian để thể hiện bản thân theo cách tự nhiên. Năng lượng Thủy khiến bạn mềm mại, sâu lắng và giàu trực giác cảm xúc.",
    pillars: {
      identity: "Chân thật, giàu cảm xúc, tôn trọng tự do cá nhân và nhạy với vẻ đẹp của hiện tại.",
      career: "Phù hợp với nghệ thuật, thiết kế, thời trang, nội dung sáng tạo, chăm sóc tinh thần, nhiếp ảnh hoặc sản phẩm trải nghiệm.",
      love: "Yêu dịu dàng, sâu sắc, thể hiện qua hành động nhỏ và sự hiện diện chân thành.",
      life: "Sống đúng cảm xúc, bảo vệ sự tự do nội tâm và biến trải nghiệm đời thường thành chất liệu sáng tạo."
    },
    advice: [
      "Đừng né tránh xung đột cần thiết chỉ để giữ bình yên tạm thời.",
      "Biến cảm hứng thành thói quen nhỏ để tài năng có đất phát triển.",
      "Học cách nói rõ giới hạn khi điều gì đó làm bạn tổn thương."
    ]
  },
  "ESTP": {
    type: "ESTP",
    name: "Người Khai Phá Hành Động (The Bold Pathfinder)",
    title: "Người bứt phá bằng bản lĩnh và tốc độ",
    element: "Hỏa",
    zodiac: "Sao Phá Quân",
    mbtiMatch: "ESTP - Năng động, Táo bạo & Thực chiến",
    description: "Bạn có năng lượng hành động mạnh, thích thử thách và phản ứng rất nhanh với cơ hội trước mắt. Bạn học tốt nhất khi trực tiếp va chạm thực tế. Sự hiện diện của bạn thường khiến không khí trở nên sống động, quyết liệt và nhiều khả năng mới.",
    pillars: {
      identity: "Gan dạ, thực tế, thích tốc độ và không ngại bước vào tình huống chưa rõ kết quả.",
      career: "Phù hợp với kinh doanh, sales, thể thao, truyền thông, startup, vận hành hiện trường hoặc xử lý khủng hoảng.",
      love: "Yêu sôi nổi, trực tiếp, thích cùng nhau trải nghiệm hơn là chỉ nói về cảm xúc.",
      life: "Chinh phục giới hạn, học qua hành động và biến rủi ro thành cơ hội phát triển."
    },
    advice: [
      "Chậm lại một nhịp trước các quyết định có tác động dài hạn.",
      "Lắng nghe cảm xúc sâu hơn thay vì chỉ xử lý bề mặt tình huống.",
      "Kỷ luật nhỏ mỗi ngày sẽ giúp sự bứt phá của bạn bền vững hơn."
    ]
  },
  "ESFP": {
    type: "ESFP",
    name: "Người Thắp Sáng Khoảnh Khắc (The Radiant Performer)",
    title: "Người biến hiện tại thành sân khấu của niềm vui",
    element: "Hỏa",
    zodiac: "Sao Hồng Loan",
    mbtiMatch: "ESFP - Sống động, Cảm xúc & Cuốn hút",
    description: "Bạn mang năng lượng rạng rỡ, dễ kết nối và biết cách làm cho cuộc sống trở nên giàu trải nghiệm. Bạn nhạy với cảm xúc của môi trường xung quanh và thường đem lại sự nhẹ nhõm, vui tươi cho người khác. Bạn tỏa sáng nhất khi được sống thật, tự nhiên và gần con người.",
    pillars: {
      identity: "Cởi mở, giàu cảm xúc, yêu trải nghiệm và thích lan tỏa sự tích cực bằng sự hiện diện chân thật.",
      career: "Phù hợp với nghệ thuật biểu diễn, truyền thông, du lịch, chăm sóc khách hàng, giáo dục trải nghiệm hoặc sáng tạo nội dung.",
      love: "Yêu nồng nhiệt, thích sự gần gũi, vui vẻ và những kỷ niệm sống động cùng nhau.",
      life: "Tận hưởng hiện tại, kết nối với con người và biến niềm vui thành nguồn chữa lành."
    },
    advice: [
      "Đừng trì hoãn những việc quan trọng chỉ vì cảm xúc hiện tại chưa sẵn sàng.",
      "Tập nhìn xa hơn để các lựa chọn hôm nay phục vụ tương lai bạn muốn.",
      "Giữ một khoảng lặng riêng để phân biệt điều mình muốn và điều đám đông mong chờ."
    ]
  },
  "INTP": {
    type: "INTP",
    name: "Nhà Giải Mã Tư Duy (The Abstract Alchemist)",
    title: "Người truy tìm cấu trúc ẩn sau mọi ý tưởng",
    element: "Thủy",
    zodiac: "Sao Thiên Cơ",
    mbtiMatch: "INTP - Phân tích, Tò mò & Độc lập",
    description: "Bạn có tư duy lý thuyết mạnh, luôn muốn hiểu bản chất và đặt câu hỏi đến tận cùng. Bạn thích không gian tự do để suy nghĩ, thử giả thuyết và kết nối các ý tưởng tưởng như rời rạc. Năng lượng Thủy giúp trí tuệ của bạn linh hoạt, sâu và khó bị giới hạn.",
    pillars: {
      identity: "Tò mò, độc lập, yêu sự chính xác trong tư duy và không dễ chấp nhận câu trả lời đơn giản.",
      career: "Phù hợp với nghiên cứu, công nghệ, dữ liệu, AI, chiến lược sản phẩm, triết học, khoa học hoặc kiến trúc hệ thống.",
      love: "Yêu bằng sự tôn trọng trí tuệ, không gian riêng và những cuộc đối thoại sâu sắc.",
      life: "Khám phá quy luật, xây hệ thống hiểu biết riêng và biến tri thức thành tự do nội tâm."
    },
    advice: [
      "Đưa ý tưởng ra thử nghiệm sớm thay vì hoàn thiện mãi trong đầu.",
      "Tập gọi tên cảm xúc bằng ngôn ngữ đơn giản hơn.",
      "Đừng để sự phân tích khiến bạn đứng ngoài những trải nghiệm quan trọng."
    ]
  },
  "ENTP": {
    type: "ENTP",
    name: "Người Khơi Mở Khả Năng (The Spark Strategist)",
    title: "Người phá khuôn bằng ý tưởng và tranh biện sắc bén",
    element: "Hỏa",
    zodiac: "Sao Liêm Trinh",
    mbtiMatch: "ENTP - Sáng tạo, Linh hoạt & Thách thức",
    description: "Bạn nhanh trí, thích khám phá khả năng mới và thường nhìn thấy nhiều hướng đi mà người khác bỏ qua. Bạn không ngại đặt câu hỏi, thử góc nhìn trái chiều và phá vỡ khuôn mẫu cũ. Năng lượng Hỏa khiến ý tưởng của bạn bùng lên mạnh mẽ và dễ truyền cảm hứng.",
    pillars: {
      identity: "Tò mò, sắc sảo, thích tự do tư duy và luôn muốn mở rộng giới hạn của vấn đề.",
      career: "Phù hợp với startup, chiến lược, marketing, sản phẩm, công nghệ, tư vấn, sáng tạo nội dung hoặc đổi mới mô hình kinh doanh.",
      love: "Yêu bằng sự kích thích trí tuệ, hài hước và những cuộc trò chuyện không bao giờ nhàm chán.",
      life: "Thử nghiệm, mở đường, chất vấn điều cũ và biến ý tưởng thành sân chơi phát triển."
    },
    advice: [
      "Chọn vài ý tưởng thật sự quan trọng để theo đến cùng.",
      "Tranh luận nên mở rộng kết nối, không chỉ để thắng lý lẽ.",
      "Kỷ luật thực thi sẽ là chiếc neo cho sức sáng tạo rất lớn của bạn."
    ]
  },
  "ENTJ": {
    type: "ENTJ",
    name: "Người Kiến Tạo Quyền Lực (The Vision Commander)",
    title: "Người dẫn đường bằng tầm nhìn và ý chí sắc bén",
    element: "Kim",
    zodiac: "Sao Tử Vi",
    mbtiMatch: "ENTJ - Lãnh đạo, Chiến lược & Quyết liệt",
    description: "Bạn có tầm nhìn lớn, tư duy hệ thống và khả năng tổ chức nguồn lực để đạt mục tiêu. Bạn thường nhìn thấy con đường tối ưu, ra quyết định nhanh và không ngại chịu trách nhiệm. Năng lượng Kim giúp bạn có khí chất lãnh đạo rõ ràng, mạnh mẽ và hướng thành tựu.",
    pillars: {
      identity: "Tham vọng, lý trí, có năng lực dẫn dắt và luôn muốn nâng cấp hệ thống xung quanh.",
      career: "Phù hợp với lãnh đạo doanh nghiệp, chiến lược, đầu tư, quản trị sản phẩm, tư vấn, công nghệ hoặc xây dựng tổ chức.",
      love: "Yêu rõ ràng, nghiêm túc, định hướng tương lai và cần một người đồng hành có bản lĩnh riêng.",
      life: "Tạo ảnh hưởng, xây thành tựu lớn và dùng năng lực lãnh đạo để kiến tạo giá trị dài hạn."
    },
    advice: [
      "Đừng xem cảm xúc là vật cản, đó cũng là dữ liệu quan trọng của con người.",
      "Cho người khác thời gian bắt kịp tốc độ tư duy của bạn.",
      "Học cách nghỉ ngơi trước khi cơ thể buộc bạn phải dừng lại."
    ]
  },
  "ENFJ": {
    type: "ENFJ",
    name: "Người Dẫn Lối Tâm Hồn (The Empathic Guide)",
    title: "Người truyền cảm hứng bằng thấu cảm và tầm nhìn nhân văn",
    element: "Mộc",
    zodiac: "Sao Thiên Phủ",
    mbtiMatch: "ENFJ - Truyền cảm hứng, Thấu cảm & Dẫn dắt",
    description: "Bạn có khả năng nhìn thấy tiềm năng trong người khác và khơi dậy điều tốt đẹp ở họ. Bạn kết hợp sự ấm áp với năng lực tổ chức, khiến người khác cảm thấy được lắng nghe và được dẫn đường. Năng lượng Mộc giúp bạn phát triển, chữa lành và lan tỏa lý tưởng sống tích cực.",
    pillars: {
      identity: "Giàu thấu cảm, hướng cộng đồng, có tầm nhìn và mong muốn nâng đỡ người khác phát triển.",
      career: "Phù hợp với coaching, giáo dục, nhân sự, truyền thông, lãnh đạo cộng đồng, tâm lý học hoặc phát triển tổ chức.",
      love: "Yêu sâu sắc, chủ động chăm sóc cảm xúc và mong muốn cùng nhau trưởng thành.",
      life: "Kết nối con người, gieo cảm hứng và xây những cộng đồng có ý nghĩa."
    },
    advice: [
      "Đừng biến việc cứu giúp người khác thành trách nhiệm thường trực của mình.",
      "Giữ một phần năng lượng cho mục tiêu cá nhân, không chỉ cho tập thể.",
      "Học cách chấp nhận rằng không phải ai cũng cần được dẫn dắt ngay lúc này."
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
