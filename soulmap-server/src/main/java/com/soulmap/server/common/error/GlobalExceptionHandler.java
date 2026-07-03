package com.soulmap.server.common.error;

import com.soulmap.server.common.enums.ErrorCode;
import com.soulmap.server.common.response.ErrorDetail;
import com.soulmap.server.common.trace.TraceIdFilter;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.context.MessageSource;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/**
 * Xu ly tap trung cac exception chinh cua REST API.
 * Lop nay chuyen validation va business exception thanh response loi chuan.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private final MessageSource messageSource;

    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Xu ly loi validate request body voi @Valid.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception,
            Locale locale
    ) {
        List<ErrorDetail> details = exception.getBindingResult().getFieldErrors().stream()
                .map(this::toErrorDetail)
                .toList();

        return buildErrorResponse(ErrorCode.COMMON_ERROR_0001, details, locale);
    }

    /**
     * Xu ly loi nghiep vu da duoc code chu dong throw ra.
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ProblemDetail> handleBusinessException(BusinessException exception, Locale locale) {
        log.warn("Business exception: code={}", exception.getErrorCode().name(), exception);

        return buildErrorResponse(
                exception.getErrorCode(),
                Collections.emptyList(),
                locale
        );
    }

    /**
     * Tao response loi voi HTTP status tu ErrorCode.
     */
    private ResponseEntity<ProblemDetail> buildErrorResponse(
            ErrorCode errorCode,
            List<ErrorDetail> details,
            Locale locale) {

        ProblemDetail response = ProblemDetail.forStatus(errorCode.getHttpStatus());
        response.setType(toProblemType(errorCode));
        response.setTitle(errorCode.name());
        response.setDetail(resolveMessage(errorCode, locale));
        response.setProperty("details", details == null ? Collections.emptyList() : details);
        response.setProperty("traceId", MDC.get(TraceIdFilter.TRACE_ID_KEY));
        response.setProperty("timestamp", Instant.now());

        return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
    }

    /**
     * Tao URI dinh danh loai loi theo RFC 9457.
     */
    private URI toProblemType(ErrorCode errorCode) {
        return URI.create("https://api.soulmap.vn/problems/" + errorCode.name().toLowerCase().replace('_', '-'));
    }

    /**
     * Resolve public detail message theo locale tu ErrorCode.
     */
    private String resolveMessage(ErrorCode errorCode, Locale locale) {
        return messageSource.getMessage(errorCode.getMessageKey(), null, errorCode.name(), locale);
    }

    /**
     * Chuyen FieldError cua Spring Validation thanh detail an toan cho client.
     */
    private ErrorDetail toErrorDetail(FieldError fieldError) {
        String code = fieldError.getCode();
        if (code == null || code.isBlank()) {
            code = ErrorCode.COMMON_ERROR_0001.name();
        }

        return new ErrorDetail(
                fieldError.getField(),
                code,
                fieldError.getDefaultMessage()
        );
    }

}
