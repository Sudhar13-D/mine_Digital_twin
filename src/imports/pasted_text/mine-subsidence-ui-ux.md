# Mine Subsidence Monitoring Platform — UI/UX Design Specification

**For:** Stitch AI Design Tool  
**Document Purpose:** Detailed layout, navigation, interaction, and visual hierarchy specification  
**Version:** 1.0  
**Last Updated:** Sept 2026

---

## 1. Core Problem We're Solving

**Primary User Job:** A mine supervisor or manager needs to **understand, in GIS context, WHERE surface deformation is being detected by sensor nodes, WHAT the risk is at that location, and HOW that risk would propagate underground through pillars.**

Not just: "Risk score is 7.2." But: "Sensor nodes on the surface at grid coordinates [E562000, N2340000] are detecting 8.7° tilt. The cross-section shows this aligns with Pillar 12 below, which depillared 18 months ago. If it collapses, the surface here will subside 1.2m. Residential area is 400m to the northeast."

**Align to Software Requirements:**
- GIS-based visualization of live deformation maps and risk zones (PRIMARY)
- Real-time monitoring of tilt, displacement, vibration, and crack initiation (PRIMARY)
- AI/ML-based anomaly detection and subsidence prediction using live and historical data (SECONDARY visualization, high-value backend)
- Interactive dashboards for mine operators, planners, and regulators (PRIMARY)
- Automated early warning alerts (triggers dashboard alerts, SMS/email sent separately)
- Deployment across multiple underground coalfields (multi-site panel selector)

**Secondary Jobs:**
- Monitor sensor readings and trends over time
- Acknowledge/escalate alerts
- View historical subsidence patterns
- Export compliance reports

