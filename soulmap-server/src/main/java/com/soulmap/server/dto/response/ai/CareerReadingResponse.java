package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CareerReadingResponse {
    private Long id;
    private String type;
    private String chapterId;
    private String chapterTitle;
    private String content;
    private String deepReadingMarkdown;
}
