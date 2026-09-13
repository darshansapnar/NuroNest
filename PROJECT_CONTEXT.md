# NuroNest — Project Context for Development

## 1. Project Overview

I am developing a web application called **NuroNest**, an **AI-powered mental wellness platform**.

The goal of NuroNest is to provide users with a safe, friendly, and accessible platform where they can:

-  Talk to an AI companion about their thoughts and feelings. 
-  Perform mental wellness/self-assessment screenings. 
-  Get personalized wellness recommendations. 
-  Access relaxation and mindfulness activities. 
-  Discover mental-health-related resources. 
-  Find mental-health professionals. 
-  Track their wellness journey through a personal dashboard. 
-  Use the platform anonymously or create an account to save their progress. 

The application should feel **calm, trustworthy, modern, friendly, and non-clinical** rather than looking like a hospital/medical application.

> Important: NuroNest is a **mental wellness and screening platform, not a medical diagnosis system**. Assessments should clearly state that they are screening/wellness tools and not medical diagnoses.

---

# 2. Main User Journey

The overall flow is:

```
```

```
User
 ↓
Visits NuroNest
 ↓
Landing Page
 ↓
User chooses what they want to do
 ├── Talk to AI
 ├── Mental Health Assessment
 ├── Relaxation Hub
 ├── Find Mental Health Professional
 ├── Wellness Resources
 └── Login / Continue Journey
```

Users should be able to explore most features **without creating an account initially**.

If they want to save their wellness journey, they can create an account.

---

# 3. Landing Page

The landing page is the main entry point.

It should communicate:

### NuroNest

**AI-powered mental wellness companion**

Possible primary actions:

1. **Talk to AI** 
2. **Mental Health Assessment** 
3. **Relaxation Hub** 
4. **Find Mental Health Professional** 
5. **Wellness Resources** 
6. **Login / Continue Journey** 

The landing page should have a calm visual design with:

-  Soft colors 
-  Rounded cards 
-  Good spacing 
-  Modern typography 
-  Subtle animations 
-  Friendly illustrations 
-  Strong accessibility 
-  Responsive design 

Avoid making it look overly medical.

---

# 4. Module 1 — AI Companion

The AI Companion allows users to have an anonymous conversation with an AI wellness assistant.

### Flow

```
```

```
User selects "Talk to AI"
        ↓
Anonymous AI Conversation
        ↓
AI welcomes user
        ↓
User shares concerns
        ↓
AI responds empathetically
        ↓
AI provides relevant suggestions
        ↓
User chooses next action
```

The AI should behave primarily as a **supportive wellness companion**, not as a doctor.

Depending on the conversation, it may recommend:

-  Continue conversation 
-  Journal thoughts 
-  Breathing exercises 
-  Meditation 
-  Relaxation activities 
-  Mental health assessment 
-  Wellness resources 
-  Find a mental-health professional 

### Important AI behavior

The AI should:

-  Be empathetic. 
-  Avoid judgment. 
-  Encourage users to express themselves. 
-  Ask appropriate follow-up questions. 
-  Avoid pretending to be a human therapist. 
-  Avoid giving medical diagnoses. 
-  Avoid claiming certainty about someone's mental health. 
-  Recommend professional help when appropriate. 

For situations indicating potential immediate danger or self-harm, the application should show an appropriate **crisis/professional-support message** rather than attempting to handle the situation entirely through AI.

---

# 5. Module 2 — Mental Health Assessment

This module allows users to perform structured mental wellness screenings.

### Flow

```
```

```
User selects Mental Health Assessment
             ↓
"How can we help you today?"
             ↓
Select Concern
             ↓
 ┌──────────┬────────────┬───────────┬──────────────┬─────────────┐
 │ Anxious  │ Feeling Low│ Stressed  │ Sleep Issues │ Wellness    │
 └──────────┴────────────┴───────────┴──────────────┴─────────────┘
             ↓
       Appropriate screening
             ↓
          Questions
             ↓
       Calculate result
             ↓
       Display result
             ↓
 Personalized recommendations
             ↓
"Screening tool — not a medical diagnosis"
             ↓
          High Risk?
          /       \
        Yes        No
        ↓           ↓
Professional      Continue
Support/Crisis    Wellness
Information
```

