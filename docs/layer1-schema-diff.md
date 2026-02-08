# Layer 1 Schema Diff Report

Generated: 2026-02-08T16:25:03.857Z

- **Tables in code**: 95
- **Tables in DB**: 95
- **Tables in both**: 95

## Tables Only in Code (not in DB)

_None — all code tables exist in the database._

## Tables Only in DB (not in code)

_None — all DB tables are defined in code._

## Column-Level Comparison

### `ai_jobs` — 2 issue(s)

  - ⚠️ Column `job_type`: type mismatch — code=`text` db=`job_type`
  - ⚠️ Column `status`: type mismatch — code=`text` db=`job_status`

### `ai_sessions` — 1 issue(s)

  - ⚠️ Column `memory_mode_at_start`: type mismatch — code=`text` db=`memory_mode`

### `ai_users` — 1 issue(s)

  - ⚠️ Column `memory_mode`: type mismatch — code=`text` db=`memory_mode`

### `case_deadlines` — 1 issue(s)

  - ⚠️ Column `status`: type mismatch — code=`text` db=`deadline_status`

### `case_shares` — 1 issue(s)

  - ⚠️ Column `role`: type mismatch — code=`text` db=`case_share_role`

### `claim_cases` — 2 issue(s)

  - ⚠️ Column `case_type`: type mismatch — code=`text` db=`claim_track`
  - ⚠️ Column `claim_type`: type mismatch — code=`text` db=`claim_type`

### `claim_sessions` — 3 issue(s)

  - ⚠️ Column `claim_type`: type mismatch — code=`text` db=`claim_type`
  - ⚠️ Column `evidence_level`: type mismatch — code=`text` db=`evidence_level`
  - ⚠️ Column `track`: type mismatch — code=`text` db=`claim_track`

### `claim_tasks` — 1 issue(s)

  - ⚠️ Column `status`: type mismatch — code=`text` db=`claim_task_status`

### `csu_audit_trail` — 1 issue(s)

  - ⚠️ Column `event_type`: type mismatch — code=`text` db=`audit_event_type`

### `csu_envelopes` — 1 issue(s)

  - ⚠️ Column `routing_type`: type mismatch — code=`text` db=`routing_type`

### `events` — 1 issue(s)

  - ⚠️ Column `payload`: type mismatch — code=`json` db=`jsonb`

### `identity_map` — 2 issue(s)

  - ⚠️ Column `identity_id`: type mismatch — code=`text` db=`uuid`
  - ⚠️ Column `source`: type mismatch — code=`text` db=`identity_source`

### `media_pipelines` — 2 issue(s)

  - ⚠️ Column `pipeline_type`: type mismatch — code=`text` db=`pipeline_type`
  - ⚠️ Column `status`: type mismatch — code=`text` db=`pipeline_status`

### `pipeline_steps` — 1 issue(s)

  - ⚠️ Column `status`: type mismatch — code=`text` db=`step_status`

### `sessions` — 1 issue(s)

  - ⚠️ Column `sess`: type mismatch — code=`json` db=`jsonb`

## Foreign Key Analysis

_All foreign keys match between code and database._

## Summary

| Metric | Count |
|--------|-------|
| Tables only in code | 0 |
| Tables only in DB | 0 |
| Tables in both | 95 |
| Tables with column issues | 15 |
| Tables with FK issues | 0 |
| Total issues | 21 |
