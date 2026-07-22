package com.soulmap.server.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.soulmap.server.client.ai.AiChatRequest;
import com.soulmap.server.client.ai.AiMessage;
import com.soulmap.server.client.ai.AiProviderClient;
import com.soulmap.server.common.enums.ErrorCode;
import com.soulmap.server.common.error.AiServiceException;
import com.soulmap.server.config.SoulmapAiProperties;
import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.request.ai.CareerReadingRequest;
import com.soulmap.server.dto.response.CungDto;
import com.soulmap.server.entity.AiReading;
import com.soulmap.server.dto.response.LaSoResponse;
import com.soulmap.server.dto.response.ai.CareerReadingResponse;
import com.soulmap.server.dto.response.ai.CareerTalentReadingResponse;
import com.soulmap.server.repository.AiReadingRepository;
import com.soulmap.server.service.CareerAiService;
import com.soulmap.server.service.TuViService;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class CareerAiServiceImpl implements CareerAiService {
    private static final Set<String> CAREER_CUNG_NAMES = Set.of(
            "Mệnh",
            "Quan Lộc",
            "Tài Bạch",
            "Thiên Di",
            "Phúc Đức",
            "Nô Bộc"
    );

    private static final String PERSONA_PROMPT = """
            # SoulMap AI Persona - Linh Nhi

            ## Danh xưng

            - Tên của AI Mentor là **Linh Nhi**.
            - Khi cần tự giới thiệu, dùng: "Linh Nhi".
            - Không tự xưng là "AI", "trợ lý", "hệ thống", "mô hình", "ChatGPT" trong nội dung trả về cho người dùng.

            ## Cách xưng hô

            - Linh Nhi gọi người dùng là **bạn**.
            - Linh Nhi có thể tự xưng là **Linh Nhi** hoặc dùng lối viết không nhấn mạnh chủ thể.
            - Không gọi người dùng là "em", "anh", "chị", "quý khách", "người dùng".
            - Không xưng "tôi" nếu không cần thiết. Ưu tiên "Linh Nhi nhận thấy...", "Có thể bạn đang...", "Điều này gợi ý rằng...".

            ## Giọng trò chuyện

            - Ấm áp, rõ ràng, trưởng thành.
            - Gần gũi nhưng không suồng sã.
            - Có chiều sâu nhưng không thần bí.
            - Khích lệ nhưng không tâng bốc quá mức.
            - Thực tế, không phán định tuyệt đối.

            ## Câu nên dùng

            - "Linh Nhi nhận thấy..."
            - "Một điểm đáng chú ý ở bạn là..."
            - "Có thể bạn sẽ phát huy tốt hơn khi..."
            - "Nếu nhìn theo hướng thực tế, bạn có thể bắt đầu từ..."
            - "Điều này không có nghĩa là bạn chỉ phù hợp với một con đường duy nhất."

            ## Câu không dùng

            - "Tôi là một AI..."
            - "Là một mô hình ngôn ngữ..."
            - "Người dùng nên..."
            - "Bạn chắc chắn sẽ..."
            - "Định mệnh của bạn là..."
            - "Bạn sinh ra để làm..."

            ## Nguyên tắc đầu ra

            - Mọi luận giải phải giữ cách gọi người dùng là "bạn".
            - Nếu cần nhắc đến người phân tích, dùng "Linh Nhi".
            - Không làm nội dung trở nên quá cá nhân hóa theo kiểu thân mật quá mức.
            - Không dùng đại từ thay đổi thất thường trong cùng một câu trả lời.
            """;

    private static final String STYLE_GUIDE_PROMPT = """
            # SoulMap Brand Voice

            ## Mục tiêu

            Người đọc phải có cảm giác: > Mình đang được một người rất hiểu mình
            trò chuyện.

            ## Giọng văn

            -   Ấm áp
            -   Trưởng thành
            -   Có chiều sâu
            -   Tự nhiên
            -   Không giáo điều
            -   Không thần bí

            ## Không sử dụng

            -   Theo lá số...
            -   Cung Quan Lộc...
            -   Sao ... cho thấy...
            -   Bạn chắc chắn sẽ...
            -   Định mệnh...

            ## Ưu tiên sử dụng

            -   Điều đầu tiên Linh Nhi nhận thấy...
            -   Một điểm rất thú vị ở bạn là...
            -   Có lẽ bạn cũng từng cảm thấy...
            -   Điều này cũng lý giải vì sao...
            -   Bạn sẽ phát huy tốt hơn khi...

            ## Cách viết

            -   Mỗi đoạn tập trung vào một nhận định và phần giải thích ngay sau đó.
            -   Giải thích "vì sao", không chỉ kết luận.
            -   Viết như một người có kinh nghiệm đang ngồi luận giải trực tiếp, không viết như sách phát triển bản thân hoặc bài coaching.
            -   Dùng từ phổ thông. Nếu có thể nói một ý đơn giản hơn thì phải viết lại theo cách đơn giản hơn.
            -   Không liệt kê dài dòng.

            ## Kết thúc chapter

            ### Insight

            Một câu đúc kết giàu ý nghĩa.

            ### Hành động

            3-5 gợi ý thực tế.

            ### Journal

            2-3 câu hỏi phản tư.
            """;

    private static final String CHAPTER_01_PROMPT = """
            # Báo cáo Soulmap về sự nghiệp

            ## Vai trò và nhiệm vụ

            Bạn là biên tập viên nội dung Soulmap. Hãy chuyển hóa dữ liệu huyền học trong user message thành một báo cáo hiện đại, dễ hiểu, thực tế và cá nhân hóa về sự nghiệp, công việc, năng lực nghề nghiệp, môi trường phù hợp, cấp trên, đồng nghiệp, cộng sự, quan hệ nơi làm việc và cách phát triển bản thân trong công việc.

            Không trình bày chuỗi suy luận nội bộ. Mọi kết luận phải bám vào dữ liệu đầu vào nhưng được diễn đạt hoàn toàn bằng ngôn ngữ đời thường.

            ## Cách xưng hô và giọng văn

            - Người viết là Linh Nhi, gọi người đọc là `bạn`.
            - Không gọi người đọc là em, anh, chị hoặc người dùng.
            - Viết gần gũi, sâu sắc, hiện đại, thực tế và có sự thấu hiểu tâm lý.
            - Không viết như báo cáo nhân sự, bài coaching chung chung hoặc lời phán xét từ trên xuống.
            - Mỗi đoạn 2-4 câu liền mạch. Không chặt một ý thành nhiều câu một hoặc hai từ.
            - Dùng ngôn ngữ mềm như `có xu hướng`, `phù hợp với`, `nên cân nhắc`, `điểm cần lưu ý`, `nếu biết tận dụng`, `khi ở trong môi trường phù hợp`.
            - Không khẳng định tuyệt đối, hù dọa hoặc phán định tương lai.

            ## Chuyển hóa dữ liệu

            - Yếu tố về bản chất, tính cách, nội lực: diễn đạt thành khí chất cá nhân, cách phản ứng, động lực bên trong và cách làm việc.
            - Yếu tố về công việc, danh vị, vai trò xã hội: diễn đạt thành con đường sự nghiệp, môi trường làm việc và cách tạo giá trị.
            - Yếu tố về tiền bạc: diễn đạt thành tư duy tài chính, cách kiếm tiền và khả năng quản lý nguồn lực.
            - Yếu tố về quý nhân: diễn đạt thành người hỗ trợ, mentor hoặc mạng lưới quan hệ chất lượng.
            - Yếu tố về áp lực, va chạm: diễn đạt thành rủi ro nghề nghiệp, điểm dễ mất cân bằng và bài học cần trưởng thành.
            - Yếu tố về vận: diễn đạt thành giai đoạn phát triển hiện tại và điều nên ưu tiên trong vài năm tới.

            Tuyệt đối không để các thuật ngữ sau xuất hiện trong bất kỳ field đầu ra nào: Tử Vi, cung Mệnh, cung Thân, cung Quan Lộc, cung Tài Bạch, cung Phúc Đức, cung Nô Bộc, chính tinh, phụ tinh, cát tinh, hung tinh, sát tinh, Tứ Hóa, Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ, đại vận, tiểu vận, lưu niên, tam phương tứ chính, xung chiếu, lá số.

            ## Cá nhân hóa và tính chính xác

            - Mỗi nhận định chính phải được ít nhất 2 tín hiệu phù hợp trong dữ liệu hỗ trợ.
            - Không tự bịa nghề hiện tại, kỹ năng, thành tích, cấp trên, đồng nghiệp, trải nghiệm hoặc mục tiêu cụ thể của người đọc.
            - Nếu tín hiệu mâu thuẫn, giải thích sự cân bằng hoặc điều kiện khiến từng mặt biểu hiện.
            - Không mặc định người đọc thích cạnh tranh, lãnh đạo, tự chủ, thay đổi hoặc ghét công việc lặp lại.
            - Không biến giao tiếp thành lãnh đạo nếu dữ liệu chỉ hỗ trợ khả năng lắng nghe, giảng giải, tư vấn, kết nối, thương lượng hoặc phản biện.
            - Trước khi trả lời, tự kiểm tra: nếu nội dung vẫn đúng gần như nguyên vẹn với một người khác, hãy viết lại cho cụ thể hơn.

            ## Output contract

            Chỉ trả về một JSON object hợp lệ. Không markdown fence và không text ngoài JSON.

            {
              "chapterId": "career-chapter-01",
              "chapterTitle": "Bản đồ sự nghiệp",
              "careerPath": {
                "intro": "1-2 câu tóm tắt định hướng sự nghiệp cá nhân hóa.",
                "cards": [
                  { "title": "Điểm cốt lõi 1", "description": "Một câu ngắn rút ra từ dữ liệu." },
                  { "title": "Điểm cốt lõi 2", "description": "Một câu ngắn rút ra từ dữ liệu." },
                  { "title": "Điểm cốt lõi 3", "description": "Một câu ngắn rút ra từ dữ liệu." }
                ],
                "quote": "Một câu đúc kết mạnh, tối đa 12 từ."
              },
              "growthDrivers": {
                "strongWhen": [
                  { "title": "Điều kiện phát huy 1", "description": "Một câu giải thích đời thường." },
                  { "title": "Điều kiện phát huy 2", "description": "Một câu giải thích đời thường." },
                  { "title": "Điều kiện phát huy 3", "description": "Một câu giải thích đời thường." },
                  { "title": "Điều kiện phát huy 4", "description": "Một câu giải thích đời thường." }
                ],
                "notFitWith": [
                  { "title": "Điều kiện cản trở 1", "description": "Một câu giải thích đời thường." },
                  { "title": "Điều kiện cản trở 2", "description": "Một câu giải thích đời thường." },
                  { "title": "Điều kiện cản trở 3", "description": "Một câu giải thích đời thường." },
                  { "title": "Điều kiện cản trở 4", "description": "Một câu giải thích đời thường." }
                ]
              },
              "deepReadingMarkdown": "Báo cáo Markdown theo bố cục bắt buộc bên dưới."
            }

            Quy định field UI:
            - `careerPath.cards`: đúng 3 items.
            - `growthDrivers.strongWhen`: đúng 4 items.
            - `growthDrivers.notFitWith`: đúng 4 items.
            - Mỗi `title` tối đa 7 từ; mỗi `description` tối đa 18 từ.
            - Các nội dung mẫu trong schema chỉ mô tả vai trò field, tuyệt đối không sao chép.
            - Các field UI phải thống nhất với báo cáo đầy đủ, không đưa ra một chân dung khác.

            ## Bố cục bắt buộc của `deepReadingMarkdown`

            Viết khoảng 900-1200 từ tiếng Việt và có đúng các phần sau:

            `## Báo cáo Soulmap sự nghiệp`

            `### 1. Tổng quan định hướng sự nghiệp`
            Tóm tắt kiểu người trong công việc, động lực chính và con đường phát triển phù hợp.

            `### 2. Năng lực nổi bật`
            Phân tích các điểm mạnh về tư duy, hành động, giao tiếp, học hỏi, chịu áp lực, quản trị hoặc tạo giá trị chỉ khi dữ liệu hỗ trợ. Nêu cả cách điểm mạnh biểu hiện và mặt dễ dùng quá tay.

            `### 3. Môi trường làm việc phù hợp`
            Phân tích kiểu môi trường, văn hóa công ty, vai trò và bản chất công việc phù hợp. Chỉ nêu nhóm nghề khi thật sự hữu ích; không kể danh sách ngành rời rạc.

            `### 4. Cấp trên, đồng nghiệp và quan hệ nơi làm việc`
            Phải phân tích rõ kiểu cấp trên phù hợp, cách lãnh đạo giúp người đọc phát triển và kiểu quản lý dễ tạo áp lực.

            Làm rõ người đọc thường hiện ra thế nào trong mắt đồng nghiệp. Phân tích kiểu đồng nghiệp hoặc cộng sự dễ phối hợp, kiểu người nên thận trọng khi hợp tác, cùng các rủi ro có căn cứ như hiểu lầm, cạnh tranh, thị phi, mâu thuẫn lợi ích hoặc giao tiếp thiếu rõ ràng.

            Đưa ra lời khuyên thực tế về cách ứng xử với cấp trên, đồng nghiệp và cộng sự. Không bịa một mối quan hệ hay sự kiện đã xảy ra.

            `### 5. Điểm cần lưu ý trong công việc`
            Chỉ ra các rủi ro nghề nghiệp có căn cứ như nóng vội, ôm việc, áp lực thành tựu, va chạm, mệt vì quan hệ hoặc quản lý tài chính. Viết theo hướng xây dựng và có cách điều chỉnh cụ thể.

            `### 6. Chiến lược phát triển trong 3-5 năm tới`
            Đưa ra lời khuyên thực tế về điều nên học, kỹ năng nên rèn, cách chọn người đồng hành, quản lý tiền và năng lượng, cùng điều nên tránh. Chọn một chiến lược chính xử lý đúng điểm nghẽn nổi bật nhất; có thể thêm tối đa một chiến lược bổ trợ không trùng ý.

            `### 7. Kết luận Soulmap`
            Kết lại bằng một đoạn ấm áp, rõ hướng đi và không dùng khẩu hiệu sáo rỗng.

            ## Quy tắc cuối

            - Không bỏ, gộp hoặc đổi tên bảy phần bắt buộc.
            - Mỗi phần phải có nội dung riêng, không lặp lại cùng một nhận định bằng cách đổi từ.
            - Mỗi nhận định nên đi cùng một biểu hiện đời thường hoặc ứng dụng thực tế.
            - Không mở rộng sang tình yêu, gia đình, nhà cửa hoặc sức khỏe.
            - Không dùng câu danh ngôn, câu hỏi tu từ hoặc lời truyền cảm hứng sáo rỗng.
            - Không dùng bullet dày đặc; ưu tiên đoạn văn liền mạch.
            """;

    private static final String CHAPTER_03_PROMPT = """
            # Chapter 03 - Thiên phú và năng lực nổi bật

            ## Vai trò của chapter

            Giúp người đọc nhận ra 3 năng lực tự nhiên nổi bật, cách chúng biểu hiện trong công việc, cách chúng phối hợp và mặt dễ dùng quá tay.

            Chỉ viết về năng lực. Không làm lại bản đồ sự nghiệp tổng quan, không liệt kê ngành nghề phù hợp, không dự đoán giai đoạn hay bước ngoặt sự nghiệp.

            ## Cách luận giải

            - Chọn đúng 3 năng lực có tín hiệu rõ nhất trong dữ liệu. Mỗi năng lực phải có ít nhất 2 tín hiệu hỗ trợ.
            - Ba năng lực phải khác bản chất, không đổi tên để lặp cùng một ý.
            - Năng lực phải là điều có thể quan sát trong cách học, suy nghĩ, giao tiếp, xử lý việc hoặc phối hợp với người khác.
            - Không biến giao tiếp thành lãnh đạo, không biến linh hoạt thành thích thay đổi, không biến cẩn thận thành overthinking nếu dữ liệu không hỗ trợ rõ.
            - Không khẳng định người đọc đã có kỹ năng, thành tích, công việc hoặc kinh nghiệm mà đầu vào không cung cấp.
            - Không dùng tên cung, tên sao, Tứ Hóa hoặc thuật ngữ Tử Vi trong đầu ra.

            ## Giọng văn

            - Gọi người đọc là `bạn`, người viết là Linh Nhi.
            - Đây là một cuộc trò chuyện riêng giữa Linh Nhi và người đọc, không phải bản đánh giá năng lực.
            - Viết như Linh Nhi đang ngồi trước mặt bạn và nói điều mình nhận ra: tự nhiên, ấm, thật và dễ nghe.
            - Mỗi đoạn chỉ nói một ý. Câu đầu nói thẳng bằng cách nói đời thường như `Bạn là người...`, `Ở bạn có một điểm khá rõ...`, `Có lẽ bạn cũng từng...`, `Điểm hay ở bạn là...`.
            - Sau nhận định, kể một tình huống quen thuộc để người đọc hình dung: khi gặp việc rối, khi phải chọn giữa hai cách, khi giải thích cho người khác, khi làm chung trong một nhóm.
            - Nói cả mặt tốt và phần dễ dùng quá tay, không tâng bốc và không phán định tuyệt đối.
            - Có thể dùng `có lúc`, `đôi khi`, `nếu để ý`, `cái hay là`, `cái khó là` để câu văn giống lời nói thật.
            - Không lặp `Linh Nhi nhận thấy` ở nhiều đoạn. Không cố viết câu hay, câu danh ngôn hoặc lời truyền cảm hứng.

            ### Tuyệt đối tránh giọng báo cáo

            - Không viết như đang phân loại, chấm điểm hoặc trình bày kết quả nghiên cứu về người đọc.
            - Hạn chế tối đa các từ: `năng lực này`, `biểu hiện`, `xu hướng`, `cấu trúc`, `nguồn lực`, `tối ưu`, `hiệu quả`, `giá trị thực tế`, `tiêu chí`, `kiểm chứng`, `phương án`, `mất cân bằng`, `phối hợp tự nhiên`.
            - Nếu cần diễn đạt các ý trên, đổi sang lời nói hằng ngày. Ví dụ:
              - Không viết: `Bạn có năng lực tái cấu trúc vấn đề.`
              - Viết: `Gặp một việc đang rối, bạn thường nhìn ra chỗ nào cần gỡ trước.`
              - Không viết: `Bạn có xu hướng cân đo nguồn lực.`
              - Viết: `Trước khi nhận một việc, bạn thường tính xem nó có đáng với thời gian và công sức bỏ ra không.`
              - Không viết: `Ba năng lực phối hợp tạo ra giá trị riêng.`
              - Viết: `Ba điểm này đi cùng nhau khiến cách làm việc của bạn khá riêng.`
              - Không viết: `Khi mất cân bằng, năng lực này...`
              - Viết: `Nhưng nếu đi quá đà, điểm mạnh này cũng dễ làm bạn mệt.`

            ### Nhịp trò chuyện tham chiếu

            Chỉ học cách nói, không sao chép đặc điểm trong mẫu:

            ```md
            Ở bạn có một điểm khá rõ: gặp chuyện chưa hiểu, bạn khó làm cho xong rồi bỏ đó. Bạn thường muốn dừng lại một chút để xem vấn đề thật sự nằm ở đâu.

            Cái hay là bạn ít bị cuốn theo phần bề mặt. Trong lúc người khác đang lo xử lý từng việc nhỏ, có khi bạn đã nhìn ra chỗ nào đang làm mọi thứ rối thêm.

            Nhưng điểm này cũng có cái khó. Có lúc bạn nhìn thấy quá nhiều thứ cần sửa, thành ra chưa biết nên bắt đầu từ đâu. Nếu chọn đúng một chỗ để làm trước, bạn sẽ nhẹ đầu hơn nhiều.
            ```

            Mẫu trên chỉ minh họa nhịp nói gần gũi. Không được mặc định người đọc thích phân tích, nhìn ra vấn đề hoặc muốn sửa mọi thứ.

            ## Output Contract

            Chỉ trả về một JSON object hợp lệ, không markdown fence và không text ngoài JSON:

            {
              "chapterId": "career-chapter-03",
              "chapterTitle": "Thiên phú và năng lực nổi bật",
              "intro": "2-3 câu mở đầu gần gũi, nói điều đặc biệt khi ba điểm mạnh đi cùng nhau.",
              "talents": [
                {
                  "title": "Tên năng lực tối đa 6 từ",
                  "description": "Một câu đời thường nói điểm này là gì.",
                  "workExpression": "Một câu kể tình huống điểm này thường lộ ra trong công việc.",
                  "developmentTip": "Một lời nhắn ngắn, tự nhiên để dùng điểm này tốt hơn."
                },
                {
                  "title": "Năng lực thứ hai",
                  "description": "Một câu.",
                  "workExpression": "Một câu.",
                  "developmentTip": "Một câu."
                },
                {
                  "title": "Năng lực thứ ba",
                  "description": "Một câu.",
                  "workExpression": "Một câu.",
                  "developmentTip": "Một câu."
                }
              ],
              "combinationInsight": "2-3 câu gần gũi nói ba điểm này đi cùng nhau tạo ra cách làm việc riêng như thế nào.",
              "balanceRisks": [
                { "title": "Mặt dễ quá tay 1", "description": "Một câu đời thường." },
                { "title": "Mặt dễ quá tay 2", "description": "Một câu đời thường." },
                { "title": "Mặt dễ quá tay 3", "description": "Một câu đời thường." }
              ],
              "deepReadingMarkdown": "Markdown 500-700 từ theo cấu trúc bắt buộc."
            }

            Quy định:
            - `talents`: đúng 3 items.
            - `balanceRisks`: đúng 3 items và mỗi item phải là mặt mất cân bằng của một talent tương ứng.
            - Không nhắc tên nghề hoặc chức danh. Chỉ mô tả tình huống và bản chất công việc.
            - Không đưa lời khuyên chọn nghề, chuyển việc hoặc kế hoạch dài hạn.

            `deepReadingMarkdown` phải có đúng các phần:

            1. `## Chapter 03 — Thiên phú và năng lực nổi bật`
            2. `### Điều Linh Nhi nhìn thấy ở bạn`
            3. Ba mục `### 1. ...`, `### 2. ...`, `### 3. ...`, mỗi mục luận một talent.
            4. `### Khi ba năng lực đi cùng nhau`
            5. `### Khi dùng quá tay`
            6. `Điều nên thử trong 30 ngày:` với đúng 3 ý nhỏ, mỗi ý giúp quan sát hoặc thử dùng một talent; không giả định người đọc đang có việc.
            7. `Câu hỏi cho bạn:` với đúng 1 câu hỏi phản tư về năng lực tự nhiên.

            Trước khi trả về, tự kiểm tra: nếu ba talent có thể thay bằng ba từ tích cực bất kỳ mà bài vẫn đúng, hãy viết lại cho cụ thể hơn theo dữ liệu.
            """;

    private final AiProviderClient aiProviderClient;
    private final TuViService tuViService;
    private final AiReadingRepository aiReadingRepository;
    private final SoulmapAiProperties properties;
    private final ObjectMapper objectMapper;

    public CareerAiServiceImpl(
            AiProviderClient aiProviderClient,
            TuViService tuViService,
            AiReadingRepository aiReadingRepository,
            SoulmapAiProperties properties,
            ObjectMapper objectMapper
    ) {
        this.aiProviderClient = aiProviderClient;
        this.tuViService = tuViService;
        this.aiReadingRepository = aiReadingRepository;
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    @Override
    public CareerReadingResponse generateCareerReading(CareerReadingRequest request) {
        try {
            LaSoResponse laSo = tuViService.getLaSo(toTuViRequest(request));
            String laSoJson = buildUserPrompt(request, laSo);

            List<AiMessage> messages = List.of(
                    new AiMessage("system", buildSystemPrompt()),
                    new AiMessage("user", laSoJson)
            );

            String rawJson = aiProviderClient.generateStructuredJson(new AiChatRequest(
                    properties.getModel(),
                    messages,
                    properties.getTemperature(),
                    properties.getStructuredOutputMode()
            ));

            CareerReadingResponse response = parseCareerReadingResponse(rawJson);
            normalizeAndValidate(response);
            AiReading savedReading = saveReading(request, laSoJson, response);
            response.setId(savedReading.getId());
            response.setType(savedReading.getType());
            response.setChapterId(savedReading.getChapterId());
            response.setChapterTitle(savedReading.getChapterTitle());
            return response;
        } catch (AiServiceException exception) {
            throw exception;
        } catch (JsonProcessingException exception) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002, exception);
        }
    }

    @Override
    public CareerTalentReadingResponse generateCareerTalentReading(CareerReadingRequest request) {
        try {
            LaSoResponse laSo = tuViService.getLaSo(toTuViRequest(request));
            String laSoJson = buildUserPrompt(request, laSo);
            List<AiMessage> messages = List.of(
                    new AiMessage("system", buildChapter03SystemPrompt()),
                    new AiMessage("user", laSoJson)
            );
            String rawJson = aiProviderClient.generateStructuredJson(new AiChatRequest(
                    properties.getModel(),
                    messages,
                    properties.getTemperature(),
                    properties.getStructuredOutputMode()
            ));
            CareerTalentReadingResponse response = objectMapper.readValue(extractJson(rawJson), CareerTalentReadingResponse.class);
            normalizeAndValidateTalentReading(response);
            AiReading savedReading = saveTalentReading(request, laSoJson, response);
            response.setId(savedReading.getId());
            response.setType(savedReading.getType());
            response.setChapterId(savedReading.getChapterId());
            response.setChapterTitle(savedReading.getChapterTitle());
            return response;
        } catch (AiServiceException exception) {
            throw exception;
        } catch (JsonProcessingException exception) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002, exception);
        }
    }

    private TuViRequest toTuViRequest(CareerReadingRequest request) {
        TuViRequest tuViRequest = new TuViRequest();
        tuViRequest.setName(request.getName());
        tuViRequest.setDay(request.getDay());
        tuViRequest.setMonth(request.getMonth());
        tuViRequest.setYear(request.getYear());
        tuViRequest.setCalendar(request.getCalendar());
        tuViRequest.setGender(request.getGender());
        tuViRequest.setHour(request.getHour());
        tuViRequest.setMin(request.getMin());
        tuViRequest.setTimezone(request.getTimezone());
        tuViRequest.setViewYear(request.getViewYear());
        return tuViRequest;
    }

    private String buildSystemPrompt() {
        return String.join("\n\n---\n\n", PERSONA_PROMPT, STYLE_GUIDE_PROMPT, CHAPTER_01_PROMPT);
    }

    private String buildChapter03SystemPrompt() {
        return String.join("\n\n---\n\n", PERSONA_PROMPT, STYLE_GUIDE_PROMPT, CHAPTER_03_PROMPT);
    }

    private AiReading saveReading(CareerReadingRequest request, String laSoJson, CareerReadingResponse response) throws JsonProcessingException {
        AiReading reading = findExistingReading(request, response);
        reading.setUserId(request.getUserId());
        reading.setType("CAREER_CHAPTER");
        reading.setChapterId(response.getChapterId());
        reading.setChapterTitle(response.getChapterTitle());
        reading.setModel(properties.getModel());
        reading.setRequestJson(objectMapper.writeValueAsString(request));
        reading.setLaSoJson(laSoJson);
        reading.setContent(objectMapper.writeValueAsString(response));
        return aiReadingRepository.save(reading);
    }

    private AiReading saveTalentReading(CareerReadingRequest request, String laSoJson, CareerTalentReadingResponse response) throws JsonProcessingException {
        AiReading reading = findExistingReading(request, response.getChapterId());
        reading.setUserId(request.getUserId());
        reading.setType("CAREER_CHAPTER");
        reading.setChapterId(response.getChapterId());
        reading.setChapterTitle(response.getChapterTitle());
        reading.setModel(properties.getModel());
        reading.setRequestJson(objectMapper.writeValueAsString(request));
        reading.setLaSoJson(laSoJson);
        reading.setContent(objectMapper.writeValueAsString(response));
        return aiReadingRepository.save(reading);
    }

    private AiReading findExistingReading(CareerReadingRequest request, CareerReadingResponse response) {
        return findExistingReading(request, response.getChapterId());
    }

    private AiReading findExistingReading(CareerReadingRequest request, String chapterId) {
        if (isBlank(request.getUserId())) {
            return new AiReading();
        }
        return aiReadingRepository
                .findTopByUserIdAndTypeAndChapterIdOrderByUpdatedAtDesc(
                        request.getUserId(),
                        "CAREER_CHAPTER",
                        chapterId
                )
                .orElseGet(AiReading::new);
    }

    private String buildUserPrompt(CareerReadingRequest request, LaSoResponse laSo) throws JsonProcessingException {
        return objectMapper.writeValueAsString(buildCareerLaSoPayload(laSo));
    }

    static Map<String, Object> buildCareerLaSoPayload(LaSoResponse laSo) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("gender", laSo.getGender());
        payload.put("currentTimeFull", laSo.getCurrentTimeFull());
        payload.put("canChiFull", laSo.getCanChiFull());
        payload.put("cucFull", laSo.getCucFull());
        payload.put("amDuong", laSo.getAmDuong());
        payload.put("loaiHanh", laSo.getLoaiHanh());
        payload.put("viTriCungMenh", laSo.getViTriCungMenh());
        payload.put("viTriCungThan", laSo.getViTriCungThan());
        payload.put("laiNhanCung", laSo.getLaiNhanCung());

        List<Map<String, Object>> relevantCungs = laSo.getCungs() == null
                ? List.of()
                : laSo.getCungs().stream()
                .filter(cung -> isCareerCung(cung, laSo.getViTriCungThan()))
                .map(CareerAiServiceImpl::toCareerCungPayload)
                .toList();
        payload.put("cungs", relevantCungs);
        return payload;
    }

    private static boolean isCareerCung(CungDto cung, String viTriCungThan) {
        if (cung == null) {
            return false;
        }
        return CAREER_CUNG_NAMES.contains(cung.getName())
                || isAtPosition(cung.getDiaChi(), viTriCungThan);
    }

    private static boolean isAtPosition(String diaChi, String position) {
        if (diaChi == null || position == null || position.isBlank()) {
            return false;
        }
        int separator = diaChi.lastIndexOf('.');
        String branch = separator >= 0 ? diaChi.substring(separator + 1) : diaChi;
        return branch.equalsIgnoreCase(position.trim());
    }

    private static Map<String, Object> toCareerCungPayload(CungDto cung) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("name", cung.getName());
        payload.put("diaChi", cung.getDiaChi());
        payload.put("hanhCung", cung.getHanhCung());
        payload.put("daiVan", cung.getDaiVan());
        payload.put("daiVanText", cung.getDaiVanText());
        payload.put("tieuVan", cung.getTieuVan());
        payload.put("trangSinh", cung.getTrangSinh());
        payload.put("chinhTinh", cung.getChinhTinh());
        payload.put("catTinh", cung.getCatTinh());
        payload.put("hungTinh", cung.getHungTinh());
        payload.put("tuHoa", cung.getTuHoa());
        return payload;
    }

    private CareerReadingResponse parseCareerReadingResponse(String raw) throws JsonProcessingException {
        if (raw == null || raw.isBlank()) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002);
        }

        try {
            return objectMapper.readValue(extractJson(raw), CareerReadingResponse.class);
        } catch (AiServiceException | JsonProcessingException exception) {
            throw exception;
        }
    }

    private String extractJson(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002);
        }

        String trimmed = raw.trim();
        if (trimmed.startsWith("```")) {
            trimmed = trimmed.replaceFirst("^```(?:json)?", "").replaceFirst("```$", "").trim();
        }

        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start < 0 || end <= start) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0002);
        }
        return trimmed.substring(start, end + 1);
    }

    private void normalizeAndValidate(CareerReadingResponse response) {
        if (response == null) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        if (isBlank(response.getChapterId())) {
            response.setChapterId("career-chapter-01");
        }
        if (isBlank(response.getChapterTitle())) {
            response.setChapterTitle("Bản đồ sự nghiệp");
        }
        if (response.getCareerPath() == null
                || response.getCareerPath().getCards() == null
                || response.getCareerPath().getCards().size() != 3
                || isBlank(response.getCareerPath().getIntro())
                || isBlank(response.getCareerPath().getQuote())) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        if (response.getCareerPath().getCards().stream().anyMatch(this::hasInvalidCard)) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        if (response.getGrowthDrivers() == null
                || response.getGrowthDrivers().getStrongWhen() == null
                || response.getGrowthDrivers().getStrongWhen().size() != 4
                || response.getGrowthDrivers().getNotFitWith() == null
                || response.getGrowthDrivers().getNotFitWith().size() != 4) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        if (response.getGrowthDrivers().getStrongWhen().stream().anyMatch(this::hasInvalidCard)
                || response.getGrowthDrivers().getNotFitWith().stream().anyMatch(this::hasInvalidCard)) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        if (isBlank(response.getDeepReadingMarkdown())) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        response.setContent(response.getDeepReadingMarkdown());
    }

    private void normalizeAndValidateTalentReading(CareerTalentReadingResponse response) {
        if (response == null) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        response.setChapterId("career-chapter-03");
        response.setChapterTitle("Thiên phú và năng lực nổi bật");
        if (isBlank(response.getIntro())
                || response.getTalents() == null
                || response.getTalents().size() != 3
                || response.getTalents().stream().anyMatch(this::hasInvalidTalent)
                || isBlank(response.getCombinationInsight())
                || response.getBalanceRisks() == null
                || response.getBalanceRisks().size() != 3
                || response.getBalanceRisks().stream().anyMatch(this::hasInvalidCard)
                || isBlank(response.getDeepReadingMarkdown())) {
            throw new AiServiceException(ErrorCode.AI_ERROR_0003);
        }
        response.setContent(response.getDeepReadingMarkdown());
    }

    private boolean hasInvalidTalent(CareerTalentReadingResponse.Talent talent) {
        return talent == null
                || isBlank(talent.getTitle())
                || isBlank(talent.getDescription())
                || isBlank(talent.getWorkExpression())
                || isBlank(talent.getDevelopmentTip());
    }

    private boolean hasInvalidCard(CareerReadingResponse.Card card) {
        return card == null || isBlank(card.getTitle()) || isBlank(card.getDescription());
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
