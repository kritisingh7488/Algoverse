# AlgoVerse — API Specification

## Purpose

This document defines the API standards and endpoint specifications for AlgoVerse.

Every backend endpoint must follow the conventions defined here. All frontend modules should consume these APIs without depending on internal implementation details.

This document is the single source of truth for API design.

---

# API Principles

Every API should be:

* RESTful
* Predictable
* Secure
* Versioned
* Well validated
* Consistent
* Easy to extend

---

# Base URL

Development

```text
/api/v1
```

Future Production

```text
https://your-domain.com/api/v1
```

---

# API Categories

* Authentication
* User
* Dashboard
* Algorithms
* Visualizations
* Playground
* Benchmarks
* Problems
* Community
* Contests
* Notifications
* Admin

---

# Standard Response Format

## Success

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

# HTTP Status Codes

| Status | Meaning               |
| ------ | --------------------- |
| 200    | Success               |
| 201    | Created               |
| 204    | No Content            |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Not Found             |
| 409    | Conflict              |
| 422    | Validation Error      |
| 429    | Too Many Requests     |
| 500    | Internal Server Error |

---

# Authentication

Protected routes require:

```text
Authorization: Bearer <JWT>
```

Public endpoints should not require authentication.

---

# Pagination Standard

Request

```text
?page=1&limit=20
```

Response

```json
{
  "page": 1,
  "limit": 20,
  "totalPages": 15,
  "totalItems": 287
}
```

---

# Filtering Standard

Example

```text
?difficulty=Easy

?category=Sorting

?sort=popular

?order=desc
```

Multiple filters should be supported together.

---

# Search Standard

Example

```text
?search=merge
```

Search should ignore case.

---

# Authentication APIs

## Register

POST

```text
/api/v1/auth/register
```

Body

```json
{
  "name": "",
  "username": "",
  "email": "",
  "password": ""
}
```

Validation

* Unique email
* Unique username
* Password policy
* Email format

Returns

* User
* JWT

---

## Login

POST

```text
/api/v1/auth/login
```

Body

```json
{
  "email": "",
  "password": ""
}
```

Returns

JWT

User

---

## Google Login

POST

```text
/api/v1/auth/google
```

---

## Logout

POST

```text
/api/v1/auth/logout
```

---

## Forgot Password

POST

```text
/api/v1/auth/forgot-password
```

---

## Reset Password

POST

```text
/api/v1/auth/reset-password
```

---

## Verify Email

POST

```text
/api/v1/auth/verify-email
```

---

# User APIs

## Get Profile

GET

```text
/api/v1/users/me
```

---

## Update Profile

PUT

```text
/api/v1/users/me
```

---

## Upload Avatar

POST

```text
/api/v1/users/avatar
```

Multipart upload.

---

## Update Password

PUT

```text
/api/v1/users/password
```

---

## Delete Account

DELETE

```text
/api/v1/users/me
```

Soft delete.

---

# Dashboard APIs

GET

```text
/api/v1/dashboard
```

Returns

* Progress
* Streak
* Recommendations
* Recent Activity
* Statistics
* Achievements

---

# Algorithm APIs

## List Algorithms

GET

```text
/api/v1/algorithms
```

Supports

* Search
* Filter
* Pagination
* Sorting

---

## Algorithm Details

GET

```text
/api/v1/algorithms/:slug
```

Returns

* Description
* Complexity
* Supported operations
* Visualization availability
* Related algorithms

---

# Visualization APIs

## Execute Algorithm

POST

```text
/api/v1/visualize
```

Body

```json
{
  "algorithm": "",
  "input": {},
  "settings": {}
}
```

Returns

```json
{
  "events": [],
  "statistics": {},
  "complexity": {}
}
```

---

## Save Visualization

POST

```text
/api/v1/visualizations
```

---

## Get Saved Visualizations

GET

```text
/api/v1/visualizations
```

---

## Delete Visualization

DELETE

```text
/api/v1/visualizations/:id
```

---

# Playground APIs

Generate random structure

POST

```text
/api/v1/playground/random
```

