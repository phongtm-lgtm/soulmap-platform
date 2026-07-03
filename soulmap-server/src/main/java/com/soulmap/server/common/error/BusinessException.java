package com.soulmap.server.common.error;

import com.soulmap.server.common.enums.ErrorCode;

/**
 * Exception cho loi nghiep vu da duoc kiem soat.
 * Client chi nhan code/status/detail theo ErrorCode.
 */
public class BusinessException extends RuntimeException {

    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.name());
        this.errorCode = errorCode;
    }

    /**
     * ErrorCode quyet dinh HTTP status, message key va muc expose cua loi.
     */
    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
