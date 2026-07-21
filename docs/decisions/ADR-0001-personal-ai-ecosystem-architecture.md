# ADR-0001: Personal AI Ecosystem Architecture

## 1. Status and version

Status: APPROVED v1.0.0
Decision status: accepted
Approved by: Bryan Cash
Approved date: 2026-07-21
Not canonical in Nexus.
Supersedes draft v0.2 (2026-07-20), whose deferred decisions D1–D4 are resolved here.

## 2. Date

2026-07-21.

## 3. Context

Bryan operates eight repositories spanning personal operations, life planning,
finance, public professional identity, public artist presentation, governed
knowledge, video-tooling planning, and a concluded creator-tools prototype.
Projects tended to stall at "almost complete," ownership overlapped, and no
single surface showed what deserved attention. Draft v0.2 deferred four
decisions because four repositories were inaccessible. The 2026-07-20 evidence
pass and a 2026-07-21 re-verification completed the record. This ADR fixes the
ecosystem's ownership boundaries, lifecycle model, and governance placement.

## 4. Repositories reviewed

| Repository | Evidence point |
|---|---|
| bryan-command-center | origin/main @ 02bd420 (local checkout 4 commits behind at review time) |
| life-command-center | main, pushed 2026-07-18 |
| c-finance | main, pushed 2026-07-18 |
| my-portfolio (CashBryan.com) | main, pushed 2026-07-20; live at cashbryan.com |
| v0-ai-music-artist-website (Dorsyth Records) | main, pushed 2026-07-20; live at dorsythrecords.com |
| nexus | main @ 39 tracked files; nexus.yaml declares phase: 1 |
| dorsyth-video-engine | main, revised 2026-07-15; zero application code by design |
| creatorops | main, last pushed 2026-06-13 |

## 5. Evidence basis

Labels used throughout: **[V]** verified in current repository state;
**[I]** inferred from evidence; **[P]** proposed future behavior;
**[O]** operator-controlled — only Bryan decides.

Key verified facts: BCC ships mission/focus/touches/chores/Home Reset/job-search
surfaces, an 11-project registry (statuses draft/active/idle/waiting/complete),
and JSON backup/validated restore/guarded reset [V]. LCC ships today planner,
inbox, tasks, calendar, focus sessions, projects, weekly review, reminders, and
authenticated JSON export; it has no chores, household, or recurring-stewardship
modules — those appear only in its roadmap Phase 6 [V]. C-Finance is a
Firebase-backed personal-finance app with its own authentication [V]. Nexus
ADR-005 and the Phase-2 Boundary Plan are canonical, operator-approved
2026-07-13; capacity is 39 of a 65-file hard ceiling; Employee OS defers
Employee-invocation and sub-agent delegation and gates external publication as
human-only [V]. Dorsyth Video Engine is Phase-0 documentation only [V].
CreatorOps is a substantial implemented prototype; its findings note exists
only outside the repo [V]. Evidence gaps are listed in §12.

## 6. Final system ownership boundaries

- **Bryan Command Center (Mission Control)** — cross-project orientation,
  project lifecycle and closure metadata, cross-project priorities, private
  job-search pipeline truth, campaign status [P], waiting items, approvals,
  review dates, maintenance visibility. Also, as a documented exception:
  chores, Home Reset, and daily touches [V].
- **Life Command Center** — detailed execution planning: tasks, calendar,
  reminders, task-linked focus sessions, weekly review [V]. It MAY hold action
  tasks for job search and campaigns but does not own pipeline or lifecycle
  truth.
- **C-Finance** — sole source of truth for all detailed financial records and
  financial authentication [V].
- **CashBryan.com** — public professional identity and content only [V].
- **Dorsyth Records site** — public artist presentation only; it is the
  canonical *public archive*, never the canonical *knowledge* source [V].
- **Nexus** — canonical knowledge, artist canon, reusable governed methods,
  promotion-factory assets, Employee OS authority rules [V].
- **Dorsyth Video Engine** — complementary execution tooling, Phase-0 planning
  only [V].
- **CreatorOps** — concluded prototype; reference source only [V/I].
- Campaign run artifacts — per-campaign workspaces, never Nexus canon [V, per
  Boundary Plan].

## 7. Accepted decisions

**A1 — Mission Control [V/I].** BCC evolves in place into Mission Control. No
ninth application is created. Mission Control MUST link to authoritative
evidence (closure records, Nexus assets, C-Finance, campaign workspaces) and
MUST NOT copy evidence bodies. Campaign status and approval surfaces are [P] —
planned capabilities, not current features.

**A2 — BCC/LCC boundary [V].** BCC owns orientation, lifecycle, closure
status, cross-project priorities, campaign status, and private job-search
pipeline truth. LCC owns detailed execution planning. "Completed" in LCC MUST
NOT be read as formal ecosystem closure. Chores, Home Reset, and daily touches
remain in BCC as a documented exception because LCC does not implement those
modules [V]. "LCC owns recurring stewardship" is retained only as future
intent, contingent on LCC actually implementing its planned household modules
(its roadmap Phase 6); the boundary moves only by a successor decision [O].

