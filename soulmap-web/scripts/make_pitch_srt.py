# -*- coding: utf-8 -*-
"""Build SRT for SoulMap pitch VO (duration-weighted by character count)."""

from pathlib import Path

TOTAL = 166.0  # 00:02:46
GAP = 0.08

CUES = [
    "Mỗi năm có rất nhiều người trẻ làm test tính cách.\nHọ xem kết quả, đọc vài dòng mô tả, rồi… thôi. Xong.",
    "Họ biết mình thuộc nhóm tính cách nào.\nNhưng vẫn không trả lời được câu hỏi thật sự quan trọng:\nmình hợp việc gì, hợp môi trường nào, và nên bắt đầu từ đâu?",
    "Vấn đề không phải thiếu công cụ. Công cụ thì nhiều.\nCó trang làm MBTI. Có trang xem Tử Vi.\nCó bài test nghề nghiệp. Có chatbot AI hỏi gì cũng trả lời.\nNhưng mỗi thứ nằm một chỗ.\nNgười dùng phải tự ghép — và hầu như không ghép nổi thành một hướng đi rõ.",
    "SoulMap làm việc khác.",
    "Chúng tôi xây một nền tảng giúp bạn hiểu mình —\nrồi biết bước tiếp theo nên làm gì.\nKhông dừng ở một trang kết quả.",
    "Cách dùng trên web rất thẳng.",
    "Bạn làm bài đánh giá tính cách — MBTI.\nHệ thống nắm được cách bạn nghĩ, cách bạn quyết định,\ncách bạn làm việc với người khác.",
    "Sau đó bạn nhập ngày giờ sinh.\nTừ đó hệ thống dựng thêm lớp Tử Vi.\nKhông phải để bói tương lai.\nMà để có thêm một góc nhìn về nhịp sống, điểm mạnh,\nvà hướng phát triển của bạn — nói bằng ngôn ngữ dễ hiểu,\nkhông bắt bạn học thuật ngữ.",
    "Rồi AI gom MBTI và Tử Vi lại, tạo ra SoulMap —\nmột bản đồ riêng cho đúng người đó.",
    "Đây mới là điểm khác.\nKhông còn MBTI một bên, Tử Vi một bên.\nHai nguồn được nối thành một bức tranh.\nKhông phải một nhãn kiểu “bạn thuộc nhóm tính cách này”.\nCũng không phải lá số đầy chữ khó đọc.\nĐây là bản đồ: các phần quan trọng về bạn được nối với nhau,\nvà từ đó mở ra các hành trình cụ thể.",
    "Có bốn hành trình chính.",
    "“Tôi là ai” — nhìn rõ mình hơn:\ntính cách, cảm xúc, điều gì là quan trọng với mình.",
    "“Sự nghiệp” — nghề nào hợp, môi trường nào hợp,\nvà nên tiếp cận công việc thế nào.\nĐây là phần chúng tôi làm sâu nhất trong bản demo hiện tại.",
    "“Tình yêu và mối quan hệ” —\ncách bạn kết nối và xây quan hệ.",
    "“Cuộc đời” — nhìn dài hơn một chút:\ncác hướng đi và lựa chọn theo thời gian.",
    "Ngoài ra còn hành trình Tử Vi riêng.\nNếu bạn muốn xem tách ra, muốn hiểu các chòm sao vận hành thế nào —\nvẫn có, bằng lời dễ hiểu, gắn với đời sống thật.",
    "Mỗi hành trình không chỉ kể bạn là ai.\nNó chỉ ra bạn có thể làm gì tiếp.",
    "Rồi có Linh Nhi — AI Mentor của SoulMap.",
    "Khác ChatGPT ở chỗ này: Linh Nhi không trả lời kiểu chung chung.\nNó dựa trên SoulMap — kể cả phần tính cách và phần Tử Vi —\ncùng hành trình bạn đang mở.\nBạn hỏi về nghề, về môi trường làm việc,\nvề một lựa chọn đang phân vân —\ncâu trả lời gắn với đúng hồ sơ của bạn.",
    "Về sau, còn Journal để ghi lại hành trình từng ngày,\nvà Academy để học thêm.\nMục tiêu không phải dùng một lần rồi bỏ.\nMục tiêu là đi cùng bạn lâu hơn.",
    "Tóm lại, SoulMap không cố làm một trang MBTI đẹp hơn.\nCũng không làm một trang xem Tử Vi kiểu cũ.",
    "Chúng tôi lấy những gì người Việt đã quen — tính cách và Tử Vi —\nrồi biến thành thứ dùng được: hiểu mình, có định hướng,\nvà có AI đồng hành khi cần quyết định.",
    "Thị trường đang thiếu đúng thứ này.\nSoulMap đang xây nó.",
    "Hiểu mình hơn. Bước tiếp rõ hơn.",
]


def weight(text: str) -> int:
    plain = text.replace("\n", "")
    w = max(len(plain), 8)
    if len(plain) < 35:
        w += 12
    return w


def fmt(sec: float) -> str:
    if sec < 0:
        sec = 0.0
    if sec > TOTAL:
        sec = TOTAL
    h = int(sec // 3600)
    m = int((sec % 3600) // 60)
    s = int(sec % 60)
    ms = int(round((sec - int(sec)) * 1000))
    if ms == 1000:
        s += 1
        ms = 0
        if s == 60:
            m += 1
            s = 0
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def main() -> None:
    weights = [weight(t) for t in CUES]
    usable = TOTAL - GAP * (len(CUES) - 1)
    total_w = sum(weights)
    durs = [usable * w / total_w for w in weights]

    lines: list[str] = []
    t = 0.0
    for i, (text, d) in enumerate(zip(CUES, durs), 1):
        start, end = t, t + d
        lines.append(str(i))
        lines.append(f"{fmt(start)} --> {fmt(end)}")
        lines.append(text)
        lines.append("")
        t = end + GAP

    content = "\n".join(lines)
    outs = [
        Path(r"c:\Users\Admin\Downloads\gensuite-thoughtful-moi-nam-co-rat-nhat-narrative-compelling-25.07.2026.srt"),
        Path(r"D:\Manh Phong\soulmap-platform\docs\core\SOULMAP_Demo_Web_Pitch_Script.srt"),
    ]
    for out in outs:
        out.write_text(content, encoding="utf-8")
        print(f"wrote {out}")

    print(f"cues={len(CUES)} end≈{t - GAP:.2f}s")
    t = 0.0
    for i, (text, d) in enumerate(zip(CUES, durs), 1):
        preview = text.split("\n")[0][:52]
        print(f"{i:02d} {fmt(t)[3:-4]}-{fmt(t + d)[3:-4]} | {preview}")
        t = t + d + GAP


if __name__ == "__main__":
    main()
