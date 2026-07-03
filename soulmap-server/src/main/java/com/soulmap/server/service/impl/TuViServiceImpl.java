package com.soulmap.server.service.impl;

import com.soulmap.server.common.error.TuViSourceException;
import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.response.CungDto;
import com.soulmap.server.service.TuViService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.core.io.buffer.DataBufferLimitException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.*;

@Service
public class TuViServiceImpl implements TuViService {

    private static final Map<String, String> CUNG_KEYS = Map.ofEntries(
            Map.entry("Tý", "ty_b"),
            Map.entry("Sửu", "suu"),
            Map.entry("Dần", "dan"),
            Map.entry("Mão", "mao"),
            Map.entry("Thìn", "thin"),
            Map.entry("Tỵ", "ty"),
            Map.entry("Ngọ", "ngo"),
            Map.entry("Mùi", "mui"),
            Map.entry("Thân", "than"),
            Map.entry("Dậu", "dau"),
            Map.entry("Tuất", "tuat"),
            Map.entry("Hợi", "hoi")
    );
    private static final int TUVI_RESPONSE_BUFFER_SIZE = 2 * 1024 * 1024;

    private final WebClient webClient;

    public TuViServiceImpl(WebClient.Builder webClientBuilder) {
        ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(TUVI_RESPONSE_BUFFER_SIZE))
                .build();

        this.webClient = webClientBuilder
                .baseUrl("https://tuvi.vn")
                .defaultHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .exchangeStrategies(exchangeStrategies)
                .build();
    }

    @Override
    public Map<String, CungDto> getLaSo(TuViRequest request) {
        MultiValueMap<String, String> formData = buildFormData(request);

        try {
            String responseBody = webClient.post()
                    .uri("/la-so")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue(formData)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (responseBody == null || responseBody.isBlank()) {
                throw new TuViSourceException("Không nhận được dữ liệu từ server nguồn.");
            }

            return parseHtmlToLaSo(responseBody);
        } catch (WebClientResponseException exception) {
            if (exception.getCause() instanceof DataBufferLimitException) {
                throw new TuViSourceException("Du lieu tra ve tu server nguon qua lon cho cau hinh hien tai.", exception);
            }

            throw new TuViSourceException("Server nguon tra ve loi HTTP: " + exception.getStatusCode().value(), exception);
        }
    }

    private Map<String, CungDto> parseHtmlToLaSo(String html) {
        Document doc = Jsoup.parse(html);
        Map<String, CungDto> tempMap = new HashMap<>();

        Elements tds = doc.select("td.cung");
        for (Element td : tds) {
            String fullCungName = normalizeCungName(td.attr("data-cung-full-name"));
            if (fullCungName == null) {
                continue;
            }

            String key = resolveCungKey(fullCungName);
            if (key == null) {
                continue;
            }

            //TODO: parse cung thân, tràng sinh, tuần - triệt,
            tempMap.put(key, parseCung(td, fullCungName, key));
        }

        return orderLaSoMap(tempMap);
    }

    private MultiValueMap<String, String> buildFormData(TuViRequest request) {
        String calendar = "lunar".equalsIgnoreCase(request.getCalendar()) || "false".equalsIgnoreCase(request.getCalendar()) ? "false" : "true";
        String gender = "male".equalsIgnoreCase(request.getGender()) || "true".equalsIgnoreCase(request.getGender()) ? "true" : "false";

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("name", request.getName());
        formData.add("dayOfDOB", String.valueOf(request.getDay()));
        formData.add("monthOfDOB", String.valueOf(request.getMonth()));
        formData.add("yearOfDOB", String.valueOf(request.getYear()));
        formData.add("calendar", calendar);
        formData.add("gender", gender);
        formData.add("hourOfDOB", String.valueOf(request.getHour()));
        formData.add("minOfDOB", String.valueOf(request.getMin()));
        formData.add("timezone", String.valueOf(request.getTimezone()));
        formData.add("viewYear", String.valueOf(request.getViewYear()));
        return formData;
    }

    private CungDto parseCung(Element td, String fullCungName, String key) {
        return CungDto.builder()
                .gridClass("cung-" + key.replace("_", "-"))
                .name(readCungName(td))
                .diaChi(fullCungName)
                .hanhCung(readHanhCung(td))
                .daiVan(cleanText(td.attr("data-dai-van")))
                .tieuVan(readTieuVan(td))
                .chinhTinh(readChinhTinh(td))
                .catTinh(readSaoList(td.selectFirst(".sao-tot")))
                .hungTinh(readSaoList(td.selectFirst(".sao-xau")))
                .build();
    }

    private String normalizeCungName(String fullCungName) {
        if (fullCungName == null) {
            return null;
        }

        String normalized = fullCungName.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private String readCungName(Element td) {
        Element nameEl = td.selectFirst(".text-sao-chinh-tinh");
        return nameEl != null ? cleanText(nameEl.text()) : "";
    }

    private String readHanhCung(Element td) {
        Elements diaChiEls = td.select(".text-dia-chi");
        if (diaChiEls.size() <= 1) {
            return null;
        }

        String rawHanh = cleanText(diaChiEls.get(1).text());
        return rawHanh.replaceAll("^[+-]+", "");
    }

    private String readTieuVan(Element td) {
        String tieuVan = findTieuVan(td.select(".text-dia-chi.txt-tiny-mid"));
        if (!tieuVan.isEmpty()) {
            return tieuVan;
        }

        return findTieuVan(td.select("p[id^=KNH]"));
    }

    private String findTieuVan(Elements elements) {
        for (Element element : elements) {
            String text = cleanText(element.text());
            if (text.startsWith("Th.")) {
                return text;
            }
        }

        return "";
    }

    private List<String> readChinhTinh(Element td) {
        List<String> chinhTinh = new ArrayList<>();
        Elements chinhEls = td.select(".text-chinh-chinh, .text-chinh-phu");
        for (Element el : chinhEls) {
            String txt = cleanText(el.text()).replaceAll("^[+-]+", "");
            if (!txt.isEmpty()) {
                chinhTinh.add(txt);
            }
        }
        return chinhTinh;
    }

    private List<String> readSaoList(Element container) {
        List<String> saoList = new ArrayList<>();
        if (container == null) {
            return saoList;
        }

        Elements elements = container.select(".text-sao-xau-tot");
        for (Element element : elements) {
            String text = cleanText(element.text());
            if (!text.isEmpty()) {
                saoList.add(text);
            }
        }

        return saoList;
    }

    private Map<String, CungDto> orderLaSoMap(Map<String, CungDto> tempMap) {
        List<String> orderedKeys = Arrays.asList(
                "ty", "ngo", "mui", "than", "dau", "tuat", "hoi", "ty_b", "suu", "dan", "mao", "thin"
        );
        Map<String, CungDto> laSoMap = new LinkedHashMap<>();
        for (String key : orderedKeys) {
            if (tempMap.containsKey(key)) {
                laSoMap.put(key, tempMap.get(key));
            }
        }

        return laSoMap;
    }

    private String cleanText(String text) {
        if (text == null) return "";
        return text.replaceAll("\\s+", " ").trim();
    }

    private String resolveCungKey(String fullCungName) {
        for (Map.Entry<String, String> entry : CUNG_KEYS.entrySet()) {
            if (fullCungName.endsWith(entry.getKey())) {
                return entry.getValue();
            }
        }

        return null;
    }
}
