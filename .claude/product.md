---
inclusion: always
---

# Healing — Product Overview (Frontend)

Healing is a digital healthcare platform that connects patients with a broad spectrum of health specialists — human and veterinary medicine, traditional and non-traditional practices (Chinese medicine, therapies, holistic treatments, etc.). The platform centralizes each patient's medical history, enables multi-specialist collaboration, and integrates AI agents as first-class participants in the care journey.

This document captures the product from the **frontend** perspective: which surfaces we build, what each domain looks like to the user, and which business rules the UI must honor or enforce. Implementation details (services, infrastructure, transport) live in the backend documentation.

## Vision

Every patient owns a complete, portable health record built from every consultation and treatment on the platform. Every specialist has the tools, visibility, and AI assistance to deliver better care. The platform removes friction between disciplines, enabling truly integrative health management.

The frontend's job is to make that integrative experience feel obvious: a patient should see their full journey in one place, a specialist should be one click away from any context they need, and AI assistance should feel woven into the workflow — not bolted on.

## Core Domains

### 1. Specialist Management

Licensed healthcare professionals who provide care through the platform across all disciplines.

- Professional credential capture and submission flow (backend validates against external services)
- Public profile pages with bio, specialty, keywords, case studies, and ratings
- Profile-builder experience with a platform-provided AI assistant
- Support for human medicine, veterinary medicine, traditional and non-traditional practices
- Surface conflict feedback when email or license number is already in use
- Reflect the specialist status lifecycle in UI: pending → active → unavailable → deleted → banned

### 2. Patient Management

Patients are the central users whose health journey the platform serves.

- Authenticated profile screen with personal and contact information
- Unified medical record view: all reports, documents, prescriptions, and treatment history
- Favorite specialists list for quick access
- Specialist and AI agent reviews and ratings
- Data export experience (patients own and can take their data with them)

### 3. Appointment Scheduling

Consultations can be booked online (video/chat) or in-person, with both human specialists and AI agents.

- Booking flows for online (video, chat) and in-person consultations
- Distinct AI-agent booking experience (lower cost, virtually unlimited availability)
- Calendar and availability management UIs for specialists
- Appointment reminders surfaced in-app
- Post-consultation prompts to ensure the mandatory report is created

### 4. Consultation Reports & Medical Records

Every consultation produces a structured report that feeds the patient's unified health record.

- Report creation experience after every consultation (no skip path)
- Reports linked to patient record, specialist, and appointment in the UI
- Cross-specialist report sharing visible from the report and patient timeline
- Document upload UI (lab results, imaging, prescriptions) with progress and validation
- Chronological patient timeline across all specialists and disciplines

### 5. Multi-Specialist Collaboration

Patients often need care from multiple specialists. The platform enables direct collaboration.

- Shared patient context visible to all involved specialists
- Case discussions UI (structured threads per patient case)
- Referral flow between specialists
- Multi-disciplinary treatment plan views

### 6. AI Agents

AI is a core pillar of the platform, not an add-on.

- Each specialist has an agent management area to create and curate their own AI agent
- Guided agent-creation flow with the platform's instructions and tools
- Knowledge/protocol upload and review experience
- Agent roles surfaced in two distinct UI modes:
  - **Assistant mode**: in-consultation panels that suggest, draft reports, and surface relevant history for the specialist
  - **Autonomous consultation mode**: patient-facing chat/video experience, with explicit consent and liability disclosure
- Lower-cost AI consultations are clearly labeled vs. human consultations
- Lifecycle, versioning, and quality monitoring affordances for the specialist owner

### 7. Authentication & Authorization

The platform requires authentication for all interactions.

- Mandatory login for patients and specialists
- Role-based UI: patient, specialist, admin (routes, navigation, and visible actions depend on role)
- Secure session handling on the client
- Data access scoped by role — UI never offers actions the user cannot perform server-side

### 8. Reviews & Ratings

Trust and quality are built through transparent feedback.

- Post-consultation prompts inviting patients to rate and review specialists
- Ratings rendered on specialist public profiles
- Aggregated rating display (average score, total reviews)
- Moderation status surfaced to admins; flagged content hidden from regular views

### 9. Search & Discovery

Patients need to find the right specialist efficiently.

- Full-text search across specialist profiles (name, specialty, keywords, description)
- Filter UI by specialty, rating, availability, practice type
- Cursor-based pagination patterns for large result sets
- Sort controls for relevance, rating, recency

