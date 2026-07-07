export function getMbtiArchetypeLabel(mbtiType: string): string {
  const labels: Record<string, string> = {
    INFJ: 'Người Cố Vấn',
    ENFP: 'Nhà Khai Phá',
    INTJ: 'Nhà Thiết Kế',
    INFP: 'Người Hòa Giải',
    INTP: 'Nhà Tư Tưởng',
    ENTJ: 'Nhà Lãnh Đạo',
    ENTP: 'Nhà Sáng Tạo',
    ENFJ: 'Người Dẫn Dắt',
    ISTJ: 'Người Trách Nhiệm',
    ISFJ: 'Người Bảo Vệ',
    ESTJ: 'Người Quản Trị',
    ESFJ: 'Người Chăm Sóc',
    ISTP: 'Người Thợ Thủ',
    ISFP: 'Nghệ Sĩ Tự Do',
    ESTP: 'Người Năng Động',
    ESFP: 'Người Trình Diễn',
  };
  return labels[mbtiType] ?? 'Người Tìm Kiếm';
}

export function getMbtiShortDescription(mbtiType: string): string {
  const descriptions: Record<string, string> = {
    INFJ: 'Bạn sâu sắc, giàu trực giác và luôn hướng đến những điều có ý nghĩa cho bản thân và thế giới.',
    ENFP: 'Bạn giàu năng lượng, sáng tạo và luôn mở lòng với những khả năng mới trong cuộc sống.',
    INTJ: 'Bạn độc lập, có chiến lược rõ ràng và thường nhìn thấy bức tranh dài hạn trước người khác.',
    INFP: 'Bạn sâu sắc, giàu cảm xúc và luôn hướng đến những điều tốt đẹp cho bản thân và thế giới.',
    INTP: 'Bạn tò mò, thích phân tích và luôn muốn hiểu bản chất thật sự của mọi vấn đề.',
    ENTJ: 'Bạn quyết đoán, định hướng mục tiêu và có khả năng dẫn dắt người khác tiến về phía trước.',
    ENTP: 'Bạn nhanh trí, linh hoạt và thường tìm thấy cơ hội trong những góc nhìn khác biệt.',
    ENFJ: 'Bạn ấm áp, truyền cảm hứng và có khả năng kết nối mọi người bằng sự thấu hiểu.',
    ISTJ: 'Bạn đáng tin cậy, thực tế và luôn coi trọng trách nhiệm trong từng lựa chọn.',
    ISFJ: 'Bạn chu đáo, tận tâm và thường âm thầm tạo cảm giác an toàn cho những người xung quanh.',
    ESTJ: 'Bạn rõ ràng, thực tế và có năng lực tổ chức để biến kế hoạch thành kết quả.',
    ESFJ: 'Bạn thân thiện, quan tâm và luôn muốn xây dựng sự hài hòa trong các mối quan hệ.',
    ISTP: 'Bạn điềm tĩnh, linh hoạt và thích khám phá cuộc sống thông qua trải nghiệm thực tế.',
    ISFP: 'Bạn tinh tế, giàu cảm nhận và thường thể hiện bản thân qua vẻ đẹp rất riêng.',
    ESTP: 'Bạn năng động, thực tế và dễ thích nghi với những thay đổi ngay trước mắt.',
    ESFP: 'Bạn rạng rỡ, giàu cảm xúc và có khả năng mang lại sức sống cho không gian xung quanh.',
  };

  return descriptions[mbtiType] ?? 'Bạn đang sở hữu một bản sắc nội tâm riêng, chờ được SoulMap soi chiếu sâu hơn.';
}

export function getMbtiHighlights(mbtiType: string): string[] {
  const highlights: Record<string, string[]> = {
    INFJ: ['Trực giác sâu và giàu lòng trắc ẩn', 'Có tầm nhìn cá nhân rõ ràng', 'Thích chữa lành và nâng đỡ người khác', 'Luôn tìm kiếm ý nghĩa trong cuộc sống'],
    ENFP: ['Sáng tạo và giàu cảm hứng', 'Kết nối nhanh với con người mới', 'Luôn mở lòng với khả năng mới', 'Mang năng lượng tích cực đến tập thể'],
    INTJ: ['Tư duy chiến lược và nhìn xa', 'Độc lập trong lựa chọn', 'Thích tối ưu hệ thống và kế hoạch', 'Kỷ luật khi theo đuổi mục tiêu'],
    INFP: ['Sáng tạo và giàu trí tưởng tượng', 'Đồng cảm và tinh tế', 'Luôn tìm kiếm ý nghĩa', 'Thích phát triển và học hỏi'],
    INTP: ['Phân tích sắc bén và khách quan', 'Tò mò với những ý tưởng phức tạp', 'Thích tự do tư duy', 'Giỏi nhìn ra logic ẩn sau vấn đề'],
    ENTJ: ['Dẫn dắt quyết đoán', 'Định hướng kết quả mạnh mẽ', 'Tổ chức nguồn lực hiệu quả', 'Không ngại thử thách lớn'],
    ENTP: ['Nhanh trí và thích tranh luận', 'Linh hoạt trước thay đổi', 'Nhìn thấy nhiều hướng giải quyết', 'Có tinh thần khám phá mạnh'],
    ENFJ: ['Ấm áp và biết truyền cảm hứng', 'Nhạy cảm với cảm xúc người khác', 'Giỏi kết nối tập thể', 'Luôn muốn tạo ảnh hưởng tích cực'],
    ISTJ: ['Đáng tin cậy và có trách nhiệm', 'Thực tế trong hành động', 'Tôn trọng cấu trúc rõ ràng', 'Kiên trì hoàn thành cam kết'],
    ISFJ: ['Tận tâm và chu đáo', 'Quan sát tốt nhu cầu của người khác', 'Đề cao sự ổn định', 'Bền bỉ trong các mối quan hệ'],
    ESTJ: ['Rõ ràng và có tổ chức', 'Ra quyết định thực tế', 'Theo sát mục tiêu đến cùng', 'Tạo trật tự cho tập thể'],
    ESFJ: ['Thân thiện và dễ tạo thiện cảm', 'Quan tâm đến sự hài hòa', 'Biết chăm sóc người xung quanh', 'Có tinh thần cộng đồng cao'],
    ISTP: ['Bình tĩnh khi xử lý vấn đề', 'Thực tế và linh hoạt', 'Thích học qua trải nghiệm', 'Giỏi thích nghi với tình huống mới'],
    ISFP: ['Tinh tế và giàu cảm xúc', 'Yêu tự do cá nhân', 'Có gu thẩm mỹ riêng', 'Thể hiện sự quan tâm bằng hành động'],
    ESTP: ['Năng động và nhanh nhạy', 'Giỏi nắm bắt cơ hội', 'Thích hành động thực tế', 'Dễ tạo sự hứng khởi xung quanh'],
    ESFP: ['Tỏa sáng trong kết nối xã hội', 'Sống giàu cảm xúc', 'Mang lại niềm vui tự nhiên', 'Biết tận hưởng khoảnh khắc hiện tại'],
  };

  return highlights[mbtiType] ?? ['Có bản sắc nội tâm riêng', 'Sẵn sàng khám phá chiều sâu bản thân', 'Linh hoạt trong cách nhìn cuộc sống', 'Đang mở ra một hành trình mới'];
}

export const MBTI_TRAIT_TAGS = [
  { emoji: '🌿', label: 'Đồng cảm' },
  { emoji: '✨', label: 'Trực giác' },
  { emoji: '💡', label: 'Sáng tạo' },
  { emoji: '🛡️', label: 'Kiên định' },
] as const;
