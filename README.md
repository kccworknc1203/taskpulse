# TaskPulse

A full-stack, agile issue tracking platform engineered with the Next.js App Router, TypeScript, Prisma ORM, and Neon Serverless PostgreSQL. Designed for sprint management with instant server-side updates, URL-driven filtering, and dual workspace views.

---

## Live Demo & Repository

- **Live Demo:** [https://taskpulse.vercel.app](https://taskpulse.vercel.app)
- **GitHub Repository:** [https://github.com/kccworknc1203/taskpulse](https://github.com/kccworknc1203/taskpulse)

---

## Core Features

- **Dual Workspace Views:** Switch between an interactive Kanban board with column-based sprint lanes (`To Do`, `In Progress`, `In Review`, `Done`) and a dense List view.
- **Debounced Server-Side Search:** Real-time query synchronization across title and description fields using URL parameters (`?q=query`) and PostgreSQL case-insensitive pattern matching.
- **Type-Safe Data Mutations:** Full issue CRUD powered by Next.js Server Actions and validated against runtime Zod schemas.
- **Sprint Metrics Dashboard:** Aggregated top-level progress cards displaying real-time task distribution and workload health.
- **Non-Blocking UI Updates:** Optimistic state transitions using React's `useTransition` to prevent waterfall UI locks during database writes.
- **Serverless-Optimized Database Layer:** Split architecture utilizing pooled connection proxies (PgBouncer) for standard queries and direct connections for schema migrations.

---

## Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React Server Components, Server Actions, streaming SSR |
| **Language** | TypeScript 5 | Strict static typing and end-to-end interface contracts |
| **Database** | Neon PostgreSQL | Cloud-native serverless relational persistence |
| **ORM** | Prisma ORM 6 | Schema migrations, typed queries, and relational integrity |
| **Validation** | Zod 4 | Server-side payload parsing and runtime contract enforcement |
| **Styling** | Tailwind CSS 4 | Responsive, dark-mode native user interface |
| **Deployment** | Vercel | Production hosting, CI/CD pipeline, Edge routing |

---

## Database Architecture

The schema maintains strict relational integrity across three core entities:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatarUrl String?
  issues    Issue[]  @relation("AssignedIssues")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id          String   @id @default(cuid())
  name        String
  key         String   @unique
  description String?
  issues      Issue[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Issue {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      Status   @default(TODO)
  priority    Priority @default(MEDIUM)
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assigneeId  String?
  assignee    User?    @relation("AssignedIssues", fields: [assigneeId], references: [id], onDelete: SetNull)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([projectId])
  @@index([status])
}

enum Status {
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