The diagram maps concerns to screening tools:

| ConcernScreening |        |
| ---------------- | ------ |
| Anxiety          | GAD-7  |
| Feeling Low      | PHQ-9  |
| Stress           | PSS-10 |
| Sleep Issues     | PSQI   |
| General Wellness | WHO-5  |

The assessment system should be modular so additional assessments can be added later without rewriting the entire application.

### Result page

The result should include:

-  Score 
-  Interpretation/category 
-  Simple explanation 
-  Recommended next steps 
-  Relevant wellness activities 
-  Resources 
-  Professional-support option when appropriate 

Do **not** present the result as a diagnosis.

---

# 6. Module 3 — Relaxation Hub

The Relaxation Hub provides activities that help users relax and improve their mental wellness.

### Flow

```
```

```
Relaxation Hub
      ↓
Choose Category
      ↓
 ┌──────────────┬────────────────┐
 │ Breathing    │ Meditation     │
 │ Exercises    │                │
 └──────────────┴────────────────┘
      ↓
 ┌──────────────┬────────────────┐
 │ Sleep        │ Relaxing       │
 │ Support      │ Sounds         │
 └──────────────┴────────────────┘
      ↓
 ┌──────────────┬────────────────┐
 │ Instrumental │ Guided Audio    │
 │ Music        │                │
 └──────────────┴────────────────┘
```

### Breathing Exercises

Examples:

-  Box breathing 
-  4-7-8 breathing 
-  Deep breathing 

The interface could include:

-  Animated breathing circle 
-  Inhale timer 
-  Hold timer 
-  Exhale timer 
-  Session duration 
-  Start/Pause/Reset 

---

### Meditation

Categories could include:

-  Anxiety 
-  Stress 
-  Sleep 
-  Gratitude 

---

### Sleep Support

Examples:

-  Rain 
-  Ocean 
-  White noise 
-  Brown noise 
-  Pink noise 

---

### Relaxing Sounds

Examples:

-  Forest 
-  Fireplace 
-  Rain 
-  Ocean 
-  Wind 
-  Birds 

---

### Instrumental Music

Examples:

-  Piano 
-  Guitar 
-  Flute 
-  Lo-fi 

---

### Guided Audio

Examples:

-  Let go 
-  Overthinking 
-  Motivation 
-  Relaxation 
-  Sleep 

---

# 7. Dynamic Sound Mixer

One interesting feature in the diagram is a **Dynamic Sound Mixer**.

Users can combine different sounds.

Example:

```
```

```
Rain      70%
Ocean     20%
Birds     10%
```

The user should be able to adjust volume levels using sliders.

Example UI:

```
```

```
Dynamic Sound Mixer

🌧 Rain       ━━━━━━━━━━━━━ 70%
🌊 Ocean      ━━━━          20%
🐦 Birds      ━━            10%

        ▶ Play Mix
```

Users can then:

-  Play the mix 
-  Pause 
-  Adjust individual volumes 
-  Save favorite soundscapes 

---

# 8. Personalized Relaxation Recommendations

The platform should learn from user preferences.

For example:

```
```

```
User frequently plays:
Rain + Ocean

        ↓

System learns preference

        ↓

"Recommended for You"

Rainy Evening
Ocean Waves
Rain + Birds
Sleep Sounds
```

If the user has an account, these preferences can be persisted.

---

# 9. Module 4 — Find Mental Health Professional

Users should be able to find appropriate professionals.

### Flow

```
```

```
Find Professional
       ↓
Search Professionals
       ↓
Filter
       ↓
View Profile
       ↓
Book & Confirm
```

Possible professional categories:

-  Psychologist 
-  Psychiatrist 
-  Counselor 

The professional profile could include:

-  Name 
-  Qualification 
-  Specialization 
-  Experience 
-  Location 
-  Consultation type 
-  Availability 
-  Languages 
-  Rating/reviews if implemented 
-  Appointment slots 

---

# 10. Module 5 — Wellness Resources

The platform should have an educational resource library.

Categories:

### Articles

Educational mental wellness content.

### Videos

Short educational/wellness videos.

### Guides

