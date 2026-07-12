-- Triangle Reviewer schema. Run this once in the Supabase SQL Editor
-- (Dashboard → SQL Editor → New query → paste → Run).

create table if not exists users (
  id            text primary key,
  username      text not null,
  bio           text not null default '',
  role          text not null default 'member'
                check (role in ('member', 'council', 'zealot')),
  avatar_hue    integer not null,
  password_hash text not null,
  joined        text not null
);
create unique index if not exists users_username_unique on users (lower(username));

create table if not exists follows (
  follower_id text not null references users(id) on delete cascade,
  followee_id text not null references users(id) on delete cascade,
  primary key (follower_id, followee_id)
);

create table if not exists triangles (
  id          text primary key,
  title       text not null,
  description text not null default '',
  location    text not null default '',
  image_url   text not null,
  author_id   text not null references users(id) on delete cascade,
  created_at  text not null
);

create table if not exists reviews (
  id            text primary key,
  triangle_id   text not null references triangles(id) on delete cascade,
  author_id     text not null references users(id) on delete cascade,
  kind          text not null check (kind in ('axes', 'zealot')),
  aesthetic     integer,
  tacticality   integer,
  triangularity integer,
  zealot_score  integer,
  comment       text not null default '',
  created_at    text not null,
  unique (triangle_id, author_id)
);

create table if not exists sessions (
  token      text primary key,
  user_id    text not null references users(id) on delete cascade,
  expires_at text not null
);

create index if not exists idx_triangles_author on triangles(author_id);
create index if not exists idx_reviews_triangle on reviews(triangle_id);
create index if not exists idx_reviews_author   on reviews(author_id);
create index if not exists idx_sessions_user    on sessions(user_id);

-- The app talks to the database with the secret key only (bypasses RLS).
-- Enabling RLS with no policies means the public/publishable key can read
-- and write NOTHING — exactly what we want.
alter table users     enable row level security;
alter table follows   enable row level security;
alter table triangles enable row level security;
alter table reviews   enable row level security;
alter table sessions  enable row level security;
