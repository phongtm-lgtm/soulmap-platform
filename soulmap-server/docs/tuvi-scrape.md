# 📋 Hướng dẫn Di chuyển tích hợp API tuvi.vn (HTML Scraping -> REST API)

Tài liệu này hướng dẫn chi tiết cách refactor mã nguồn trong dự án **soulmap-server** từ cơ chế cào giao diện HTML (sử
dụng JSoup) sang cơ chế gọi **REST API** chính thức của `tuvi.vn` để tăng tốc độ tải, tính ổn định và bổ sung thêm nhiều
dữ liệu chi tiết hơn (Cung Thân, Tràng Sinh, Tứ Hóa, Luận giải...).

---

## 🎯 Mục tiêu

Thay thế toàn bộ logic cào dữ liệu cũ bằng Jsoup tại `TuViServiceImpl.java` bằng việc gọi chuỗi 2 API dạng JSON của
`tuvi.vn`:

1. **Tạo lá số (`POST /api/v1/la-so`)** để lấy `slug`.
2. **Lấy chi tiết lá số (`GET /api/v1/la-so/{slug}`)** để lấy data JSON hoàn chỉnh.

---

## 🛠️ Hướng dẫn Ánh xạ Dữ liệu (Request Mappings)

Cấu trúc API gốc cần các tham số khớp với định dạng REST của tuvi.vn. Ta cần map dữ liệu từ `TuViRequest` của backend
sang payload JSON của tuvi.vn.

### Bảng đối chiếu tham số (Mapping)

| REST API `tuvi.vn` | Kiểu dữ liệu | Mô tả                                  | Cách ánh xạ từ `TuViRequest` hiện tại                           |
|:-------------------|:-------------|:---------------------------------------|:----------------------------------------------------------------|
| `name`             | String       | Họ tên                                 | `request.getName()`                                             |
| `day`              | int          | Ngày sinh                              | `request.getDay()`                                              |
| `month`            | int          | Tháng sinh                             | `request.getMonth()`                                            |
| `year`             | int          | Năm sinh                               | `request.getYear()`                                             |
| `solar_calendar`   | boolean      | `true` = Dương lịch, `false` = Âm lịch | `"solar".equalsIgnoreCase(request.getCalendar())`               |
| `hour_id`          | int          | ID Giờ sinh (1-12)                     | Chuyển đổi từ `request.getHour()` (Xem bảng bên dưới)           |
| `male`             | boolean      | `true` = Nam, `false` = Nữ             | `"male".equalsIgnoreCase(request.getGender())`                  |
| `nam_xem`          | int          | Năm muốn xem (≥ 1911)                  | `request.getViewYear()`                                         |
| `thang_xem`        | int          | Tháng muốn xem (1-12)                  | Mặc định là tháng hiện tại hoặc bổ sung `request.getThangXem()` |

### Hàm convert Giờ sinh sang `hour_id`

Giờ trong tử vi tính theo 12 canh giờ (Tý -> Hợi). Thêm hàm helper sau vào `TuViServiceImpl.java`:

```java
private int getHourId(int hour) {
    if (hour >= 23 || hour < 1) return 1;  // Tý
    if (hour >= 1 && hour < 3) return 2;   // Sửu
    if (hour >= 3 && hour < 5) return 3;   // Dần
    if (hour >= 5 && hour < 7) return 4;   // Mão
    if (hour >= 7 && hour < 9) return 5;   // Thìn
    if (hour >= 9 && hour < 11) return 6;  // Tỵ
    if (hour >= 11 && hour < 13) return 7; // Ngọ
    if (hour >= 13 && hour < 15) return 8; // Mùi
    if (hour >= 15 && hour < 17) return 9; // Thân
    if (hour >= 17 && hour < 19) return 10;// Dậu
    if (hour >= 19 && hour < 21) return 11;// Tuất
    return 12;                             // Hợi (21h - 23h)
}
```

---

## 📦 Bước 2: Tạo các Model DTO để nhận JSON từ tuvi.vn

Tạo các Java class mới để deserialize kết quả trả về từ tuvi.vn API.

### 1. `TuViResponse.java` (Response chính)

```java
package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class TuViResponse {
    private String code;
    private String msg;
    private TuViData data;
}
```

### 2. `TuViData.java`

