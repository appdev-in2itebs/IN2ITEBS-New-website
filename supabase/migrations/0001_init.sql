-- In2IT EBS website — initial schema.
--
-- Nothing in the app writes to these tables yet (Phase 1 is hosting only). They exist now so the
-- schema is version-controlled alongside the code and Phase 2 starts by writing queries rather
-- than designing tables.
--
-- Apply with: Supabase dashboard -> SQL Editor -> paste -> Run.
--
-- Row Level Security is ON for every table with no policies attached, which denies all access by
-- default. The server reaches these tables with SUPABASE_SECRET_KEY, which bypasses RLS; the
-- publishable key a browser may hold therefore reads nothing. Policies get added in Phase 2, when
-- the admin dashboard needs signed-in reads.

create extension if not exists "pgcrypto";

-- Enquiries. Today app/api/lead/ forwards to LEAD_WEBHOOK_URL and stores nothing; in Phase 2 it
-- writes here as well, so an enquiry survives a webhook outage.
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text        not null,
  email         text        not null,
  company       text,
  phone         text,
  message       text        not null,
  source        text        not null default 'website',  -- 'website' | 'chatbot' | 'voice'
  -- Delivery to the webhook/CRM, tracked separately from capture so a failed
  -- hand-off is visible instead of silently losing the enquiry.
  delivered     boolean     not null default false,
  delivered_at  timestamptz,
  request_id    text,
  ip_hash       text,                                    -- hashed, never the raw address
  user_agent    text
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx      on public.leads (email);

-- Candidates applying through /careers/current-openings/. The CV itself goes to Supabase Storage;
-- this row holds the object path, not the file.
create table if not exists public.job_applications (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text        not null,
  email         text        not null,
  phone         text,
  role_applied  text        not null,
  location      text,
  cover_note    text,
  resume_path   text,                                    -- Storage object path
  status        text        not null default 'new',      -- new | screening | interview | offer | rejected
  notes         text
);
create index if not exists job_applications_created_at_idx on public.job_applications (created_at desc);
create index if not exists job_applications_status_idx     on public.job_applications (status);

-- Chatbot transcripts, so the team can read what visitors actually ask.
create table if not exists public.chat_conversations (
  id           uuid primary key default gen_random_uuid(),
  started_at   timestamptz not null default now(),
  ended_at     timestamptz,
  channel      text        not null default 'text',      -- 'text' | 'voice'
  locale       text,
  lead_id      uuid references public.leads (id) on delete set null,
  ip_hash      text
);

create table if not exists public.chat_messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.chat_conversations (id) on delete cascade,
  created_at       timestamptz not null default now(),
  role             text not null,                        -- 'user' | 'assistant' | 'system'
  content          text not null,
  -- Which model produced this turn, and what it cost. Recorded per message because the
  -- active model is admin-switchable, so a conversation can span more than one.
  model            text,
  input_tokens     integer,
  output_tokens    integer
);
create index if not exists chat_messages_conversation_idx on public.chat_messages (conversation_id, created_at);

-- Admin-editable chatbot configuration. Rows are versioned rather than updated in place: the live
-- chatbot runs whatever is active, so a bad edit must be revertible in one click instead of being
-- overwritten irrecoverably.
create table if not exists public.system_prompts (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  content     text        not null,
  version     integer     not null default 1,
  is_active   boolean     not null default false,
  created_at  timestamptz not null default now(),
  created_by  text,
  unique (name, version)
);
-- At most one active prompt per name.
create unique index if not exists system_prompts_one_active
  on public.system_prompts (name) where is_active;

alter table public.leads              enable row level security;
alter table public.job_applications   enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages      enable row level security;
alter table public.system_prompts     enable row level security;
