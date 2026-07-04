# SOULMAP MVP Demo Plan

## 1. Muc tieu MVP Demo

MVP demo cua SOULMAP can chung minh duoc gia tri cot loi:

- User lam bai test MBTI.
- User nhap thong tin ngay sinh/gio sinh.
- Backend sinh duoc la so tu API hien co.
- AI tong hop MBTI va la so de tao SoulMap.
- User xem Journey dau tien: Su nghiep.
- User chat voi AI Mentor dua tren SoulMap va Career Journey.

MVP nay khong can xay dung day du toan bo he sinh thai SOULMAP. Muc tieu la tao mot demo end-to-end ro rang, de khach hang thay duoc san pham hoat dong va gia tri khac biet so voi website MBTI hoac tu vi thong thuong.

## 2. Nhung Thu Da Co

Stack va tai san hien co:

- Backend: Spring Boot.
- Frontend: Next.js.
- MBTI test: da co 40 cau hoi.
- Logic tinh MBTI: dang xu ly o frontend.
- La so: backend da co API tra ve ket qua day du cua 1 la so.
- AI service: Python.

Voi hien trang nay, kien truc nen giu Spring Boot lam backend trung tam. Python AI service chi xu ly AI, prompt va goi model.

## 3. Scope MVP

Trong ban demo dau tien, chi lam cac phan sau:

- MBTI test.
- Nhap thong tin sinh.
- Sinh la so tu backend.
- Sinh SoulMap.
- Sinh Journey Su nghiep.
- AI chat theo ngu canh SoulMap va Journey Su nghiep.

Chua can lam:

- Journey Tinh yeu.
- Journey Hanh trinh cuoc doi.
- Big Five.
- Astrology ngoai he thong la so hien co.
- Numerology.
- Payment.
- Marketplace.
- Mobile app.
- RAG voi tai lieu rieng.
- LangGraph workflow phuc tap.

## 4. Kien Truc Tong The

```text
Next.js Frontend
  |
  | REST API
  v
Spring Boot Backend
  |
  | HTTP internal API
  v
Python AI Service
  |
  | LLM API
  v
OpenAI / Gemini / Claude / OpenRouter
```

Vai tro cua tung thanh phan:

- Next.js: UI, MBTI test, hien thi SoulMap, Career Journey va AI chat.
- Spring Boot: backend trung tam, luu data, dieu phoi flow, goi API la so, goi Python AI service.
- Python AI Service: tao prompt, goi model, validate output, tra JSON ve backend.
- LLM Provider: model sinh noi dung AI.

## 5. User Flow Demo

```text
Landing / Onboarding
  -> MBTI Test
  -> FE tinh ket qua MBTI
  -> Gui MBTI result ve Spring Boot
  -> Nhap ngay sinh/gio sinh
  -> Spring Boot sinh la so
  -> Generate SoulMap
  -> Xem SoulMap
  -> Generate Career Journey
  -> Xem Career Journey
  -> Chat voi AI Mentor
```

Flow chi tiet:

1. User vao landing page.
2. User lam 40 cau MBTI.
3. Frontend tinh ra MBTI type va score tung truc.
4. Frontend gui ket qua MBTI ve backend.
5. User nhap ngay sinh, gio sinh va cac thong tin can thiet.
6. Backend luu birth profile va goi API sinh la so.
7. Backend gom MBTI result va la so.
8. Backend goi Python AI service de sinh SoulMap.
9. Backend luu SoulMap va tra ve frontend.
10. User xem SoulMap.
11. User bam mo Journey Su nghiep.
12. Backend goi Python AI service de sinh Career Journey.
13. Backend luu Career Journey va tra ve frontend.
14. User chat voi AI Mentor.
15. Backend gui SoulMap, Career Journey va lich su chat sang Python AI service.
16. Python AI service goi model va tra cau tra loi.
17. Backend luu chat message va tra ve frontend.

## 6. Phan Chia Trach Nhiem

## 6.1 Next.js Frontend

Frontend phu trach:

- Hien thi landing/onboarding.
- Hien thi 40 cau hoi MBTI.
- Tinh ket qua MBTI tren client.
- Gui MBTI result ve Spring Boot.
- Form nhap ngay sinh/gio sinh.
- Hien thi generating/loading state.
- Hien thi SoulMap.
- Hien thi Career Journey.
- Hien thi AI Mentor chat.
- Hien thi suggested prompts cho chat.

