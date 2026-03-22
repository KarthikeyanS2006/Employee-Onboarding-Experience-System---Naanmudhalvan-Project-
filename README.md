# OnboardX - Employee Onboarding Experience System

A comprehensive employee onboarding platform with AI-powered features for modern organizations.

![OnboardX](https://img.shields.io/badge/OnboardX-v1.0-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Supabase](https://img.shields.io/badge/Supabase-ready-3ecf8e)
![Groq AI](https://img.shields.io/badge/Groq%20AI-Enabled-purple)

## Features

### Core Features
- **Role-Based Dashboards**: Separate experiences for Employees, Mentors, and HR Admin
- **Onboarding Workflow**: Step-by-step guided onboarding process
- **Training Modules**: Department-specific training content
- **Quiz System**: Interactive quizzes with scoring
- **Document Management**: Upload and verify required documents
- **Mentor Connection**: Direct communication with assigned mentors
- **Feedback System**: Collect and analyze onboarding feedback
- **Certificate Generation**: Download certificates upon completion

### AI Features (Powered by Groq)
- **AI Quiz Generator**: Generate custom quizzes instantly
- **Personalized Feedback**: AI-powered improvement tips after quizzes
- **Smart Mentor Suggestions**: AI-recommended mentor matching
- **Training Summarizer**: Auto-generate key points from content
- **Performance Review Prep**: AI-generated review comments

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + Database + Storage)
- **AI**: Groq API (Llama 3.1, Mixtral)
- **Charts**: Chart.js + React-ChartJS-2
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Groq API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KarthikeyanS2006/Employee-Onboarding-Experience-System.git
cd Employee-Onboarding-Experience-System
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173)

## Supabase Setup

### Database Schema

Run these SQL queries in Supabase SQL Editor:

```sql
-- Profiles table
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

-- Departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding steps table
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

-- Employee progress table
CREATE TABLE employee_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  step_id UUID REFERENCES onboarding_steps NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  score FLOAT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  step_id UUID REFERENCES onboarding_steps,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mentors table
CREATE TABLE mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES profiles NOT NULL,
  employee_id UUID REFERENCES profiles NOT NULL,
  status TEXT DEFAULT 'assigned',
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Enable Row Level Security

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies (basic example)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "HR can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'hr')
  );
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Badge.jsx
│   │   ├── Modal.jsx
│   │   └── Loading.jsx
│   └── layout/       # Layout components
│       ├── Sidebar.jsx
│       ├── Header.jsx
│       └── Layout.jsx
├── contexts/
│   └── AuthContext.jsx  # Authentication context
├── hooks/
│   └── useGroq.js       # AI integration hook
├── lib/
│   ├── supabase.js      # Supabase client
│   └── utils.js         # Utility functions
├── pages/
│   ├── Login.jsx
│   ├── employee/        # Employee pages
│   │   ├── Dashboard.jsx
│   │   ├── Training.jsx
│   │   ├── TrainingDetail.jsx
│   │   ├── Quiz.jsx
│   │   ├── Documents.jsx
│   │   ├── Feedback.jsx
│   │   ├── Mentor.jsx
│   │   └── Certificate.jsx
│   ├── mentor/          # Mentor pages
│   │   ├── Dashboard.jsx
│   │   ├── Employees.jsx
│   │   └── EmployeeDetail.jsx
│   └── hr/              # HR Admin pages
│       ├── Dashboard.jsx
│       ├── Employees.jsx
│       ├── EmployeeDetail.jsx
│       └── Content.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## User Roles

### Employee
- View personalized dashboard
- Complete onboarding steps
- Take quizzes
- Upload documents
- Give feedback
- Chat with mentor
- Download certificate

### Mentor
- View assigned mentees
- Track progress
- Add comments
- Approve steps
- Send reminders

### HR Admin
- Analytics dashboard
- Manage employees
- Content management
- Export reports
- AI quiz generation

## AI Features Demo

### Quiz Generation
HR admins can generate custom quizzes using AI:
```javascript
const { generateQuiz } = useGroq()
const quiz = await generateQuiz('IT Security Training', 5)
```

### Personalized Feedback
Employees receive AI feedback after quizzes:
```javascript
const { getFeedback } = useGroq()
const tips = await getFeedback(60, ['phishing', 'passwords'], 'Security Quiz')
```

## Deployment

### Vercel (Recommended)

1. **One-click Deploy**: 
   - Click the button below or visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_GROQ_API_KEY`
   - Deploy!

2. **CLI Deployment**:
```bash
npm i -g vercel
vercel login
vercel --prod
```

3. **Manual Setup**:
   - Build the project: `npm run build`
   - Deploy the `dist` folder to Vercel

### Environment Variables

Create a `.env` file (or set in Vercel dashboard):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

### Build for Production

```bash
npm run build
npm run preview
```

## Demo Credentials

For testing purposes:
- **Employee**: employee@demo.com / demo123
- **Mentor**: mentor@demo.com / demo123
- **HR Admin**: hr@demo.com / demo123

## Success Metrics

✅ Role-based access  
✅ Onboarding workflow  
✅ Document upload  
✅ Quiz scoring  
✅ HR analytics  
✅ Responsive design  
✅ Realtime updates  
✅ AI integration  

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [Supabase](https://supabase.com) - Backend as a Service
- [Groq](https://groq.com) - AI Infrastructure
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Lucide](https://lucide.dev) - Beautiful icons

## Support

For support, email support@onboardx.com or join our Discord channel.

---

Built with ❤️ for the Naanmudhalvan Project
