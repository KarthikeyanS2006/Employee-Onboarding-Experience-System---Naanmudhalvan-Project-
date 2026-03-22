# OnboardX - Employee Onboarding Experience System

## Concept & Vision

OnboardX transforms chaotic new-hire onboarding into a seamless, confidence-building journey. The platform exudes professionalism with a warm, welcoming energy—think "Fortune 500 meets boutique hotel welcome." Every interaction should feel purposeful, rewarding progress while reducing the anxiety of starting something new. The experience communicates: "We've prepared for you. You're in the right place."

## Design Language

### Aesthetic Direction
Corporate-modern with human warmth. Clean lines and professional structure softened by rounded corners, friendly illustrations, and encouraging micro-copy. Inspired by Linear's precision meets Notion's approachability.

### Color Palette
- **Primary**: `#3B82F6` (Blue 500) - Trust, professionalism
- **Primary Dark**: `#1D4ED8` (Blue 700) - Hover states
- **Secondary**: `#10B981` (Emerald 500) - Success, completion
- **Accent**: `#8B5CF6` (Violet 500) - Special highlights, certificates
- **Warning**: `#F59E0B` (Amber 500) - Pending items
- **Background**: `#F8FAFC` (Slate 50) - Main bg
- **Surface**: `#FFFFFF` - Cards, modals
- **Text Primary**: `#1E293B` (Slate 800)
- **Text Secondary**: `#64748B` (Slate 500)
- **Border**: `#E2E8F0` (Slate 200)

### Typography
- **Headings**: Inter (700, 600) - Clean, modern, professional
- **Body**: Inter (400, 500) - Excellent readability
- **Mono**: JetBrains Mono - Code, certificates
- **Scale**: 12/14/16/18/24/32/48px

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Card padding: 24px
- Section gaps: 32px
- Border radius: 8px (cards), 6px (buttons), 12px (modals)

### Motion Philosophy
- **Entrances**: Fade up + scale (opacity 0→1, translateY 8px→0, 300ms ease-out)
- **Interactions**: Quick, responsive (150ms for hovers, 200ms for state changes)
- **Progress**: Smooth increments (400ms ease-out)
- **Celebrations**: Subtle confetti on completion, gentle pulse on achievements

### Visual Assets
- **Icons**: Heroicons (outline for nav, solid for actions)
- **Illustrations**: Abstract geometric shapes in brand colors for empty states
- **Avatars**: Initials-based with gradient backgrounds
- **Charts**: Chart.js with brand color palette

## Layout & Structure

