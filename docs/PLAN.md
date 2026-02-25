# Kita App - Unified Consolidated Plan

**Single source of truth.** Follow this plan. Do not create parallel plan versions that drift.

Source: `/home/kal/.cursor/plans/kita_unified_consolidated.plan.md`

---

## Phase 0 Status (Implemented)

- [x] Project setup (Next.js, Tailwind, shadcn)
- [x] `(prototype)` route group, `lib/mock/` (locations, groups, children, attendance, dayLogEntries, dailyTasks, staff, ablauf)
- [x] Group overview with group switcher (Schmetterlinge, Bären, Igel)
- [x] Gruppe view: kid count + spots occupied (≤18mo=1.5, >18mo=1)
- [x] Children grid with attendance status, log icons
- [x] Morning / Lunch / Afternoon counts banner (respects group filter)
- [x] Entgegennehmen: per-kid Info from Eltern, Check-in, Abmelden, Alles in Ordnung (no batch "Alle angekommen")
- [x] Ablauf: display + data entry pages (Znüni, Lunch, Zvieri; daily tasks; break times)
- [x] Abgeben: collapsible handover (Activity morning, Lunch, Sleep/Break, Activity afternoon, Zvieri, Infos für Eltern; no times except sleep; Windeln nachfüllen quick option)
- [x] No Send Reports page

---

## 1. Feature Inventory (Everything Ever Mentioned)

### Staff Daily Workflow

| Feature                        | Source               | Notes                                                                                                                                                 |
| ------------------------------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Check-in (Entgegennehmen)      | KitaWeb, Staff-First | List of expected kids, Info from parents textarea                                                                                                     |
| Check-out + Handover (Abgeben) | KitaWeb, Staff-First | Collapsible list, expand to show day log. Staff uses as reminder/checklist while talking to parent. Parent does not see screen. Checkout removes kid. |
| Day navigation                 | KitaWeb              | Arrows + date picker. No day limit. Can select any specific date.                                                                                     |
| Group filter                   | KitaWeb, Staff-First | Filter by group (Bunnies, Foxes, Bears, Owls / Schmetterlinge, Bären, Igel)                                                                           |
| Group switcher                 | Staff-First e3f5a729 | Tabs or dropdown when staff has multiple groups                                                                                                       |
| Batch check-in/out             | Staff-First          | "All arrived", batch checkout                                                                                                                         |


### Daily Logging

| Feature                        | Source               | Notes                                                             |
| ------------------------------ | -------------------- | ----------------------------------------------------------------- |
| Activities Morning / Afternoon | KitaWeb, Staff-First | Text or quick-tap                                                 |
| Lunch                          | KitaWeb, Staff-First | Description + portions 0–3 + optional "no X" or "only Y" per item |
| Snack                          | KitaWeb              | Descriptions only, no portions                                    |
| Sleep / Naps                   | KitaWeb, Staff-First | KitaWeb: sleep field. Staff-First: nap timer, quality             |
| Info from parents              | KitaWeb              | At Entgegennehmen, on kid detail                                  |
| Info for parents               | KitaWeb              | On kid detail, in Abgeben handover                                |
| Daily Update (bulk)            | KitaWeb              | Per-group inputs, save applies to all present kids in group       |
| Meal grid (group-wide)         | Secure Swiss         | One meal description, portions per child, "Default All"           |
| Quick-tap meal logging         | Staff-First          | Ate well / some / little / didn't eat                             |
| Photo capture                  | Staff-First          | Inline, attach to log                                             |
| Incident form                  | Staff-First          | Injury, illness, conflict, details, actions                       |


### Child & Schedule

| Feature             | Source               | Notes                                                                |
| ------------------- | -------------------- | -------------------------------------------------------------------- |
| Kid detail page     | KitaWeb, Staff-First | Basic info + daily fields, editable                                  |
| Add new kids        | KitaWeb              | Name, Group, Age, Allergies, Parent, Emergency, Days Present         |
| Parents & Emergency | KitaWeb              | Link on card, parent name, emergency number, Call link               |
| Half-day schedule   | KitaWeb              | full, morning, morning+lunch, afternoon, lunch+afternoon per weekday |
| Days present        | KitaWeb              | Mo–Fr checkboxes, fixed per child                                    |
| Stundenplan         | KitaWeb              | Table: kid × weekday, ✓/—, group filter, sort by day                 |
| Absences            | KitaWeb              | Mark absent (sick/other), date + reason, future dates                |
| Extra days          | KitaWeb              | Add kid for day outside usual schedule                               |
| Baby profile        | Secure Swiss         | Bottle, diaper, nap restrictions                                     |


