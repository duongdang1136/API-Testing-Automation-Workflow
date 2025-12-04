# Database Schema Design

## users
- `id` (PK)
- `email` (unique)
- `password_hash`
- `name`
- `role` (owner/admin/editor/viewer/qc/ba/developer)
- `status`
- `last_login_at`
- `created_at`, `updated_at`

## projects
- `id` (PK)
- `name`
- `description`
- `status` (active/archived/draft)
- `created_by` (FK `users`)
- `created_at`, `updated_at`

## project_members
- `project_id` (FK `projects`)
- `user_id` (FK `users`)
- `role` (owner/admin/editor/viewer)
- `joined_at`
- `invited_by`
- `status`

## api_specs
- `id`
- `project_id` (FK)
- `feature_id` (nullable FK)
- `name`
- `endpoint`
- `method`
- `description`
- `source_type` (template/custom/import)
- `swagger_url`
- `created_by`
- `created_at`, `updated_at`

### api_fields
- `id`
- `api_spec_id` (FK)
- `name`
- `data_type`
- `required`
- `validation`
- `example`

### api_status_codes
- `id`
- `api_spec_id` (FK)
- `code`
- `description`
- `scenario`

### api_business_rules
- `id`
- `api_spec_id` (FK)
- `rule_text`

## features
- `id`
- `project_id` (FK)
- `name`
- `description`
- `status` (pending/in-progress/completed)
- `created_by`
- `created_at`, `updated_at`
- `current_generation_step` (requirements/scripts/json/completed)

### feature_api_specs
- `feature_id` (FK)
- `api_spec_id` (FK)

## test_requirements
- `id`
- `feature_id` (FK)
- `api_spec_id` (FK)
- `title`
- `description`
- `test_type` (happy/validation/exception/business_rule)
- `priority`
- `generated_by`
- `generated_at`, `updated_at`
- `status`

### test_requirement_criteria
- `id`
- `test_requirement_id` (FK)
- `description`
- `order_index`

## test_scripts
- `id`
- `feature_id` (FK)
- `test_requirement_id` (FK)
- `language`
- `framework`
- `title`
- `description`
- `code`
- `mock_data` (JSONB)
- `generated_by`
- `generated_at`, `updated_at`
- `status`

### test_script_steps
- `id`
- `test_script_id` (FK)
- `order_index`
- `action`
- `input` (JSONB)
- `expected_output` (JSONB)
- `assertion`

## postman_collections
- `id`
- `feature_id` (FK)
- `project_id` (FK)
- `name`
- `description`
- `raw_json` (JSONB)
- `schema_url`
- `mock_server_url`
- `generated_by`
- `generated_at`

## versions
- `id`
- `project_id` (FK)
- `feature_id` (nullable FK)
- `version_number`
- `title`
- `description`
- `status` (draft/published/deprecated)
- `created_by`
- `created_at`
- `postman_collection_id` (FK)

### version_changes
- `id`
- `version_id` (FK)
- `change_type` (added/modified/removed/fixed)
- `description`
- `timestamp`
- `related_requirement_id`
- `related_script_id`

## feature_generation_logs
- `id`
- `feature_id` (FK)
- `step`
- `action`
- `status` (success/error/processing)
- `message`
- `created_by`
- `created_at`

## prompt_templates
- `id`
- `title`
- `content`
- `use_case`
- `created_by`
- `created_at`

## uploads
- `id`
- `feature_id` (FK)
- `project_id` (FK)
- `file_name`
- `file_type`
- `storage_url`
- `metadata` (JSONB)
- `uploaded_by`
- `uploaded_at`

## audit_events
- `id`
- `actor_id` (FK `users`)
- `project_id` (FK)
- `entity_type`
- `entity_id`
- `action`
- `details` (JSONB)
- `created_at`

## auth_tokens
- `id`
- `user_id` (FK)
- `token`
- `expires_at`
- `device_info`

Notes:
- Foreign keys s? d?ng `ON DELETE CASCADE` v?i soft delete (`status`/`deleted_at`) cho c�c b?ng quan tr?ng.
- JSONB �p d?ng cho tru?ng `mock_data`, `raw_json`, `metadata`, `details` d? linh ho?t.
- C� th? th�m view t?ng h?p (v� d? `project_stats_view`) ph?c v? Dashboard.
