# Tinybird Setup Instructions

## Prerequisites
- Tinybird CLI installed (`pip install tinybird-cli`)
- Admin token configured

## Setup Commands

```bash
# Authenticate
tb auth --token p.eyJ1IjogIjZiYTJmMzY4LTUwZDMtNDVhYS1iZGE4LWNjZTgwNDQ1MDIzZCIsICJpZCI6ICIyMGVhYjhjYS1mOTlmLTQxMWItYmQ3My03OTU5OGJkYjk0OTYiLCAiaG9zdCI6ICJhd3MtZXUtd2VzdC0xIn0.7WnsNWaEXbmUbSSJuppWvmRLbgdS3bwpeUa-DRtAHRc

# Push events data source
tb push events.datasource

# Create the pipes
tb push recent_clicks.pipe
tb push top_features.pipe
tb push least_used_features.pipe

# Test the events endpoint
curl -H "Authorization: Bearer p.eyJ1IjogIjZiYTJmMzY4LTUwZDMtNDVhYS1iZGE4LWNjZTgwNDQ1MDIzZCIsICJpZCI6ICIyMGVhYjhjYS1mOTlmLTQxMWItYmQ3My03OTU5OGJkYjk0OTYiLCAiaG9zdCI6ICJhd3MtZXUtd2VzdC0xIn0.7WnsNWaEXbmUbSSJuppWvmRLbgdS3bwpeUa-DRtAHRc" \
  -d '{"feature_name":"test_button","selector":"button.test","timestamp":"2025-01-01T12:00:00Z","user_id":"test_user","session_id":"test_session","url":"https://example.com","website_domain":"example.com","element_type":"button","element_text":"Test"}' \
  https://api.eu-west-1.aws.tinybird.co/v0/events?name=events

# Test recent_clicks pipe
curl "https://api.eu-west-1.aws.tinybird.co/v0/pipes/recent_clicks.json?domain=example.com&limit=10&token=p.eyJ1IjogIjZiYTJmMzY4LTUwZDMtNDVhYS1iZGE4LWNjZTgwNDQ1MDIzZCIsICJpZCI6ICIyMGVhYjhjYS1mOTlmLTQxMWItYmQ3My03OTU5OGJkYjk0OTYiLCAiaG9zdCI6ICJhd3MtZXUtd2VzdC0xIn0.7WnsNWaEXbmUbSSJuppWvmRLbgdS3bwpeUa-DRtAHRc"
```

## File Locations
- `events.datasource` - Events table schema
- `recent_clicks.pipe` - Last N clicks per domain
- `top_features.pipe` - Most clicked features
- `least_used_features.pipe` - Rarely clicked features

## API Endpoints After Setup
- Events ingestion: `https://api.eu-west-1.aws.tinybird.co/v0/events?name=events`
- Recent clicks: `https://api.eu-west-1.aws.tinybird.co/v0/pipes/recent_clicks.json`
- Top features: `https://api.eu-west-1.aws.tinybird.co/v0/pipes/top_features.json`
- Least used: `https://api.eu-west-1.aws.tinybird.co/v0/pipes/least_used_features.json`