Step-by-step wellness guides.

### Self-help Tips

Simple actionable suggestions.

### Coping Strategies

Techniques users can try for managing common wellness challenges.

The resource system should be searchable/filterable.

Example:

```
```

```
Search resources...

[ Anxiety ] [ Stress ] [ Sleep ] [ Focus ] [ Self-care ]

Articles
Videos
Guides
```

---

# 11. Anonymous Access

A major concept of NuroNest is:

> **Users should not be forced to create an account before receiving value.**

Anonymous users can access:

-  AI chat 
-  Assessments 
-  Relaxation Hub 
-  Resources 
-  Professional search 

The application can periodically ask:

```
```

```
"Save your wellness journey?"

[Create Account] [Continue Anonymously]
```

This should not interrupt the user's experience aggressively.

---

# 12. Account Flow

If the user chooses to create an account:

```
```

```
Anonymous User
      ↓
"Save your wellness journey?"
      ↓
Create Account
      ↓
Personal Dashboard
```

The account allows the application to save relevant user data and preferences.

---

# 13. Personal Dashboard

The dashboard becomes the user's central wellness hub.

Possible sections:

```
```

```
Personal Dashboard

├── Mood History
├── Assessment History
├── AI Chat History
├── Journal
├── Meditation History
├── Favorite Soundscapes
├── Appointments
├── Progress Analytics
└── Personalized AI Recommendations
```

### Mood History

Display mood trends over time.

Example:

```
```

```
Mood
 😊 ───╮      ╭──
       ╰──────╯
 😐
 😔
      Mon Tue Wed Thu Fri
```

---

### Assessment History

Show previous assessments:

```
```

```
Assessment History

GAD-7      Aug 20    Score: X
PHQ-9      Aug 25    Score: X
WHO-5      Sep 01    Score: X
```

---

### AI Chat History

Users can revisit previous AI conversations if they have an account.

---

### Journal

Users can write private journal entries.

Possible features:

-  Create entry 
-  Edit entry 
-  Delete entry 
-  Search entries 
-  Mood associated with entry 
-  Date/time 

---

### Meditation History

Track:

-  Sessions completed 
-  Duration 
-  Type 
-  Date 

---

### Favorite Soundscapes

Show saved combinations.

Example:

```
```

```
My Soundscapes

🌧 Rain + Ocean
🌲 Forest + Birds
🌊 Ocean + Piano
```

---

### Appointments

Show:

-  Upcoming appointments 
-  Past appointments 
-  Professional information 
-  Date/time 
-  Status 

---

### Progress Analytics

Provide meaningful wellness trends without implying medical conclusions.

Examples:

-  Meditation consistency 
-  Journal frequency 
-  Assessment history 
-  Mood trends 
-  Relaxation sessions 

---

# 14. Core Navigation

A possible global navigation structure:

```
```

```
NuroNest

Home
AI Companion
Assessment
Relaxation
Professionals
Resources

                 Login / Profile
```

After login:

```
```

```
Dashboard
AI Companion
Assessment
Relaxation
Professionals
Resources
Journal
Profile
```

On mobile, use a bottom navigation or hamburger menu.

---

# 15. Suggested Technical Architecture

The application should be designed as a modern full-stack web application.

A possible stack:

### Frontend

-  React / Next.js 
-  TypeScript 
-  Tailwind CSS 
-  Component-based architecture 

### Backend

-  Node.js 
-  API routes / Express depending on architecture 

### Database

-  PostgreSQL 

Possible ORM:

-  Prisma 

### Authentication

Possible options:

-  Clerk 
-  Auth.js 
-  JWT-based authentication 

The authentication layer should support anonymous users and authenticated users.

### AI

Use an LLM API for the AI Companion.

The AI integration should be isolated behind a service layer so that the model/provider can be changed later without rewriting the UI.

Example:

```
```

```
Frontend
   ↓
Backend API
   ↓
AI Service
   ↓
LLM Provider
```

---

# 16. Suggested Application Structure

A clean architecture could look like:

```
```

