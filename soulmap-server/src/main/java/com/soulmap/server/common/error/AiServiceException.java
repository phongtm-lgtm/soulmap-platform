package com.soulmap.server.common.error;

import com.soulmap.server.common.enums.ErrorCode;

public class AiServiceException extends BusinessException {
    public AiServiceException(ErrorCode errorCode) {
        super(errorCode);
    }

    public AiServiceException(ErrorCode errorCode, Throwable cause) {
        super(errorCode);
        initCause(cause);
    }
}