### Counts & Overview

| Feature                            | Source               | Notes                                       |
| ---------------------------------- | -------------------- | ------------------------------------------- |
| Morning / Lunch / Afternoon counts | KitaWeb              | Large visible banner, respects group filter |
| Kids of the day                    | KitaWeb, Staff-First | Present today                               |
| All kids                           | KitaWeb              | Full list                                   |
| Log progress icons                 | Staff-First          | 🍽 😴 📸 ⚠️ per child                       |


---

## 2. IN SCOPE (What We Build)

### Core Principle

Staff daily loop first. **No report sending.** Parents receive info when they pick up at Abgeben. Staff expand child card to show day log; parent sees it in person.

### Phase 0 — Visual Prototype

- Project setup (Next.js, Tailwind, shadcn)
- `(prototype)` route group, `lib/mock/` (locations, groups, children, attendance, dayLogEntries)
- Group overview with group switcher (multiple groups)
- Children grid with attendance status, log icons
- Morning / Lunch / Afternoon counts (visible, respects group filter)
- Entgegennehmen (check-in) with Info from parents placeholder
- Check-out (Abgeben) page: collapsible list, expand to show day log for handover
- **No Send Reports page**

### Phase 1 — Staff MVP (Weeks 1–5)

- **Entgegennehmen**: Check-in, list of expected kids, Info from parents textarea
- **Abgeben**: Check-out, collapsible list, handover view (expand child to show day log)
- **Day log**: Meals, naps, activities, photos, incidents (quick-tap where possible)
- **Daily Update**: Bulk per-group inputs (Activities, Lunch, Snack, Sleep, Info for parents), save to all present in group
- **Kid detail**: Basic info, daily fields, editable
- **Group filter / switcher**: Multi-group support
- **Stundenplan**: Kid × weekday table, group filter, sort
- **Absences & extra days**: Mark absent (sick/other), add extra day
- **Half-day schedule**: full, morning, morning+lunch, afternoon, lunch+afternoon per weekday
- **Morning / Lunch / Afternoon counts**: Visible, respects group filter
- **Day navigation**: Arrows to switch day
- **Add kids**: Form with group, allergies, parent, emergency, days present
- **Parents & Emergency**: On kid card/detail, Call link

### Phase 2 — Admin (Weeks 6–8)

- Child profiles CRUD
- Group and location management
- Staff management, shift schedule
- Absence/attendance statistics

### Phase 3 — Parent (Optional, Weeks 9–10)

- Parent login, child linking
- View child's day journal (pull, not push)
- Photo gallery
- Messaging

### Phase 4 — Polish (Weeks 11–12)

- Calendar, documents
- Full offline sync
- Translations (DE/FR/IT/EN)
- Accessibility audit

---

## 3. OUT OF SCOPE

| Feature                                   | Reason                                                          |
| ----------------------------------------- | --------------------------------------------------------------- |
| **Send reports to parents**               | Never intended. Info handed over at Abgeben in person.          |
| **Daily report generation + Send action** | Same as above.                                                  |
| **DailyReport table**                     | Day log entries are source of truth. No separate report entity. |
| **Push notifications for reports**        | No reports to send.                                             |
| **Report preview / edit / Send page**     | Out of scope.                                                   |

---

## 4. Tech Stack

| Layer     | Technology              |
| --------- | ----------------------- |
| Framework | Next.js 15 (App Router) |
| UI        | Tailwind + shadcn/ui    |
| Database  | PostgreSQL via Supabase |
| ORM       | Prisma                  |
| Auth      | Supabase Auth           |
| Storage   | Supabase Storage        |
| i18n      | next-intl (DE/FR/IT/EN) |
| PWA       | Serwist                 |

---

## 5. Data Model (Core)

- **Organization** → KitaLocation → KitaGroup
- **Child** (firstName, lastName, dateOfBirth, groupId, daysPresent, daySchedule, absentDates, extraPresenceDates)
- **ChildProfile** (allergies, medicalInfo, emergencyContacts, parentName, emergencyNumber)
- **AttendanceRecord** (childId, date, checkInTime, checkOutTime, pickedUpBy)
- **DayLogEntry** (childId, staffId, date, type: meal|nap|activity|incident|note, data JSONB)
- **LogPhoto** (dayLogEntryId, storagePath)
- **Staff** (userId, role, locationId, groupAssignments)

**No DailyReport table.**
