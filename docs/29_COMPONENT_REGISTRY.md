# AlgoVerse — Component Registry

# Purpose

The Component Registry serves as the single source of truth for every reusable UI component used throughout AlgoVerse.

Every page, laboratory, dashboard, modal, and feature must use components from this registry before creating new ones.

This ensures

- Consistent UI
- Better maintainability
- Reusable architecture
- Faster development
- Easier agent continuation
- Scalable design

---

# Component Naming Convention

Every component follows

```text
<ComponentName>.jsx
```

Example

```text
Button.jsx
Navbar.jsx
ProgressCard.jsx
SortingCanvas.jsx
```

Folders

```text
src/
│
├── components/
│
├── layouts/
│
├── ui/
│
├── features/
│
└── shared/
```

---

# Component Categories

Core UI

Layouts

Authentication

Dashboard

Visualization

Learning

Profile

Community

Contest

Benchmark

Playground

Admin

Animations

Charts

Forms

Feedback

Utility

---

# Folder Structure

```text
components/

│

├── ui/

├── layout/

├── auth/

├── dashboard/

├── profile/

├── community/

├── contests/

├── benchmark/

├── playground/

├── visualization/

├── admin/

├── settings/

├── roadmap/

├── animations/

├── charts/

├── forms/

├── feedback/

└── shared/
```

---

# CORE UI COMPONENTS

---

## Button

Purpose

Reusable button.

Variants

Primary

Secondary

Outline

Ghost

Danger

Success

Gradient

Cute

Loading

Disabled

Sizes

XS

SM

MD

LG

XL

Props

```text
variant

size

icon

loading

disabled

fullWidth

onClick
```

Animations

Hover

Ripple

Glow

Bounce

---

## IconButton

Used for

Bookmarks

Likes

Settings

Play

Pause

Delete

Edit

Share

Copy

---

## Card

Variants

Default

Glass

Gradient

Elevated

Outlined

Cute

Dashboard

Interactive

Supports

Header

Body

Footer

Hover Animation

---

## Modal

Supports

Small

Medium

Large

Fullscreen

Confirmation

Alert

Form

Image Preview

Animation

Fade

Scale

Slide

---

## Dialog

Types

Confirm

Delete

Warning

Information

Success

---

## Drawer

Used for

Sidebar

Notifications

Profile

Settings

Mobile Navigation

Supports

Left

Right

Top

Bottom

---

## Tabs

Animated tabs.

Supports

Icons

Badges

Scrollable

Nested Tabs

---

## Accordion

Used in

FAQs

Roadmaps

Documentation

Algorithm Details

---

## Badge

Variants

XP

Level

Difficulty

Achievement

Contest

Community

Verification

Animated

---

## Avatar

Supports

Image

Initials

Status

Online Indicator

Level Ring

XP Ring

---

## Tooltip

Supports

Text

Rich Content

Images

Markdown

Keyboard Accessible

---

## Popover

Supports

Menus

Notifications

Mini Profile

Quick Actions

---

## Breadcrumb

Used in

Labs

Dashboard

Roadmaps

Profile

---

## Pagination

Supports

Numbers

Previous

Next

Infinite Scroll

Load More

---

## Divider

Horizontal

Vertical

Gradient

Animated

---

## Chip

Used for

Tags

Filters

Algorithms

Topics

Companies

---

# LAYOUT COMPONENTS

---

## Navbar

Shared across application.

Contains

Logo

Search

Notifications

Theme Toggle

Profile Menu

Settings

Mobile Menu

---

## Sidebar

Variants

Expanded

Collapsed

Floating

Mobile Drawer

---

## Footer

Contains

Links

Social

Documentation

Privacy

Terms

Version

---

## DashboardLayout

Reusable layout.

Used by

Dashboard

Profile

Admin

Settings

Benchmark

---

## LabLayout

Used by

Sorting

Searching

Trees

Graphs

DP

Strings

Backtracking

Contains

Sidebar

Visualization

Timeline

Statistics

Explanation

---

# AUTH COMPONENTS

---

LoginForm

SignupForm

ForgotPasswordForm

ResetPasswordForm

GoogleLoginButton

EmailVerificationBanner

OTPInput

PasswordStrengthMeter

TermsCheckbox

RememberMe

SocialLoginButtons

---

# DASHBOARD COMPONENTS

---

WelcomeBanner

DailyGoalsCard

ContinueLearningCard

XPCard

LevelCard

