import type { JourneySlug } from '../types/journey';
import type { JourneyDetailContent } from '../types/journeyDetail';

const CAREER_ACCENT = '#3F7DB8';

/**
 * Mock content for the "Sự nghiệp" (Career) journey.
 * Voice: Linh Nhi — warm, addresses the reader as "bạn", weaves Tử Vi
 * symbolism softly through `tuViNote`. Last two sections are locked.
 */
export const careerJourneyContent: JourneyDetailContent = {
  slug: 'career',
  tagline: 'Hành trình tìm ra công việc khiến bạn thấy mình đang thật sự sống, không chỉ tồn tại.',
  accentColor: CAREER_ACCENT,
  sections: [
    {
      id: 'intro',
      navLabel: 'Mở đầu',
      headline: 'Trước khi nói về nghề, mình muốn nói về bạn đã.',
      body: [
        'Sự nghiệp không phải là một cái tên chức danh in trên tấm danh thiếp. Nó là cách bạn dành phần lớn thời gian tỉnh táo nhất trong đời để đổi lấy một điều gì đó có ý nghĩa với mình.',
        'Nên trước khi bàn tới việc nên làm nghề gì, mình muốn cùng bạn nhìn lại: điều gì khiến bạn thấy một ngày làm việc là đáng sống, và điều gì khiến bạn thấy mình đang tự bào mòn chính mình.',
        'Hành trình này không đưa cho bạn một câu trả lời đóng khung. Nó giúp bạn hiểu chính mình rõ hơn, để mỗi lựa chọn nghề nghiệp sau này là lựa chọn của một người biết mình muốn gì.',
      ],
      tuViNote: 'Cung Quan Lộc trong lá số của bạn nói về sự nghiệp, nhưng nó chỉ là tấm bản đồ. Người cầm bản đồ và quyết định đi hướng nào, vẫn là bạn.',
    },
    {
      id: 'work-identity',
      navLabel: 'Con người trong công việc',
      headline: 'Ở nơi làm việc, bạn là ai khi không ai nhắc bạn phải là ai?',
      body: [
        'Bạn thuộc kiểu người tìm kiếm ý nghĩa trước khi tìm kiếm phần thưởng. Một công việc trả lương cao nhưng khiến bạn thấy trống rỗng sẽ nhanh chóng làm bạn kiệt sức, kể cả khi nhìn từ bên ngoài mọi thứ đều ổn.',
        'Bạn làm tốt nhất khi được tin tưởng và trao cho không gian tự chủ. Bạn không thích bị quản lý sát sao từng bước, nhưng bạn cũng không phải người thích hỗn loạn. Bạn cần một khung rõ ràng, rồi tự do bên trong cái khung đó.',
        'Điểm mạnh thầm lặng của bạn là khả năng nhìn ra bức tranh lớn và cảm nhận được điều người khác đang cần, đôi khi trước cả khi họ nói ra.',
      ],
      tuViNote: 'Sao chủ mệnh của bạn nghiêng về nhóm văn tinh — hợp với công việc dùng tư duy, chữ nghĩa và sự thấu cảm hơn là công việc thuần cạnh tranh, va chạm.',
    },
    {
      id: 'career-path',
      navLabel: 'Con đường phù hợp',
      headline: 'Có những con đường nghề nghiệp gọi đúng tần số của bạn.',
      body: [
        'Bạn phát triển mạnh trong những vai trò cho phép bạn kết nối con người, kiến tạo giá trị và để lại dấu ấn cá nhân: tư vấn, giáo dục, sáng tạo nội dung, thiết kế trải nghiệm, hoặc những công việc chăm sóc và dẫn dắt người khác.',
        'Bạn không nhất thiết phải chọn một nghề rồi gắn bó cả đời. Con đường của bạn thường là một chuỗi các chặng, mỗi chặng bạn học thêm một mảnh về chính mình rồi dịch chuyển sang thứ sâu hơn.',
        'Đừng vội so sánh tốc độ của mình với người khác. Có người chạy nước rút, có người đi đường dài. Bạn thuộc nhóm đi đường dài, và giá trị của bạn thường lộ ra rõ nhất sau vài năm chứ không phải vài tháng.',
      ],
      tuViNote: 'Cung Quan Lộc gặp cách cục thiên về hậu vận: nghĩa là sự nghiệp của bạn có xu hướng "chín muộn nhưng bền", càng về sau càng vững nếu bạn kiên nhẫn tích lũy.',
    },
    {
      id: 'money-style',
      navLabel: 'Cách bạn với tiền',
      headline: 'Tiền với bạn là phương tiện, không phải đích đến, nhưng vẫn cần được tôn trọng.',
      body: [
        'Bạn không phải người bị tiền cuốn đi, nhưng chính vì thế bạn dễ xem nhẹ việc quản lý nó. Bạn hay ưu tiên ý nghĩa và cảm hứng, rồi để chuyện tài chính "tính sau".',
        'Điều này khiến bạn dễ nhận việc dưới giá trị thật của mình, hoặc ngại nói về lương vì sợ bị đánh giá là thực dụng. Nhưng được trả công xứng đáng không làm bạn kém tử tế đi, nó giúp bạn đi được đường dài mà không kiệt sức.',
        'Một thói quen nhỏ có thể đổi nhiều thứ: đặt cho mình một con số tối thiểu mà bạn không thương lượng xuống dưới, và tập nói con số đó ra mà không xin lỗi.',
      ],
      tuViNote: 'Cung Tài Bạch của bạn nghiêng về "cầu tài bằng tài năng và uy tín" hơn là bằng đầu cơ, may rủi. Tiền đến với bạn qua giá trị bạn tạo ra, chậm mà chắc.',
    },
    {
      id: 'environment',
      navLabel: 'Môi trường lý tưởng',
      headline: 'Bạn không chỉ chọn công việc, bạn còn chọn bầu không khí mình sẽ thở mỗi ngày.',
      body: [
        'Môi trường phù hợp với bạn là nơi con người được tôn trọng như con người, chứ không chỉ như một mắt xích tạo ra kết quả. Bạn cực kỳ nhạy với năng lượng xung quanh, một tập thể độc hại có thể rút cạn bạn nhanh hơn khối lượng công việc.',
        'Bạn cần một người lãnh đạo hoặc đồng đội mà bạn có thể tôn trọng thật lòng. Khi tin vào người dẫn dắt, bạn cống hiến hết mình. Khi mất niềm tin, bạn khó lòng giả vờ.',
        'Bạn cũng cần khoảng lặng để làm việc sâu. Một chỗ ngồi yên tĩnh, một khung giờ không bị ngắt quãng, đôi khi quan trọng với bạn hơn cả những phúc lợi hào nhoáng.',
      ],
      tuViNote: 'Cung Thiên Di cho thấy bạn hợp với môi trường có tính nhân văn và được quý nhân nâng đỡ, hơn là nơi phải một mình bươn chải giữa cạnh tranh khốc liệt.',
    },
    {
      id: 'watch-out',
      navLabel: 'Điều cần lưu ý',
      headline: 'Có vài cái bẫy quen thuộc mà những người giống bạn hay bước vào.',
      locked: true,
      body: [
        'Bạn dễ ôm quá nhiều vì không nỡ từ chối, rồi âm thầm gánh phần việc của người khác cho tới lúc kiệt sức mà không ai biết.',
        'Bạn có xu hướng đợi tới khi "cảm thấy đủ giỏi" mới dám bước lên, trong khi nhiều cơ hội cần bạn bước lên trước rồi mới giỏi lên.',
        'Bạn cũng dễ đánh đồng việc nghỉ ngơi với sự lười biếng, và tự trách mình vào đúng lúc lẽ ra nên tự chăm sóc mình nhất.',
      ],
      tuViNote: 'Một vài sát tinh trong cung Quan Lộc nhắc bạn cẩn trọng với giai đoạn chuyển việc và những lời hứa hẹn thiếu rõ ràng, hãy nghe kỹ trước khi gật đầu.',
    },
    {
      id: 'next-steps',
      navLabel: 'Bước tiếp theo',
      headline: 'Vậy từ ngày mai, bạn có thể bắt đầu từ đâu?',
      locked: true,
      body: [
        'Bạn không cần một cuộc lột xác. Bạn cần một vài bước nhỏ, đủ cụ thể để làm được, đủ đúng hướng để không lãng phí.',
        'Mình đã chuẩn bị cho bạn một lộ trình gồm những việc rất đời thường: cách viết lại câu chuyện nghề nghiệp của mình, cách nhận diện cơ hội hợp tần số, và cách nói về giá trị của bạn mà không thấy ngại.',
        'Và nếu bạn muốn, mình sẽ đồng hành cùng bạn qua từng bước, tùy theo tình huống thật của bạn chứ không phải lời khuyên chung chung.',
      ],
      tuViNote: 'Đại vận sắp tới của bạn mở ra một cửa thuận cho sự nghiệp — thời điểm tốt để gieo hạt cho những thứ bạn muốn gặt trong vài năm tới.',
    },
  ],
};

const CONTENT_REGISTRY: Partial<Record<JourneySlug, JourneyDetailContent>> = {
  career: careerJourneyContent,
};

/**
 * Placeholder content for journeys that don't have authored copy yet.
 * Keeps the generic screen renderable for every slug in phase 1.
 */
function buildPlaceholderContent(slug: JourneySlug): JourneyDetailContent {
  return {
    slug,
    tagline: 'Nội dung chi tiết cho hành trình này đang được Linh Nhi hoàn thiện.',
    accentColor: '#3E7A50',
    sections: careerJourneyContent.sections.map((section) => ({
      ...section,
      body: ['Nội dung cho phần này sẽ sớm được cập nhật. Hãy quay lại sau nhé.'],
      tuViNote: undefined,
    })),
  };
}

/**
 * Resolve the detail content for a journey slug.
 * Phase 1 returns mock data; swap this for an API call later.
 */
export function getJourneyContent(slug: JourneySlug): JourneyDetailContent {
  return CONTENT_REGISTRY[slug] ?? buildPlaceholderContent(slug);
}
