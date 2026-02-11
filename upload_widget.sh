#!/bin/bash
# Upload TagInteraction.js to the tag_interaction channel via Doover 2.0 data API
# Uses refresh token to obtain a fresh bearer token before uploading.

set -e

AGENT_ID="144936119761420291"
CHANNEL="tag_interaction"
FILE="assets/TagInteraction.js"
DATA_URL="https://data.doover.com/api"

# Read dv2 profile config
get_config() {
  sed -n '/profile=dv2/,/^$/p' ~/.doover/config | grep "^$1=" | head -1 | cut -d= -f2
}

REFRESH_TOKEN=$(get_config REFRESH_TOKEN)
OLD_TOKEN=$(get_config TOKEN)
AUTH_SERVER_URL=$(get_config AUTH_SERVER_URL)
CLIENT_ID=$(get_config AUTH_SERVER_CLIENT_ID)

if [ -z "$REFRESH_TOKEN" ]; then
  echo "Error: No refresh token found in dv2 profile. Run 'doover login --profile dv2' first."
  exit 1
fi

# Exchange refresh token for a fresh bearer token
echo "Refreshing bearer token..."
REFRESH_RESPONSE=$(curl -s -X POST "${AUTH_SERVER_URL}/oauth2/token" \
  --data-urlencode "grant_type=refresh_token" \
  --data-urlencode "refresh_token=${REFRESH_TOKEN}" \
  --data-urlencode "access_token=${OLD_TOKEN}" \
  --data-urlencode "client_id=${CLIENT_ID}")

TOKEN=$(echo "$REFRESH_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "Error: Failed to refresh token. Response:"
  echo "$REFRESH_RESPONSE"
  exit 1
fi

echo "Token refreshed successfully."

# Upload the widget file
echo "Uploading ${FILE} to channel ${CHANNEL}..."
curl -v -X PUT \
  "${DATA_URL}/agents/${AGENT_ID}/channels/${CHANNEL}/aggregate?log_update=true" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F 'json_payload={"output_type":"text/javascript"}' \
  -F "attachment-1=@${FILE};type=text/javascript"
