package com.soulmap.server.common.enums;

import org.springframework.http.HttpStatus;

/**
 * Danh muc loi chuan cua API.
 * Moi error code gan voi HTTP status va message key i18n.
 */
public enum ErrorCode {
    COMMON_ERROR_0001(HttpStatus.BAD_REQUEST, "0001.common.validation-error"),
    COMMON_ERROR_0002(HttpStatus.NOT_FOUND, "0002.common.resource-not-found"),
    COMMON_ERROR_0003(HttpStatus.INTERNAL_SERVER_ERROR, "0003.common.internal-error"),
    AI_ERROR_0001(HttpStatus.BAD_GATEWAY, "0001.ai.provider-error"),
    AI_ERROR_0002(HttpStatus.BAD_GATEWAY, "0002.ai.response-parse-error"),
    AI_ERROR_0003(HttpStatus.BAD_GATEWAY, "0003.ai.response-validation-error"),
    AI_ERROR_0004(HttpStatus.GATEWAY_TIMEOUT, "0004.ai.timeout");

    private final HttpStatus httpStatus;
    private final String messageKey;

    ErrorCode(HttpStatus httpStatus, String messageKey) {
        this.httpStatus = httpStatus;
        this.messageKey = messageKey;
    }

    /**
     * HTTP status that su duoc tra ve cho client.
     */
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    /**
     * Key dung de lay message da dich tu MessageSource.
     */
    public String getMessageKey() {
        return messageKey;
    }
}
