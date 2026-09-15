package com.soulmap.server.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

import org.junit.jupiter.api.Test;

class SoulMapProfileKeyServiceTest {
    private final SoulMapProfileKeyService service = new SoulMapProfileKeyService();

    @Test
    void ignoresNameAndViewYearByDesign() {
        String key = service.create("infj", 15, 8, 1998, "solar", "female", 8, 0, 1);
        assertEquals(key, service.create("INFJ", 15, 8, 1998, "SOLAR", "FEMALE", 8, 0, 1));
    }

    @Test
    void changesWhenBillableProfileInputChanges() {
        String key = service.create("INFJ", 15, 8, 1998, "solar", "female", 8, 0, 1);
        assertNotEquals(key, service.create("ENFJ", 15, 8, 1998, "solar", "female", 8, 0, 1));
        assertNotEquals(key, service.create("INFJ", 15, 8, 1998, "solar", "female", 9, 0, 1));
    }
}