Frontend khong nen:

- Goi truc tiep LLM provider.
- Goi truc tiep Python AI service.
- Xu ly prompt.
- Luu long-term data.

Ly do: tranh lo API key, tranh logic AI bi phan tan va giu backend la noi dieu phoi chinh.

## 6.2 Spring Boot Backend

Spring Boot phu trach:

- Quan ly user hoac anonymous session.
- Nhan va luu MBTI result tu frontend.
- Nhan va luu birth profile.
- Goi API sinh la so hien co.
- Luu full response la so.
- Chuan hoa du lieu la so thanh context cho AI.
- Goi Python AI service.
- Luu SoulMap.
- Luu Career Journey.
- Luu chat sessions va chat messages.
- Luu AI generation logs de debug.

Spring Boot nen la noi nam flow nghiep vu chinh.

## 6.3 Python AI Service

Python AI service phu trach:

- Quan ly prompt templates.
- Build prompt tu input backend gui sang.
- Goi LLM provider.
- Parse output.
- Validate output bang Pydantic.
- Retry khi output loi JSON.
- Tra structured JSON ve Spring Boot.

Trong MVP, Python AI service khong nen quan ly database chinh. Neu can log noi bo thi chi log request/response ky thuat, con data nghiep vu van nen luu o Spring Boot.

## 7. Backend API De Xuat

## 7.1 Luu Ket Qua MBTI

```http
POST /api/mbti-results
```

Request:

```json
{
  "type": "INFJ",
  "scores": {
    "E": 35,
    "I": 65,
    "S": 40,
    "N": 60,
    "T": 45,
    "F": 55,
    "J": 70,
    "P": 30
  },
  "answers": [
    {
      "questionId": "q1",
      "value": 4
    }
  ]
}
```

Response:

```json
{
  "id": "mbti_result_id",
  "type": "INFJ"
}
```

Backend nen luu ca raw answers de sau nay audit hoac doi logic scoring.

## 7.2 Tao Birth Profile Va La So

```http
POST /api/birth-profiles
```

Request:

```json
{
  "birthDate": "2002-05-21",
  "birthTime": "08:30",
  "birthPlace": "Ho Chi Minh City",
  "gender": "male"
}
```

Backend xu ly:

- Luu birth profile.
- Goi API la so hien co.
- Luu full astrology chart JSON.

Response:

```json
{
  "birthProfileId": "birth_profile_id",
  "astrologyChartId": "chart_id",
  "chartGenerated": true
}
```

## 7.3 Generate SoulMap

```http
POST /api/soulmaps/generate
```

Request:

```json
{
  "mbtiResultId": "mbti_result_id",
  "birthProfileId": "birth_profile_id",
  "astrologyChartId": "chart_id"
}
```

Backend xu ly:

- Load MBTI result.
- Load birth profile.
- Load astrology chart.
- Tao AstrologyAIContext rut gon.
- Goi Python AI service.
- Validate response co cac field bat buoc.
- Luu SoulMap.

Response:

```json
{
  "soulmapId": "soulmap_id",
  "content": {}
}
```

## 7.4 Generate Career Journey

```http
POST /api/journeys/career/generate
```

Request:

```json
{
  "soulmapId": "soulmap_id"
}
```

Backend xu ly:

- Load SoulMap.
- Load MBTI result.
- Load astrology context lien quan su nghiep.
- Goi Python AI service.
- Validate response.
- Luu Journey voi type la `career`.

Response:

```json
{
  "journeyId": "journey_id",
  "type": "career",
  "content": {}
}
```

## 7.5 Chat Session

```http
POST /api/chat/sessions
```

Request:

```json
{
  "soulmapId": "soulmap_id",
  "journeyId": "career_journey_id"
}
```

Response:

```json
{
  "chatSessionId": "chat_session_id"
}
```

## 7.6 Gui Chat Message

```http
POST /api/chat/sessions/{chatSessionId}/messages
```

Request:

```json
{
  "message": "Toi co phu hop lam Product Manager khong?"
}
```

Backend xu ly:

- Luu user message.
- Load SoulMap.
- Load Career Journey.
- Load recent chat history.
- Goi Python AI service.
- Luu assistant message.
- Tra response ve frontend.

Response:

