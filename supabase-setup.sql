-- =============================================
-- OnboardX Database Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
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

-- 2. Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create onboarding_steps table
CREATE TABLE IF NOT EXISTS onboarding_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments,
  title TEXT NOT NULL,
  description TEXT,
  order_num INTEGER NOT NULL,
  type TEXT CHECK (type IN ('document', 'training', 'quiz', 'feedback')),
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create employee_progress table
CREATE TABLE IF NOT EXISTS employee_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  step_id UUID REFERENCES onboarding_steps NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  score FLOAT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  step_id UUID REFERENCES onboarding_steps,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create mentors table
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES profiles NOT NULL,
  employee_id UUID REFERENCES profiles NOT NULL,
  status TEXT DEFAULT 'assigned',
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles NOT NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Enable Row Level Security (RLS)
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS Policies
-- =============================================

-- Profiles: Users can read/update own profile, HR can read all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Departments: Everyone can read
CREATE POLICY "Everyone can view departments" ON departments
  FOR SELECT USING (true);

-- Onboarding steps: Everyone can read
CREATE POLICY "Everyone can view onboarding steps" ON onboarding_steps
  FOR SELECT USING (true);

-- Employee progress: Users see own, HR sees all
CREATE POLICY "Users can view own progress" ON employee_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON employee_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON employee_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feedback: Users see own
CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Documents: Users see own
CREATE POLICY "Users can view own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mentors: Users can view assigned mentors
CREATE POLICY "Users can view own mentor assignments" ON mentors
  FOR SELECT USING (auth.uid() = employee_id OR auth.uid() = mentor_id);

-- =============================================
-- Insert Sample Data
-- =============================================

-- Sample departments
INSERT INTO departments (name, description) VALUES
  ('Engineering', 'Software development and technical teams'),
  ('Marketing', 'Marketing and communications'),
  ('Sales', 'Sales and business development'),
  ('Human Resources', 'HR and people operations'),
  ('Finance', 'Finance and accounting');

-- Sample onboarding steps
INSERT INTO onboarding_steps (department_id, title, description, order_num, type) 
SELECT id, 'Company Orientation', 'Learn about our culture, values, and mission', 1, 'training'
FROM departments WHERE name = 'Engineering'
UNION ALL
SELECT id, 'HR Policies & Compliance', 'Review essential policies and sign acknowledgments', 2, 'document'
FROM departments WHERE name = 'Engineering'
UNION ALL
SELECT id, 'Department Introduction', 'Meet your team and understand your role', 3, 'training'
FROM departments WHERE name = 'Engineering'
UNION ALL
SELECT id, 'Tools & Systems Training', 'Get hands-on with our core tools and platforms', 4, 'quiz'
FROM departments WHERE name = 'Engineering'
UNION ALL
SELECT id, 'Security Awareness', 'Complete security fundamentals training', 5, 'quiz'
FROM departments WHERE name = 'Engineering'
UNION ALL
SELECT id, 'First Week Feedback', 'Share your onboarding experience', 6, 'feedback'
FROM departments WHERE name = 'Engineering';

-- Do the same for other departments...

INSERT INTO onboarding_steps (department_id, title, description, order_num, type) 
SELECT id, 'Company Orientation', 'Learn about our culture, values, and mission', 1, 'training'
FROM departments WHERE name = 'Marketing'
UNION ALL
SELECT id, 'HR Policies & Compliance', 'Review essential policies', 2, 'document'
FROM departments WHERE name = 'Marketing'
UNION ALL
SELECT id, 'Marketing Fundamentals', 'Learn our marketing strategies', 3, 'training'
FROM departments WHERE name = 'Marketing'
UNION ALL
SELECT id, 'Brand Guidelines Quiz', 'Test your knowledge of our brand', 4, 'quiz'
FROM departments WHERE name = 'Marketing';

INSERT INTO onboarding_steps (department_id, title, description, order_num, type) 
SELECT id, 'Company Orientation', 'Learn about our culture, values, and mission', 1, 'training'
FROM departments WHERE name = 'Sales'
UNION ALL
SELECT id, 'HR Policies & Compliance', 'Review essential policies', 2, 'document'
FROM departments WHERE name = 'Sales'
UNION ALL
SELECT id, 'Sales Process Training', 'Learn our sales methodology', 3, 'training'
FROM departments WHERE name = 'Sales'
UNION ALL
SELECT id, 'CRM Training Quiz', 'Test your CRM knowledge', 4, 'quiz'
FROM departments WHERE name = 'Sales';

-- =============================================
-- Create Function to Auto-create Profile on Signup
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role, department, joining_date)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee'),
    COALESCE(NEW.raw_user_meta_data->>'department', ''),
    CURRENT_DATE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Success Message
-- =============================================

DO $$
BEGIN
  RAISE NOTICE 'OnboardX database setup complete!';
END $$;
