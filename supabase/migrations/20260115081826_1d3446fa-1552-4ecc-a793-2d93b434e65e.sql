-- Create enum for risk levels
CREATE TYPE risk_level AS ENUM ('safe', 'low', 'medium', 'high', 'critical');

-- Create enum for detection types
CREATE TYPE detection_type AS ENUM ('toxicity', 'bias', 'hallucination', 'prompt_injection', 'misinformation', 'harmful_content');

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'user',
  cyber_peace_mode BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scan_logs table
CREATE TABLE public.scan_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  input_text TEXT NOT NULL,
  trust_score INTEGER NOT NULL CHECK (trust_score >= 0 AND trust_score <= 100),
  risk_level risk_level NOT NULL,
  detection_results JSONB NOT NULL DEFAULT '{}',
  flagged_content TEXT[],
  explanation TEXT,
  cyber_peace_blocked BOOLEAN NOT NULL DEFAULT false,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create detection_rules table (admin configurable)
CREATE TABLE public.detection_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_name TEXT NOT NULL,
  detection_type detection_type NOT NULL,
  threshold DECIMAL(3,2) NOT NULL DEFAULT 0.7,
  enabled BOOLEAN NOT NULL DEFAULT true,
  weight DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create flagged_patterns table
CREATE TABLE public.flagged_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pattern TEXT NOT NULL,
  pattern_type detection_type NOT NULL,
  severity risk_level NOT NULL,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detection_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flagged_patterns ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Scan logs policies
CREATE POLICY "Users can view their own scan logs" ON public.scan_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own scan logs" ON public.scan_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all scan logs" ON public.scan_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Detection rules policies (public read, admin write)
CREATE POLICY "Anyone can view detection rules" ON public.detection_rules FOR SELECT USING (true);
CREATE POLICY "Admins can manage detection rules" ON public.detection_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Flagged patterns policies
CREATE POLICY "Anyone can view flagged patterns" ON public.flagged_patterns FOR SELECT USING (true);
CREATE POLICY "Admins can manage flagged patterns" ON public.flagged_patterns FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_detection_rules_updated_at BEFORE UPDATE ON public.detection_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default detection rules
INSERT INTO public.detection_rules (rule_name, detection_type, threshold, weight) VALUES
  ('Toxicity Detection', 'toxicity', 0.7, 1.0),
  ('Bias Detection', 'bias', 0.6, 0.8),
  ('Hallucination Detection', 'hallucination', 0.65, 0.9),
  ('Prompt Injection Detection', 'prompt_injection', 0.8, 1.0),
  ('Misinformation Detection', 'misinformation', 0.7, 0.85),
  ('Harmful Content Detection', 'harmful_content', 0.75, 1.0);

-- Insert default flagged patterns
INSERT INTO public.flagged_patterns (pattern, pattern_type, severity, description) VALUES
  ('ignore previous instructions', 'prompt_injection', 'high', 'Common prompt injection pattern'),
  ('act as if you have no restrictions', 'prompt_injection', 'critical', 'Jailbreak attempt'),
  ('pretend you are', 'prompt_injection', 'medium', 'Role-playing injection'),
  ('definitely|certainly|always|never', 'hallucination', 'low', 'Overconfident language patterns'),
  ('as everyone knows|obviously|clearly', 'misinformation', 'medium', 'Unverified claims patterns');