```json
{
  "answer": "Dua tren SoulMap va Journey Su nghiep cua ban...",
  "suggestedFollowups": [
    "Toi nen hoc ky nang gi trong 3 thang toi?",
    "Toi hop startup hay corporate hon?"
  ]
}
```

Streaming chat co the them sau bang SSE hoac WebSocket. Ban MVP demo co the dung response thuong de giam do phuc tap.

## 8. Database Entities De Xuat

## 8.1 mbti_results

```text
id
user_id/session_id
mbti_type
scores_json
answers_json
created_at
```

## 8.2 birth_profiles

```text
id
user_id/session_id
birth_date
birth_time
birth_place
created_at
```

## 8.3 astrology_charts

```text
id
user_id/session_id
birth_profile_id
chart_json
created_at
```

## 8.4 soulmaps

```text
id
user_id/session_id
mbti_result_id
birth_profile_id
astrology_chart_id
content_json
model_name
prompt_version
status
created_at
updated_at
```

## 8.5 journeys

```text
id
user_id/session_id
soulmap_id
type
content_json
model_name
prompt_version
status
created_at
updated_at
```

Trong MVP:

```text
type = career
```

Sau nay co the them:

```text
type = self
type = relationship
type = life
```

## 8.6 chat_sessions

```text
id
user_id/session_id
soulmap_id
journey_id
title
created_at
updated_at
```

## 8.7 chat_messages

```text
id
chat_session_id
role
content
metadata_json
created_at
```

## 8.8 ai_generations

```text
id
user_id/session_id
generation_type
request_json
response_json
raw_output
model_name
prompt_version
latency_ms
status
error_message
created_at
```

Bang `ai_generations` rat quan trong cho demo vi giup debug khi AI tra output loi, cham hoac khong dung schema.

## 9. Python AI Service Design

De xuat dung FastAPI cho AI service.

Cau truc thu muc:

```text
ai-service/
  app/
    main.py
    routes/
      soulmap.py
      journey.py
      chat.py
    services/
      llm_client.py
      soulmap_generator.py
      career_journey_generator.py
      mentor_chat.py
    prompts/
      soulmap_v1.md
      career_journey_v1.md
      mentor_chat_v1.md
    schemas/
      soulmap.py
      career_journey.py
      chat.py
    core/
      config.py
      logging.py
```

Endpoints:

```http
POST /ai/soulmap/generate
POST /ai/journeys/career/generate
POST /ai/chat
```

Trong MVP, moi endpoint co the la mot direct model call rieng.

## 10. LangChain Hay LangGraph

Ket luan cho MVP:

```text
Chua can LangGraph.
Co the chua can LangChain.
```

Ly do:

- Generate SoulMap la 1 flow don gian.
- Generate Career Journey la 1 flow don gian.
- Chat hien tai chi can lay context va goi model.
- Chua co RAG.
- Chua co tool calling phuc tap.
- Chua co multi-step agent workflow.

Nen lam trong MVP:

- Direct LLM call.
- Prompt templates thu cong.
- Pydantic validation.
- Retry 1 lan khi JSON loi.
- Logging day du.

Sau demo, khi co tai lieu rieng:

- Dung LangChain cho document loader, chunking, embeddings, retriever, prompt composition.
- Dung vector DB nhu pgvector hoac Qdrant.

Khi AI Mentor phuc tap hon:

- Dung LangGraph de build workflow classify intent, retrieve context, route theo Journey, generate answer, safety check va save memory.

## 11. AI Output Schemas

## 11.1 SoulMap Schema

```json
{
  "coreSelf": {
    "archetype": "Nguoi dinh huong sau sac",
    "oneLineSummary": "...",
    "description": "...",
    "strengths": [],
    "blindSpots": [],
    "motivations": []
  },
  "sourceSignals": {
    "mbti": {
      "type": "INFJ",
      "contribution": 60,
      "notes": "..."
    },
    "astrology": {
      "contribution": 40,
      "notes": "..."
    }
  },
  "journeyPreviews": {
    "career": {
      "title": "Su nghiep",
      "summary": "...",
      "unlocked": true
    },
    "relationship": {
      "title": "Tinh yeu",
      "summary": "Se mo sau",
      "unlocked": false
    },
    "life": {
      "title": "Hanh trinh cuoc doi",
      "summary": "Se mo sau",
      "unlocked": false
    }
  }
}
```