Reset structure

POST

```text
/api/v1/playground/reset
```

Import structure

POST

```text
/api/v1/playground/import
```

Export structure

GET

```text
/api/v1/playground/export
```

---

# Benchmark APIs

POST

```text
/api/v1/benchmarks/run
```

Runs selected algorithms.

Returns

* Runtime
* Memory
* Comparisons
* Swaps
* Execution Time

---

GET

```text
/api/v1/benchmarks/history
```

---

# Problem APIs

List Problems

GET

```text
/api/v1/problems
```

Problem Details

GET

```text
/api/v1/problems/:slug
```

Like Problem

POST

```text
/api/v1/problems/:id/like
```

Unlike Problem

DELETE

```text
/api/v1/problems/:id/like
```

Bookmark Problem

POST

```text
/api/v1/problems/:id/bookmark
```

Remove Bookmark

DELETE

```text
/api/v1/problems/:id/bookmark
```

Submit Solution

POST

```text
/api/v1/problems/:id/submit
```

---

# Community APIs

Create Discussion

POST

```text
/api/v1/discussions
```

Get Discussions

GET

```text
/api/v1/discussions
```

Discussion Details

GET

```text
/api/v1/discussions/:id
```

Update Discussion

PUT

```text
/api/v1/discussions/:id
```

Delete Discussion

DELETE

```text
/api/v1/discussions/:id
```

Like Discussion

POST

```text
/api/v1/discussions/:id/like
```

Bookmark Discussion

POST

```text
/api/v1/discussions/:id/bookmark
```

Comment

POST

```text
/api/v1/discussions/:id/comments
```

Reply

POST

```text
/api/v1/comments/:id/reply
```

Like Comment

POST

```text
/api/v1/comments/:id/like
```

Report Content

POST

```text
/api/v1/reports
```

---

# Contest APIs

Upcoming Contests

GET

```text
/api/v1/contests/upcoming
```

Contest Details

GET

```text
/api/v1/contests/:id
```

Register

POST

```text
/api/v1/contests/:id/register
```

Leaderboard

GET

```text
/api/v1/contests/:id/leaderboard
```

Submit Contest Solution

POST

```text
/api/v1/contests/:id/submit
```

---

# Notification APIs

Get Notifications

GET

```text
/api/v1/notifications
```

Mark as Read

PUT

```text
/api/v1/notifications/:id/read
```

Mark All Read

PUT

```text
/api/v1/notifications/read-all
```

Delete Notification

DELETE

```text
/api/v1/notifications/:id
```

---

# Admin APIs

Get Users

GET

```text
/api/v1/admin/users
```

Ban User

PUT

```text
/api/v1/admin/users/:id/ban
```

Delete Problem

DELETE

```text
/api/v1/admin/problems/:id
```

Manage Contests

POST

PUT

DELETE

```text
/api/v1/admin/contests
```

Analytics

GET

```text
/api/v1/admin/analytics
```

---

# Validation Rules

Every endpoint must validate:

* Required fields
* Data types
* Length constraints
* Enum values
* Object IDs
* File sizes
* Authentication
* Authorization

---

# Rate Limiting

Apply stricter limits to:

* Login
* Register
* Forgot Password
* Reset Password

General APIs should also have reasonable rate limits to prevent abuse.

---

# Error Handling

Never expose:

* Stack traces
* Database errors
* Internal file paths
* Secrets

Always return user-friendly messages.

---

# Logging

Log:

* Authentication attempts
* Failed validations
* Server errors
* Contest submissions
* Algorithm execution failures
* Admin actions

Never log passwords or sensitive tokens.

---

# Versioning

All APIs must remain under:

```text
/api/v1
```

Future breaking changes should introduce:

```text
/api/v2
```

Do not modify v1 in a way that breaks existing clients.

---

# API Design Principles Summary

* RESTful resource naming
* Consistent request and response formats
* JWT-based authentication
* Proper validation
* Predictable status codes
* Pagination, filtering, and search support
* Clear separation of public and protected endpoints
* Easy extensibility for future versions
