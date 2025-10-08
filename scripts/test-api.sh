#!/bin/bash

# Test BLACK GPT API endpoints
# Usage: ./scripts/test-api.sh [API_URL]

API_URL="${1:-http://localhost:3000}"

echo "BLACK GPT API Tests"
echo "==================="
echo "API URL: $API_URL"
echo ""

# Test 1: Health Check
echo "1. Testing health endpoint..."
HEALTH=$(curl -s "${API_URL}/health")
if echo "$HEALTH" | grep -q "healthy"; then
  echo "   ✓ Health check passed"
else
  echo "   ✗ Health check failed"
  echo "   Response: $HEALTH"
fi

# Test 2: Upload Signal
echo ""
echo "2. Testing signal upload..."
UPLOAD_RESPONSE=$(curl -s -X POST "${API_URL}/api/v1/signals/upload" \
  -H "Content-Type: application/json" \
  -d '{
    "scriptName": "Test-Signal",
    "dateFrom": "2024-01-01T00:00:00Z",
    "dateTo": "2024-01-02T00:00:00Z",
    "gistText": "Test signal for automated testing. This is a legal public source signal.",
    "provenanceTags": ["manual:human-upload"],
    "createdBy": "test-script"
  }')

if echo "$UPLOAD_RESPONSE" | grep -q "success"; then
  echo "   ✓ Signal upload passed"
  SIGNAL_ID=$(echo "$UPLOAD_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  echo "   Signal ID: $SIGNAL_ID"
else
  echo "   ✗ Signal upload failed"
  echo "   Response: $UPLOAD_RESPONSE"
  exit 1
fi

# Test 3: Get Signal
echo ""
echo "3. Testing get signal..."
if [ -n "$SIGNAL_ID" ]; then
  GET_RESPONSE=$(curl -s "${API_URL}/api/v1/signals/${SIGNAL_ID}")
  if echo "$GET_RESPONSE" | grep -q "Test-Signal"; then
    echo "   ✓ Get signal passed"
  else
    echo "   ✗ Get signal failed"
    echo "   Response: $GET_RESPONSE"
  fi
else
  echo "   ⊘ Skipped (no signal ID)"
fi

# Test 4: List Signals
echo ""
echo "4. Testing list signals..."
LIST_RESPONSE=$(curl -s "${API_URL}/api/v1/signals?page=1&limit=10")
if echo "$LIST_RESPONSE" | grep -q "pagination"; then
  echo "   ✓ List signals passed"
else
  echo "   ✗ List signals failed"
  echo "   Response: $LIST_RESPONSE"
fi

echo ""
echo "==================="
echo "API tests completed"