```
NuroNest
│
├── Landing Page
│
├── AI Companion
│   ├── Chat
│   ├── Conversation History
│   └── AI Recommendations
│
├── Assessment
│   ├── Assessment Selection
│   ├── Questions
│   ├── Scoring
│   ├── Results
│   └── Recommendations
│
├── Relaxation
│   ├── Breathing
│   ├── Meditation
│   ├── Sleep Sounds
│   ├── Relaxing Sounds
│   ├── Instrumental Music
│   ├── Guided Audio
│   └── Sound Mixer
│
├── Professionals
│   ├── Search
│   ├── Filters
│   ├── Professional Profile
│   ├── Availability
│   └── Booking
│
├── Resources
│   ├── Articles
│   ├── Videos
│   ├── Guides
│   ├── Self-help
│   └── Coping Strategies
│
├── Authentication
│
└── Dashboard
    ├── Mood
    ├── Assessments
    ├── AI History
    ├── Journal
    ├── Meditation
    ├── Soundscapes
    ├── Appointments
    └── Analytics
```

---

# 17. Important UX Principle

The application should follow a **progressive engagement model**.

Don't immediately ask:

> "Create an account."

Instead:

```
```

```
Visit NuroNest
      ↓
Explore
      ↓
Get value
      ↓
Personalize experience
      ↓
"Save your journey?"
      ↓
Create account
```

This makes the product less intimidating.

---

# 18. Design Language

NuroNest should have a visual identity around:

**Calm + Trust + Technology + Human warmth**

Use:

-  Soft blue/green/purple tones 
-  White/soft backgrounds 
-  Rounded cards 
-  Subtle shadows 
-  Smooth transitions 
-  Clean typography 
-  Minimal clutter 
-  Friendly icons 
-  Accessible contrast 

Avoid:

-  Excessive red 
-  Hospital-like UI 
-  Extremely dark interfaces 
-  Overly complicated dashboards 
-  Too many animations 
-  Excessive gradients 
-  Making the product look like a medical diagnosis platform 

---

# 19. Privacy & Safety

Because the platform deals with sensitive wellness information, privacy should be considered from the beginning.

Important principles:

-  Collect only necessary information. 
-  Clearly explain how user data is used. 
-  Protect authentication and user data. 
-  Don't expose private journal entries. 
-  Don't expose AI conversations to other users. 
-  Use secure API communication. 
-  Don't store API keys in frontend code. 
-  Keep AI API calls server-side. 
-  Provide appropriate crisis/professional-support information. 
-  Clearly communicate that assessments are **screening tools, not diagnoses**. 

---

# 20. Development Philosophy

When developing NuroNest, don't build everything at once.

Build incrementally.

### Phase 1 — UI Foundation

Build:

```
```

```
Landing Page
Navbar
Footer
Design System
Buttons
Cards
Modals
Responsive Layout
```

### Phase 2 — Core Wellness Features

Build:

```
```

```
AI Companion UI
Assessment UI
Relaxation Hub
Resources
```

### Phase 3 — Backend

Implement:

```
```

```
Database
Authentication
User profiles
Assessment storage
AI API
Journal
Preferences
```

### Phase 4 — Advanced Features

Implement:

```
```

```
Personalized recommendations
Sound mixer
Analytics
Professional search
Appointments
```

### Phase 5 — Security & Deployment

Implement:

```
```

```
Validation
Authorization
Error handling
Rate limiting
Security
Logging
Testing
CI/CD
Deployment
```

---

# 21. Important Development Rule

**Do not invent unrelated features.**

The provided flow diagram represents the current product vision.

When implementing a feature, preserve the overall product flow and architecture.

If a technical decision is required, prefer solutions that are:

1.  Simple 
2.  Scalable 
3.  Maintainable 
4.  Secure 
5.  Easy to demonstrate 
6.  Suitable for a production-quality portfolio project 

Avoid unnecessary complexity.

---

# 22. Current Development Goal

The immediate goal is to build a **polished, production-style NuroNest website**, not just a static college-project UI.

The final product should demonstrate:

-  Modern frontend development 
-  Full-stack development 
-  AI integration 
-  Authentication 
-  Database design 
-  API development 
-  Responsive UI 
-  State management 
-  Security 
-  CI/CD 
-  Deployment 
-  Good UX 

The website should feel like a **real startup/product**, rather than a basic academic project.