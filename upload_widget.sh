#!/bin/bash
# Upload TagInteraction.js to the tag_interaction channel via Doover 2.0 data API

TOKEN=$(sed -n '/profile=dv2/,/^$/p' ~/.doover/config | grep '^TOKEN=' | head -1 | cut -d= -f2)
AGENT_ID="144936119761420291"
CHANNEL="tag_interaction"
FILE="assets/TagInteraction.js"
DATA_URL="https://data.doover.com/api"

curl -v -X PUT \
  "${DATA_URL}/agents/${AGENT_ID}/channels/${CHANNEL}/aggregate?log_update=true" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F 'json_payload={"output_type":"text/javascript"}' \
  -F "attachment-1=@${FILE};type=text/javascript"
