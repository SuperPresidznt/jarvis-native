# GitHub Competitor Repository Research for Javi

**Research Date:** December 27, 2025
**Compiled by:** Growth Agent (Max's Team)
**Purpose:** Identify similar projects, competitive landscape, and useful patterns

---

## Executive Summary

After comprehensive GitHub research across 10+ search terms, the key finding is: **No one is building the full "Life OS" vision that Javi represents.** The market is fragmented into specialized tools (habit trackers, finance apps, note-taking, AI assistants), but no single open-source project combines tasks + habits + calendar + finance + focus + AI chat in one mobile-first app.

### Key Insights

| Question | Answer |
|----------|--------|
| Is anyone building the full Life OS? | **No** - closest is MyBrain (tasks/notes/calendar/diary, no finance) |
| Good open-source Jarvis projects? | **Yes** - but all desktop/web, none mobile-first |
| Voice/chat for data entry? | **Limited** - Speechly-based expense trackers exist, no all-in-one |
| React Native + SQLite + AI? | **Emerging** - new libraries in 2024, no complete app examples |

### Javi's Unique Position

```
Javi = Tasks + Habits + Calendar + Finance + Focus Timer + Journal + AI Chat
       + React Native Mobile + SQLite Local-First + Voice Input (planned)

Competitors:
- MyBrain = Tasks + Notes + Calendar + Diary + AI (no finance, no habits, Android-only)
- Habitica = Gamified habits/tasks (no finance, no AI, no focus timer)
- Budget Buddy = Finance only
- Super Productivity = Tasks + time tracking (desktop-first, no finance, no habits)
- Leon AI = Voice assistant (server-based, no mobile app, no data management)
```

---

## Tier 1: Most Similar Projects (All-in-One Productivity)

### 1. MyBrain by mhss1

**The closest competitor to Javi's vision**

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/mhss1/MyBrain](https://github.com/mhss1/MyBrain) |
| **Stars** | ~1.7k |
| **Last Updated** | Active (v2.0.6, December 2024) |
| **Tech Stack** | Kotlin, Jetpack Compose, Room DB, MVVM, Hilt |
| **Platform** | Android only |
| **License** | GPL-3.0 |

**Features:**
- Tasks with sub-tasks and priorities
- Notes with markdown support
- Calendar integration
- Diary/journaling
- Bookmarks
- AI assistant (Gemini, GPT, or custom OpenAI-compatible API)
- Material You theming
- Widgets

**What's Missing vs Javi:**
- No finance/expense tracking
- No habit tracking
- No focus/pomodoro timer
- Android only (no iOS)
- No voice input
- Server-dependent AI (not local)

**Useful Patterns:**
- AI integration with multiple providers (Gemini, GPT, custom API)
- Clean architecture with Compose
- Room database schema for tasks/notes

---

### 2. Super Productivity by johannesjo

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/johannesjo/super-productivity](https://github.com/johannesjo/super-productivity) |
| **Stars** | ~16.5k |
| **Last Updated** | Active (v16.7.3, December 2024) |
| **Tech Stack** | Angular, Electron, TypeScript |
| **Platform** | Desktop (Win/Mac/Linux), Web, Android (wrapper) |
| **License** | MIT |

**Features:**
- Advanced task management with sub-tasks
- Timeboxing and time tracking
- Pomodoro timer
- Jira, GitLab, GitHub, Open Project integrations
- Calendar import
- Offline mode (Connectivity-Free Mode added Oct 2024)
- WebDAV/Dropbox sync
- Custom CSS theming

**What's Missing vs Javi:**
- No habit tracking
- No finance tracking
- No AI chat
- Desktop-first (Android app is just a wrapper)
- No native mobile experience
- No voice input

**Useful Patterns:**
- Timeboxing implementation
- Issue provider integrations pattern
- Offline sync strategies (WebDAV, Dropbox)

---

### 3. Lunatask

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/lunatask/lunatask](https://github.com/lunatask/lunatask) |
| **Stars** | Not primarily open-source (freemium) |
| **Last Updated** | Active (v2.0.14, December 2024) |
| **Tech Stack** | Electron, TypeScript |
| **Platform** | Desktop, Web |
| **License** | Proprietary with open issues |

**Features:**
- Encrypted to-do list
- Habit tracker with visual streaks
- Journaling and notes
- Mood/life tracking
- Calendar integration with drag-and-drop
- Time blocking
- Personal CRM (relationship tracking)
- ADHD-friendly design

**What's Missing vs Javi:**
- No finance tracking
- No mobile apps
- No AI assistant
- No voice input
- Zero collaboration features (by design)

**Useful Patterns:**
- ADHD-friendly UX principles
- "Now/Later" task methodology
- Mood tracking integration with journaling
- Personal CRM approach

---

## Tier 2: Category Leaders (Single Focus)

### Habit Tracking

#### Loop Habit Tracker (uhabits)

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/iSoron/uhabits](https://github.com/iSoron/uhabits) |
| **Stars** | ~8k+ |
| **Tech Stack** | Kotlin, SQLite |
| **Platform** | Android only |
| **License** | GPL-3.0 |

**Features:**
- Habit score algorithm (streak + strength)
- Flexible schedules (daily, weekly, custom)
- Detailed graphs and statistics
- Reminders with snooze
- Smartwatch support (Android Wear)
- Dark theme
- No ads, no accounts, privacy-focused

**What's Missing vs Javi:**
- No tasks
- No finance
- No AI
- No iOS
- Single-purpose only

**Useful Patterns:**
- Habit strength algorithm (not just streaks)
- Flexible scheduling logic
- Statistics visualization

---

#### Habitica (HabitRPG)

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/HabitRPG/habitica](https://github.com/HabitRPG/habitica) |
| **Stars** | ~13.2k (main), ~1.7k (Android) |
| **Tech Stack** | Node.js backend, Kotlin (Android), Swift (iOS) |
| **Platform** | Web, iOS, Android |
| **License** | GPL-3.0 |

**Features:**
- Gamified habit and task tracking
- RPG mechanics (XP, levels, HP, gold, equipment)
- Social features (parties, guilds, challenges)
- Daily tasks, habits, and to-dos
- Rewards system
- Pet and mount collection

**What's Missing vs Javi:**
- No finance tracking
- No focus timer
- No AI assistant
- No calendar integration
- No journaling
- Gamification may not suit everyone

**Useful Patterns:**
- Gamification mechanics for motivation
- Social accountability features
- Native mobile apps with shared backend

---

### Finance Tracking

#### Budget Buddy App

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/betomoedano/Budget-Buddy-App](https://github.com/betomoedano/Budget-Buddy-App) |
| **Stars** | Active project |
| **Tech Stack** | React Native, Expo 50, SQLite |
| **Platform** | iOS, Android |
| **License** | Open source |

**Features:**
- Expense tracking with SQLite
- Budget management
- Local-first architecture
- Expo 50 with modern APIs

**Relevance to Javi:**
- **EXACT tech stack match** (React Native + Expo + SQLite)
- Shows local-first finance tracking is viable
- Pattern for complex data structures in SQLite

**Useful Patterns:**
- SQLite schema for transactions
- Expo 50 SQLite integration
- Local-first data management

---

#### Expense Tracker with Voice (Speechly)

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/adilrana03/expense_tracker](https://github.com/adilrana03/expense_tracker) |
| **Tech Stack** | React, Speechly API |
| **Platform** | Web |

**Features:**
- Voice recognition for expense input
- Charts for income/expense visualization
- Speechly API integration

**What's Missing:**
- Web only, not mobile
- Expense only, not full productivity
- Requires internet for voice

**Useful Patterns:**
- Voice-to-data-entry workflow
- Natural language parsing for financial data

---

### Personal Knowledge Management (PKM) / Second Brain

#### AppFlowy

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/AppFlowy-IO/AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) |
| **Stars** | ~64.4k |
| **Tech Stack** | Flutter, Rust |
| **Platform** | Desktop, iOS, Android |
| **License** | AGPL-3.0 |