## 11.2 Career Journey Schema

```json
{
  "title": "Ban do su nghiep cua ban",
  "summary": "...",
  "careerFits": [
    {
      "role": "Product Manager",
      "fitScore": 84,
      "reason": "...",
      "validationAction": "..."
    }
  ],
  "workStyle": {
    "bestEnvironments": [],
    "avoidEnvironments": [],
    "collaborationStyle": "...",
    "decisionMakingStyle": "..."
  },
  "strengthsAtWork": [
    {
      "title": "...",
      "description": "..."
    }
  ],
  "growthAreas": [
    {
      "title": "...",
      "whyItMatters": "...",
      "practice": "..."
    }
  ],
  "careerRisks": [
    {
      "risk": "...",
      "signal": "...",
      "prevention": "..."
    }
  ],
  "nextActions": [
    {
      "timeframe": "7 ngay",
      "action": "...",
      "expectedOutcome": "..."
    }
  ]
}
```

## 11.3 Mentor Chat Schema

```json
{
  "answer": "...",
  "suggestedFollowups": [],
  "referencedSections": []
}
```

## 12. Cach Dung La So Trong AI

Backend da co API tra ve day du la so. Tuy nhien khong nen gui toan bo raw la so sang AI trong moi request neu qua dai.

Nen tao mot object rut gon:

```text
AstrologyAIContext
```

Voi MVP Career Journey, chi can uu tien:

- Cung Menh.
- Cung Quan Loc.
- Cung Tai Bach.
- Cung Phuc Duc neu can.
- Dai van/current period neu API la so co tra.
- Cac sao hoac luan giai lien quan cong viec, tai chinh, cach phat trien.

Khong nen de AI tra loi theo huong dinh menh. La so nen duoc xem la mot nguon tham chieu, khong phai ket luan tuyet doi.

Wording nen dung:

```text
Du lieu la so goi y rang...
Mot cach dien giai phu hop la...
Ban co the can nhac...
```

Khong nen dung:

```text
So ban chac chan...
Ban nhat dinh se...
Ban khong the...
```

## 13. Prompt Principles

Tat ca prompt nen tuan theo cac nguyen tac:

- Khong dong vai thay boi.
- Khong du doan tuong lai mot cach tuyet doi.
- Khong dua ra chan doan tam ly/y te.
- Khong dua loi khuyen quyet dinh lon theo kieu bat buoc.
- Tap trung vao self-awareness, reflection va dinh huong.
- Noi bang ngon ngu than thien, ro rang, co tinh dong hanh.
- Neu dua goi y nghe nghiep, phai co hanh dong kiem chung.

Vi du tot:

```text
Ban co xu huong phu hop voi moi truong cho phep phan tich sau, lam viec co muc tieu ro rang va co khong gian de tu chu. De kiem chung, ban co the thu mot project nho lien quan den nghien cuu nguoi dung hoac lap ke hoach san pham trong 2 tuan.
```

Vi du khong nen:

```text
Ban sinh ra de lam Product Manager va se thanh cong neu theo nghe nay.
```

## 14. AI Chat Context

Khi user chat, Spring Boot nen gui sang Python AI service:

```json
{
  "userProfile": {
    "mbti": {},
    "birthProfile": {}
  },
  "soulmap": {},
  "careerJourney": {},
  "astrologyContext": {},
  "recentMessages": [
    {
      "role": "user",
      "content": "..."
    },
    {
      "role": "assistant",
      "content": "..."
    }
  ],
  "message": "Toi co phu hop lam Product Manager khong?"
}
```

Chat prompt nen yeu cau AI:

- Tra loi dua tren SoulMap va Career Journey.
- Khong lap lai toan bo profile neu khong can.
- Neu cau hoi ve nghe nghiep, uu tien Career Journey.
- Neu thieu du lieu, hoi lai toi da 1 cau.
- Ket thuc bang 1-2 hanh dong cu the.
- Tra ve suggested follow-up questions.

## 15. Frontend Pages

De xuat cac route trong Next.js:

```text
/
  Landing

/mbti
  40 cau MBTI

/birth
  Nhap ngay sinh/gio sinh

/generate
  Loading tao SoulMap

/soulmap/[id]
  Hien thi SoulMap

/soulmap/[id]/career
  Career Journey

/chat/[sessionId]
  AI Mentor chat
```

