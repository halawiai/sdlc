# HALA SDLC Process Visualization Platform
## Technical Documentation

**Version:** 2.2
**Last Updated:** February 2026
**Platform Type:** Web Application (SPA)

---

## Table of Contents

1. [Business Value](#1-business-value)
2. [Process Flow](#2-process-flow)
3. [Backend Architecture](#3-backend-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Database](#5-database)
6. [CI/CD Pipeline](#6-cicd-pipeline)
7. [Technical Stack](#7-technical-stack)
8. [File Structure](#8-file-structure)
9. [Key Features](#9-key-features)
10. [Development Roadmap](#10-development-roadmap)

---

## 1. Business Value

### 1.1 Overview

The HALA SDLC Process Visualization Platform is an enterprise-grade web application designed to standardize, visualize, and manage software development lifecycle processes across HALA's technology organization. It serves as the single source of truth for project management, governance, and compliance workflows.

### 1.2 Core Business Benefits

| Benefit | Description | Impact |
|---------|-------------|--------|
| **Process Standardization** | Unified SDLC framework for all technology initiatives | Reduces confusion, improves consistency across teams |
| **Governance & Compliance** | Built-in approval gates, RACI matrices, and Central Bank NOC validation | Ensures regulatory compliance and risk management |
| **Decision Support** | Scientific scoring system for project track selection | Data-driven decisions, optimal resource allocation |
| **Transparency** | Visual process flows with clear ownership and responsibilities | Enhanced stakeholder communication and accountability |
| **Knowledge Management** | Centralized documentation of phases, tasks, and criteria | Faster onboarding, reduced knowledge silos |
| **Efficiency** | Streamlined workflows with dual-track system | Faster time-to-market for appropriate projects |

### 1.3 Target Users

1. **Project Management Office (PMO)**: Primary users for governance and oversight
2. **Product Managers**: Track selection and product lifecycle management
3. **Business Analysts**: Requirements gathering and validation
4. **Engineering Teams**: Development planning and execution tracking
5. **QA Teams**: Testing strategy and quality gates
6. **Business Stakeholders**: Approval workflows and progress visibility
7. **Risk & Compliance**: Regulatory validation and Central Bank NOC coordination

### 1.4 Key Use Cases

- **Project Initiation**: Guide teams through discovery and initiation phases
- **Track Selection**: Scientific scoring to determine Enterprise vs Product track
- **Phase Navigation**: Interactive exploration of SDLC phases with detailed information
- **Governance Compliance**: Validate completion of gate criteria and approvals
- **Process Documentation**: Export and share process flows for training and reference
- **Framework Management**: Manage RACI matrices, prioritization criteria, and governance rules

### 1.5 Business Metrics & KPIs

- **Process Adoption Rate**: Percentage of projects following standardized SDLC
- **Time-to-Decision**: Speed of track selection decisions
- **Gate Compliance**: Percentage of projects meeting phase gate criteria
- **Regulatory Compliance**: 100% NOC validation when required
- **User Engagement**: Platform usage by PMO, Product, and Business teams
- **Documentation Quality**: Completeness of project artifacts

---

## 2. Process Flow

### 2.1 SDLC Process Overview

The platform implements HALA's dual-track SDLC framework with 12 structured phases:

```
Discovery (0) → Initiation (1) → Owner Decision
                                      ↓
                        ┌─────────────┴─────────────┐
                  Enterprise Track            Product Track
                  (Complex Projects)         (Simple Projects)
                        ↓                           ↓
         E2: Enterprise Requirements    P2: Product Requirements
         E3: Business Review            P3: Design
         E4: Planning                   P4: Grooming
                        └─────────────┬─────────────┘
                                      ↓
                        Solution Architecture (SA)
                                      ↓
                        Development (5) ←→ QA (5.1)
                                      ↓
                      Business/Product Acceptance (6)
                                      ↓
                        Release Management (7)
                                      ↓
                      Post Implementation (8)
                                      ↓
                            Closure (9)
```

### 2.2 Parallel Processes

**Central Bank NOC Check**: Runs parallel to Discovery phase when regulatory approval is required.

### 2.3 Track Decision Logic

**Scoring Criteria**:
- Customer Impact (1-5 scale)
- Market Demand (1-5 scale)
- Request Features (1-5 scale)

**Decision Rules**:
- **Score < 9**: Product Track (streamlined)
- **Score = 9**: Discussion required (PMO + Product + BA)
- **Score > 9**: Enterprise Track (comprehensive)

### 2.4 Exception States

1. **DROPPED**: Project cancelled or terminated
2. **ON HOLD**: Project temporarily suspended

### 2.5 Phase Details

Each phase includes:
- **Owner**: Responsible party (PMO, Product, Engineering, etc.)
- **Process Focus**: Main objectives and activities
- **Inputs**: Required deliverables to start the phase
- **Outputs**: Deliverables produced by the phase
- **Key Tasks**: Specific activities to be completed
- **Gate Criteria**: Exit criteria to move to next phase
- **RACI Matrix**: Role assignments (Responsible, Accountable, Consulted, Informed)
- **Duration SLAs**: Expected timeframes (Enterprise vs Product track)

---

## 3. Backend Architecture

### 3.1 Current State

**Status**: No backend currently implemented

The application is currently a **static frontend-only** Single Page Application (SPA) with no backend API or server-side processing.

### 3.2 Backend Readiness

**Available Infrastructure**:
- Supabase instance provisioned and configured
- Environment variables configured in `.env` file:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### 3.3 Recommended Backend Architecture

When backend implementation is required, the recommended architecture includes:

#### 3.3.1 Database Layer (Supabase PostgreSQL)
```
Tables (Proposed):
- projects: Project metadata and status
- project_phases: Phase completion tracking
- users: User accounts and roles
- approvals: Approval workflow tracking
- audit_log: Change history and compliance tracking
- raci_assignments: Role assignments per project
- noc_validations: Central Bank NOC tracking
```

#### 3.3.2 API Layer (Supabase Edge Functions)
```
Functions (Proposed):
- /functions/v1/projects: CRUD operations for projects
- /functions/v1/track-scoring: Calculate track selection scores
- /functions/v1/approvals: Manage approval workflows
- /functions/v1/exports: Generate PDF/Excel reports
- /functions/v1/notifications: Send notifications to stakeholders
```

#### 3.3.3 Authentication (Supabase Auth)
- Email/password authentication
- Role-Based Access Control (RBAC)
- Row Level Security (RLS) policies

#### 3.3.4 Storage (Supabase Storage)
- Project documents
- Exported reports and diagrams
- User uploads

### 3.4 Integration Points

**Future Integrations**:
- **JIRA/Azure DevOps**: Project management tool sync
- **Microsoft Teams/Slack**: Notifications and updates
- **Email**: Approval requests and notifications
- **Central Bank Systems**: NOC submission and tracking
- **HR Systems**: Team member information
- **BI Tools**: Analytics and reporting dashboards

---

## 4. Frontend Architecture

### 4.1 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.5.3 | Type safety and developer experience |
| **Vite** | 5.4.2 | Build tool and dev server |
| **React Router** | 7.7.0 | Client-side routing |
| **ReactFlow** | 11.11.4 | Interactive flow diagrams |
| **Tailwind CSS** | 3.4.1 | Styling framework |
| **Lucide React** | 0.344.0 | Icon library |
| **html2canvas** | 1.4.1 | Canvas/image export |
| **jsPDF** | 3.0.1 | PDF generation |
| **xlsx** | 0.18.5 | Excel export |

### 4.2 Application Structure

```
src/
├── App.tsx                 # Main application component with routing
├── main.tsx               # Application entry point
├── index.css              # Global styles
├── components/            # Reusable UI components
│   ├── Layout.tsx         # Main layout with navigation
│   ├── PhaseNode.tsx      # Phase visualization node
│   ├── DecisionNode.tsx   # Decision diamond node
│   ├── PhaseDetailModal.tsx   # Phase information modal
│   ├── LegendModal.tsx    # Legend display
│   ├── FeedbackModal.tsx  # User feedback form
│   └── editable/          # Editable process components
├── canvas/                # Process flow canvas implementations
│   ├── ProcessFlowMinimalCanvas2.tsx  # Main V2 canvas
│   ├── ProcessFlowV2Canvas.tsx        # V2 variations
│   └── [other canvas versions]
├── pages/                 # Application pages/routes
│   ├── ProcessFlowTestPage.tsx    # Main process flow (V2)
│   ├── ProcessFlowPage.tsx        # Legacy process flow
│   ├── RACIMatrixPage.tsx         # RACI matrix view
│   ├── GovernanceFrameworkPage.tsx # Governance details
│   ├── CriteriaMatrixPage.tsx     # Track decision criteria
│   ├── PrioritizationFrameworkPage.tsx # WRIVE scoring
│   ├── SDLCProcessPage.tsx        # Document viewer
│   └── [other pages]
├── data/                  # Static data and configurations
│   ├── lifecycleDataV25.ts        # Phase definitions
│   └── lifecycleDataV25Details.ts # Detailed phase info
└── utils/                 # Utility functions
    ├── exportUtils.ts     # Export functionality
    └── searchIndex.ts     # Search indexing
```

### 4.3 Key Components

#### 4.3.1 Layout Component (`src/components/Layout.tsx`)
- Responsive navigation header
- Dropdown menus for different views
- Footer with branding
- Wrapper for all page content

#### 4.3.2 Process Flow Canvas (`src/canvas/ProcessFlowMinimalCanvas2.tsx`)
- Interactive SVG-based flow diagram
- Phase nodes with click handlers
- Decision diamonds
- Curved connectors and arrows
- Parallel process visualization (NOC)
- Responsive layout

#### 4.3.3 Phase Detail Modal (`src/components/PhaseDetailModal.tsx`)
- Modal dialog for phase information
- Tabbed interface:
  - Overview: Owner, focus, gate criteria
  - Details: Inputs, outputs, key tasks
  - RACI: Role assignments
- Export functionality

#### 4.3.4 RACI Matrix Page (`src/pages/RACIMatrixPage.tsx`)
- Tabbed view: Enterprise Track vs Product Track
- Interactive matrix with color-coded cells
- Role definitions
- Export to Excel

#### 4.3.5 Criteria Matrix Page (`src/pages/CriteriaMatrixPage.tsx`)
- Track decision scoring tool
- Interactive criteria selection
- Real-time score calculation
- Decision recommendation display

### 4.4 Routing Structure

```typescript
Route Structure:
/                                  → ProcessFlowTestPage (V2)
/process-flow                      → ProcessFlowPage (Legacy)
/process-flow-test                 → ProcessFlowTestPage (V2)
/criteria                          → CriteriaMatrixPage
/prioritization-framework          → PrioritizationFrameworkPage
/raci-matrix                       → RACIMatrixPage
/governance-framework              → GovernanceFrameworkPage
/sdlc-process                      → SDLCProcessPage
/sitemap                          → SitemapPage
/about                            → AboutPage
/help                             → HelpPage
/editable-test                    → EditableProcessTestPage
/documentation/editable-process   → EditableProcessPage
*                                 → NotFoundPage
```

### 4.5 State Management

**Current Implementation**: React hooks and local state
- `useState` for component-level state
- `useMemo` for computed values
- No global state management library (Redux, Zustand, etc.)

**Future Consideration**: When backend is integrated, consider:
- React Query for server state management
- Zustand or Context API for global client state

### 4.6 Data Flow

```
Static Data (lifecycleDataV25.ts)
    ↓
Component Props
    ↓
Component State (useState)
    ↓
UI Rendering
    ↓
User Interaction
    ↓
Modal Display / Navigation
```

### 4.7 Export Functionality

**Supported Export Formats**:

1. **PNG Image** (`html2canvas`):
   - Process flow diagrams
   - High-resolution screenshots
   - Filename: `pmo-process-flow-v2-YYYY-MM-DD.png`

2. **PDF** (`jsPDF`):
   - RACI matrices
   - Governance frameworks
   - Multi-page documents

3. **Excel** (`xlsx`):
   - RACI matrices
   - Prioritization data
   - Tabular information

4. **Print**:
   - Direct browser printing
   - Print-optimized layouts

### 4.8 Responsive Design

**Breakpoints**:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Responsive Features**:
- Collapsible navigation on mobile
- Flexible grid layouts
- Touch-optimized controls
- Readable text sizes across devices

---

## 5. Database

### 5.1 Current State

**Status**: No database currently implemented

The application uses static data defined in TypeScript files (`src/data/`).

### 5.2 Database Readiness

**Available Infrastructure**:
- Supabase PostgreSQL database provisioned
- Connection details in `.env` file
- Ready for migration creation and table setup

### 5.3 Proposed Database Schema

#### 5.3.1 Core Tables

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('PMO', 'Product', 'BA', 'Engineering', 'QA', 'Business', 'Risk_Compliance')),
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**projects**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  track TEXT CHECK (track IN ('Enterprise', 'Product', 'Undecided')),
  current_phase TEXT,
  status TEXT CHECK (status IN ('Active', 'OnHold', 'Dropped', 'Completed')),
  customer_impact_score INTEGER CHECK (customer_impact_score BETWEEN 1 AND 5),
  market_demand_score INTEGER CHECK (market_demand_score BETWEEN 1 AND 5),
  features_score INTEGER CHECK (features_score BETWEEN 1 AND 5),
  total_score INTEGER GENERATED ALWAYS AS (customer_impact_score + market_demand_score + features_score) STORED,
  noc_required BOOLEAN DEFAULT false,
  noc_status TEXT CHECK (noc_status IN ('Not_Required', 'Pending', 'Approved', 'Rejected')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**project_phases**
```sql
CREATE TABLE project_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_id TEXT NOT NULL,
  phase_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('Not_Started', 'In_Progress', 'Completed', 'Skipped')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  gate_criteria_met BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, phase_id)
);
```

**approvals**
```sql
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_id TEXT NOT NULL,
  approver_id UUID REFERENCES users(id),
  approval_status TEXT CHECK (approval_status IN ('Pending', 'Approved', 'Rejected', 'Revoked')),
  comments TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**raci_assignments**
```sql
CREATE TABLE raci_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  phase_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  responsibility TEXT CHECK (responsibility IN ('Responsible', 'Accountable', 'Consulted', 'Informed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, phase_id, user_id)
);
```

**audit_log**
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**noc_validations**
```sql
CREATE TABLE noc_validations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  submission_date TIMESTAMPTZ,
  central_bank_reference TEXT,
  status TEXT CHECK (status IN ('Pending', 'Submitted', 'Under_Review', 'Approved', 'Rejected')),
  approval_date TIMESTAMPTZ,
  rejection_reason TEXT,
  documents JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### 5.3.2 Row Level Security (RLS)

All tables must have RLS enabled with appropriate policies:

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can view projects they're assigned to
CREATE POLICY "Users can view assigned projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT project_id FROM raci_assignments
      WHERE user_id = auth.uid()
    )
    OR created_by = auth.uid()
  );
```

### 5.4 Data Migration Strategy

When implementing database:

1. **Phase 1**: Read-only integration
   - Display existing static data
   - No writes to database
   - Verify schema and queries

2. **Phase 2**: Project creation
   - Allow new project creation
   - Track selection scoring
   - Basic CRUD operations

3. **Phase 3**: Phase tracking
   - Phase progression
   - Gate criteria validation
   - Approval workflows

4. **Phase 4**: Full integration
   - Complete audit trail
   - NOC workflow
   - Advanced reporting

---

## 6. CI/CD Pipeline

### 6.1 Current State

**Status**: No CI/CD pipeline currently configured

The project uses manual builds and deployments.

### 6.2 Build Commands

```bash
# Development server
npm run dev          # Starts Vite dev server on port 5173

# Production build
npm run build        # Builds production bundle to dist/

# Preview production build
npm run preview      # Preview production build locally

# Linting
npm run lint         # ESLint code quality check
```

### 6.3 Recommended CI/CD Architecture

#### 6.3.1 GitHub Actions Workflow

**File**: `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy-staging:
    needs: lint-and-test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Staging
        run: |
          # Deploy to staging environment
          # e.g., Netlify, Vercel, or custom server

  deploy-production:
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Production
        run: |
          # Deploy to production environment
```

#### 6.3.2 Environment Configuration

**Environments**:
- **Development**: Local development (localhost:5173)
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

**Environment Variables** (per environment):
```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
VITE_APP_VERSION=<version-number>
VITE_ENVIRONMENT=<dev|staging|production>
```

#### 6.3.3 Deployment Platforms

**Recommended Options**:

1. **Netlify** (Recommended for static sites)
   - Automatic builds from Git
   - Preview deployments for PRs
   - Built-in CDN
   - Custom domain support

2. **Vercel**
   - Optimized for React/Vite
   - Edge network deployment
   - Zero-config deployments

3. **AWS S3 + CloudFront**
   - Enterprise-grade hosting
   - Full control over infrastructure
   - Integration with AWS services

4. **Azure Static Web Apps**
   - Microsoft ecosystem integration
   - Built-in authentication
   - API integration

### 6.4 Quality Gates

**Pre-deployment Checks**:
- ✅ ESLint passes with no errors
- ✅ TypeScript compilation successful
- ✅ Production build completes
- ✅ No console errors in build output
- ✅ Bundle size within limits

**Post-deployment Checks**:
- ✅ Application loads successfully
- ✅ All routes accessible
- ✅ No JavaScript errors in browser console
- ✅ Performance metrics acceptable (Lighthouse score)

### 6.5 Rollback Strategy

**Manual Rollback**:
1. Identify last stable deployment
2. Revert Git commits or redeploy previous version
3. Notify stakeholders

**Automated Rollback** (future):
- Health check endpoints
- Automatic rollback on failed health checks
- Canary deployments

---

## 7. Technical Stack

### 7.1 Core Technologies

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 18.3.1 | UI component library |
| **Language** | TypeScript | 5.5.3 | Type-safe JavaScript |
| **Build Tool** | Vite | 5.4.2 | Fast build and HMR |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS |
| **Routing** | React Router | 7.7.0 | Client-side navigation |

### 7.2 Visualization Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **ReactFlow** | 11.11.4 | Interactive flow diagrams and node graphs |
| **html2canvas** | 1.4.1 | Convert DOM to canvas for image export |
| **jsPDF** | 3.0.1 | Client-side PDF generation |

### 7.3 UI Components & Icons

| Library | Version | Purpose |
|---------|---------|---------|
| **Lucide React** | 0.344.0 | Modern icon library |
| **Tailwind CSS** | 3.4.1 | Responsive design system |

### 7.4 Data Export

| Library | Version | Purpose |
|---------|---------|---------|
| **xlsx** | 0.18.5 | Excel file generation |

### 7.5 Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9.9.1 | Code quality and consistency |
| **TypeScript ESLint** | 8.3.0 | TypeScript linting rules |
| **PostCSS** | 8.4.35 | CSS processing |
| **Autoprefixer** | 10.4.18 | CSS vendor prefixing |

---

## 8. File Structure

```
/tmp/cc-agent/55327676/project/
├── .env                              # Environment variables (Supabase config)
├── .gitignore                        # Git ignore rules
├── index.html                        # HTML entry point
├── package.json                      # Dependencies and scripts
├── package-lock.json                 # Dependency lock file
├── tsconfig.json                     # TypeScript configuration
├── tsconfig.app.json                 # App-specific TS config
├── tsconfig.node.json                # Node-specific TS config
├── vite.config.ts                    # Vite build configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── eslint.config.js                  # ESLint configuration
├── README.md                         # Project overview
├── HALA_SDLC_Process_Document_v2.2.md # SDLC process documentation
├── TECHNICAL_DOCUMENTATION.md        # This file
│
├── .milestone-1.txt                  # Project milestone checkpoint
├── .milestone-2.txt                  # Dropdown navigation fixes
├── .milestone-3.txt                  # React rendering fixes
│
├── src/
│   ├── main.tsx                      # Application entry point
│   ├── App.tsx                       # Main app component with routing
│   ├── index.css                     # Global styles and Tailwind imports
│   ├── vite-env.d.ts                 # Vite type definitions
│   │
│   ├── assets/                       # Static assets
│   │   ├── image.png
│   │   └── image copy.png
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── Layout.tsx                # Main layout with navigation
│   │   ├── PhaseNode.tsx             # Phase circle node
│   │   ├── DecisionNode.tsx          # Decision diamond node
│   │   ├── ExceptionNode.tsx         # Exception state node
│   │   ├── InfoBoxNode.tsx           # Information box node
│   │   ├── SpecialElementNode.tsx    # Special element node
│   │   ├── GroupContainerNode.tsx    # Container for grouped nodes
│   │   ├── PhaseDetailModal.tsx      # Phase information modal
│   │   ├── LegendModal.tsx           # Process legend modal
│   │   ├── FeedbackModal.tsx         # User feedback form
│   │   ├── ProcessFlowV3Canvas.tsx   # V3 canvas implementation
│   │   ├── ProcessFlowV4Canvas.tsx   # V4 canvas implementation
│   │   └── editable/                 # Editable process components
│   │       ├── EditablePhaseNode.tsx
│   │       ├── EditableInfoBoxNode.tsx
│   │       ├── EditableConnectionLine.tsx
│   │       └── DecisionNode.tsx
│   │
│   ├── canvas/                       # Process flow canvas implementations
│   │   ├── index.ts                  # Canvas exports
│   │   ├── ProcessFlowMinimalCanvas2.tsx    # Main V2 canvas (current)
│   │   ├── ProcessFlowMinimalCanvas1.tsx    # V1 minimal canvas
│   │   ├── ProcessFlowMinimalCanvas.tsx     # Original minimal canvas
│   │   ├── ProcessFlowCleanCanvas.tsx       # Clean version
│   │   ├── ProcessFlowV2Canvas.tsx          # V2 variations
│   │   ├── ProcessFlowV2_3Canvas.tsx
│   │   └── ProcessFlowV4_1Canvas.tsx
│   │
│   ├── pages/                        # Application pages/routes
│   │   ├── ProcessFlowTestPage.tsx   # Main process flow page (V2) - DEFAULT
│   │   ├── ProcessFlowPage.tsx       # Legacy process flow
│   │   ├── VisualProcessPage.tsx     # Visual process view
│   │   ├── VisualProcessTestPage.tsx # Visual process test view
│   │   ├── HorizontalProcessPage.tsx # Horizontal layout view
│   │   ├── FullLifecyclePage.tsx     # Full lifecycle details
│   │   ├── RACIMatrixPage.tsx        # RACI matrix display
│   │   ├── GovernanceFrameworkPage.tsx # Governance framework
│   │   ├── CriteriaMatrixPage.tsx    # Track decision criteria
│   │   ├── PrioritizationFrameworkPage.tsx # WRIVE framework
│   │   ├── SDLCProcessPage.tsx       # SDLC document viewer
│   │   ├── EditableProcessPage.tsx   # Editable process view
│   │   ├── EditableProcessTestPage.tsx # Editable test view
│   │   ├── SitemapPage.tsx           # Site navigation map
│   │   ├── AboutPage.tsx             # About information
│   │   ├── HelpPage.tsx              # Help and documentation
│   │   ├── NotFoundPage.tsx          # 404 error page
│   │   └── ProcessFlowTestPage_old.tsx # Archived version
│   │
│   ├── data/                         # Static data definitions
│   │   ├── lifecycleDataV25.ts       # V2.5 phase structure
│   │   └── lifecycleDataV25Details.ts # Detailed phase information
│   │
│   └── utils/                        # Utility functions
│       ├── exportUtils.ts            # Export to PDF/Excel/Image
│       └── searchIndex.ts            # Search functionality
│
└── node_modules/                     # Dependencies (not in Git)
```

---

## 9. Key Features

### 9.1 Interactive Process Visualization

**Description**: Interactive flow diagrams built with ReactFlow showing the complete SDLC process.

**Features**:
- Click phases to view detailed information
- Visual distinction between Enterprise and Product tracks
- Parallel process visualization (NOC)
- Curved connectors and arrows
- Responsive layout for all screen sizes

**Implementation**: `src/canvas/ProcessFlowMinimalCanvas2.tsx`

### 9.2 Phase Detail Modal

**Description**: Comprehensive phase information in modal dialog.

**Features**:
- Tabbed interface (Overview, Details, RACI)
- Owner, focus, gate criteria
- Inputs, outputs, key tasks
- RACI matrix for role assignments
- Export functionality

**Implementation**: `src/components/PhaseDetailModal.tsx`

### 9.3 Track Decision Criteria

**Description**: Scientific scoring system for track selection.

**Features**:
- Three scoring dimensions (Customer Impact, Market Demand, Features)
- Interactive criteria selection
- Real-time score calculation
- Decision recommendation (Enterprise vs Product vs Discussion)
- Visual score display

**Implementation**: `src/pages/CriteriaMatrixPage.tsx`

### 9.4 RACI Matrix

**Description**: Role responsibility matrix for all phases.

**Features**:
- Tabbed view: Enterprise Track vs Product Track
- Color-coded cells (Responsible, Accountable, Consulted, Informed)
- Role definitions and explanations
- Export to Excel
- Filterable by phase or role

**Implementation**: `src/pages/RACIMatrixPage.tsx`

### 9.5 Governance Framework

**Description**: Communication matrix and risk management framework.

**Features**:
- Communication frequency and participants
- Risk response strategies
- Quality gates and Definition of Done framework
- Stakeholder update schedules
- SLA tracking

**Implementation**: `src/pages/GovernanceFrameworkPage.tsx`

### 9.6 Prioritization Framework (WRIVE)

**Description**: Weighted RICE + Value/Effort scoring model.

**Features**:
- Interactive scoring calculator
- Customizable weights
- Strategic alignment scoring
- Prioritization recommendations
- Visual score breakdown

**Implementation**: `src/pages/PrioritizationFrameworkPage.tsx`

### 9.7 Export Functionality

**Description**: Multi-format export of process artifacts.

**Formats**:
- PNG images (process flows)
- PDF documents (matrices, frameworks)
- Excel spreadsheets (RACI matrices)
- Print-optimized layouts

**Implementation**: `src/utils/exportUtils.ts`

### 9.8 Central Bank NOC Integration

**Description**: Regulatory compliance tracking for Central Bank No Objection Certificate.

**Features**:
- Parallel process visualization
- NOC requirement determination
- Status tracking (Pending, Submitted, Approved, Rejected)
- Compliance clearance documentation

**Implementation**: Integrated in process flow with NOC phase data

### 9.9 Responsive Navigation

**Description**: Multi-level navigation with dropdown menus.

**Features**:
- Process flows submenu
- Documentation submenu
- Frameworks submenu
- Mobile-responsive collapsible menu
- Smooth animations and transitions

**Implementation**: `src/components/Layout.tsx`

### 9.10 Legend and Help

**Description**: Contextual help and legend for process understanding.

**Features**:
- Role definitions
- Phase type explanations
- Decision criteria guide
- Usage instructions
- Color coding reference

**Implementation**: `src/components/LegendModal.tsx` and `src/pages/HelpPage.tsx`

---

## 10. Development Roadmap

### 10.1 Completed Features (Current State)

- ✅ Interactive process flow visualization (V2)
- ✅ Phase detail modal with comprehensive information
- ✅ Track decision criteria matrix
- ✅ RACI matrix (Enterprise and Product tracks)
- ✅ Governance framework display
- ✅ Prioritization framework (WRIVE)
- ✅ Export to PNG, PDF, Excel
- ✅ Print functionality
- ✅ Central Bank NOC integration
- ✅ Responsive design
- ✅ Multi-page navigation
- ✅ Legend and help documentation

### 10.2 Phase 1: Backend Integration (Recommended Next Steps)

**Priority: High**

1. **Database Setup**
   - Create Supabase migrations for core tables
   - Implement Row Level Security policies
   - Set up initial data seeding

2. **Authentication**
   - Implement Supabase Auth
   - Email/password authentication
   - Role-based access control (PMO, Product, BA, etc.)

3. **Project CRUD**
   - Create project endpoint
   - Read project list
   - Update project status and track
   - Delete/archive projects

4. **Track Scoring API**
   - API endpoint for score calculation
   - Score history tracking
   - Decision recommendation logic

### 10.3 Phase 2: Workflow Management

**Priority: High**

1. **Phase Progression**
   - Track current phase per project
   - Phase completion validation
   - Gate criteria checking

2. **Approval Workflows**
   - Create approval requests
   - Approve/reject functionality
   - Notification system (email/in-app)

3. **RACI Assignment**
   - Dynamic RACI assignment per project
   - Team member selection
   - Role notifications

### 10.4 Phase 3: Advanced Features

**Priority: Medium**

1. **NOC Workflow**
   - NOC submission tracking
   - Central Bank integration (if API available)
   - Document upload and management
   - Status updates and notifications

2. **Reporting & Analytics**
   - Project dashboard
   - Phase duration analytics
   - Resource utilization reports
   - Gate compliance metrics

3. **Real-time Collaboration**
   - Multi-user editing
   - Real-time updates (Supabase Realtime)
   - Activity feed
   - Comments and discussions

### 10.5 Phase 4: Integration & Automation

**Priority: Medium**

1. **External Integrations**
   - JIRA/Azure DevOps sync
   - Microsoft Teams/Slack notifications
   - Calendar integration (Outlook/Google Calendar)
   - Email notifications (SendGrid/Mailgun)

2. **Automation**
   - Automated phase transitions
   - Reminder notifications for approvals
   - Escalation workflows
   - SLA violation alerts

3. **Document Management**
   - Document upload and versioning
   - Template library (BRD, PRD, etc.)
   - Document search and indexing

### 10.6 Phase 5: AI & Intelligence

**Priority: Low**

1. **AI-Powered Features**
   - Automatic track recommendation based on project description
   - Risk prediction and mitigation suggestions
   - Timeline estimation using historical data
   - Natural language search

2. **Advanced Analytics**
   - Predictive analytics for project success
   - Resource optimization recommendations
   - Bottleneck identification
   - Performance benchmarking

### 10.7 Technical Debt & Improvements

**Ongoing**

1. **Code Quality**
   - Add unit tests (Jest/Vitest)
   - Add integration tests (Cypress/Playwright)
   - Improve TypeScript strict mode compliance
   - Code documentation (JSDoc)

2. **Performance Optimization**
   - Lazy loading for pages
   - Code splitting
   - Image optimization
   - Bundle size reduction

3. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support
   - Color contrast validation

4. **Security**
   - Security headers
   - Content Security Policy
   - XSS protection
   - Regular dependency updates

---

## Appendix A: Environment Variables

### Required Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Application Configuration
VITE_APP_VERSION=2.2.0
VITE_ENVIRONMENT=development
```

### How to Set Up

1. Copy `.env.example` to `.env`
2. Replace placeholders with actual values
3. Never commit `.env` file to Git
4. Use environment-specific `.env` files for different environments

---

## Appendix B: Development Commands

### Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Troubleshooting

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Fix linting issues
npm run lint -- --fix
```

---

## Appendix C: Deployment Checklist

### Pre-Deployment

- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run build` - successful build
- [ ] Test production build locally with `npm run preview`
- [ ] Verify all environment variables are configured
- [ ] Check for console errors in browser
- [ ] Test all major user flows
- [ ] Verify export functionality (PNG, PDF, Excel)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test responsive design on mobile and tablet

### Deployment

- [ ] Tag release in Git
- [ ] Deploy to staging environment
- [ ] Run smoke tests on staging
- [ ] Get stakeholder approval
- [ ] Deploy to production
- [ ] Monitor for errors in production

### Post-Deployment

- [ ] Verify application loads successfully
- [ ] Test critical user journeys
- [ ] Check browser console for errors
- [ ] Monitor performance metrics
- [ ] Notify stakeholders of successful deployment

---

## Appendix D: Support & Maintenance

### Support Contacts

- **Technical Lead**: [Name/Email]
- **PMO Office**: [Contact]
- **DevOps**: [Contact]

### Maintenance Schedule

- **Dependency Updates**: Monthly
- **Security Patches**: As needed (critical within 24h)
- **Feature Releases**: Quarterly
- **Documentation Updates**: As needed

### Monitoring

**Recommended Monitoring Tools**:
- **Error Tracking**: Sentry, LogRocket
- **Performance**: Google Lighthouse, WebPageTest
- **Uptime**: Pingdom, UptimeRobot
- **Analytics**: Google Analytics, Mixpanel

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | AI Documentation | Initial comprehensive technical documentation |

---

**End of Technical Documentation**
