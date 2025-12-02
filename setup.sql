-- setup.sql

-- Tinybird Schema for 'events' Datasource
-- Run this in your Tinybird CLI or UI

TOKEN "tracker_token" READ "events" WRITE "events";

SCHEMA >
    `timestamp` DateTime,
    `session_id` String,
    `project_id` String,
    `feature_name` String,
    `event_type` String,
    `path` String

ENGINE "MergeTree"
ENGINE_SORTING_KEY "project_id, timestamp"