Voi demo, co the gop Career Journey va Chat vao cung trang:

```text
/soulmap/[id]/career
```

Layout goi y:

```text
Left side: Career Journey
Right side: AI Mentor chat
```

Layout nay phu hop demo vi khach hang thay duoc insight va kha nang hoi tiep ngay tren cung mot man hinh.

## 16. UI Can Uu Tien

## 16.1 Landing

Thong diep:

```text
SOULMAP giup ban bien MBTI va du lieu ngay sinh thanh ban do ca nhan hoa de hieu ban than va dinh huong su nghiep.
```

CTA:

```text
Bat dau kham pha
```

## 16.2 MBTI Test

Can co:

- Progress bar.
- 40 cau hoi.
- Lua chon dang thang diem.
- Man hinh ket qua MBTI ngan gon.

## 16.3 Birth Form

Can co:

- Ngay sinh.
- Gio sinh.
- Gioi tinh neu API la so can.
- Noi sinh neu API la so can.

## 16.4 Generating Screen

Man hinh nay quan trong cho cam xuc demo.

Nen hien thi cac buoc:

```text
Dang phan tich MBTI...
Dang doc du lieu la so...
Dang tong hop Core Self...
Dang xay dung Journey Su nghiep...
```

## 16.5 SoulMap Page

MVP khong can canvas phuc tap. Co the dung card layout:

- Core Self.
- Strengths.
- Blind Spots.
- Motivations.
- Career Preview unlocked.
- Relationship locked.
- Life Journey locked.

CTA:

```text
Kham pha Journey Su nghiep
```

## 16.6 Career Journey Page

Can co cac section:

- Summary.
- Top Career Fits.
- Work Style.
- Best Environments.
- Growth Areas.
- Career Risks.
- Next Actions.

## 16.7 AI Chat

Suggested prompts:

- Toi co phu hop lam Product Manager khong?
- Toi nen chon startup hay corporate?
- Toi nen hoc ky nang gi trong 3 thang toi?
- Diem yeu nghe nghiep lon nhat cua toi la gi?

## 17. Roadmap Trien Khai

## Phase 1: Chot Data Contract

Muc tieu:

- Chot format MBTI result frontend gui ve backend.
- Chot format birth profile.
- Chot format la so rut gon cho AI.
- Chot schema SoulMap.
- Chot schema Career Journey.
- Chot schema Chat response.

Deliverable:

```text
API contract ro rang giua FE, Spring Boot va Python AI service.
```

## Phase 2: Backend Luu MBTI, Birth Profile Va La So

Muc tieu:

- FE gui MBTI result.
- Backend luu MBTI result.
- FE gui birth data.
- Backend goi API la so.
- Backend luu full chart.

Deliverable:

```text
Moi user/session co du input de sinh SoulMap.
```

## Phase 3: Python AI Service Sinh SoulMap

Muc tieu:

- Tao prompt `soulmap_v1.md`.
- Tao Pydantic schema.
- Goi model truc tiep.
- Validate JSON output.
- Retry khi output loi.

Deliverable:

```text
Python AI service tra ve SoulMap JSON on dinh.
```

## Phase 4: Backend Goi AI Service Va Luu SoulMap

Muc tieu:

- Spring Boot tao client goi Python service.
- Tao endpoint generate SoulMap.
- Luu SoulMap.
- Luu AI generation log.

Deliverable:

```text
FE co the goi backend de sinh va xem SoulMap.
```

## Phase 5: Career Journey

Muc tieu:

- Tao prompt `career_journey_v1.md`.
- Tao Pydantic schema.
- Backend endpoint generate Career Journey.
- Luu Journey type `career`.
- FE render Career Journey.

Deliverable:

```text
User mo duoc Journey Su nghiep sau khi co SoulMap.
```

## Phase 6: AI Mentor Chat

Muc tieu:

- Tao prompt `mentor_chat_v1.md`.
- Tao chat session API.
- Tao send message API.
- Backend load SoulMap, Career Journey va recent messages.
- Python AI service tra response.
- Backend luu messages.
- FE hien thi chat.

Deliverable:

```text
User hoi AI Mentor ve su nghiep va nhan cau tra loi theo context ca nhan.
```

## Phase 7: Demo Polish

