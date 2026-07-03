package com.soulmap.server.common.error;

import com.soulmap.server.common.enums.ErrorCode;

/**
 * Exception tien ich cho cac truong hop khong tim thay resource.
 */
public class ResourceNotFoundException extends BusinessException {

    public ResourceNotFoundException() {
        super(ErrorCode.COMMON_ERROR_0002);
    }
}
