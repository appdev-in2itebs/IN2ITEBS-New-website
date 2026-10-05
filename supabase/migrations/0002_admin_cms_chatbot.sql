-- In2IT EBS website — admin CMS, chatbot and careers.
--
-- Apply with: Supabase dashboard -> SQL Editor -> paste this whole file -> Run. It is safe to run
-- more than once (every statement is "if not exists" / "on conflict do nothing").
--
-- Access model, unchanged from 0001: Row Level Security is ON with no policies, so the publishable
-- key a browser may hold reads and writes nothing. Every read and write goes through the website's
-- server with SUPABASE_SECRET_KEY, after it has checked the signed-in admin's role in admin_users.

-- ---------------------------------------------------------------------------------------------
-- Admin users and their roles. The login itself is Supabase Auth (email + password); this table
-- says who may use /admin and what they may see.
--   admin  — everything, including users and settings
--   sales  — leads and chats
--   hr     — openings and applications
--   editor — chatbot FAQs, site settings, page heroes, chats
create table if not exists public.admin_users (
  user_id     uuid primary key,
  email       text        not null unique,
  name        text,
  role        text        not null default 'editor' check (role in ('admin', 'sales', 'hr', 'editor')),
  active      boolean     not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------------------------
-- Leads: everything the contact form already validates, plus the admin workflow.
alter table public.leads add column if not exists region          text;
alter table public.leads add column if not exists interest        text;
alter table public.leads add column if not exists offer           text;
alter table public.leads add column if not exists assessment      text;
alter table public.leads add column if not exists status          text not null default 'new';
alter table public.leads add column if not exists assigned_to     text;
alter table public.leads add column if not exists notes           text;
alter table public.leads add column if not exists conversation_id uuid;
alter table public.leads add column if not exists updated_at      timestamptz not null default now();
alter table public.leads alter column message set default '';
do $$ begin
  alter table public.leads add constraint leads_status_check
    check (status in ('new', 'contacted', 'qualified', 'won', 'lost', 'spam'));
exception when duplicate_object then null; end $$;
create index if not exists leads_status_idx on public.leads (status);

-- ---------------------------------------------------------------------------------------------
-- Job openings, edited by HR in /admin and listed on /careers/current-openings/.
create table if not exists public.job_openings (
  id               uuid primary key default gen_random_uuid(),
  title            text        not null,
  department       text,
  employment_type  text        not null default 'Full Time',
  location         text        not null,
  description      text        not null default '',
  requirements     text        not null default '',
  status           text        not null default 'open' check (status in ('open', 'closed')),
  sort_order       integer     not null default 100,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists job_openings_status_idx on public.job_openings (status, sort_order);

-- Applications: link to the opening, and the fields the new apply form collects.
alter table public.job_applications add column if not exists opening_id      uuid references public.job_openings (id) on delete set null;
alter table public.job_applications add column if not exists current_position text; -- "current_role" is reserved in SQL
alter table public.job_applications add column if not exists notice_period   text;
alter table public.job_applications add column if not exists expected_ctc    text;
alter table public.job_applications add column if not exists linkedin_url    text;
alter table public.job_applications add column if not exists consent_at      timestamptz;
alter table public.job_applications add column if not exists source          text not null default 'website';
alter table public.job_applications add column if not exists updated_at      timestamptz not null default now();
create index if not exists job_applications_opening_idx on public.job_applications (opening_id);

-- ---------------------------------------------------------------------------------------------
-- Chat transcripts: a little more about each conversation for the admin list.
alter table public.chat_conversations add column if not exists last_message_at timestamptz not null default now();
alter table public.chat_conversations add column if not exists message_count   integer     not null default 0;
alter table public.chat_conversations add column if not exists page_url        text;
alter table public.chat_conversations add column if not exists visitor_name    text;
alter table public.chat_conversations add column if not exists visitor_email   text;
create index if not exists chat_conversations_last_idx on public.chat_conversations (last_message_at desc);

-- ---------------------------------------------------------------------------------------------
-- Chatbot knowledge: questions and answers the editors maintain. The bot matches a visitor's
-- message against question + keywords; link_url sends them to the page with the detail.
create table if not exists public.chatbot_faqs (
  id          uuid primary key default gen_random_uuid(),
  question    text        not null,
  answer      text        not null,
  keywords    text[]      not null default '{}',
  link_url    text,
  link_label  text,
  category    text        not null default 'General',
  sort_order  integer     not null default 100,
  active      boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------------------------
-- Site settings: one JSON value per key (announcement, contact, chatbot).
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb       not null,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

-- Page hero overrides: title, intro and picture per page path. Read at build time, so an edit goes
-- live when an admin presses Publish (which rebuilds the site).
create table if not exists public.page_heroes (
  path        text primary key,
  title       text,
  intro       text,
  image_key   text,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

-- Who changed what in /admin.
create table if not exists public.admin_audit (
  id         uuid primary key default gen_random_uuid(),
  at         timestamptz not null default now(),
  user_email text,
  action     text not null,
  entity     text not null,
  entity_id  text,
  detail     jsonb
);
create index if not exists admin_audit_at_idx on public.admin_audit (at desc);

alter table public.admin_users   enable row level security;
alter table public.job_openings  enable row level security;
alter table public.chatbot_faqs  enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_heroes   enable row level security;
alter table public.admin_audit   enable row level security;

-- ---------------------------------------------------------------------------------------------
-- Private storage for CVs. Files are only ever read through short-lived signed links made by
-- /admin after a role check.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 5242880,
        array['application/pdf', 'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------------------------
-- Starting content.
insert into public.site_settings (key, value) values
  ('announcement', '{"enabled": false, "text": "", "linkUrl": "", "linkLabel": ""}'),
  ('contact', '{"email": "info@in2itebs.com", "hrEmail": "hr@in2itebs.com", "phone": ""}'),
  ('chatbot', '{"enabled": true, "name": "In2IT Assistant", "greeting": "Hi! I am the In2IT EBS assistant. Ask me about our services, industries, partners, offices or careers, or share your requirement and our team will get back to you.", "quickReplies": ["Our services", "Industries we serve", "Current openings", "Share my requirement", "Office locations"]}')
on conflict (key) do nothing;

insert into public.job_openings (title, employment_type, location, sort_order)
select * from (values
  ('SAP and Success Factors Consultant', 'Walk-in', 'Hyderabad', 10),
  ('Manager - Finance', 'Full Time', 'Bhubaneshwar, Bangalore', 20),
  ('SuccessFactors Compensation Consultant', 'Full Time', 'Bangalore, Bhubaneshwar, Chennai and more', 30),
  ('Assistant General Manager – IT Application Delivery', 'Full Time', 'Bhubaneshwar', 40),
  ('Management Trainee', 'Full Time', 'Bangalore', 50),
  ('NetSuite Technical Consultant', 'Full Time', 'Bangalore', 60),
  ('Senior Consultant - SAP SD WM', 'Full Time', 'Bhubaneshwar, Mumbai, Bangalore', 70)
) as seed (title, employment_type, location, sort_order)
where not exists (select 1 from public.job_openings);

insert into public.chatbot_faqs (question, answer, keywords, link_url, link_label, category, sort_order)
select * from (values
  ('What does In2IT EBS do?',
   'In2IT EBS is an enterprise transformation partner. We bring together enterprise platforms (SAP, SuccessFactors, Salesforce, Workday, Oracle, Microsoft), advisory, digital engineering, data and AI, and managed services under one accountable team.',
   array['about','company','who','what','do','in2it','overview'], '/about/', 'About In2IT EBS', 'Company', 10),
  ('Which SAP services do you offer?',
   'We deliver RISE with SAP, SAP GROW, S/4HANA migrations, SAP Analytics Cloud, SuccessFactors, Ariba, Concur, ABAP development, clean core, health checks and our ECC Prism assessment.',
   array['sap','s4hana','s/4hana','rise','grow','ecc','migration','analytics cloud','sac'], '/sap-enterprise-solutions/', 'SAP Enterprise Solutions', 'Services', 20),
  ('Do you work with SuccessFactors?',
   'Yes. We implement and support SAP SuccessFactors across core HR, recruiting, onboarding, learning, performance, compensation and payroll.',
   array['successfactors','hcm','hr','payroll','recruiting'], '/services/sap-successfactors/', 'SAP SuccessFactors', 'Services', 30),
  ('What cloud services do you provide?',
   'Cloud strategy, migration, hosting, infrastructure and cloud security, so you can move and run workloads safely.',
   array['cloud','aws','azure','hosting','migration','infrastructure'], '/services/cloud-infrastructure-services/', 'Cloud Infrastructure Services', 'Services', 40),
  ('Do you offer data analytics and AI?',
   'Yes: data management, predictive analytics, AI and machine learning, big data and robotic process automation.',
   array['data','analytics','ai','machine learning','ml','rpa','automation','big data'], '/services/data-analytics-ai/', 'Data Analytics & AI', 'Services', 50),
  ('Do you provide cyber security services?',
   'We offer security and risk advisory, cloud and infrastructure security, and identity and access management.',
   array['security','cyber','risk','identity','iam','access'], '/services/cyber-security-enterprise-risk/', 'Cyber Security & Enterprise Risk', 'Services', 60),
  ('Which industries do you serve?',
   'Automobiles, textiles, retail and e-commerce, banking and insurance, media and telecom, FMCG, professional services, energy and utilities, government, engineering and construction, manufacturing, heavy engineering, chemicals and fertilizers, and pharma and healthcare.',
   array['industry','industries','sector','manufacturing','retail','banking','pharma','healthcare','fmcg','government'], '/industries/', 'Industries', 'Company', 70),
  ('Who are your technology partners?',
   'We partner with SAP, SAP Qualtrics, SAP Concur, Microsoft, Oracle, OpenText, IBM, Newgen, HP and AWS.',
   array['partner','partners','alliance','microsoft','oracle','ibm','aws','hp','opentext','newgen'], '/partners/', 'Our partners', 'Company', 80),
  ('Where are your offices?',
   'We have offices in India and serve clients across Africa and the Middle East. The contact page lists every office and the right person to reach.',
   array['office','offices','location','address','where','india','africa','middle east','kenya','south africa'], '/contact/', 'Contact and offices', 'Contact', 90),
  ('How can I contact you?',
   'Email info@in2itebs.com, use the contact form, or share your requirement right here in this chat and our team will get back to you.',
   array['contact','email','phone','call','reach','talk','speak'], '/contact/', 'Contact us', 'Contact', 100),
  ('Are you hiring?',
   'Yes. You can see our current openings and apply online with your CV.',
   array['job','jobs','career','careers','hiring','opening','openings','vacancy','apply','work'], '/careers/current-openings/', 'Current openings', 'Careers', 110),
  ('What is it like to work at In2IT EBS?',
   'We offer a welcoming, diverse and open environment where you keep learning and growing, with regular team events and celebrations.',
   array['culture','life','work','team','employees','events'], '/careers/our-culture/', 'Our culture', 'Careers', 120)
) as seed (question, answer, keywords, link_url, link_label, category, sort_order)
where not exists (select 1 from public.chatbot_faqs);