Muc tieu:

- Loading screen dep hon.
- Empty/error states.
- Suggested prompts.
- Cache ket qua da generate.
- Seed demo data neu can.
- Kiem tra prompt va output chat.

Deliverable:

```text
Demo end-to-end on dinh cho khach hang.
```

## 18. RAG Sau Demo

Sau khi co tai lieu rieng de AI tra loi focus va chinh xac hon, them RAG trong Python AI service.

Pipeline:

```text
Documents
  -> Chunking
  -> Embedding
  -> Vector DB
  -> Retrieval
  -> Inject vao prompt
  -> Generate answer
```

Nguon tai lieu co the gom:

- Tai lieu SOULMAP methodology.
- Tai lieu MBTI.
- Tai lieu Career Journey.
- Tai lieu cach dien giai la so cho tung Journey.
- Prompt guidelines.

Vector DB de xuat:

- pgvector neu backend dang dung PostgreSQL.
- Qdrant neu muon tach rieng vector service.

LangChain nen duoc dung o phase nay de xu ly:

- Document loader.
- Text splitter.
- Embeddings.
- Retriever.
- Prompt composition.

LangGraph chi nen them khi can workflow phuc tap hon:

```text
User question
  -> Classify intent
  -> Load user memory
  -> Retrieve docs
  -> Route theo Journey
  -> Generate answer
  -> Safety check
  -> Save memory
```

## 19. Rủi Ro Va Cach Xu Ly

## 19.1 AI Output Loi JSON

Cach xu ly:

- Bat model tra JSON theo schema.
- Validate bang Pydantic.
- Retry 1 lan voi prompt sua loi JSON.
- Log raw output vao `ai_generations`.

## 19.2 La So Qua Dai Lam Prompt Loang

Cach xu ly:

- Rut gon thanh AstrologyAIContext.
- Career Journey chi dung cac phan lien quan su nghiep.
- Khong gui toan bo chart neu khong can.

## 19.3 Chat Tra Loi Chung Chung

Cach xu ly:

- Inject SoulMap va Career Journey vao context.
- Prompt yeu cau reference insight cu the.
- Dung suggested prompts tap trung vao nghe nghiep.

## 19.4 Demo Cham Do Goi AI

Cach xu ly:

- Hien thi generating screen nhieu buoc.
- Cache SoulMap va Journey da sinh.
- Khong regenerate neu da co content.
- Dat timeout hop ly.

## 19.5 Frontend Tinh MBTI Nhung Backend Khong Verify

Cach xu ly:

- Luu raw answers.
- Luu scores tung truc.
- Sau nay co the them backend verification neu can.

## 20. Demo Script Goi Y

1. Mo landing page.

```text
SOULMAP khong phai website xem tu vi hay MBTI thong thuong. San pham bien du lieu ca nhan thanh ban do hieu ban than va dinh huong phat trien bang AI.
```

2. Lam MBTI test.

```text
He thong dau tien hieu cach nguoi dung suy nghi, ra quyet dinh va tuong tac.
```

3. Nhap thong tin sinh.

```text
Du lieu ngay sinh giup bo sung mot lop tham chieu khac cho AI.
```

4. Sinh SoulMap.

```text
AI tong hop MBTI va la so thanh Core Self va cac Journey.
```

5. Mo Career Journey.

```text
MVP tap trung vao Journey co gia tri thuc te cao nhat: Su nghiep.
```

6. Chat voi AI Mentor.

```text
Trai nghiem khong ket thuc o bao cao tinh. User co the tiep tuc hoi AI dua tren chinh SoulMap va Career Journey cua minh.
```

## 21. Ket Luan

Voi stack hien co, cach lam tot nhat cho MVP demo la:

- Next.js xu ly UI va MBTI test.
- Spring Boot lam backend trung tam va dieu phoi nghiep vu.
- Backend su dung API la so hien co de lay du lieu dau vao.
- Python AI service xu ly prompt, model call va structured output.
- MVP chi call thang model, chua can LangChain hoac LangGraph.
- Sau demo moi them RAG bang LangChain.
- Khi AI Mentor can workflow phuc tap, moi them LangGraph.

Uu tien quan trong nhat la co mot flow end-to-end on dinh:

```text
MBTI + ngay sinh -> la so -> SoulMap -> Career Journey -> AI Mentor chat
```
