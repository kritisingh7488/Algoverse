# AlgoVerse — Database Schema

## Purpose

This document defines the complete MongoDB database design for AlgoVerse.

It specifies every collection, document structure, relationships, validation rules, indexes, and future expansion strategy.

This document is the single source of truth for database design.

---

# Database

Database Name

AlgoVerse

Technology

MongoDB Atlas

ODM

Mongoose

---

# Design Principles

The database should be:

* Scalable
* Normalized where practical
* Easy to query
* Easy to extend
* Optimized for read-heavy operations
* Secure

---

# General Schema Rules

Every collection must include:

```text
_id

createdAt

updatedAt
```

Use timestamps in every schema.

Never store plaintext passwords.

Never duplicate unnecessary information.

Reference documents when relationships become large.

Embed documents only when tightly coupled.

---

# Collections Overview

Version 1 includes:

```text
Users

Algorithms

Problems

Submissions

Bookmarks

SavedVisualizations

Progress

Achievements

Discussions

Comments

Contests

ContestRegistrations

Notifications

Reports

Settings
```

---

# Users Collection

Purpose

Stores authentication and profile information.

Fields

```text
_id

name

username

email

password

avatar

bio

role

emailVerified

googleId

isActive

lastLogin

createdAt

updatedAt
```

Role Values

```text
USER

ADMIN
```

Validation

* Email unique
* Username unique
* Password hashed
* Bio optional
* Avatar optional

Indexes

```text
email

username

role
```

---

# Algorithms Collection

Purpose

Stores information about every algorithm available in the platform.

Fields

```text
_id

name

slug

category

difficulty

description

timeComplexity

spaceComplexity

stable

recursive

inPlace

supportedVisualization

cppFile

enabled

createdAt

updatedAt
```

Categories

```text
Sorting

Searching

Trees

Graphs

Dynamic Programming

Strings

Backtracking
```

Indexes

```text
slug

category

difficulty
```

---

# Problems Collection

Purpose

Stores coding problems and educational exercises.

Fields

```text
_id

title

slug

description

difficulty

category

constraints

sampleInput

sampleOutput

explanation

tags

algorithmReferences

createdBy

likes

bookmarks

isPublished

createdAt

updatedAt
```

Indexes

```text
difficulty

category

slug
```

---

# Submissions Collection

Purpose

Stores user code submissions.

Fields

```text
_id

userId

problemId

language

sourceCode

status

runtime

memory

submittedAt
```

Status

```text
Accepted

Wrong Answer

Compilation Error

Runtime Error

Time Limit Exceeded

Memory Limit Exceeded
```

Indexes

```text
userId

problemId
```

---

# Progress Collection

Purpose

Tracks learning progress.

Fields

```text
_id

userId

completedAlgorithms

completedProblems

learningHours

currentStreak

longestStreak

lastStudied

overallCompletion

statistics

createdAt

updatedAt
```

Statistics Object

Contains

```text
Sorting

Searching

Trees

Graphs

DP

Strings

Backtracking
```

Each stores

```text
completed

total

percentage
```

---

# Bookmarks Collection

Purpose

Stores bookmarked content.

Fields

```text
_id

userId

type

referenceId

createdAt
```

Type Values

```text
Algorithm

Problem

Discussion

Visualization
```

---

# SavedVisualizations Collection

Purpose

Allows users to save custom visualizations.

Fields

```text
_id

userId

algorithm

inputData

settings

snapshot

title

description

createdAt

updatedAt
```

---

# Achievements Collection

Purpose

Stores unlocked achievements.

Fields

```text
_id

userId

achievementId

earnedAt

progress
```

Example Achievements

```text
First Login

First Visualization

100 Problems

10 Day Streak

Sorting Master

Graph Explorer
```

---

# Discussions Collection

Purpose

Community discussions.

Fields

```text
_id

userId

title

content

tags

likes

views

bookmarks

isPinned

isLocked

createdAt

updatedAt
```

Indexes

```text
tags

likes
```

---

# Comments Collection

Purpose

Discussion replies.

Fields

```text
_id

discussionId

userId

content

parentComment

likes

createdAt

updatedAt
```

Nested replies are supported using parentComment.

---

# Contests Collection

Purpose

Contest management.

Fields

```text
_id

title

description

startTime

endTime

duration

problems

visibility

status

createdBy

createdAt

updatedAt
```

Status

```text
Upcoming

Live

Completed
```

---

# ContestRegistrations Collection

Purpose

Tracks contest participation.

Fields

```text
_id

contestId

userId

score

rank

penalty

submissions

joinedAt
```

---

# Notifications Collection

Purpose

Stores in-app notifications.

Fields

```text
_id

userId

type

title

message

referenceId

isRead

createdAt
```

Notification Types

```text
Contest

Achievement

Discussion

System

Reminder

Announcement
```

---

# Reports Collection

Purpose

Community moderation.

Fields

```text
_id

reportedBy

targetType

targetId

reason

status

reviewedBy

createdAt
```

---

# Settings Collection

Purpose

Stores user preferences.

Fields

```text
_id

userId

theme

animationSpeed

preferredLanguage

notifications

privacy

visualizationDefaults

updatedAt
```

Theme

```text
Light

Dark

System
```

Animation Speed

```text
Slow

Normal

Fast
```

---

# Relationships

User

↓

Progress

One to One

---

User

↓

Settings

One to One

---

User

↓

Bookmarks

One to Many

---

User

↓

Submissions

One to Many

---

User

↓

Saved Visualizations

One to Many

---

Contest

↓

Problems

Many to Many

---

Discussion

↓

Comments

One to Many

---

Problem

↓

Submissions

One to Many

---

# Indexing Strategy

Always index:

Unique fields

Foreign keys

Frequently searched fields

Examples

```text
email

username

slug

userId

problemId

contestId
```

Avoid excessive indexing.

---

# Soft Delete Strategy

Instead of deleting valuable content:

Use

```text
isDeleted

deletedAt
```

Where appropriate.

Applicable for

* Discussions
* Comments
* Problems

---

# Data Validation

All schemas should validate:

Required fields

Enums

Minimum lengths

Maximum lengths

Email format

Unique constraints

Reference existence

---

# Security

Never expose:

Password

Refresh Tokens

Internal IDs unnecessarily

Admin-only information

Sensitive metadata

Always sanitize user-generated content before storage.

---

# Future Collections

Reserved for Version 2+

```text
Courses

Lessons

Certificates

StudyGroups

Messages

FriendRequests

AIChats

PremiumSubscriptions

InstitutionAccounts

Classrooms
```

---

# Migration Strategy

When modifying schemas:

* Never remove production fields immediately.
* Add new fields with sensible defaults.
* Write migration scripts if required.
* Keep backward compatibility whenever possible.

---

# Database Design Principles Summary

* Use Mongoose schemas for every collection.
* Enable timestamps on every model.
* Validate all input.
* Use indexes thoughtfully.
* Prefer references for large relationships.
* Keep collections focused on a single responsibility.
* Design for future scalability without premature complexity.