**A3 — Lifecycle truth [P, adopting on ratification].** BCC is the single
owner of project lifecycle metadata. States: active, functionally-complete,
production-ready, closed, maintenance, paused, archived, reopened. A project
MUST NOT display `closed` without a closure-record reference. Closure evidence
lives in each project repository (e.g. `docs/CLOSURE.md`); BCC stores links
and metadata only. Legacy `complete` without a closure record becomes
`functionally-complete (unclosed)` — this applies immediately to the four
seeded entries: Dorsyth Records Website V1, Bryan Command Center V1, Life
Command Center V1, Nexus Platform Foundation [V]. Lifecycle state MUST NOT
change automatically because time elapsed or a review date was missed; missed
dates produce alerts or recommendations only [O-supplied rule].

**A4 — Financial boundary [V/P].** C-Finance owns all detailed financial
records and financial authentication [V]. Mission Control MAY show derived
status or risk flags only [P]; amounts do not leave C-Finance by default.
Financial actions always require Bryan. No agent may move money or obtain
detailed financial access through Mission Control.

**A5 — Public-content boundaries [V].** CashBryan.com owns public professional
identity; employer-confidential, client-confidential, private-career, and
internal pipeline data MUST NOT enter it (its README already states this
boundary). Dorsyth Records owns public artist presentation only; campaign
operations, approval state, and run artifacts do not belong there. Public
artist data MAY project Nexus canon but never becomes the canonical knowledge
source.

**A6 — Nexus boundary [V].** Nexus owns canonical knowledge, artist canon,
reusable governed methods, promotion-factory assets, and Employee OS authority
rules. Nexus is not a project-management tool, operational database, approval
queue, or Mission Control backend. Nexus rules override Mission Control
architecture wherever they conflict; the architecture is amended, never Nexus.
Agent instructions derive from Nexus only where Nexus currently governs the
domain; during Phase 2 that is the creator domain only. Career strategist,
financial analyst, and general chief-of-staff roles remain architectural
intent, not Nexus-governed Employees. Multi-Employee invocation and sub-agent
delegation remain deferred per Employee OS (§4 rows 22–23) [V].

**A7 — Nexus Phase-2 limits [V, per ADR-005 and the Boundary Plan].** One
approved release → one approved promotion package for one artist. Promotion
copy, metadata, visual briefs (as a package section), proposed calendars, and
campaign methodology MAY be governed. Merchandising, analytics ingestion,
website implementation, animation execution, and editing execution are
deferred; publishing, social-platform API integration, and ad management are
prohibited — exactly as the Boundary Plan's scope table states. Campaign run
artifacts live in campaign workspaces, not canon. Dorsyth Video Engine is
complementary execution tooling, not Nexus methodology. Phase 3 requires a
successor ADR after the Phase-2 exit retrospective. Note [V]: `nexus.yaml`
still declares `phase: 1`; Phase 2 is approved but not marked started, and
this ADR does not start it.

**A8 — Governance placement [O].** The full Mission Control Architecture and
the Closure Framework remain in BCC documentation during Nexus Phase 2. Only
this ecosystem decision record is a candidate for Nexus, where it MUST become
ADR-006 (Nexus already uses 001–005). See §14.

**A9 — CreatorOps [V/I].** Concluded as a substantial prototype (13
implemented tool pages, workflow runner, prompt library — verified), not empty
stubs. Its taxonomy and prompt material MAY be referenced during Nexus Phase-2
drafting; its workflow-runner UX MAY be referenced in future BCC design work.
No CreatorOps code is migrated wholesale. Archive sequence: (1) findings
committed → (2) reusable ideas migrated or referenced → (3) conclusion
ratified → (4) Bryan manually archives. Step 1 is **not yet done**: the
findings note exists only in session outputs, not the repository [V].

**A10 — Dorsyth Video Engine [V].** Disposition: **Keep but narrow**. It is a
Phase-0 planning repository (zero application code, by stated design), not a
failed prototype. Implementation begins only after Bryan approves the Phase-0
architecture and the first packet (PKT-001). Artist themes and presets MUST
cite Nexus canon rather than restating it. Its implementation is outside this
ADR.

## 8. Rejected decisions

- **R1** — A ninth application or any central ecosystem database, service,
  or webhook layer. Not justified at this scale [V: BCC already carries the
  surface].
- **R2** — Nexus as Mission Control backend, operational database, or
  approval queue.
- **R3** — Automatic lifecycle transitions from elapsed time or missed
  reviews (including v0.2's 90-day prototype rule, pause auto-archive, and
  the video-engine 30-day timer — all downgraded to alerts) [O].
- **R4** — Copying closure evidence, Nexus canon bodies, or financial
  amounts into Mission Control.
- **R5** — Treating LCC "completed" or seeded registry statuses as closure
  truth.
- **R6** — Wholesale CreatorOps code migration.
- **R7** — BCC↔Nexus programmatic integration during Phase 2 (the Boundary
  Plan rejects "application (BCC) integration" as a Phase-2 goal) [V].
- **R8** — Numbering this record ADR-0001 inside Nexus (collides with the
  Nexus 001–005 series).