**Why This Matters:** Underground room-and-pillar mines require GIS context (WHERE on the earth) + geological context (WHAT's underground below that location). Layering live sensor data on a GIS map of the mine panel makes spatial risk immediate and actionable.

---

## 2. Overall Page Architecture

### Information Hierarchy (Most Important → Least Important)

1. **WHERE is surface deformation on the panel map?** (GIS layer with sensor node markers)
2. **WHAT does the underground geometry look like at that location?** (Cross-sectional view, pillars + nodes)
3. **WHAT is the risk score and prediction?** (Live readings + AI anomaly output)
4. **WHEN did alerts fire and what's the escalation status?** (Alert log)
5. **Historical trends and compliance context** (Secondary, behind links)

### Top-Level Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER: Logo | Mine Name | Active Panel Selector | User Menu    │
├──────────────────────────────────────────────────────────────────┤
│  NAVIGATION: Monitoring | Reports | Settings | Help              │
├──────────────────┬─────────────────────────────────────────────────┤
│  LEFT SIDEBAR    │                                                 │
│  (Hidden/Drawer  │          MAIN CONTENT AREA                      │
│  on mobile)      │   (2-column layout)                            │
│                  │                                                 │
│  • Panel List    │   LEFT COLUMN (65%):                           │
│  • Sensor List   │   • GIS MAP (Hero, 70% of column height)       │
│  • Alert Log     │     Sensor node markers, risk zones, roads     │
│  • Quick Stats   │                                                 │
│                  │   • CROSS-SECTION VIEW (30% of column height)  │
│                  │     Geological layers, pillars, nodes above,   │
│                  │     subsidence prediction animation            │
│                  │                                                 │
│                  │   RIGHT COLUMN (35%):                          │
│                  │   • Live Readings Table (60%)                  │
│                  │     Sensor values: tilt, displacement, etc.    │
│                  │   • Risk Scores & Alerts (40%)                 │
│                  │     Current risk level, anomaly detection      │
│                  │                                                 │
└──────────────────┴─────────────────────────────────────────────────┘
```

### Viewport Breakdown (Desktop 1920px)

| Section | Width | Height | Purpose |
|---|---|---|---|
| Header + Nav | 100% | ~80px | Branding, quick navigation, mine/panel selector |
| Left Sidebar | 280px | Full | Panel/sensor list, alert log, quick stats |
| GIS Map (Hero) | ~1100px | ~440px | PRIMARY: Panel boundary, sensor nodes, risk zones, deformation vectors |
| Cross-Section | ~1100px | ~180px | SECONDARY: Geological layers, pillars, sensor nodes above pillars, subsidence prediction |
| Readings Table | ~420px | ~300px | Sensor values (tilt, vibration, displacement, AE, crack, temp, humidity) |
| Risk & Alerts | ~420px | ~300px | Risk scores, anomaly flags, alert status, escalation path |

**Mobile (< 768px):** GIS takes full width (100%), cross-section and readings stack below as scrollable sections, sidebar becomes drawer.

---

## 3. Core Visual Elements & Spatial Design

### 3.1 PRIMARY: GIS MAP (Leaflet.js + Custom Overlay)

**Location:** Left column, top (hero position)  
**Size:** ~1100px wide × 440px tall (desktop)  
**Technology:** Leaflet.js with custom GIS layers  

#### What Users See

A bird's-eye-view map of the mine panel, oriented to real-world coordinates (UTM or lat/lng):

- **Panel boundary:** Polygon outline showing the depillared zone (e.g., Panel 2, boundary in tan/sand color)
- **Roads and surface features:** (Optional) Faint roads, water bodies, structures for geographic context
- **Sensor node markers:** Circles placed at exact GPS coordinates on the surface, color-coded by risk:
  - **Green circle** (low risk): stable, baseline readings
  - **Amber circle** (medium risk): early warning, readings rising
  - **Red circle** (high risk): critical, pulsing or glowing
- **Deformation vectors/arrows:** Small arrows pointing in direction of ground movement (if displacement data available), length proportional to magnitude
- **Risk zone heatmap (optional overlay):** Contoured area showing interpolated risk across the panel (cooler = low, hotter = high risk)
- **Pillar footprints (faint):** Dotted rectangles showing where underground pillars are located (helps operator correlate surface readings to underground geometry)
- **Scale bar and north arrow** (bottom-left corner)
- **Zoom level and coordinates** (bottom-right corner)

#### Interaction

- **Click a node marker:** Highlights that node, updates the cross-section view to show that node's location, updates readings table
- **Hover a node:** Tooltip shows node ID, latest risk score, tilt angle, last update time
- **Hover a pillar footprint:** Tooltip shows pillar ID, mining date, expected failure mode
- **Zoom:** Scroll wheel or zoom controls to focus on a region
- **Pan:** Click + drag to move the map view
- **Toggle layers:** Checkboxes on top-right to show/hide deformation vectors, risk heatmap, pillar footprints
- **Draw/measure tool (admin):** Ability to draw new panel boundaries or measure distances (if admin role)

#### Visual Feedback

- **Node pulses red** when HIGH alert triggers
- **New node highlight** briefly flashes amber when reading is updated (2x per second, 2 pulses)
- **Zoom animation:** Map smoothly zooms to selected node or alert location (0.3 sec)

#### Why This Design

**GIS is the PRIMARY user mental model.** Mine operators, planners, and regulators all think in terms of geography: "Where on the panel is this happening?" A supervisor managing a 10-panel coalfield thinks in map coordinates. The GIS layer makes the answer immediate and removes ambiguity about which part of the mine is affected.

---

### 3.2 SECONDARY: Cross-Section View (Geological Layers + Pillars + Subsidence Animation)

**Location:** Left column, bottom (below GIS map)  
**Size:** ~1100px wide × 180px tall (compact; expandable on click)  
**Technology:** SVG + Canvas (or Three.js lite)  

#### What Users See (Like the "When Abandoned Mines Collapse" Reference Image)

A side-view cross-section slice through the selected node's location, showing:

- **Surface layer:** Top tan/brown band showing the surface landscape (ground where residents live, roads, etc.)
- **Overburden/soil layers:** Multiple thin bands showing geological strata (sandstone, shale, mudstone) between surface and coal seam
- **Coal seam:** Darker band showing the coal layer (mined-out area = hollow goaf above)
- **Pillars (underground):** Vertical dark rectangles representing support pillars below the surface
- **Sensor node markers:** Small circles ABOVE the surface, positioned directly over the pillar they're monitoring (e.g., Node 5 positioned above Pillar 12)
- **Depth scale:** Y-axis showing distance from surface in meters (e.g., 0m surface, -50m coal seam)
- **Distance scale:** X-axis showing lateral distance across the panel

#### Subsidence Prediction Animation

When a HIGH-risk alert is triggered at a specific node:

1. **Pillar cracks (visual effect):** The pillar rect shows hairline cracks, darkens
2. **Surface sags:** The surface band smoothly deforms downward over 1-2 seconds, creating a trough/depression above the failing pillar
3. **Nodes move:** Sensor node markers above the pillar move down with the surface (shows relative subsidence)
4. **Ripple effect:** Adjacent strata layers crumple/buckle visually
5. **Alert indicator:** Red pulsing line appears above the subsiding area with magnitude label (e.g., "Drop: 1.2m predicted")
6. **Recovery:** If risk drops, animation reverses or stabilizes

#### Interaction

- **Click on cross-section:** Expands to full height (0.3 sec animation)
- **Click a node marker on the map:** Cross-section view immediately jumps to show that node's location (center of X-axis)
- **Hover a node marker on cross-section:** Shows node ID, risk score, tilt angle
- **Hover a pillar:** Shows pillar ID, mining date, age since depillaring
- **Time scrubber (if historical mode):** Slider at bottom lets user scrub through time to see how the cross-section evolved
- **Compare mode (advanced):** Side-by-side view of cross-sections from different time periods or different nodes

#### Visual Feedback

- **Animate subsidence in real-time:** As displacement readings increase, the surface visibly sags (0.5-1 sec smooth transition per update)
- **Pulsing red alert glow** above pillar when HIGH risk detected
- **Smooth layer deformation** (not blocky) to show the cascading effect of pillar failure through strata

#### Why This Design

**This visualization makes the causal chain visible:** Pillar fails → overburden collapses → surface subsides → residents at risk. A supervisor immediately *sees* the consequence, not just a number. The image you shared is the perfect reference — it shows exactly this layering. Combined with the GIS map above (WHERE it's happening), the cross-section shows HOW it happens physically.

---

### 3.3 RIGHT COLUMN: Live Readings Table (Top 60%)

**Location:** Right side of main content area, top section  
**Size:** ~420px wide × 300px tall  
**Technology:** React table component (scrollable)

#### What Users See

A real-time sensor readings feed, showing the 9-component sensor suite:

**Tab 1: Quick View (Default)**
```
┌────┬──────────┬─────────┬──────────┬────────┬────────┐
│ ID │ Tilt(°) │ Vibr(g) │ AE(hits) │ Disp   │ Risk   │
├────┼─────────┼─────────┼──────────┼────────┼────────┤
│ 1  │ -0.95   │  0.12   │ 2        │ +1mm   │ 🟢 LOW │
│ 5  │  8.73   │  2.48   │ 142      │ +47mm  │ 🔴 HIGH│
│ 6  │  8.02   │  2.15   │ 127      │ +42mm  │ 🔴 HIGH│
│ 7  │  7.01   │  1.89   │ 118      │ +38mm  │ 🔴 HIGH│
│ 8  │  7.76   │  2.02   │ 131      │ +44mm  │ 🔴 HIGH│
└────┴─────────┴─────────┴──────────┴────────┴────────┘
Last updated: 2 seconds ago
```

**Tab 2: Full Sensor Suite (Click "Show More")**
```
┌────┬───────┬──────┬────┬──────────┬──────┬──────┬──────┐
│ ID │ Tilt  │ Vibr │ AE │ SoilMois │ Temp │ UWB  │ Last │
├────┼───────┼──────┼────┼──────────┼──────┼──────┼──────┤
│ 5  │ 8.73° │ 2.48 │142 │ 65%RH    │ 24°C │ -2mm │ 2s   │
│ 6  │ 8.02° │ 2.15 │127 │ 68%RH    │ 24°C │ -1mm │ 2s   │
└────┴───────┴──────┴────┴──────────┴──────┴──────┴──────┘
[More columns: Crack meter, Inter-node distance]
```

**Column Definitions:**
- **Tilt(°):** Angle of ground tilt from horizontal (MPU6050)
- **Vibr(g):** Ground vibration amplitude in g (geophone or MEMS accelerometer)
- **AE(hits):** Acoustic emission event count (piezo + TL072 op-amp)
- **Disp/UWB:** Inter-node distance change in mm (UWB ranging)
- **SoilMois:** Soil moisture/water content % (capacitive sensor)
- **Temp:** Ambient temperature (DHT22)
- **Crack:** Crack meter width in mm (resistive sensor, if installed)
- **Last:** Time since last reading (seconds ago)

#### Interaction

- **Sort by any column:** Users can sort by risk, tilt, panel, etc.
- **Click a row:** Highlights that node on the 3D twin, updates the 2D profile to focus on that sensor's region
- **Scroll:** Table scrolls if there are >8 nodes
- **Row highlight on new HIGH risk:** New alert rows flash amber/red briefly, then steady state
- **Click row menu (...):** Options to view historical trend for this node, acknowledge alert, snooze

#### Color Coding

- **Row background:** Light tint matching risk level (green for LOW, amber for MEDIUM, red for HIGH)
- **Status emoji/icon:** 🟢 (green circle) / 🟡 (amber) / 🔴 (red circle) — instantly scannable

#### Interaction

- **Sort by any column:** Users sort by tilt, risk, vibration, AE, etc.
- **Click a row:** Highlights that node on GIS map, cross-section updates to show that location, sidebar updates
- **Toggle "Show More":** Expands to show all 9 sensor columns
- **Scroll:** Table scrolls if >8 nodes
- **Export:** Click menu (…) to export this node's data as CSV/PDF

#### Why This Design

The table serves two jobs: **(a) confirmation** (users verify exact readings from the display) and **(b) detail drill-down** (click a row to navigate to that node on the map/cross-section). It's not cluttered — Quick View shows only essentials (Tilt, Vibration, AE, Displacement, Risk). Full sensor suite hidden behind "Show More" for power users.

---

### 3.4 RIGHT COLUMN: Risk Scores & AI/ML Output (Bottom 40%)

**Location:** Right side of main content area, bottom section  
**Size:** ~420px wide × 300px tall  
**Technology:** React cards + inline charts

#### What Users See

**A. Current Risk Status (Top)**
```
┌────────────────────────────────┐
│ PANEL 2 RISK SUMMARY           │
├────────────────────────────────┤
│ Overall Risk: HIGH 🔴          │
│ Trend: ↗ RISING (last 6h)     │
│ Anomaly Score: 0.87 (LSTM)     │
│ Confidence: 94%                │
│ Prediction Horizon: 2-3 days   │
│                                │
│ Most Critical: Node 5, Node 6  │
│ Recommended Action: ESCALATE   │
└────────────────────────────────┘
```

**B. Per-Node Risk Breakdown (Below)**
```
Node 5: LSTM Anomaly Score = 0.87 (HIGH)
  └─ Tilt trend: +7.2° → +8.73° (rising)
  └─ AE spike: 2 events/min → 142 events/min (64x normal)
  └─ Prediction: Pillar failure risk 73% within 3 days

Node 6: LSTM Anomaly Score = 0.84 (HIGH)
  └─ Similar pattern, 48h offset from Node 5
```

**C. Alert History (Inline)**
```
[HIGH] 14:23 — Panel 2, Nodes 5-8
       ├─ Status: Active 🔴
       ├─ Acknowledged by: None
       └─ [Acknowledge] [Escalate]

[MEDIUM] 11:05 — Panel 1, Node 2
       ├─ Status: Resolved ✓
       └─ Resolved at: 13:15
```

#### What Each Field Means

- **Overall Risk:** Aggregate risk across selected panel (LOW/MEDIUM/HIGH), calculated by LSTM on all nodes
- **Trend:** Direction of risk change (↗ rising, → stable, ↘ falling)
- **Anomaly Score:** LSTM reconstruction error (0-1 scale; >0.7 typically triggers HIGH alert)
- **Confidence:** Model confidence in the anomaly (based on historical variance, data quality)
- **Prediction Horizon:** How far into the future the model is extrapolating (e.g., "within 2-3 days" = model says failure risk will peak in this window)
- **Per-Node Risk:** Breakdown of which nodes are driving the overall panel risk

#### Interaction

- **Click a node risk card:** Highlights that node on GIS map
- **Click "Anomaly Score" card:** Opens modal showing the LSTM model's input time-series and reconstruction error graph
- **Click "Acknowledge":** Records acknowledgment, grays out alert
- **Click "Escalate":** Opens escalation dialog (to Manager, Safety Officer, or Residents)
- **View Alert History:** Link to full alert log for past 30 days

#### Why This Design

**This is where AI/ML adds value.** The readings table shows *what is,* the risk scores show *what might happen.* The LSTM anomaly score + prediction horizon tell the operator "this node's readings are abnormal AND we predict failure within X days." The confidence % gives the operator a sense of model reliability. This informs escalation urgency: a 73% failure risk in 3 days warrants immediate escalation; 30% risk in 10 days warrants monitoring and follow-up.

---

### 3.4 LEFT SIDEBAR

**Location:** Left edge of main content, 280px wide  
**Visibility:** Shown on desktop, collapsed into hamburger drawer on mobile  

#### Sections (top to bottom)

**A. MINE & PANEL SELECTOR**
```
┌──────────────────────┐
│ Mine: Demo Mine ▼    │
│ Panel: Panel 2 ▼     │
│ [View All Panels]    │
└──────────────────────┘
```
- Dropdown to switch between mines (if multi-site deployment)
- Dropdown to switch active panel (updates all visualizations)
- Link to view all panels in a list or grid

**B. SENSOR LIST (Current Panel)**
```
┌──────────────────────┐
│ Sensors (Panel 2)    │
├──────────────────────┤
│ ✓ Node 1 (Panel 1)   │ ← Low risk, enabled
│ ✓ Node 2 (Panel 1)   │
│ ✗ Node 5 (Panel 2)   │ ← High risk, PULSE
│ ✗ Node 6 (Panel 2)   │   (red background)
│ ✗ Node 7 (Panel 2)   │
│ ✗ Node 8 (Panel 2)   │
│ [+ Add Sensor]       │ (hidden if not admin)
└──────────────────────┘
```
- List of all sensor nodes in the selected panel
- Check mark = online/last reading <5 min ago
- X mark = offline/stale data
- **HIGH-risk nodes** have red pulsing background
- Clicking a node highlights it on the 3D twin and updates the readings table

**C. ALERT LOG (Last 24 Hours)**
```
┌──────────────────────┐
│ Alerts (Last 24h)    │
├──────────────────────┤
│ [HIGH] Panel 2       │
│ 14:23 Nodes 5-8      │
│ [Acknowledge]        │
│                      │
│ [MEDIUM] Panel 1     │
│ 10:15 Node 2         │
│ [Acknowledge]        │
│                      │
│ [LOW] Panel 1        │
│ 08:32 Node 4         │
│ [Dismiss]            │
│ [View More ...]      │
└──────────────────────┘
```
- Reverse chronological order (newest first)
- Color-coded by risk level (red/amber/green)
- Show panel, timestamp, affected nodes
- Quick action buttons: Acknowledge, Snooze (4h), Dismiss, Escalate
- "View More" link opens full alert history page

**D. QUICK STATS (Summary)**
```
┌──────────────────────┐
│ OVERALL STATUS       │
├──────────────────────┤
│ Active Nodes: 8/8    │
│ HIGH Alerts: 4       │
│ MEDIUM Alerts: 1     │
│ Last Alert: 14:23    │
│ Avg Tilt: +2.1°      │
│ Max Risk: 8.73°      │
│                      │
│ [Export Report]      │
│ [Full Analytics]     │
└──────────────────────┘
```
- One-line metrics at a glance
- Color-coded (red if any HIGH alerts)
- Quick links to export and analytics

#### Why This Sidebar

All critical **navigation and status** in one place. A supervisor doesn't have to hunt for a list of nodes or past alerts — they're always available without cluttering the main 3D twin. On mobile, the sidebar becomes a drawer to reclaim screen real estate for the hero visualization.

---

## 4. Navigation System & User Flows

### 4.1 Top Navigation Bar

```
┌──────────────────────────────────────────────────────────────┐
│ [LOGO] Mine Subsidence Monitor │ Monitoring | Reports │ Help  │
│                                   Settings | Logout            │
└──────────────────────────────────────────────────────────────┘
```

- **Logo** (left): Links back to dashboard home
- **Monitoring** (primary): Active dashboard (current page)
- **Reports** (secondary): Historical reports, compliance exports, analytics
- **Settings** (secondary): User preferences, alert thresholds, integrations
- **Help** (secondary): Docs, contact support
- **User menu** (right): Logout, profile, preferences

### 4.2 Primary User Flows

#### Flow 1: Monitor Active Panel (Primary Job)
```
1. User lands on dashboard
   ↓
2. Sidebar shows active panel (e.g., Panel 2) with sensor list
   ↓
3. 3D twin renders underground geometry + sensor positions
   ↓
4. Read live readings in bottom-right table
   ↓
5. If ANY HIGH-risk node appears:
   a. 3D twin highlights that pillar in red + pulsing glow
   b. Surface mesh sags/deforms at that location
   c. Sidebar alert log shows new HIGH alert
   d. Operator clicks alert → node highlights in table
   ↓
6. Operator clicks node in table → detail view opens (overlay)
   ↓
7. Detail view shows: Historical trend, Anomaly info, Linked sensors, Manual check options
   ↓
8. Operator can: Acknowledge, Snooze, Escalate to Manager
```

#### Flow 2: Switch Panels (If Multi-Panel Site)
```
1. Operator notices Alert in sidebar for Panel 1
   ↓
2. Clicks "Panel 1" dropdown in sidebar
   ↓
3. Entire dashboard switches: 
   - 3D twin reloads Panel 1 geometry
   - Sensor list updates for Panel 1
   - Readings table updates with Panel 1 data
   - Alert log filters to Panel 1
   ↓
4. User continues monitoring Panel 1
```

#### Flow 3: Export Compliance Report (Secondary Job)
```
1. Operator clicks "Reports" in top nav
   ↓
2. Reports page shows:
   - Date range picker
   - Panel/sensor selector
   - Report type (Daily Summary, Incident Report, Compliance Audit)
   ↓
3. Clicks "Generate"
   ↓
4. PDF/CSV is prepared with:
   - Time-stamped readings
   - Alert history
   - Risk scores and trends
   - Signature/approval section
   ↓
5. Downloaded or emailed automatically
```

---

## 5. What's Visible vs. Hidden (And Why)

### Visible by Default (Above the Fold)

| Element | Why |
|---|---|
| **GIS Map** | **PRIMARY hero element** — WHERE is the risk on the mine panel? Answers the fundamental spatial question |
| **Cross-Section View** | **SECONDARY hero element** — HOW does the risk manifest underground? Shows geological causality |
| **Live Readings Table (Quick View)** | Shows the SENSOR DATA driving the risk scores (tilt, vibration, AE, displacement) |
| **Risk & Alerts Panel** | Shows the AI/ML OUTPUT and escalation status — "is this going to fail?" |
| **Top navigation** | Users need to switch between Monitoring, Reports, Settings |
| **Left sidebar** (panels/sensors/alerts) | Quick context, alert log, and navigation without scrolling |
| **Mine/Panel selector** | Multi-panel sites need instant switching |

### Hidden/Collapsed Until Needed

| Element | When Revealed | Why |
|---|---|---|
| Full Sensor Suite | Click "Show More" in readings table | All 9 sensor columns (soil moisture, inter-node distance, crack meter, etc.) are valuable but clutter the default view; power users can expand |
| Subsidence animation | Triggered automatically when HIGH alert fires, OR click cross-section to expand | Animation is powerful but shouldn't play constantly; only on demand or on critical alert |
| Historical trend chart | Click a node in table or "View Trend" link | Important for context but only after drilling into a specific node; showing all trends simultaneously = visual noise |
| Threshold configuration | Settings > Risk Thresholds | Only admins adjust this; operators don't need to see it |
| Full 30-day alert history | Click "View More" in right panel | Last 24h alerts visible by default; older alerts hidden behind a link |
| GIS layer toggles (heatmap, pillar footprints) | Top-right checkboxes on GIS map | Optional; users enable as needed (not everyone needs them) |
| Pillar detail card | Click a pillar footprint on GIS map | Detailed pillar geometry/history only relevant when investigating a specific pillar |

### Why This Hierarchy

**GIS + Cross-Section + Live Readings + Risk Scores = everything a supervisor needs to decide whether to escalate.** This is the complete picture:
- GIS answers WHERE
- Cross-section answers HOW
- Readings answer WHAT (sensor data)
- Risk scores answer "WILL IT FAIL?" (ML prediction)

Everything else (historical trends, advanced analytics, compliance reports) supports decision-making *after* the immediate alert — they're important but secondary.

---

## 6. UI States & Feedback

### 6.1 Loading State

**Scenario:** Dashboard first loads, or user switches panels

**What Users See:**
- 3D canvas shows a wireframe skeleton (outline of pillars + surface, no detail)
- Sidebar sensor list shows as grayed-out placeholders
- Readings table shows skeleton rows (shimmer animation)
- Banner at top: "Fetching latest sensor data..."

**Why:** Users understand data is loading; no confusion or perceived freezing.

### 6.2 Data Update (Live Reading Refresh)

**Scenario:** New sensor reading arrives (every 5-10 seconds)

**What Users See:**
- 3D surface mesh smoothly deforms (1-2 second animation) to reflect new displacement
- Readings table row updates with new value; cell briefly highlights in yellow/amber
- If risk level changes (e.g., LOW → HIGH):
  - Table row background flashes red
  - 3D pillar pulses red
  - Sidebar alert log shows new alert
  - (If very high priority) Toast notification in bottom-right: "HIGH RISK: Panel 2, Nodes 5-8"

**Why:** Visual feedback shows data is fresh and actionable, without requiring clicks.

### 6.3 Alert Triggered (HIGH Risk)

**Scenario:** Risk score crosses HIGH threshold

**What Users See:**
1. 3D twin: Affected pillar glows red, pulsates (2x per second)
2. Surface above pillar visibly sags/deforms
3. Readings table: Row for the node turns red background, pulses
4. Sidebar alert log: New "HIGH" alert appears at the top with timestamp
5. Toast notification: "⚠️ HIGH RISK ALERT — Panel 2, Nodes 5-8 | Tilt: 8.73° | [Acknowledge] [Escalate]"
6. If configured, SMS/email sent automatically to manager

**Why:** Layered feedback ensures the alert is noticed and actionable without requiring the user to hunt for it.

### 6.4 Operator Acknowledges Alert

**Scenario:** User clicks "Acknowledge" button on toast or in alert log

**What Users See:**
- Alert row in log changes to a muted gray (still visible, but no longer pulsing)
- Tooltip shows: "Acknowledged by [Operator Name] at [time]"
- Red glow on 3D pillar stops pulsing (but stays red, showing ongoing risk)
- Toast disappears

**Why:** Acknowledges are tracked for compliance; visual change confirms action taken.

### 6.5 Offline/No Data State

**Scenario:** A sensor node goes offline or data sync fails

**What Users See:**
- Sensor node in sidebar marked with ✗ (offline)
- Corresponding row in readings table grayed out, marked "[No data — last reading 23 min ago]"
- In 3D twin, that node's marker becomes hollow/transparent (not solid)
- Alert log shows: "[INFO] Node 5 offline — last reading at 14:15"

**Why:** Clear visual distinction between "working but no anomaly" and "not reporting at all." Operator knows to check the node's physical connection.

---

## 7. Mobile & Responsive Design

### Tablet (768px - 1024px)
- Sidebar shrinks to 200px or becomes a collapsible drawer
- 3D twin and 2D profile/table remain side-by-side but smaller
- Top nav adapts to touch-friendly tap targets

### Mobile (< 768px)
- **Full-screen 3D twin** (hero gets maximum space)
- **Hamburger menu** (top-left) for sidebar
- **Bottom sheet** for readings table (swipe up from bottom)
- **Sidebar alert log** accessible via drawer

**Layout on mobile:**
```
┌─────────────────────┐
│ ☰ | Mine | ⟳ | ⚙️  │  ← Compact header
├─────────────────────┤
│                     │
│   3D TWIN (full)    │  ← Hero element gets all space
│   (touchable)       │
│                     │
├─────────────────────┤
│  [Panel 2] [Alert 1]│  ← Quick action buttons
│  [Swipe up for more]│
└─────────────────────┘
```

---

## 8. Color Palette & Visual Language

### Core Palette (Tied to Mining Domain)

| Role | Hex | Name | Usage |
|---|---|---|---|
| Background | `#1A1714` | Anthracite coal | Main background, cards |
| Surface/Cards | `#24211C` | Charcoal seam | Elevated surfaces, containers |
| Brand accent | `#C9A66B` | Sand/overburden | Logo, primary buttons, active states |
| Text primary | `#EDE6DA` | Off-white | All readable text |
| Risk: Low | `#4C8C6B` | Muted moss green | Stable pillars, LOW alerts |
| Risk: Medium | `#D98E3B` | Amber/ochre | Caution, MEDIUM alerts, pillar weakening |
| Risk: High | `#B3492E` | Rust/iron-oxide | Critical, HIGH alerts, failure imminent |

### 3D Twin Color Coding

- **Stable pillars:** Coal-gray (`#2A2420`) with subtle shadow
- **Low-risk pillar:** Tinted green overlay (20% opacity `#4C8C6B`)
- **Medium-risk pillar:** Tinted amber overlay (40% opacity `#D98E3B`)
- **High-risk pillar:** Bright red with pulsing glow (`#B3492E`, 80% opacity, pulsate 2x/sec)
- **Surface (topography):** Sand color with contour lines (`#C9A66B` base, darker lines)
- **Deformed surface (subsidence):** Surface darkens slightly where sag is worst (toward rust-red)

### Typography

- **Headings:** Space Grotesk (geometric, technical feel)
- **Body text:** IBM Plex Sans (clean, legible in dashboard)
- **Sensor readings / risk scores:** IBM Plex Mono (instrumentation feel, numbers)

---

## 9. Key Interactions & Micro-Interactions

### 9.1 Hover States

| Element | Hover Effect |
|---|---|
| 3D Pillar | Slight color lighten, tooltip shows ID + strength |
| Sensor node marker | Highlight glow, tooltip shows node ID + risk |
| Sidebar sensor row | Row background highlights, cursor pointer |
| Readings table row | Row background highlights, shows detail icon |
| Alert row | Expand slightly, show full timestamp + action buttons |

### 9.2 Click Actions

| Element | Click Action |
|---|---|
| 3D Pillar | Opens pillar detail card (overlay): ID, geometry, mining date, expected failure mode, linked sensors |
| Sensor node (3D or table) | Highlights in all views, updates readings table/chart to focus on this node |
| Sidebar alert | Jumps to node on 3D twin, highlights in table, scrolls to relevant position |
| "Acknowledge" button | Marks alert as acknowledged, grays out, records timestamp |
| "Escalate" button | Opens escalation dialog: select recipient (manager, safety officer), add note, send |

### 9.3 Animations

| Trigger | Animation |
|---|---|
| 3D surface update | Mesh vertices smoothly interpolate to new height (0.5-1.5 sec) |
| HIGH alert triggered | Pillar + surface pulse red (2x per second) |
| Alert acknowledged | Pulse fades to steady red; row fades to gray |
| Panel switch | 3D twin cross-fades to new panel (0.3 sec fade) |
| Node detail overlay enter | Slide up from bottom (0.2 sec) |
| Readings table row highlight | Smooth background color transition (0.1 sec) |

**Note:** All animations respect `prefers-reduced-motion` for accessibility.

---

## 10. User Roles & Customized Views

### Operator (Field/Supervisor)

**Default view:**
- 3D twin + live readings (primary focus)
- Alert log (to know what needs acknowledgment)
- Cannot change thresholds, cannot generate reports
- Quick action: Acknowledge/snooze alerts

**Hidden:**
- Settings, user management, threshold config
- Advanced analytics, historical trend charts (unless clicked into)

### Planner (Mine Manager)

**Default view:**
- Dashboard similar to Operator, but also shows:
  - Historical trend charts (2D profile over time)
  - Alert summary (counts of HIGH/MEDIUM/LOW in last 24h, 7d, 30d)
  - Report generation link
- Can view analytics, create reports, acknowledge alerts
- Cannot change alert thresholds (escalates to Safety Officer)

### Regulator (Compliance Officer, Read-Only)

**Default view:**
- Same as Planner, but read-only (no acknowledge/escalate actions)
- Focus on historical logs, compliance reports
- Can export audit trail, but cannot modify alerts

**Hidden:**
- "Acknowledge" and "Escalate" buttons
- Forward-looking predictive data (only historical/current, no future risk estimates)

---

## 11. Error & Edge Cases

### Sensor Offline

**Display:**
- Sidebar: Node row marked with ✗, grayed out
- 3D twin: Node marker becomes hollow/transparent
- Alert log: "[INFO] Node 5 offline — last reading 2 hours ago"

**Action available:** "Re-pair sensor" link (if admin)

### Database Sync Failure

**Display:**
- Banner at top: "⚠️ Unable to sync data. Retrying... | [Retry] [Dismiss]"
- Readings table shows timestamp, but with a warning icon
- 3D twin remains frozen at last-known state (doesn't update)

**Why:** User knows data may be stale, not live; informs their decisions.

### User Permissions Error (Trying to Escalate but No Email Configured)

**Display:**
- Toast: "Cannot escalate — email not configured. [Contact Admin]"
- Escalate button disabled (grayed out)

### No Alerts in Last 24h

**Display:**
- Alert log section in sidebar: "[No alerts in the last 24 hours]" — calm/positive message
- 3D twin shows all pillars as green/stable

---

## 12. Accessibility & Usability

### Keyboard Navigation

- Tab through: Nav bar → Sidebar sections → 3D canvas → Readings table → Action buttons
- Enter/Space to activate buttons
- Arrow keys to rotate 3D twin (in addition to mouse drag)
- Esc to close detail overlays

### Screen Reader Support

- Alt text for all icons: "High risk alert", "Offline sensor", "Acknowledge"
- 3D canvas: Summary aria-label describing current scene ("3D visualization of Panel 2: 4 nodes, 2 HIGH risk pillars in NE zone")
- Table cells read out: "Node 5, Panel 2, Tilt 8.73 degrees, Risk HIGH"

### Color Contrast

- All text on background meets WCAG AA (4.5:1 for body text)
- Risk colors supplemented with symbols (🟢 🟡 🔴) not just color alone

### Mobile Touch Targets

- All buttons ≥ 44px × 44px
- Sensor markers on mobile 3D canvas ≥ 40px diameter (easier to tap)
- Double-tap to zoom 3D twin

---

## 13. Summary: Information Architecture

```
DASHBOARD (Primary View)
├── LEFT COLUMN (65% width)
│   ├── HERO: GIS Map
│   │   ├── Panel boundary + sensor node markers (color-coded by risk)
│   │   ├── Deformation vectors (ground movement direction/magnitude)
│   │   ├── Pillar footprints (faint, showing underground geometry)
│   │   ├── Risk heatmap overlay (optional toggle)
│   │   └── Interactive: click nodes, zoom, pan, toggle layers
│   │
│   └── SECONDARY: Cross-Section View (Geological Layers)
│       ├── Surface, overburden strata, pillars, coal seam
│       ├── Sensor nodes positioned above pillars
│       ├── Subsidence animation on HIGH alert
│       ├── Depth scale (meters from surface)
│       └── Interactive: click to expand, time scrubber for history
│
├── RIGHT COLUMN (35% width)
│   ├── Live Readings Table (Top 60%)
│   │   ├── Quick View: Tilt, Vibration, AE, Displacement, Risk
│   │   ├── Full Suite: Toggle to show all 9 sensors
│   │   └── Click row to highlight on GIS/cross-section
│   │
│   └── Risk & AI/ML Output (Bottom 40%)
│       ├── Overall panel risk (LOW/MEDIUM/HIGH)
│       ├── LSTM anomaly scores per node
│       ├── Prediction horizon (days to failure)
│       ├── Alert status + escalation path
│       └── Per-node risk breakdown
│
└── LEFT SIDEBAR (280px, always visible or drawer on mobile)
    ├── Mine/Panel selector
    ├── Sensor list (with online/offline status)
    ├── Alert log (last 24h, color-coded)
    └── Quick stats summary

REPORTS PAGE (Secondary View)
├── Date range, panel, report type selectors
├── Compliance export (PDF/CSV)
├── Historical risk trends by panel
├── Incident timeline
└── Regulatory submission tools

SETTINGS PAGE (Tertiary View)
├── User preferences (theme, units)
├── Alert thresholds (admin only)
├── Sensor calibration (admin only)
├── Integrations (Twilio SMS, SendGrid email, Firebase push)
├── Data retention & export
└── User management

DETAIL VIEWS (Overlays)
├── Node detail card (on node click)
│   ├── Historical time-series (tilt, vibration, AE)
│   ├── Anomaly detection overlay on chart
│   └── Manual override/pause monitoring
├── Escalation dialog (on escalate click)
│   ├── Recipient selector (Manager, Safety Officer, Residents)
│   ├── Message template customization
│   └── Send confirmation
└── Pillar detail card (on pillar click on cross-section)
    ├── Pillar ID, mining date, age since depillaring
    ├── Linked sensor nodes
    ├── Expected failure mode
    └── Historical status
```

---

## 14. Rationale: Why This Design Works for Underground Mining

### Problem: Geographic Orientation (WHERE?)

Mining operators, planners, and regulators all think in map coordinates first: "Where on the panel is this risk?" A supervisor managing 10 coalfield panels needs to know immediately which geographic area is in trouble. **The GIS layer makes the location unmissable.** It's the first thing they see because it's the first question they ask.

### Problem: Underground Causality (HOW?)

A risk score (8.7° tilt) tells the operator something *is* happening. But what does it *mean*? The cross-section view answers this: the ground is tilting because Pillar 12 (100m below) is failing, and if it collapses completely, the surface will subside 1.2m. **The cross-section makes the causal chain visible** — pillar failure → overburden collapse → surface drop → residents at risk. The operator sees the consequence, not just the warning light.

### Problem: Sensor Reliability (WHAT?)

Nine different sensors (tilt, vibration, AE, displacement, soil moisture, temp, humidity, crack, inter-node distance) are confusing in aggregate. The dashboard shows **essential sensors first** (tilt, vibration, AE, displacement) — these are the most informative for subsidence detection. Specialized sensors (soil moisture as a rainfall/saturation context, inter-node distance for spatial deformation) are available in a "Show More" tab for power users, but don't clutter the default view.

### Problem: AI/ML Credibility (WILL IT FAIL?)

An LSTM anomaly score (0.87) is meaningless to an operator without context. The Risk & Alerts panel provides that context: "anomaly score 0.87, confidence 94%, prediction: 73% chance of failure within 3 days." The prediction horizon ("within 3 days") tells the operator *how urgent* this is. The confidence % tells them *how much to trust* the ML model. This informs escalation urgency.

### Problem: Real-Time Risk vs. Historical Context

A supervisor needs *both*: live alerts (NOW) and historical trends (has this been degrading for days?). The dashboard provides live readings + real-time risk scores; clicking into a node's detail reveals historical charts. No single view is overloaded.

### Problem: Usability Under Stress

In a real emergency (HIGH alert), the operator has **seconds** to decide: escalate or monitor? The combination of GIS (WHERE) + cross-section (HOW) + risk scores (WILL IT FAIL?) gives them the complete picture instantly. The pulsing red node on the GIS map and the animating subsidence on the cross-section are unmissable.

### Problem: Multi-Panel Multi-Site Operations

Managing multiple panels or multiple coalfields: the panel selector in the sidebar + top navigation make switching instant. All visualizations (GIS, cross-section, readings, risk scores) update coherently per panel.

### Why GIS + Cross-Section (Not Just One)

- **GIS map** answers WHERE (geographic location) — this is how operators think
- **Cross-section** answers HOW (underground mechanism) — this is what engineers need to understand causality
- **Together** they're complete: geographic context + geological causality + sensor data + AI/ML prediction = a supervisor can escalate with confidence

---

## 15. Next Steps for Stitch AI

**Provide to Stitch AI:**
1. This entire `UI_UX_SPECIFICATION.md` document (revised version focused on GIS + Cross-Section)
2. Color palette (hex codes) + typography (font families) from Section 8
3. Reference image: Your "When Abandoned Mines Collapse" image showing geological layers
4. Assets needed:
   - Soil/overburden layer textures (sand, shale, mudstone bands)
   - Pillar icon/geometry (dark rectangle)
   - Risk status emoji (🟢 🟡 🔴)
   - Sensor node marker icons (circles, color-coded)
   - Alert icons (bell, checkmark, escalate arrow)
   - GIS map styling (panel boundary, deformation vectors, pillar footprints)
   - Cross-section background pattern (geological strata)

**Interactive Prototype Priorities (Build in This Order):**

1. **GIS Map** (PRIMARY)
   - Leaflet.js integration
   - Panel boundary (GeoJSON polygon)
   - Sensor node markers (clickable, color-coded by risk)
   - Click node → highlight on map
   - Zoom/pan controls
   - Layer toggles (heatmap, pillar footprints)

2. **Cross-Section View** (SECONDARY)
   - SVG/Canvas geological layers (surface, overburden, pillars, coal seam)
   - Sensor node markers positioned above pillars
   - Click GIS node → cross-section updates to show that location
   - Subsidence animation (surface sags when HIGH alert triggers)

3. **Live Readings Table** (TERTIARY)
   - Quick View (Tilt, Vibration, AE, Displacement, Risk)
   - "Show More" toggle for full 9-sensor suite
   - Click row → highlight on GIS + cross-section

4. **Risk & Alerts Panel** (TERTIARY)
   - Risk summary card (overall HIGH/MEDIUM/LOW)
   - Per-node anomaly scores
   - Alert history with status
   - Escalation buttons

5. **Left Sidebar** (SUPPORTING)
   - Panel/mine selector
   - Sensor list (online/offline status)
   - Alert log
   - Quick stats

6. **Mobile Responsiveness**
   - GIS full-width at top
   - Cross-section and readings stack below
   - Sidebar as drawer

**Design Component Library (Create These):**
- Button variants (primary, secondary, danger)
- Cards (risk card, alert card, node detail card)
- Alert toasts (success, info, warning, error)
- Tabs/toggles (Quick View vs. Full Suite)
- Modals (escalation dialog, node detail overlay)
- Badges (risk level, online/offline status)

**Responsive Breakpoints:**
- Desktop: 1920px (2-column layout: GIS+cross-section left, readings+risk right)
- Tablet: 1024px (stack more vertically, sidebar as drawer)
- Mobile: 480px (full-width GIS, stacked sections below, hamburger nav)

**Accessibility Audit:**
- Color contrast: WCAG AA (4.5:1 for body text)
- Keyboard navigation: Tab through all interactive elements
- Screen reader: Aria-labels on GIS markers, risk badges, alert toasts
- Touch targets: ≥44px on mobile
- Reduced motion: Disable animations if `prefers-reduced-motion` is set

**Micro-Interactions to Nail:**
- Node marker pulse on HIGH alert (2x per second)
- Cross-section surface deformation (0.5-1 sec smooth sag animation)
- GIS map zoom to node (0.3 sec animation)
- Table row highlight on update (0.1 sec color transition)
- Modal slide-in/out (0.2 sec)
- Toast notification enter/exit (0.2 sec fade)