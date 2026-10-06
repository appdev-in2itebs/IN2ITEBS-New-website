-- The AI assistant (agentic chat): structured details for leads and applications collected in chat,
-- the assistant's own memory per conversation, and what each conversation was about.
-- Safe to run more than once.

-- Leads: every answer the assistant collected, one key per question, plus its summary.
alter table public.leads add column if not exists details    jsonb not null default '{}'::jsonb;
alter table public.leads add column if not exists ai_summary text;
alter table public.leads add column if not exists language   text;

-- Applications: experience, skills and the job-description screening answers, plus HR's summary.
alter table public.job_applications add column if not exists details         jsonb not null default '{}'::jsonb;
alter table public.job_applications add column if not exists ai_summary      text;
alter table public.job_applications add column if not exists fit_score       integer check (fit_score between 0 and 100);
alter table public.job_applications add column if not exists conversation_id uuid references public.chat_conversations (id) on delete set null;
alter table public.job_applications add column if not exists language        text;

-- Conversations: what it was about, its language, a summary, the assistant's working state
-- (an uploaded CV, the lead or application it already filed) and the application it led to.
alter table public.chat_conversations add column if not exists purpose        text;
alter table public.chat_conversations add column if not exists language       text;
alter table public.chat_conversations add column if not exists summary        text;
alter table public.chat_conversations add column if not exists state          jsonb not null default '{}'::jsonb;
alter table public.chat_conversations add column if not exists application_id uuid references public.job_applications (id) on delete set null;

create index if not exists job_applications_conversation_idx on public.job_applications (conversation_id);
