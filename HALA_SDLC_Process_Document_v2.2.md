# HALA Software Development Life Cycle (SDLC) Process Document

**Version 2.2 - Updated Process Guide**

*This document defines HALA's standardized Software Development Life Cycle (SDLC) process for all technology initiatives. The framework provides a structured approach to project execution with clear phases, decision criteria, and accountability measures.*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Track Decision Logic](#2-track-decision-logic)
3. [Phase Documentation](#3-phase-documentation)
4. [RACI Matrix](#4-raci-matrix)
5. [Prioritization Framework](#5-prioritization-framework)
6. [Governance Framework](#6-governance-framework)
7. [Central Bank NOC Process](#7-central-bank-noc-process)
8. [Appendix A: SLA Framework](#appendix-a-sla-framework)

---

## 1. Executive Summary

This document defines HALA's standardized Software Development Life Cycle (SDLC) process for all technology initiatives. The framework provides a structured approach to project execution with clear phases, decision criteria, and accountability measures.

### Key Features

| Feature | Description |
|---------|-------------|
| **Dual-Track System** | Enterprise and Product paths for different complexity levels |
| **12 Structured Phases** | From Discovery to Closure with parallel NOC validation |
| **Clear RACI Assignments** | Defined roles and responsibilities with Risk & Compliance integration |
| **Integrated QA Process** | Parallel testing throughout development with DoD validation |
| **Governance Framework** | Built-in risk, change, and quality management |
| **NOC Compliance** | Central Bank No Objection Certificate validation when required |

### 1.1 Document Purpose

This document serves as the authoritative reference for all project teams, stakeholders, and departments involved in technology initiatives at HALA. It provides detailed guidance on process execution, role responsibilities, and governance requirements.

### 1.2 Scope

This process applies to all technology projects including:
- New product development
- Feature enhancements
- System integrations
- Compliance implementations
- Infrastructure upgrades
- Bug fixes and maintenance

### 1.3 Process Flow Structure

```
Phase 0: Discovery → Phase 1: Initiation → Owner Decision
                ↓ (Parallel NOC Check when required)
         ┌─────────────────┬─────────────────┐
    Enterprise Track    Product Track
    E2→E3→E4           P2→P3→P4
         └─────────────────┬─────────────────┘
                          ↓
              Solution Architecture (SA)
                          ↓
              Development (5) ←→ QA (5.1)
                          ↓
         Business/Product Acceptance (6)
                          ↓
    Release (7) → Post Implementation (8) → Closure (9)
```

---

## 2. Track Decision Logic

### 2.1 Owner Decision Point

The track selection occurs after Phase 1 (Initiation) based on a scientific scoring system. This decision point is owned by **Product + PMO** with consultation from relevant stakeholders.

**Process Focus**: Determine project path based on complexity and requirements using Customer Impact + Market Demand + Request Features scoring.

### 2.2 Scoring Criteria Matrix

| Criterion | Score 1 (Product-Oriented) | Score 3 (Mixed) | Score 5 (Enterprise-Oriented) |
|-----------|---------------------------|-----------------|------------------------------|
| **Customer Impact** | Fully Customer Facing - Direct customer interaction, customer-visible features | Mixed Customer/Internal - Features affecting both customers and internal users | Not Customer Facing - Internal tools, backend systems, operations |
| **Market Demand** | Market Driven Focus - Competitive features, market requirements | Balanced Demand - Mix of market and internal needs | Internally Driven Focus - Operational efficiency, cost reduction |
| **Request Features** | Marketable Enhancement - Revenue-generating, customer acquisition | Mixed Features - Both marketable and operational | Internal Enhancement - Process improvement, technical debt |

### 2.3 Decision Rules

| Total Score | Decision | Action Required | Typical Examples |
|-------------|----------|-----------------|------------------|
| **< 9** | Product Override Approved | Follow Product Track (P2→P3→P4) | • Bug fixes • UI improvements • Simple feature additions • Performance optimizations |
| **= 9** | Discussion Required | PMO + Product + BA meeting to determine path | • Features with unclear scope • Mixed stakeholder requirements • Moderate complexity changes |
| **> 9** | Standard Process Required | Follow Enterprise Track (E2→E3→E4) | • New product features • Compliance requirements • System integrations • Major architectural changes |

---

## 3. Phase Documentation

### 3.1 Initial Phases (Common to Both Tracks)

#### Phase 0: Discovery
- **Duration**: 1-2 weeks
- **Owner**: Product + Business
- **Purpose**: Identify scope, objectives, stakeholders, and success criteria
- **Key Deliverable**: Project Charter/Discovery Brief
- **Gate Criteria**: Charter approved, stakeholder alignment
- **RACI**: Product (Responsible), Business (Responsible), PMO (Consulted)

#### Phase 1: Initiation
- **Duration**: 1-2 weeks
- **Owner**: PMO + Product
- **Purpose**: Formal project kickoff and initial resource allocation
- **Key Deliverable**: Resource allocation, CAB approval, Risk & Compliance sign-off
- **Gate Criteria**: Team assigned, infrastructure ready, CAB approval obtained, Risk and Compliance sign-off
- **RACI**: PMO (Accountable), Product (Responsible), Risk and Compliance (Consulted)

### 3.2 Enterprise Track Phases

#### Phase E2: Enterprise Requirements
- **Duration**: 1-3 weeks
- **Owner**: BA + Business
- **Purpose**: Detailed business requirements analysis and documentation
- **Key Deliverable**: Business Requirements Document (BRD)
- **Gate Criteria**: BRD completed, requirements validated
- **RACI**: BA (Responsible), Business (Accountable)

#### Phase E3: Business Review
- **Duration**: 1-3 weeks (may require iterations)
- **Owner**: Business + PMO
- **Purpose**: Business stakeholder review and formal approval of requirements
- **Key Deliverable**: Formal business approval, approved requirements package
- **Gate Criteria**: Business approval obtained, requirements signed off
- **Special Note**: May require multiple iterations until all stakeholders provide formal approval

#### Phase E4: Planning
- **Duration**: 1-3 weeks
- **Owner**: PMO + Product + QA
- **Purpose**: Comprehensive project planning and early test case development
- **Key Deliverable**: Project plan, timeline, test cases, risk register, Definition of Done criteria
- **Gate Criteria**: Project plan approved, test cases ready, Definition of Done established, QA test strategy approved
- **RACI**: PMO (Responsible), QA (Consulted for test planning)

### 3.3 Product Track Phases

#### Phase P2: Product Requirements
- **Duration**: 1-3 weeks
- **Owner**: Product + BA
- **Purpose**: Product requirements gathering and user story creation
- **Key Deliverable**: User stories, product requirements
- **Gate Criteria**: User stories completed, requirements validated
- **RACI**: Product (Responsible with full autonomy), BA (Informed)

#### Phase P3: Design
- **Duration**: 1-3 weeks
- **Owner**: Design + Product
- **Purpose**: User experience and interface design development
- **Key Deliverable**: UX/UI designs, design prototypes, style guide
- **Gate Criteria**: Designs approved, prototypes validated
- **RACI**: Design (Responsible), Product (Accountable)

#### Phase P4: Grooming
- **Duration**: 1-2 weeks
- **Owner**: Product + PMO
- **Purpose**: Backlog refinement and sprint preparation
- **Key Deliverable**: Refined backlog, sprint-ready stories, Definition of Done criteria
- **Gate Criteria**: Backlog refined, stories estimated, Definition of Done established, QA testability confirmed
- **RACI**: Product (Responsible with full autonomy), PMO (Responsible for governance and assistance), QA (Consulted)

### 3.4 Common Phases (Both Tracks Converge)

#### Phase SA: Solution Architecture
- **Duration**: 1-2 weeks
- **Owner**: Engineering + Product + QA
- **Purpose**: Architecture decisions, interfaces, data, security, NFRs
- **Key Deliverable**: Architecture decision record, system context & interfaces, tech stack & NFRs
- **Gate Criteria**: ADR approved, risks identified & mitigations planned
- **RACI**: Engineering (Accountable), Product (Responsible), QA (Consulted)

#### Phase 5: Development
- **Duration**: 2-6 weeks (Enterprise), 2-4 weeks (Product), max 8 weeks
- **Owner**: Engineering
- **Purpose**: Solution development and implementation under Engineering ownership
- **Key Deliverable**: Working code, technical documentation, demo
- **Gate Criteria**: Core functionality complete, code quality standards met, Definition of Done criteria validated, PMO gate approval for QA phase
- **RACI**: Engineering (Responsible), PMO (Accountable for gating access to QA phase)

#### Phase 5.1: QA (Parallel with Development)
- **Duration**: 1-3 weeks (Enterprise), 1-2 weeks (Product), max 3 weeks
- **Owner**: QA + PMO
- **Purpose**: Comprehensive testing and quality validation
- **Key Deliverable**: Test results, bug reports, quality metrics
- **Gate Criteria**: All tests executed, critical bugs resolved, Definition of Done validated, acceptance criteria confirmed
- **RACI**: QA (Responsible), PMO (Accountable)

#### Phase 6: Business/Product Acceptance
- **Duration**: 1-2 weeks (Enterprise), 1 week (Product), max 2 weeks
- **Owner**: Business + Product
- **Purpose**: Final happy-path validation
- **Key Deliverable**: UAT sign-off, acceptance report
- **Gate Criteria**: Acceptance sign-off obtained, all acceptance criteria validated, Definition of Done confirmed
- **RACI**: Business (Accountable), Product (Responsible)

#### Phase 7: Release Management
- **Duration**: 2-5 days, max 1 week
- **Owner**: PMO + Product + Business + Engineering + Application Support
- **Purpose**: Production deployment
- **Key Deliverable**: Release report, deployment confirmation
- **Gate Criteria**: Rollback validated, support briefed, monitoring active
- **RACI**: Engineering (Responsible), PMO (Accountable), Application Support (Responsible)

#### Phase 8: Post Implementation
- **Duration**: 1 week minimum, max 2 weeks
- **Owner**: PMO + Support
- **Purpose**: System stabilization and performance measurement
- **Key Deliverable**: Performance metrics, stabilization report, success measurement
- **Gate Criteria**: System stable, success metrics achieved
- **RACI**: PMO (Accountable), Application Support (Responsible)

#### Phase 9: Closure
- **Duration**: 1 week (Enterprise), 3-5 days (Product), max 1 week
- **Owner**: PMO + Product
- **Purpose**: Project closure and knowledge transfer
- **Key Deliverable**: Lessons learned, closure report, knowledge transfer
- **Gate Criteria**: All deliverables complete, lessons documented
- **RACI**: PMO (Responsible), Product (Consulted)

---

## 4. RACI Matrix

### 4.1 RACI Definitions

| Code | Meaning | Description |
|------|---------|-------------|
| **R** | Responsible | Performs the work to complete the task |
| **A** | Accountable | Ultimately answerable for correct completion |
| **C** | Consulted | Provides input and expertise before action |
| **I** | Informed | Kept updated on progress and outcomes |

### 4.2 Enterprise Track RACI Matrix

| Phase | PMO | Product | Business | BA | Design | Engineering | QA | App Support | Risk & Compliance |
|-------|-----|---------|----------|----|---------|-----------|----|-------------|-------------------|
| **0: Discovery** | C | R | R | I | I | I | I | I | I |
| **1: Initiation** | A | R | I | I | I | I | I | I | C |
| **E2: Enterprise Requirements** | I | I | A | R | I | I | I | I | I |
| **E3: Business Review** | R | I | A | R | I | I | I | I | I |
| **E4: Planning** | R | R | I | I | I | C | C | I | I |
| **SA: Solution Architecture** | C | R | I | I | I | A | C | I | I |
| **5: Development** | A | C | I | I | I | R | I | I | I |
| **5.1: QA** | A | I | I | I | I | I | R | I | I |
| **6: Business/Product Acceptance** | I | R | A | I | I | I | I | I | I |
| **7: Release Management** | A | I | I | I | I | R | C | R | I |
| **8: Post Implementation** | A | I | I | I | I | I | I | R | I |
| **9: Closure** | R | C | I | I | I | I | I | C | I |

### 4.3 Product Track RACI Matrix

| Phase | PMO | Product | Business | BA | Design | Engineering | QA | App Support | Risk & Compliance |
|-------|-----|---------|----------|----|---------|-----------|----|-------------|-------------------|
| **0: Discovery** | C | R | R | I | I | I | I | I | I |
| **1: Initiation** | A | R | I | I | I | I | I | I | C |
| **P2: Product Requirements** | I | R | I | I | I | I | I | I | I |
| **P3: Design** | I | A | I | I | R | I | I | I | I |
| **P4: Grooming** | R | A | I | I | I | C | C | I | I |
| **SA: Solution Architecture** | C | R | I | I | I | A | C | I | I |
| **5: Development** | A | C | I | I | I | R | I | I | I |
| **5.1: QA** | A | I | I | I | I | I | R | I | I |
| **6: Product Acceptance** | I | A | I | I | I | I | I | I | I |
| **7: Release Management** | A | I | I | I | I | R | C | R | I |
| **8: Post Implementation** | A | I | I | I | I | I | I | R | I |
| **9: Closure** | R | C | I | I | I | I | I | C | I |

---

## 5. Prioritization Framework

### 5.1 WRIVE Model Overview

The WRIVE (Weighted RICE + Value/Effort) framework combines multiple prioritization methodologies for strategic initiative scoring.

### 5.2 WRIVE Formula

```
WRIVE Score = [(WR × R) + (WI × I) + (WC × C) + (WV × V)] / (WE × E)
```

### 5.3 Component Definitions

| Component | Symbol | Description | Scale |
|-----------|--------|-------------|-------|
| **Reach** | R | Number of customers/transactions impacted | 1-5 |
| **Impact** | I | Business or customer benefit magnitude | 1-5 |
| **Confidence** | C | Certainty around assumptions and data | 0.5-1.0 |
| **Value** | V | Combined business value aligned with KPIs | 1-5 |
| **Effort** | E | Estimated resources required | 1-5 |
| **Weight** | W | Strategic importance multiplier | 0-1 |

### 5.4 Default Weights (Balanced Strategy)

| Component | Default Value | Adjustment Range |
|-----------|---------------|------------------|
| WR (Reach) | 0.25 | 0.10 - 0.40 |
| WI (Impact) | 0.25 | 0.10 - 0.40 |
| WC (Confidence) | 0.15 | 0.05 - 0.25 |
| WV (Value) | 0.25 | 0.10 - 0.40 |
| WE (Effort) | 0.10 | 0.05 - 0.20 |

---

## 6. Governance Framework

### 6.1 Communication Matrix

| Component | Frequency | Participants | Purpose | Deliverables |
|-----------|-----------|--------------|---------|--------------|
| **Weekly Status Report** | Weekly (Friday 5PM) | Phase leads, PMO, Product | Progress tracking, risk identification | Status report, metrics dashboard |
| **Phase Gate Review** | End of phase | PMO, stakeholders, teams | Go/No-Go decision | Gate checklist, decision log |
| **Stakeholder Update** | Bi-weekly | PMO, Business, Sponsors | Executive alignment | Executive dashboard, newsletter |
| **Risk Review** | Monthly | PMO, Risk owners | Risk assessment | Risk register update |

### 6.2 Risk Management Framework

#### 6.2.1 Risk Response Strategies

| Risk Level | Response Time | Escalation | Mitigation Approach |
|------------|---------------|------------|-------------------|
| **Critical** | Immediate (0-24 hrs) | Steering Committee | Implement immediate countermeasures, dedicated task force |
| **High** | Urgent (1-3 days) | Program Manager | Develop detailed contingency plan, allocate resources |
| **Medium** | Timely (4-7 days) | Project Manager | Monitor closely, develop prevention strategies |
| **Low** | Planned (>7 days) | Team Lead | Document and accept, routine monitoring |

### 6.3 Quality Gates

#### 6.3.1 Definition of Done (DoD) Framework

**Established During**: Planning phases (E4/P4)
**Validated During**: Development (5), QA (5.1), Acceptance (6)
**Confirmed During**: All subsequent phases

**DoD Criteria Include**:
- Functional requirements met
- Acceptance criteria validated
- Code quality standards achieved
- Security requirements satisfied
- Performance benchmarks met
- Documentation completed

---

## 7. Central Bank NOC Process

### 7.1 NOC Overview

**Phase ID**: NOC
**Name**: Central Bank NOC Check
**Purpose**: Determine if change requires Central Bank No Objection Certificate and obtain approval if needed
**Timing**: Runs parallel to Discovery phase when regulatory approval is required

### 7.2 NOC Process Details

- **Owner**: Risk and Compliance + PMO
- **Duration**: Variable (depends on Central Bank response time)
- **Inputs**: Project Charter/Discovery Brief, Change impact assessment, Regulatory requirements
- **Outputs**: NOC determination, Central Bank approval (if required), Compliance clearance

### 7.3 NOC Key Tasks

1. Assess regulatory impact
2. Determine NOC requirement
3. Submit NOC application to Central Bank (if required)
4. Track approval status
5. Document compliance clearance

### 7.4 NOC Gate Criteria

- NOC requirement determined
- Central Bank approval obtained (if required)
- Compliance documentation complete

### 7.5 NOC RACI Matrix

| Role | Responsibility |
|------|----------------|
| **Risk and Compliance** | Responsible for NOC assessment and Central Bank coordination |
| **PMO** | Accountable for ensuring compliance process completion |
| **Business** | Consulted for business impact assessment |
| **Product** | Informed of NOC requirements and timeline impact |

---

## 8. Key Process Updates (v2.2)

### 8.1 New Features in v2.2

1. **Central Bank NOC Integration**: Parallel regulatory compliance validation
2. **Enhanced QA Integration**: QA participation in Planning/Grooming phases
3. **Definition of Done Framework**: Explicit DoD establishment and validation
4. **Engineering Ownership with PMO Gating**: Clear ownership with governance controls
5. **Product Autonomy with PMO Support**: Maintained decision-making authority with governance assistance
6. **Risk and Compliance in CAB**: Enhanced regulatory oversight in Initiation

### 8.2 Process Improvements

- **Parallel Processing**: NOC check runs parallel to Discovery
- **Quality Integration**: QA involved from Planning through Acceptance
- **Clear Ownership**: Engineering owns Development with PMO gating
- **Governance Balance**: Product autonomy maintained with PMO governance support
- **Regulatory Compliance**: Built-in Central Bank NOC validation

---

## Appendix A: SLA Framework

### A.1 Phase Duration SLAs

| Phase | Enterprise Track | Product Track | Maximum Duration |
|-------|------------------|---------------|------------------|
| Discovery | 1-2 weeks | 1 week | 2 weeks |
| Initiation | 1-2 weeks | 1 week | 2 weeks |
| Requirements (E2/P2) | 1-3 weeks | 1-3 weeks | 3 weeks |
| Review/Design (E3/P3) | 1-3 weeks | 1-3 weeks | 3 weeks |
| Planning/Grooming (E4/P4) | 1-3 weeks | 1-2 weeks | 3 weeks |
| Solution Architecture | 1-2 weeks | 1-2 weeks | 2 weeks |
| Development | 2-6 weeks | 2-4 weeks | 8 weeks |
| QA/Testing | 1-3 weeks | 1-2 weeks | 3 weeks |
| Acceptance | 1-2 weeks | 1 week | 2 weeks |
| Release | 2-5 days | 2-5 days | 1 week |
| Post-Implementation | 1 week minimum | 1 week minimum | 2 weeks |
| Closure | 1 week | 3-5 days | 1 week |

### A.2 Standard Phase Transition SLA

**Standard Transition Time**: 24-48 hours for moving between phases

**Exemptions**: Requirements and development cycles are exempted from this strict timing as they depend on feature complexity and implementation requirements.

---

*Document Version: 2.2*  
*Last Updated: January 2025*  
*Next Review: Quarterly*  
*Owner: PMO Office*