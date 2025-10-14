# Design Guidelines - Sistema de Gestão de Leads

## Design Approach: Data-Driven Dashboard System

**Selected Approach:** Design System (Utility-Focused Application)  
**Primary Inspiration:** Linear + Notion (productivity-focused interfaces)  
**Supporting Reference:** Shadcn UI components with modern dashboard patterns

**Rationale:** This is an internal productivity tool focused on data management, conversion tracking, and team performance. Design prioritizes clarity, efficiency, and information density over visual flair. Users need to process data quickly and take actions without friction.

## Core Design Principles

1. **Data Clarity First** - Information hierarchy that makes metrics scannable at a glance
2. **Action-Oriented** - Primary actions always visible and one-click accessible  
3. **Status-Driven Color** - Color used strategically to communicate lead temperature and stages
4. **Responsive Density** - Information-rich on desktop, streamlined on mobile
5. **Consistent Patterns** - Reusable components for forms, tables, cards, and stats

## Color Palette

### Light Mode
- **Background:** 0 0% 100% (pure white)
- **Surface:** 0 0% 98% (subtle gray for cards)
- **Border:** 0 0% 90% (light gray borders)
- **Text Primary:** 0 0% 10% (near black)
- **Text Secondary:** 0 0% 45% (medium gray)

### Dark Mode  
- **Background:** 222 15% 8% (deep slate)
- **Surface:** 222 15% 12% (elevated slate)
- **Border:** 222 15% 20% (subtle borders)
- **Text Primary:** 0 0% 98% (near white)
- **Text Secondary:** 0 0% 65% (muted white)

### Brand & Status Colors
- **Primary (Brand):** 221 83% 53% (professional blue - university tone)
- **Hot Lead:** 0 84% 60% (warm red with fire emoji 🔥)
- **Warm Lead:** 43 96% 56% (vibrant yellow with emoji 🟡)
- **Cold Lead:** 199 89% 48% (cool cyan with ice emoji 🧊)
- **Success (Matriculated):** 142 76% 36% (green for conversion)
- **Lost Lead:** 0 0% 45% (neutral gray)

### Accent (Use Sparingly)
- **Charts/Highlights:** 262 83% 58% (subtle purple for data visualization)

## Typography

**Font Stack:** Inter (via Google Fonts CDN)

### Hierarchy
- **Display (Dashboard Headers):** text-3xl font-bold (30px)
- **Page Titles:** text-2xl font-semibold (24px)  
- **Section Headers:** text-xl font-semibold (20px)
- **Body Text:** text-base font-normal (16px)
- **Small/Meta:** text-sm font-normal (14px)
- **Micro (Labels):** text-xs font-medium (12px uppercase tracking-wide)

### Weights
- Regular (400): Body text, descriptions
- Medium (500): Labels, secondary headers
- Semibold (600): Card titles, section headers
- Bold (700): Page titles, key metrics

## Layout System

**Spacing Primitives:** Tailwind units of **2, 4, 8, 12, 16** (keep consistent)

### Grid Structure
- **Main Container:** max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- **Dashboard Layout:** Sidebar (256px fixed) + Main Content (flex-1)
- **Card Spacing:** gap-4 for grids, p-6 for card padding
- **Section Spacing:** mb-8 between major sections, mb-4 between related elements

### Responsive Breakpoints
- Mobile: < 640px (single column, stacked layout)
- Tablet: 640px - 1024px (2-column where appropriate)  
- Desktop: > 1024px (full dashboard with sidebar)

## Component Library

### Navigation
- **Sidebar:** Fixed left navigation with logo, main menu, user profile at bottom
- **Top Bar:** Page title, breadcrumbs, quick actions (+ New Lead, filters, profile dropdown)
- **Mobile:** Collapsible hamburger menu with overlay

### Data Display

**Lead Cards:**
- White/slate surface with border
- Lead name (text-lg font-semibold) + status badge at top
- Contact info with icons (phone, email) below
- Temperature indicator (large emoji + color-coded border-l-4)
- Course tag + origin tag (small badges)
- Action buttons at bottom (Update Status, Add Note, View Details)

**Stats Cards (Dashboard):**
- Large metric number (text-4xl font-bold) with color accent
- Label below (text-sm text-muted)
- Optional trend indicator (↑ 12% green or ↓ 8% red)
- Icon in top-right corner (subtle, low opacity)

**Data Tables:**
- Sticky header with sort indicators
- Alternating row backgrounds for readability
- Row hover state with elevated shadow
- Inline actions (edit, view, status dropdown)
- Pagination at bottom (10/25/50 items per page)