**Features:**
- Notion-like workspace
- Documents, databases, kanban boards
- AI features
- Offline-first
- Self-hostable
- Cross-platform native apps

**What's Missing vs Javi:**
- No habit tracking
- No finance tracking
- No focus timer
- Complex (workspace-oriented, not personal daily OS)
- Different target audience (teams vs individuals)

**Useful Patterns:**
- Flutter + Rust architecture
- Offline-first sync
- Mobile app approach for complex data

---

#### AFFiNE

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/toeverything/AFFiNE](https://github.com/toeverything/AFFiNE) |
| **Stars** | ~60.8k |
| **Tech Stack** | TypeScript, React |
| **Platform** | Desktop, Web (mobile coming) |
| **License** | MIT |

**Features:**
- Docs + whiteboard hybrid
- Knowledge management
- Block-based editor
- Privacy-first, local-first
- Real-time collaboration

**What's Missing vs Javi:**
- No mobile app yet (coming soon)
- No habit tracking
- No finance
- No focus timer
- Workspace-oriented, not personal daily OS

---

#### Khoj AI

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/khoj-ai/khoj](https://github.com/khoj-ai/khoj) |
| **Stars** | ~20k+ |
| **Tech Stack** | Python, various LLMs |
| **Platform** | Self-hosted, Web, Obsidian/Emacs plugins, WhatsApp |

**Features:**
- AI second brain
- Chat with your docs (PDF, markdown, notion, etc.)
- Multiple LLM support (GPT, Claude, Gemini, Llama, etc.)
- Custom agents
- Scheduled automations
- Research mode
- Self-hostable

**What's Missing vs Javi:**
- No native mobile app
- No task management
- No habit tracking
- No finance
- Focused on document Q&A, not daily productivity

**Useful Patterns:**
- Multi-LLM architecture
- Document ingestion pipeline
- Agent customization

---

## Tier 3: AI Voice Assistants (Jarvis-Style)

### Leon AI

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/leon-ai/leon](https://github.com/leon-ai/leon) |
| **Stars** | ~16k+ |
| **Tech Stack** | Node.js, Python, NLP/TTS/STT |
| **Platform** | Server (runs on your machine) |
| **License** | MIT |

**Features:**
- Open-source personal assistant
- Voice and text interaction
- Offline capable
- Custom skills/plugins
- NLP with transformer models
- TTS and STT support

**What's Missing vs Javi:**
- Server-based, not mobile app
- No structured data management (tasks, habits, finance)
- General assistant, not personal life OS
- No UI for data entry/viewing

**Useful Patterns:**
- Skill/plugin architecture
- Offline voice processing options
- NLP pipeline design

---

### Project Jarvis (Likhithsai2580)

| Attribute | Details |
|-----------|---------|
| **GitHub** | [github.com/Likhithsai2580/JARVIS](https://github.com/Likhithsai2580/JARVIS) |
| **Tech Stack** | Python, ML libraries |
| **Platform** | Desktop |

**Features:**
- Machine learning integration
- Object detection via camera
- Code generation
- Task automation
- Voice commands
- GUI interface

**What's Missing vs Javi:**
- Desktop only
- No mobile app
- No personal data management
- Automation-focused, not life tracking

---

### Other Jarvis Projects

Multiple "Jarvis" projects exist on GitHub (see [topic page](https://github.com/topics/jarvis)), but they are:
- Mostly Python desktop scripts
- Voice command interfaces
- General automation tools
- None are mobile-first personal life OS apps

---

## Tier 4: React Native + AI Libraries (Building Blocks)

### On-Device LLM for React Native

| Library | GitHub | Purpose |
|---------|--------|---------|
| **react-native-executorch** | [software-mansion/react-native-executorch](https://github.com/software-mansion/react-native-executorch) | Run AI models on-device via ExecuTorch |
| **@react-native-ai** | [callstackincubator/ai](https://github.com/callstackincubator/ai) | Vercel AI SDK compatible, MLC runtime |
| **react-native-ai** | [dabit3/react-native-ai](https://github.com/dabit3/react-native-ai) | Full-stack mobile AI framework |
| **react-native-llm-mediapipe** | [cdiddy77/react-native-llm-mediapipe](https://github.com/cdiddy77/react-native-llm-mediapipe) | Gemma, Falcon, StableLM, Phi-2 on device |
| **react-native-transformers** | [daviddaytw/react-native-transformers](https://github.com/daviddaytw/react-native-transformers) | ONNX Runtime for transformers |

**Key Insight:** On-device LLM for React Native is now viable (as of 2024). Javi could integrate local AI without server dependency.

---

### Pomodoro/Focus Timers in React Native

| Project | GitHub | Notes |
|---------|--------|-------|
| **PomFocus** | [skandog/PomFocus](https://github.com/skandog/PomFocus) | Clean Expo-based pomodoro |
| **focustimeapp** | [jonidelv/focustimeapp](https://github.com/jonidelv/focustimeapp) | React Native pomodoro |
| **react-native-pomodoro-timer** | [PedroBern/react-native-pomodoro-timer](https://github.com/PedroBern/react-native-pomodoro-timer) | Simple Expo timer with vibration |

---

## Competitive Gap Analysis

### What's Available (Fragmented Market)

| Need | Available Solutions | Limitation |
|------|---------------------|------------|
| Tasks | MyBrain, Super Productivity, Habitica | No finance, limited mobile |
| Habits | Loop, Habitica, Lunatask | No finance, limited AI |
| Finance | Budget Buddy, various trackers | Single purpose, no productivity |
| Focus Timer | Pomodoro apps, Super Productivity | Single purpose |
| AI Chat | Khoj, Leon, ChatGPT | Not integrated with personal data |
| Voice Input | Speechly expense trackers | Limited to finance, web only |
| Calendar | Most productivity apps | Usually add-on, not core |
| Journal | Lunatask, MyBrain | Part of larger apps |

### What's Missing (Javi's Opportunity)

| Gap | Javi's Solution |
|-----|-----------------|
| All-in-one mobile-first app | React Native cross-platform |
| Tasks + Habits + Finance unified | Single SQLite database |
| Local-first with privacy | No server requirement |
| AI chat with personal context | Planned AI integration |
| Voice data entry | Planned feature |
| Focus timer + habit tracking | Integrated in one app |
| Calendar + tasks + journal linked | Date-based correlation |

---

## Useful Code Patterns to Reference

### 1. SQLite Schema Design
- **Budget Buddy App**: Transaction schema with categories
- **Loop Habit Tracker**: Habit frequency and score algorithms

### 2. AI Integration
- **MyBrain**: Multi-provider AI (Gemini, GPT, custom)
- **react-native-ai**: Full-stack mobile AI framework

### 3. Offline-First Sync
- **Super Productivity**: WebDAV/Dropbox sync
- **AppFlowy**: Rust-based sync engine

### 4. Voice Input
- **Speechly expense trackers**: Voice-to-structured-data patterns

### 5. Gamification
- **Habitica**: XP, levels, rewards systems

### 6. Statistics/Visualization
- **Loop Habit Tracker**: Habit strength graphs
- **Lunatask**: Mood tracking visualization

---

## Recommendations for Javi

### Immediate Value Differentiators

1. **All-in-one mobile-first** - No competitor does this
2. **Finance + Habits in one app** - Unique combination
3. **Local-first privacy** - Strong differentiator vs cloud-dependent apps
4. **Focus timer integrated** - Not an afterthought

### Features to Prioritize (Based on Gaps)

| Priority | Feature | Why |
|----------|---------|-----|
| High | Voice input for transactions | Unique differentiator, no mobile competitor |
| High | Habit strength algorithm | Copy from Loop, more engaging than streaks |
| Medium | On-device AI chat | Emerging tech, privacy differentiator |
| Medium | Export/Import data | User trust, portability |
| Low | Gamification | Habitica does this well, not core to vision |

### Code to Study

1. **Budget Buddy App** - Same tech stack, study SQLite patterns
2. **MyBrain AI integration** - Multi-provider AI approach
3. **Loop Habit Tracker** - Habit algorithms and statistics
4. **react-native-executorch** - Future on-device AI

---

## Sources

### All-in-One Productivity
- [MyBrain](https://github.com/mhss1/MyBrain)
- [Super Productivity](https://github.com/johannesjo/super-productivity)
- [Lunatask](https://lunatask.app/)

### Habit Tracking
- [Loop Habit Tracker](https://github.com/iSoron/uhabits)
- [Habitica](https://github.com/HabitRPG/habitica)
- [GitHub Habit Tracking Topic](https://github.com/topics/habit-tracking)

### Finance
- [Budget Buddy App](https://github.com/betomoedano/Budget-Buddy-App)
- [Expense Tracker with Speechly](https://github.com/adilrana03/expense_tracker)
- [GitHub Expense Tracker Topic](https://github.com/topics/expense-tracker-app)

### PKM / Second Brain
- [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy)
- [AFFiNE](https://github.com/toeverything/AFFiNE)
- [Khoj AI](https://github.com/khoj-ai/khoj)

### AI Assistants
- [Leon AI](https://github.com/leon-ai/leon)
- [Project Jarvis](https://github.com/Likhithsai2580/JARVIS)
- [GitHub Jarvis Topic](https://github.com/topics/jarvis)

### React Native AI
- [react-native-executorch](https://github.com/software-mansion/react-native-executorch)
- [react-native-ai](https://github.com/dabit3/react-native-ai)
- [react-native-llm-mediapipe](https://github.com/cdiddy77/react-native-llm-mediapipe)

### Productivity Topics
- [GitHub Productivity App Topic](https://github.com/topics/productivity-app)
- [React Native Apps List](https://github.com/ReactNativeNews/React-Native-Apps)

---

*Research completed December 27, 2025 by Growth Agent (Max's Team)*
