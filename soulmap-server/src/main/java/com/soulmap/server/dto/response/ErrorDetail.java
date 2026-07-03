package com.soulmap.server.dto.response;

/**
 * Chi tiet loi con, thuong dung cho validation theo tung field.
 */
public record ErrorDetail(
        String field,
        String code,
        String message
) {
}