ActivityCalendar

ProgressRing

LearningPathCard

RecommendedAlgorithms

RecentActivity

QuickActions

DailyChallengeCard

ContestReminderCard

StudyStreakCard

NewsWidget

---

# PROFILE COMPONENTS

---

ProfileHeader

ProfileBanner

ProfileStats

ContributionCalendar

AchievementsGrid

SkillRadarChart

ProgressChart

ContestHistory

BookmarksPanel

SavedNotes

CertificatesGrid

ProjectShowcase

PortfolioCard

ActivityTimeline

FollowersList

FollowingList

---

# COMMUNITY COMPONENTS

---

PostCard

CommentCard

CreatePostModal

DiscussionCard

StudyGroupCard

ResourceCard

PollCard

NotificationCard

LeaderboardWidget

TrendingTopics

FriendCard

CommunitySearch

ReactionBar

ReplyEditor

---

# VISUALIZATION COMPONENTS

---

ArrayCanvas

SortingCanvas

SearchingCanvas

LinkedListCanvas

StackCanvas

QueueCanvas

TreeCanvas

BSTCanvas

AVLCanvas

HeapCanvas

TrieCanvas

GraphCanvas

GridCanvas

MatrixCanvas

DPTable

StringCanvas

RecursionTree

DecisionTree

Timeline

PlaybackControls

ComplexityCard

StatisticsPanel

ExplanationPanel

LegendPanel

---

# BENCHMARK COMPONENTS

---

BenchmarkCard

BenchmarkChart

ComparisonTable

MetricCard

RuntimeChart

MemoryChart

Heatmap

RadarChart

InsightPanel

BenchmarkHistory

ExportPanel

---

# PLAYGROUND COMPONENTS

---

MonacoEditor

OutputConsole

InputPanel

TestCasePanel

LanguageSelector

ExecutionControls

VariableInspector

CallStackPanel

SnippetManager

SubmissionHistory

---

# CONTEST COMPONENTS

---

ContestCard

ContestTimer

ProblemNavigator

ContestLeaderboard

SubmissionPanel

ContestAnalytics

CertificateCard

ContestCalendar

RatingGraph

---

# SETTINGS COMPONENTS

---

ThemeSelector

AccentPicker

AnimationSettings

EditorSettings

NotificationSettings

PrivacySettings

AccessibilitySettings

ConnectedAccounts

SessionManager

BackupManager

---

# ADMIN COMPONENTS

---

AdminSidebar

AnalyticsCards

UserTable

ProblemTable

ContestTable

ModerationQueue

AuditLogTable

SystemHealthCard

FeatureFlagPanel

RoleManager

SupportTickets

---

# SHARED COMPONENTS

---

SearchBar

FilterBar

EmptyState

LoadingSpinner

LoadingSkeleton

ErrorState

SuccessAnimation

Confetti

Toast

Alert

Snackbar

CommandPalette

FloatingActionButton

BackToTop

CopyButton

FavoriteButton

ShareButton

BookmarkButton

LikeButton

---

# CHART COMPONENTS

---

LineChart

BarChart

AreaChart

PieChart

DonutChart

HeatmapChart

RadarChart

ScatterChart

TimelineChart

ContributionChart

---

# FORM COMPONENTS

---

TextField

PasswordField

TextArea

Checkbox

RadioGroup

Switch

Select

MultiSelect

DatePicker

ColorPicker

Slider

FileUploader

ImageUploader

SearchInput

TagInput

MarkdownEditor

---

# ANIMATION COMPONENTS

---

FloatingStars

FloatingHearts

CherryBlossoms

Sparkles

GradientBlob

AnimatedBackground

MouseTrail

PageTransition

MorphTransition

LoadingDots

TypingAnimation

AnimatedMascot

XPAnimation

BadgeUnlockAnimation

LevelUpAnimation

---

# Component Rules

Every component must

- Be reusable.
- Be responsive.
- Be accessible.
- Support dark/light themes.
- Support cute theme.
- Use modern ES6+ JavaScript throughout the project.
- Avoid duplicated logic.
- Support loading and error states.
- Be documented.
- Include unit tests where applicable.

---

# Definition of Done

A component can be added to the registry only if

- It is reusable.
- It follows naming conventions.
- It supports theming.
- It is responsive.
- It is accessible.
- It has clearly defined props.
- It is documented.
- It passes testing requirements.

---

# 29_COMPONENT_REGISTRY.md Completed