# SoulMap — Implementation Plans

Tài liệu plan chi tiết cho AI/developer implement các màn hình frontend.

## Danh sách plan

| Plan | File | Step trong flow | Trạng thái |
|------|------|-----------------|------------|
| Kết quả MBTI | [MBTI_RESULT_UI_PLAN.md](./MBTI_RESULT_UI_PLAN.md) | `resultStep === 'mbti_summary'` | Chưa implement |
| 4 Journey ready | [JOURNEYS_READY_UI_PLAN.md](./JOURNEYS_READY_UI_PLAN.md) | `resultStep === 'reveal'` | Chưa implement |

## Flow tổng thể Result Screen

```
mbti_summary  →  birth_form  →  generating  →  reveal  →  full_map
     ↑ MBTI plan                    ↑ Journey plan
```

## File code chính

- `soulmap-web/src/App.tsx` — routing, state `answers`, `profile`, `resultStep`
- `soulmap-web/src/components/ResultScreen.tsx` — render từng step
- `soulmap-web/src/types.ts` — `calculateProfile`, `calculateMbtiScores`

## Product reference

- `docs/core/SOULMAP_TaiLieu_DuAn.md` — 4 Journey definition
- `soulmap-web/src/components/LandingScreen.tsx` — journey pills + pillar assets