### Page Architecture
```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (240px)  │  Main Content Area                      │
│  ┌─────────────┐  │  ┌─────────────────────────────────────┐│
│  │ Logo        │  │  │ Header: Page title + actions        ││
│  │ Nav Items   │  │  ├─────────────────────────────────────┤│
│  │ - Dashboard │  │  │                                     ││
│  │ - Training  │  │  │ Content Grid                         ││
│  │ - Quizzes   │  │  │ (Responsive: 1-3 columns)            ││
│  │ - Documents │  │  │                                     ││
│  │ - Feedback  │  │  │                                     ││
│  │ - Mentor    │  │  │                                     ││
│  │ - Certs     │  │  │                                     ││
│  ├─────────────┤  │  │                                     ││
│  │ User Card   │  │  │                                     ││
│  └─────────────┘  │  └─────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Responsive Strategy
- **Desktop (1024px+)**: Full sidebar, 2-3 column grids
- **Tablet (768-1023px)**: Collapsible sidebar, 2 column grids
- **Mobile (<768px)**: Bottom navigation, single column, stacked cards

### Visual Pacing
- Dashboard: Dense information with clear visual hierarchy
- Training/Quiz: Focused, distraction-free, one action at a time
- Completion pages: Generous whitespace, celebration moments

## Features & Interactions

### Authentication
- Email/password login with Supabase Auth
- Role auto-detection from profiles table
- Redirect to appropriate dashboard based on role
- Session persistence with automatic token refresh

### Employee Features

#### Welcome Experience
- Animated welcome card with company branding
- Personalized greeting with name and start date
- Estimated completion time based on progress
- Quick-start button to resume where left off

#### Onboarding Progress
- Visual progress bar (0-100%)
- Step-by-step checklist with status icons
- Current step highlighted with pulse animation
- Click to expand step details and resources

#### Training Modules
- Department-specific content paths
- Video player with progress tracking
- PDF viewer with scroll sync
- Estimated read time displayed
- "Mark as Complete" button

#### Quiz System
- One question per view for focus
- Progress indicator (Question 3 of 10)
- Multiple choice with immediate feedback
- Score display on completion
- Retry option (max 3 attempts)
- Pass threshold: 70%

#### Document Management
- Upload area with drag-and-drop
- Supported formats: PDF, DOC, DOCX, JPG, PNG
- File preview thumbnails
- Upload progress indicator
- Verification status badge

#### Mentor Connection
- View assigned mentor profile
- Quick message button
- Scheduled check-in calendar
- Help request form

#### Feedback Collection
- Star rating (1-5) with labels
- Optional comments field
- Step-specific feedback prompts
- Thank you animation on submission

#### Certificate
- Auto-generated on 100% completion
- Company seal graphic
- Employee name, date, department
- Downloadable as PDF
- Share to LinkedIn option

### Mentor Features

#### Employee Overview
- List of assigned mentees
- Status badges (On Track, At Risk, Completed)
- Last activity timestamp
- Quick action buttons

#### Progress Tracking
- Individual employee progress views
- Step completion timeline
- Quiz scores and attempts
- Document verification status

#### Guidance Tools
- Add comments to employee progress
- Approve/reject step completions
- Send reminders (email notification)
- Schedule 1:1 sessions

### HR Admin Features

#### Dashboard Overview
- Key metrics cards (New Hires, Completion Rate, Avg Time)
- Department-wise breakdown chart
- Recent activity feed
- Quick action buttons

#### Analytics
- Completion funnel visualization
- Time-to-complete metrics
- Quiz pass/fail rates
- Feedback trends (monthly)
- Department performance comparison

#### Employee Management
- Search and filter employees
- Bulk actions (assign mentor, send reminder)
- Export to CSV
- Detailed employee profiles

#### Content Management
- Create/edit onboarding steps
- Assign steps to departments
- Upload training content
- Create quiz questions
- Preview as employee view

## Component Inventory

### Navigation
- **Sidebar**: Fixed left, collapsible on mobile
- **TopBar**: Page title, notifications, user menu
- **MobileNav**: Bottom tab bar with 5 key items

### Cards
- **MetricCard**: Icon, value, label, trend indicator
- **ProgressCard**: Title, progress bar, percentage
- **StepCard**: Number, title, description, status, actions
- **EmployeeCard**: Avatar, name, department, status badge

### Forms
- **Input**: Label, input field, helper text, error state
- **Select**: Dropdown with search capability
- **FileUpload**: Drag zone, file list, progress bars
- **Rating**: Star icons with hover states
- **Button**: Primary, secondary, outline, ghost variants

### Feedback
- **Toast**: Success, error, warning, info variants
- **Modal**: Header, body, footer with close button
- **ConfirmDialog**: Warning icon, message, confirm/cancel
- **EmptyState**: Illustration, message, action button

### Data Display
- **Table**: Sortable headers, row hover, pagination
- **Chart**: Bar, line, pie variants with legends
- **Badge**: Status colors with icons
- **Avatar**: Image or initials fallback

### States
- **Loading**: Skeleton screens with pulse animation
- **Empty**: Illustration + message + CTA
- **Error**: Red border/text with retry option
- **Success**: Green checkmark with confirmation

## Technical Approach

### Architecture
```
src/
├── components/
│   ├── ui/          # Reusable UI primitives
│   ├── layout/      # Sidebar, Header, etc.
│   └── features/    # Feature-specific components
├── pages/           # Route components
├── hooks/           # Custom React hooks
├── lib/             # Utilities, supabase client
├── contexts/        # React contexts (Auth, Theme)
└── styles/          # Global styles
```

### Supabase Schema

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('employee', 'mentor', 'hr')) DEFAULT 'employee',
  department TEXT,
  joining_date DATE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### departments
```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### onboarding_steps
```sql
CREATE TABLE onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments,
  title TEXT NOT NULL,
  description TEXT,
  order_num INTEGER NOT NULL,
  type TEXT CHECK (type IN ('document', 'training', 'quiz', 'feedback')),
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### employee_progress
```sql
CREATE TABLE employee_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  step_id UUID REFERENCES onboarding_steps NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  score FLOAT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### feedback
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  step_id UUID REFERENCES onboarding_steps,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### mentors
```sql
CREATE TABLE mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES profiles NOT NULL,
  employee_id UUID REFERENCES profiles NOT NULL,
  status TEXT DEFAULT 'assigned',
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API Design
All data access through Supabase client with RLS policies.

### Authentication Flow
1. User enters email/password
2. Supabase creates session with JWT
3. Profile fetched and role determined
4. React Router redirects to role-appropriate dashboard
5. Auth state persisted in React Context

### Row Level Security
- employees: Can read own data, HR can read all
- progress: Users see own, mentors see assigned, HR sees all
- feedback: Users see own, HR sees anonymized aggregates
- documents: Users see own uploads, HR sees all

## Pages

1. **/login** - Authentication page
2. **/employee/dashboard** - Employee home
3. **/employee/training** - Training modules list
4. **/employee/training/:id** - Individual module view
5. **/employee/quiz/:id** - Quiz interface
6. **/employee/documents** - Document management
7. **/employee/feedback** - Feedback forms
8. **/employee/mentor** - Mentor connection
9. **/employee/certificate** - Certificate view/download
10. **/mentor/dashboard** - Mentor home
11. **/mentor/employees** - Assigned employees list
12. **/mentor/employee/:id** - Individual employee view
13. **/hr/dashboard** - HR analytics home
14. **/hr/employees** - All employees management
15. **/hr/employees/:id** - Employee detail view
16. **/hr/content** - Content management