### 10. Notifications & Communication

Keeping all parties informed throughout the care journey.

- In-app notification surfaces for appointments, reports, case discussions, platform messages
- Channel preferences UI (email, push, SMS)
- New-report and case-discussion notifications surfaced to relevant specialists and patients
- Onboarding guidance presented in-product

## Feature Backlog

| #   | Feature                                                  | Domain                | Priority    |
| --- | -------------------------------------------------------- | --------------------- | ----------- |
| F1  | Specialist registration and credential validation        | Specialist Management | Implemented |
| F2  | Specialist profile search with filters and pagination    | Search & Discovery    | Implemented |
| F3  | Patient registration and profile management              | Patient Management    | High        |
| F4  | Authentication and authorization (patients + specialists)| Auth                  | High        |
| F5  | Appointment scheduling (online + in-person)              | Scheduling            | High        |
| F6  | Consultation report creation and storage                 | Reports & Records     | High        |
| F7  | Patient medical record (unified timeline)                | Reports & Records     | High        |
| F8  | Cross-specialist report sharing                          | Collaboration         | High        |
| F9  | Specialist public profile builder (with AI assistant)    | Specialist Management | Medium      |
| F10 | Case study publishing on specialist profile              | Specialist Management | Medium      |
| F11 | AI agent creation guided flow                            | AI Agents             | Medium      |
| F12 | AI agent as specialist assistant (consultation + reports)| AI Agents             | Medium      |
| F13 | AI agent autonomous consultations (patient-facing)       | AI Agents             | Medium      |
| F14 | Multi-specialist case discussions                        | Collaboration         | Medium      |
| F15 | Patient favorites list                                   | Patient Management    | Medium      |
| F16 | Reviews and ratings system                               | Reviews & Ratings     | Medium      |
| F17 | Notification system (email, push, SMS)                   | Notifications         | Medium      |
| F18 | Document upload and management (lab results, imaging)    | Reports & Records     | Medium      |
| F19 | Referral system between specialists                      | Collaboration         | Low         |
| F20 | Multi-disciplinary treatment plans                       | Collaboration         | Low         |
| F21 | AI agent quality monitoring and versioning               | AI Agents             | Low         |
| F22 | Admin dashboard (moderation, analytics, platform health) | Platform              | Low         |
| F23 | Payment and billing (consultations, AI consultations)    | Billing               | Low         |
| F24 | Video/chat infrastructure for online consultations       | Scheduling            | Low         |

> "Implemented" indicates the backend capability already exists. The frontend may still need to be built or aligned for those features.

## Key Business Rules

These rules originate in the domain and must be honored by the UI — either by enforcement (blocking invalid states) or by clear surfacing (informing the user of what is and isn't allowed):

- All specialists must hold valid professional licenses (e.g., CRM, CRMV in Brazil)
- External license validation is performed during onboarding; the UI must reflect pending/validated states
- Specialists must explicitly agree to share medical reports with patients (consent must be captured in the UI)
- Email and license number uniqueness must be communicated clearly when conflicts occur
- Every consultation (human or AI) must produce a report — the UI has no "skip" path
- AI consultations require explicit patient consent and liability acknowledgment before they can begin
- Only authenticated users can access protected experiences — public surfaces are limited
- Patients own their data and can export it at any time; the export action is a first-class UI element
- Specialists manage their own AI agents — the UI provides guardrails, previews, and monitoring affordances
- AI agents cannot prescribe controlled substances or make definitive diagnoses without specialist review — the UI must reflect these limits

## Frontend Architecture Philosophy

The frontend mirrors the backend's Domain-Driven Design with clear, feature-oriented boundaries:

- **Domain**: one folder per bounded context (`patient`, `specialist`, and future contexts like `scheduling`, `reports`, `ai-agents`, `collaboration`). Each domain owns its features, components, state, services, and types.
- **Features**: each user-facing capability lives as a feature slice inside its domain, composing components, state, and data access.
- **Shared**: cross-cutting building blocks (design system primitives, hooks, providers, utilities) live in a shared layer and stay free of domain knowledge.
- **App router**: routes act as thin composition points that wire a feature into the URL — pages should not contain business logic.

Boundaries are designed so domains can evolve independently as the platform grows. Observability, accessibility, performance, and resilience are first-class concerns, alongside data sovereignty (patients own their data, and the UI must make that real).
