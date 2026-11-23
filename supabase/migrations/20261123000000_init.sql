-- =============================================================
-- Rembug Warga — skema database
-- Simulasi akademik Mata Kuliah Demokrasi Digital, FISIP Unair
-- Jalankan file ini di Supabase SQL Editor (sekali saja).
-- =============================================================

create extension if not exists pgcrypto;

-- ---------- Usulan warga (Public Proposal) ----------
create table public.proposals (
  id                uuid primary key default gen_random_uuid(),
  issue_slug        text not null check (issue_slug in ('sampah', 'transportasi', 'perpustakaan')),
  title             text not null check (char_length(title) between 5 and 120),
  body              text not null check (char_length(body) between 20 and 2000),
  kecamatan         text,
  author_name       text,
  author_group      text not null,
  device_id         uuid not null,
  status            text not null default 'diajukan'
                    check (status in ('diajukan', 'dipertimbangkan', 'ditindaklanjuti', 'ditolak')),
  official_response text,
  responded_at      timestamptz,
  is_seed           boolean not null default false,
  hidden            boolean not null default false,
  created_at        timestamptz not null default now()
);
create index proposals_issue_idx on public.proposals (issue_slug, created_at desc);
create index proposals_device_idx on public.proposals (device_id, created_at desc);

-- ---------- Argumen pro/kontra (Discussion Forum) ----------
create table public.comments (
  id           uuid primary key default gen_random_uuid(),
  proposal_id  uuid not null references public.proposals (id) on delete cascade,
  stance       text not null check (stance in ('pro', 'kontra', 'netral')),
  body         text not null check (char_length(body) between 3 and 1000),
  author_name  text,
  author_group text not null,
  device_id    uuid not null,
  is_seed      boolean not null default false,
  hidden       boolean not null default false,
  created_at   timestamptz not null default now()
);
create index comments_proposal_idx on public.comments (proposal_id, created_at);
create index comments_device_idx on public.comments (device_id, created_at desc);

-- ---------- Suara dukung/tolak (Online Voting) ----------
-- Primary key (proposal_id, device_id) = satu suara per perangkat per usulan.
create table public.votes (
  proposal_id  uuid not null references public.proposals (id) on delete cascade,
  device_id    uuid not null,
  value        smallint not null check (value in (-1, 1)),
  author_group text not null,
  created_at   timestamptz not null default now(),
  primary key (proposal_id, device_id)
);

-- ---------- Pernyataan konsensus (Consensus Building, ala vTaiwan/Pol.is) ----------
create table public.consensus_statements (
  id           uuid primary key default gen_random_uuid(),
  issue_slug   text not null check (issue_slug in ('sampah', 'transportasi', 'perpustakaan')),
  text         text not null check (char_length(text) between 10 and 200),
  author_group text,
  device_id    uuid,
  is_seed      boolean not null default false,
  hidden       boolean not null default false,
  created_at   timestamptz not null default now()
);

create table public.consensus_votes (
  statement_id uuid not null references public.consensus_statements (id) on delete cascade,
  device_id    uuid not null,
  value        text not null check (value in ('setuju', 'tidak', 'ragu')),
  author_group text not null,
  created_at   timestamptz not null default now(),
  primary key (statement_id, device_id)
);

-- ---------- Surat suara anggaran (Participatory Budgeting) ----------
create table public.budget_ballots (
  device_id    uuid primary key,
  project_ids  text[] not null,
  total_cost   bigint not null check (total_cost <= 10000000000),
  author_group text not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------- Laporan konten & log moderasi ----------
create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('proposal', 'comment', 'statement')),
  target_id   uuid not null,
  reason      text,
  device_id   uuid not null,
  resolved    boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (target_type, target_id, device_id)
);

-- Dicatat setiap kali admin menyembunyikan/menampilkan konten atau mengubah status,
-- lalu ditampilkan publik di halaman Hasil & Transparansi.
create table public.moderation_log (
  id          uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id   uuid not null,
  action      text not null,
  reason      text,
  created_at  timestamptz not null default now()
);

-- =============================================================
-- View agregasi (dibaca halaman Hasil)
-- =============================================================
create view public.proposal_scores as
select
  p.id as proposal_id,
  count(v.device_id) filter (where v.value = 1)  as support,
  count(v.device_id) filter (where v.value = -1) as oppose
from public.proposals p
left join public.votes v on v.proposal_id = p.id
group by p.id;

create view public.comment_counts as
select proposal_id,
  count(*) filter (where stance = 'pro')    as pro,
  count(*) filter (where stance = 'kontra') as kontra,
  count(*) filter (where stance = 'netral') as netral
from public.comments
where not hidden
group by proposal_id;

create view public.consensus_tally as
select statement_id, author_group, value, count(*) as n
from public.consensus_votes
group by statement_id, author_group, value;

create view public.budget_tally as
select p.project_id, b.author_group, count(*) as n
from public.budget_ballots b
cross join lateral unnest(b.project_ids) as p (project_id)
group by p.project_id, b.author_group;

-- Satu baris per perangkat unik yang pernah berpartisipasi (untuk analisis inklusivitas).
create view public.participants as
select device_id, max(author_group) as author_group
from (
  select device_id, author_group from public.proposals where not is_seed
  union all select device_id, author_group from public.comments where not is_seed
  union all select device_id, author_group from public.votes
  union all select device_id, author_group from public.consensus_votes
  union all select device_id, author_group from public.budget_ballots
) all_activity
group by device_id;

-- =============================================================
-- Row Level Security
-- Semua penulisan lewat server (service role). Publik hanya boleh membaca.
-- =============================================================
alter table public.proposals            enable row level security;
alter table public.comments             enable row level security;
alter table public.votes                enable row level security;
alter table public.consensus_statements enable row level security;
alter table public.consensus_votes      enable row level security;
alter table public.budget_ballots       enable row level security;
alter table public.reports              enable row level security;
alter table public.moderation_log       enable row level security;

create policy "baca usulan publik"     on public.proposals            for select to anon using (not hidden);
create policy "baca argumen publik"    on public.comments             for select to anon using (not hidden);
create policy "baca pernyataan publik" on public.consensus_statements for select to anon using (not hidden);
create policy "baca suara"             on public.votes                for select to anon using (true);
create policy "baca suara konsensus"   on public.consensus_votes      for select to anon using (true);
create policy "baca surat suara"       on public.budget_ballots       for select to anon using (true);
create policy "baca log moderasi"      on public.moderation_log       for select to anon using (true);
-- reports: tidak ada policy untuk anon → hanya server yang bisa membaca.

-- Hak akses eksplisit (project Supabase baru tidak selalu memberi grant otomatis).
grant usage on schema public to anon, service_role;
grant all on all tables in schema public to service_role;
grant select on all tables in schema public to anon;
revoke select on public.reports from anon;

-- Realtime: halaman Hasil berlangganan perubahan tabel-tabel ini.
alter publication supabase_realtime add table
  public.proposals, public.comments, public.votes,
  public.consensus_votes, public.budget_ballots, public.consensus_statements;
