# Build Plan

## App Summary
- Name: tag-interaction-widget
- Type: processor
- Description: Allows a user to read/write tag values using a widget
- User Note: User requested bare minimum, empty starting point for heavy customization

## External Integration
- Service: None
- Documentation: N/A
- Authentication: N/A

## Data Flow
- Inputs: Channel messages via ManySubscriptionConfig (user-configurable channel subscriptions)
- Processing: Reads incoming messages and gets/sets tag values accordingly
- Outputs: Tag values via set_tag

## Configuration Schema
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| subscription | ManySubscriptionConfig | no | (none) | Channel subscriptions for incoming messages |

No additional configuration fields. The user wants a minimal starting point they can extend themselves.

### Subscriptions
- Channel pattern: User-configurable via ManySubscriptionConfig
- Message types: All (user will customize)

### Schedule
- Not included. User can add ScheduleConfig later if needed.

## Event Handlers
| Handler | Trigger | Description |
|---------|---------|-------------|
| setup | Invocation start | Initialize any needed state |
| on_message_create | Channel message | Receive message data, read/write tags as needed |

## Tags (Output)
| Tag Name | Type | Description |
|----------|------|-------------|
| (none predefined) | - | User will define their own tags as needed |

The processor is intentionally minimal. The `on_message_create` handler will contain a basic skeleton that demonstrates reading message data and using get_tag/set_tag, but no specific tag names are predefined.

## Documentation Chunks

### Required Chunks
- `config-schema.md` - Configuration types and patterns
- `cloud-handler.md` - Handler and event patterns
- `cloud-project.md` - Project setup and build script
- `processor-features.md` - ManySubscriptionConfig, ScheduleConfig, UI management

### Recommended Chunks
- `tags-channels.md` - Tag get/set patterns for cloud apps

### Discovery Keywords
subscription, tag, get_tag, set_tag, on_message_create, ManySubscriptionConfig

## Implementation Notes
- Convert existing docker-based template files to cloud processor pattern:
  - `__init__.py`: Change from `pydoover.docker.run_app` to `pydoover.cloud.processor.run_app` with `handler()` entry point
  - `application.py`: Change base class from `pydoover.docker.Application` to `pydoover.cloud.processor.Application`; replace `main_loop` with `on_message_create`
  - `app_config.py`: Add `ManySubscriptionConfig`; remove template placeholder fields (outputs_enabled, funny_message, sim_app_key)
  - `app_state.py`: Remove entirely (cloud processors are stateless per invocation; use tags for persistence)
- Add `build.sh` for Lambda deployment packaging
- Update `.gitignore` with build outputs (packages_export/, package.zip, requirements.txt)
- No external packages needed beyond pydoover
- Keep all handlers as minimal pass-through skeletons so user can customize
