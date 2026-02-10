# Tag Interaction Widget

**Allows a user to read/write tag values using a widget**

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/getdoover/tag-interaction-widget)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/getdoover/tag-interaction-widget/blob/main/LICENSE)

[Getting Started](#getting-started) | [Configuration](#configuration) | [Developer](https://github.com/getdoover/tag-interaction-widget/blob/main/DEVELOPMENT.md) | [Need Help?](#need-help)

<br/>

## Overview

Tag Interaction Widget is a Doover cloud processor that receives channel messages and can read/write tag values on behalf of a user. It runs as an AWS Lambda function triggered by messages on subscribed channels.

This is a minimal starting point intended for customization. The core skeleton is in place -- add your tag read/write logic in the `process()` method to build out the functionality you need.

<br/>

## Getting Started

### Prerequisites

1. A [Doover](https://doover.com) account with access to create applications
2. Python 3.13+

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/getdoover/tag-interaction-widget.git
   cd tag-interaction-widget
   ```
2. Install dependencies:
   ```bash
   uv sync
   ```
3. Customize `src/tag_interaction_widget/application.py` with your tag interaction logic.
4. Deploy via the Doover platform.

<br/>

## Configuration

This processor has no configuration options yet. Add fields to `app_config.py` and re-run `doover config-schema export` to populate the config schema.

<br/>

## How It Works

1. The processor is deployed as an AWS Lambda function (Python 3.13, 128 MB memory, 300 s timeout).
2. A channel message triggers the Lambda handler.
3. `setup()` initialises the processor and loads deployment config.
4. `process()` receives the message data -- add your tag read/write logic here.
5. `close()` runs after processing is complete.

<br/>

## Need Help?

- Email: support@doover.com
- [Doover Documentation](https://docs.doover.com)
- [App Developer Documentation](https://github.com/getdoover/tag-interaction-widget/blob/main/DEVELOPMENT.md)

<br/>

## Version History

### v0.1.0 (Current)
- Initial release
- Minimal processor skeleton with setup/process/close lifecycle
- Lambda deployment packaging via `build.sh`

<br/>

## License

This app is licensed under the [Apache License 2.0](https://github.com/getdoover/tag-interaction-widget/blob/main/LICENSE).