- **R9** — Expanding Nexus beyond the creator domain during Phase 2.

## 9. Resolved deferred decisions (v0.2 D1–D4)

- **D1 (LCC reality)** → Resolved [V]: LCC is an execution planner with no
  household modules; chores stay in BCC (A2). Its `npm run check` is red at
  HEAD and CI has never run successfully — noted as LCC maintenance debt,
  not a boundary issue.
- **D2 (Nexus placement)** → Resolved as proposal [O]: ADR-006 candidate per
  §14; capacity allocation remains Bryan's.
- **D3 (Dorsyth site)** → Resolved [V]: V1 live; public-presentation
  boundary holds; canonical-archive wording clarified (public canon only).
  Residual: Resend key history/rotation (§12).
- **D4 (Video Engine)** → Resolved [V]: Keep but narrow (A10); the 30-day
  auto-classification timer is void under R3.

## 10. Binding operator rules

- **OR1** — No automatic lifecycle changes from elapsed time; missed dates
  alert, never transition.
- **OR2** — Nexus rules override Mission Control architecture on conflict.
- **OR3** — No agent may allocate Nexus capacity, merge into Nexus, or
  promote anything to canonical. Operator only.
- **OR4** — Financial actions, external publication, credential handling,
  archiving, and deletion always require Bryan.
- **OR5** — CreatorOps archive follows the fixed four-step sequence (A9);
  Bryan performs the archive manually.
- **OR6** — During Phase 2, Mission Control links to Nexus assets; it MUST
  NOT read, write, or integrate with Nexus programmatically.
- **OR7** — "Completed" in LCC never implies ecosystem closure; closure is
  declared only in BCC against a closure record.

## 11. Consequences

- Future agent sessions cite this record instead of re-litigating boundaries.
- BCC gains lifecycle-metadata schema work (states, closure links, review
  dates) but no server, database, or integration layer.
- Four registry entries visibly downgrade to `functionally-complete
  (unclosed)` until closure records exist — an intended honesty cost.
- Nexus governance work (ADR-006 placement) is queued, not presumed; nothing
  in Nexus changes until Bryan acts.
- CreatorOps archive is unblocked only by committing the findings note.

## 12. Risks and tradeoffs

- **Evidence gaps [stated, not resolved]:** Resend API key formerly tracked
  in the Dorsyth site repo persists in git history; rotation unverified.
  LCC quality gate red at HEAD; its CI has never succeeded. The local BCC
  checkout drifts behind origin/main. C-Finance closure blockers (stale
  README deployment section) remain open.
- Manual, as-of-dated status indicators in Mission Control can go stale;
  accepted in exchange for zero new infrastructure.
- The chores exception leaves recurring stewardship split across intent
  (LCC roadmap) and reality (BCC); acceptable while LCC Phase 6 is
  unbuilt, but it is a standing boundary asymmetry.
- Link-only closure evidence means BCC displays depend on repository
  availability; accepted to avoid evidence duplication.
- The Nexus `decision/` vs `decisions/` directory inconsistency (ADR-004)
  can cause future path confusion; flagged for operator cleanup.

## 13. Revisit triggers

- LCC implements household/chores modules → revisit the A2 exception.
- Phase-2 exit retrospective is committed → successor ADR for Phase 3.
- Manual indicators demonstrably fail (repeated stale-status incidents) →
  revisit the no-backend rejection (R1) with evidence.
- A second real user appears in any system.
- Nexus rules are found to conflict with this architecture → amend this
  document (OR2).
- Bryan approves Dorsyth Video Engine Phase-0 → its implementation ADRs
  take over from A10.

## 14. Nexus placement note

Candidate placement, entirely operator-controlled [O]:
path `knowledge/common/decision/006-personal-ai-ecosystem.md`, id
`knowledge.common.006-personal-ai-ecosystem`, ADR number **006**, initial
frontmatter `status: draft`, `decision-status: proposed`. The file MAY be
charged to the reserve bucket (0/3 used) or to core/common (headroom under
its 12-file budget) — Bryan chooses. Only Bryan may allocate the slot, merge
it, or later promote it to canonical. This task allocates nothing and marks
nothing canonical. The proposed path follows the majority singular
`decision/` convention; ADR-004's placement under `decisions/` is a known
anomaly left to operator discretion.

## 15. Implementation impact

None performed in this task. Upon ratification, the queued (not scheduled)
work is: commit this ADR to `docs/decisions/` in BCC (after syncing the local
checkout with origin/main); implement BCC lifecycle metadata per A3 including
the four-entry legacy migration; author closure records in project repos as
projects actually close; commit the CreatorOps findings note to unblock A9;
place the Mission Control Architecture and Closure Framework documents in BCC
docs. Nexus, LCC, C-Finance, both public sites, and the Video Engine require
no changes from this ADR.

## 16. Operator approval

[ ] Approved as written
[x] Approved with amendments
[ ] Returned for revision

Approved by: Bryan Cash
Approved date: 2026-07-21

The amendments listed in the ratification review were incorporated into this version before approval.

Amendments:

Signed: ______________________   Date: ____________