```java
package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class TuViData {
    private Long id;
    private String slug;
    private String hour;

    @JsonProperty("solar_year")
    private int solarYear;
    @JsonProperty("solar_month")
    private int solarMonth;
    @JsonProperty("solar_day")
    private int solarDay;

    @JsonProperty("lunar_year")
    private int lunarYear;
    @JsonProperty("lunar_month")
    private int lunarMonth;
    @JsonProperty("lunar_day")
    private int lunarDay;

    private String gender;

    @JsonProperty("am_duong_cua_ban_menh")
    private String amDuong;
    @JsonProperty("loai_hanh_cua_ban_menh")
    private String loaiHanh;

    @JsonProperty("vi_tri_cung_menh")
    private String viTriCungMenh;
    @JsonProperty("vi_tri_cung_than")
    private String viTriCungThan;

    @JsonProperty("cuc_full")
    private String cucFull;
    @JsonProperty("can_xuong")
    private String canXuong;
    @JsonProperty("lai_nhan_cung")
    private String laiNhanCung;

    @JsonProperty("cung_model")
    private List<CungModel> cungModel;

    @JsonProperty("general_lg")
    private List<LuanGiai> generalLg;
    @JsonProperty("menh_lg")
    private List<LuanGiai> menhLg;
    @JsonProperty("dai_van_lg")
    private List<LuanGiai> daiVanLg;
}
```

### 3. `CungModel.java` (Thông tin chi tiết của 1 cung)

```java
package com.soulmap.server.dto.response.tuvi;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class CungModel {
    private int id;
    private String name; // Tên chi cung (Tý, Sửu...)

    @JsonProperty("full_name")
    private String fullName;
    private CungDetail cung;

    @JsonProperty("dai_van")
    private int daiVan;

    @JsonProperty("chinh_tinh")
    private List<SaoInfo> chinhTinh;
    private List<SaoInfo> sao;

    @JsonProperty("dai_van_text")
    private String daiVanText;
    @JsonProperty("luu_nien")
    private String luuNien;

    @JsonProperty("trang_sinh")
    private TrangSinh trangSinh;
    @JsonProperty("tu_hoa_phais")
    private List<TuHoa> tuHoaPhais;
}
```

### 4. Các class hỗ trợ nhỏ (`CungDetail.java`, `SaoInfo.java`, `TrangSinh.java`, `TuHoa.java`, `LuanGiai.java`)

```java
package com.soulmap.server.dto.response.tuvi;

import lombok.Data;

@Data
class CungDetail {
    private int id;
    private String name; // Tên cung chức năng (Mệnh, Phụ Mẫu...)
    private String slug;
}

@Data
class SaoInfo {
    private Sao sao;
}

@Data
class Sao {
    private int id;
    private String name;
    private String colorCode;
    private String status; // "C" = tốt, "H" = xấu
}

@Data
class TrangSinh {
    private String name;
}

@Data
class TuHoa {
    private Sao sao;
    private String cung; // Cung chịu ảnh hưởng của Tứ Hóa
}

@Data
class LuanGiai {
    private String title;
    private String content;
}
```

---

## ⚡ Bước 3: Triển khai gọi API mới trong `TuViServiceImpl.java`

Thay đổi hàm `getLaSo` sử dụng WebClient để gửi request JSON trực tiếp:

```java
package com.soulmap.server.service.impl;

import com.soulmap.server.common.error.TuViSourceException;
import com.soulmap.server.dto.request.TuViRequest;
import com.soulmap.server.dto.response.CungDto;
import com.soulmap.server.dto.response.tuvi.TuViResponse;
import com.soulmap.server.dto.response.tuvi.TuViData;
import com.soulmap.server.dto.response.tuvi.CungModel;
import com.soulmap.server.service.TuViService;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TuViServiceImpl implements TuViService {

    private final WebClient webClient;

    public TuViServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://tuvi.vn/api/v1")
                .defaultHeader("User-Agent", "Mozilla/5.0")
                .build();
    }

    @Override
    public Map<String, CungDto> getLaSo(TuViRequest request) {
        try {
            // 1. Tạo Map request body cho API POST
            Map<String, Object> body = new HashMap<>();
            body.put("name", request.getName());
            body.put("day", request.getDay());
            body.put("month", request.getMonth());
            body.put("year", request.getYear());
            body.put("solar_calendar", "solar".equalsIgnoreCase(request.getCalendar()));
            body.put("hour_id", getHourId(request.getHour()));
            body.put("male", "male".equalsIgnoreCase(request.getGender()));
            body.put("nam_xem", request.getViewYear());
            body.put("thang_xem", 7); // mặc định hoặc map tương tự

            // 2. Bước 1: POST lấy slug
            TuViResponse createResponse = webClient.post()
                    .uri("/la-so")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(TuViResponse.class)
                    .block();

            if (createResponse == null || !"200".equals(createResponse.getCode())) {
                throw new TuViSourceException("Lỗi khởi tạo lá số từ tuvi.vn");
            }

            String slug = createResponse.getData().getSlug();

            // 3. Bước 2: GET chi tiết lá số bằng slug
            TuViResponse detailResponse = webClient.get()
                    .uri("/la-so/" + slug)
                    .retrieve()
                    .bodyToMono(TuViResponse.class)
                    .block();

            if (detailResponse == null || detailResponse.getData() == null) {
                throw new TuViSourceException("Không thể lấy chi tiết lá số");
            }

            // 4. Map từ DTO gốc của tuvi.vn về Map<String, CungDto> cũ để tránh lỗi controller
            return transformToCungDtoMap(detailResponse.getData());

        } catch (Exception e) {
            throw new TuViSourceException("Lỗi kết nối API tuvi.vn: " + e.getMessage(), e);
        }
    }

    private Map<String, CungDto> transformToCungDtoMap(TuViData data) {
        Map<String, CungDto> result = new LinkedHashMap<>();

        // Sắp xếp các cung theo thứ tự của dự án cũ
        List<String> orderedKeys = Arrays.asList(
                "ty", "ngo", "mui", "than", "dau", "tuat", "hoi", "ty_b", "suu", "dan", "mao", "thin"
        );

        // Map chuyển đổi key của tuvi.vn sang key dự án cũ
        Map<String, String> keyMapping = Map.ofEntries(
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

        Map<String, CungModel> cungMap = data.getCungModel().stream()
                .collect(Collectors.toMap(CungModel::getName, cm -> cm));

        for (String projectKey : orderedKeys) {
            String chiName = keyMapping.entrySet().stream()
                    .filter(entry -> entry.getValue().equals(projectKey))
                    .map(Map.Entry::getKey)
                    .findFirst()
                    .orElse("");

            CungModel cm = cungMap.get(chiName);
            if (cm != null) {
                List<String> catTinh = new ArrayList<>();
                List<String> hungTinh = new ArrayList<>();

                if (cm.getSao() != null) {
                    for (SaoInfo si : cm.getSao()) {
                        if (si.getSao() != null) {
                            if ("C".equals(si.getSao().getStatus())) {
                                catTinh.add(si.getSao().getName());
                            } else {
                                hungTinh.add(si.getSao().getName());
                            }
                        }
                    }
                }

                List<String> chinhTinh = cm.getChinhTinh() == null ? new ArrayList<>() :
                        cm.getChinhTinh().stream()
                                .map(si -> si.getSao().getName())
                                .collect(Collectors.toList());

                CungDto cungDto = CungDto.builder()
                        .gridClass("cung-" + projectKey.replace("_", "-"))
                        .name(cm.getCung() != null ? cm.getCung().getName() : "")
                        .diaChi(cm.getFullName())
                        .hanhCung(cm.getCung() != null ? cm.getFullName() : "")
                        .daiVan(String.valueOf(cm.getDaiVan()))
                        .tieuVan(cm.getLuuNien())
                        .chinhTinh(chinhTinh)
                        .catTinh(catTinh)
                        .hungTinh(hungTinh)
                        .build();

                result.put(projectKey, cungDto);
            }
        }
        return result;
    }

    private int getHourId(int hour) {
        if (hour >= 23 || hour < 1) return 1;
        if (hour >= 1 && hour < 3) return 2;
        if (hour >= 3 && hour < 5) return 3;
        if (hour >= 5 && hour < 7) return 4;
        if (hour >= 7 && hour < 9) return 5;
        if (hour >= 9 && hour < 11) return 6;
        if (hour >= 11 && hour < 13) return 7;
        if (hour >= 13 && hour < 15) return 8;
        if (hour >= 15 && hour < 17) return 9;
        if (hour >= 17 && hour < 19) return 10;
        if (hour >= 19 && hour < 21) return 11;
        return 12;
    }
}
```
