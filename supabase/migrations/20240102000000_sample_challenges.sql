-- Sample Challenges for MetaCore Life
-- These are example challenges that admins can use as templates

-- Health Challenges
INSERT INTO challenges (title, description, category, duration_days, daily_tasks, is_featured, is_active, participants_count) VALUES
(
  '30-Day Fitness Transformation',
  'Transform your body and build healthy habits with daily workouts, proper nutrition, and mindfulness practices. Perfect for beginners and experienced fitness enthusiasts.',
  'health',
  30,
  '[
    "Complete 30 minutes of cardio (walk, run, bike, or swim)",
    "Do 3 sets of strength training exercises",
    "Drink 8 glasses of water",
    "Eat 5 servings of fruits and vegetables",
    "Get 7-8 hours of sleep",
    "Take a 10-minute walk after meals",
    "Practice 10 minutes of stretching or yoga"
  ]'::jsonb,
  true,
  true,
  0
),
(
  '7-Day Morning Routine Challenge',
  'Start your day right with a structured morning routine that boosts energy, productivity, and mental clarity.',
  'health',
  7,
  '[
    "Wake up at the same time each day",
    "Drink a glass of water immediately after waking",
    "Spend 10 minutes in meditation or deep breathing",
    "Write down 3 things you are grateful for",
    "Do 15 minutes of light exercise or stretching",
    "Eat a healthy breakfast within 1 hour of waking",
    "Review your goals for the day"
  ]'::jsonb,
  false,
  true,
  0
),
(
  '21-Day Meditation & Mindfulness',
  'Develop a consistent meditation practice to reduce stress, improve focus, and enhance overall well-being.',
  'health',
  21,
  '[
    "Meditate for 10 minutes (use an app or guided session)",
    "Practice 5 minutes of deep breathing exercises",
    "Take 3 mindful breaks throughout the day",
    "Write in a gratitude journal",
    "Practice mindful eating for at least one meal",
    "Do a body scan meditation before bed",
    "Spend 10 minutes in nature or looking at nature"
  ]'::jsonb,
  true,
  true,
  0
);

-- Wealth Challenges
INSERT INTO challenges (title, description, category, duration_days, daily_tasks, is_featured, is_active, participants_count) VALUES
(
  '30-Day Financial Fitness Challenge',
  'Take control of your finances with daily habits that build wealth, reduce debt, and create financial security.',
  'wealth',
  30,
  '[
    "Track all expenses in a budgeting app",
    "Review your bank account and credit card statements",
    "Save at least $5 (or your local equivalent)",
    "Read 10 minutes of financial education content",
    "Cancel one unnecessary subscription",
    "Negotiate a better rate on a bill",
    "Set or review your financial goals"
  ]'::jsonb,
  true,
  true,
  0
),
(
  '14-Day Side Hustle Starter',
  'Launch or grow your side business with daily actionable steps that build momentum and create income streams.',
  'wealth',
  14,
  '[
    "Spend 30 minutes on your side hustle project",
    "Reach out to one potential customer or client",
    "Learn a new skill related to your business",
    "Update your business social media or website",
    "Network with one person in your industry",
    "Review and adjust your business plan",
    "Track your progress and revenue"
  ]'::jsonb,
  false,
  true,
  0
),
(
  '21-Day Investment Learning Challenge',
  'Build your investment knowledge and start your wealth-building journey with daily learning and practice.',
  'wealth',
  21,
  '[
    "Read 15 minutes about investing basics",
    "Watch one educational video about investing",
    "Research one stock, ETF, or investment option",
    "Practice with a virtual trading account",
    "Review your current investment portfolio (if any)",
    "Set up or review your retirement account",
    "Calculate your net worth"
  ]'::jsonb,
  false,
  true,
  0
);

-- Relationships Challenges
INSERT INTO challenges (title, description, category, duration_days, daily_tasks, is_featured, is_active, participants_count) VALUES
(
  '30-Day Relationship Builder',
  'Strengthen your relationships with family, friends, and partners through daily acts of connection and appreciation.',
  'relationships',
  30,
  '[
    "Send a thoughtful message to someone you care about",
    "Have a meaningful conversation (phone or in-person)",
    "Express gratitude to someone in your life",
    "Plan quality time with a loved one",
    "Practice active listening in conversations",
    "Do something kind for someone without expecting anything back",
    "Reflect on what you appreciate about your relationships"
  ]'::jsonb,
  true,
  true,
  0
),
(
  '14-Day Communication Mastery',
  'Improve your communication skills to build deeper connections and resolve conflicts more effectively.',
  'relationships',
  14,
  '[
    "Practice active listening in at least one conversation",
    "Express your feelings clearly and honestly",
    "Ask open-ended questions to understand others better",
    "Give genuine compliments to 3 people",
    "Practice empathy by seeing things from another perspective",
    "Resolve a small conflict using effective communication",
    "Reflect on your communication patterns"
  ]'::jsonb,
  false,
  true,
  0
),
(
  '21-Day Self-Love & Confidence',
  'Build a stronger relationship with yourself through daily practices that boost self-esteem and self-care.',
  'relationships',
  21,
  '[
    "Write down 3 things you like about yourself",
    "Practice positive self-talk throughout the day",
    "Do one thing that makes you feel good",
    "Set a healthy boundary with someone",
    "Forgive yourself for a past mistake",
    "Celebrate a small win or achievement",
    "Spend 30 minutes doing something you enjoy"
  ]'::jsonb,
  false,
  true,
  0
);

