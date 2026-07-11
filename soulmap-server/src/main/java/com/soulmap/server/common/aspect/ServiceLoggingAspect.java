package com.soulmap.server.common.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * Log vong doi thuc thi cua cac public method trong bean @Service.
 */
@Slf4j
@Aspect
@Component
public class ServiceLoggingAspect {

    @Pointcut("execution(public * *(..)) && within(@org.springframework.stereotype.Service *)")
    public void publicServiceMethods() {
        // Pointcut definition.
    }

    @Around("publicServiceMethods()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        String method = joinPoint.getSignature().toShortString();
        long startTime = System.currentTimeMillis();

        log.info("[Service method] {} started", method);

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            log.info("[Service method] {} finished successfully in {} ms", method, duration);
            return result;
        } catch (Throwable error) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("[Service method] {} failed after {} ms", method, duration, error);
            throw error;
        }
    }
}
