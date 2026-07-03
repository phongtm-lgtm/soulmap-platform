package com.soulmap.server.common.error;

/**
 * Loi khi goi hoac doc du lieu tu nguon tuvi.vn.
 */
public class TuViSourceException extends RuntimeException {

    public TuViSourceException(String message) {
        super(message);
    }

    public TuViSourceException(String message, Throwable cause) {
        super(message, cause);
    }
}
