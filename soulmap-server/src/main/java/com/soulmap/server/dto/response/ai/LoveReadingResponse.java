package com.soulmap.server.dto.response.ai;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoveReadingResponse {
    private Long id;
    private String type;
    private String chapterId;
    private String chapterTitle;
    private String content;
}