### Forms
- **Lead Form:** Two-column layout on desktop, single on mobile
- Field groups with clear labels (text-sm font-medium mb-2)
- Input fields with border, focus:ring-2 focus:ring-primary
- Required fields marked with asterisk
- Textarea for observations (min-h-32)
- Status dropdown with color indicators
- Submit button primary color, Cancel button ghost

### Charts & Visualizations
- **Funnel Chart:** Vertical stepped funnel showing Contato → Interesse → Prova → Matrícula with conversion %
- **Lead Temperature Gauge:** Radial/semi-circle gauge with 🔥🟡🧊 zones
- **Conversion Line Chart:** Weekly/monthly trends with multiple lines per salesperson
- **Bar Chart:** Leads by course/origin with horizontal bars
- **Color Coding:** Use brand primary + accent purple for multi-series charts

### Modals & Overlays
- **Modal:** Centered, max-w-2xl, backdrop blur
- **Header:** Title + close button
- **Body:** Form or content with proper spacing
- **Footer:** Action buttons aligned right (Cancel ghost, Confirm primary)

### Status Badges
- **Pill-shaped:** rounded-full px-3 py-1 text-xs font-medium
- **Color-coded backgrounds:** Hot (red/10 + red/90 text), Warm (yellow/10 + yellow/90 text), Cold (cyan/10 + cyan/90 text)
- **Stage badges:** Outlined style with corresponding stage color

### Buttons & Actions
- **Primary:** bg-primary text-white hover:opacity-90 px-4 py-2 rounded-md
- **Secondary:** bg-surface text-primary border hover:bg-surface/80
- **Ghost:** text-primary hover:bg-surface/50  
- **Danger:** bg-red-500 text-white for delete actions
- **Icon Buttons:** p-2 rounded-md hover:bg-surface (for inline actions)

## Dashboard-Specific Layouts

### Main Dashboard (Coordinator View)
- **Top Row:** 4 stat cards (Total Leads, Hot Leads, Conversion Rate, Revenue)
- **Second Row:** Funnel chart (left 60%) + Temperature distribution (right 40%)
- **Third Row:** Conversion trends line chart (full width)
- **Bottom Row:** Top performers ranking table + Recent activity feed

### Salesperson Panel
- **Filters Bar:** Course dropdown, Status dropdown, Date range picker (horizontal row)
- **Lead List:** Cards in grid (3 columns desktop, 1 mobile) with infinite scroll
- **Quick Actions Floating Button:** + Add Lead (bottom right)

### Lead Detail View
- **Header Section:** Lead name, status badge, temperature indicator, last contact date
- **Two-Column Layout:** Left (contact info, course, tags) + Right (interaction history timeline)
- **Actions Bar:** Update Status, Schedule Follow-up, Add Note, Convert to Student
- **Timeline:** Chronological list of interactions with user avatar, timestamp, action description

## Interactive Elements & Animations

**Minimal Animation Approach:**
- **Card Hover:** Subtle lift with shadow (transform translateY(-2px) + shadow-lg)
- **Button States:** Opacity change on hover (no transform)
- **Modal Entry:** Fade in backdrop + scale(0.95 to 1) on content (150ms)
- **Chart Loading:** Skeleton screens, no fancy chart animations
- **Status Changes:** Simple color transition (300ms)

**No** loading spinners, complex transitions, or distracting motion. Speed and clarity over visual effects.

## Accessibility & Quality

- **WCAG AA Compliance:** Minimum 4.5:1 contrast for all text
- **Keyboard Navigation:** Full tab order, focus indicators (ring-2 ring-primary)
- **Screen Readers:** Proper ARIA labels on all interactive elements, status announcements
- **Dark Mode Toggle:** Persistent user preference, smooth theme transition
- **Form Validation:** Inline error messages (text-sm text-red-500 mt-1)
- **Loading States:** Skeleton screens for tables/charts, disabled states for buttons during save

## Icon Library
**Heroicons (via CDN)** - Outline style for general UI, Solid style for filled status indicators

## Distinctive Features
- **Emoji-Enhanced Status:** Large emoji indicators (🔥🟡🧊) make lead temperature instantly recognizable
- **Smart Density:** Information-rich tables on desktop adapt to scannable cards on mobile
- **Contextual Actions:** Every data point has relevant action buttons nearby (no hunting through menus)
- **Real-time Updates:** Dashboard metrics update live using Supabase subscriptions
- **Audit Trail:** Every interaction logged with timestamp and user for complete transparency