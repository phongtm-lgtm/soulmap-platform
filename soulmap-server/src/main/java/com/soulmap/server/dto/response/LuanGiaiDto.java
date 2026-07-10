package com.soulmap.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LuanGiaiDto {
    private int id;
    private String title;
    private String content;
    private Integer sourceId;
    private String sourceName;
}
