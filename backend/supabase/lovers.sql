-- This file is autogenerated from regen-schema.ts
create table if not exists
  lovers (
    age integer default 18 not null,
    bio json,
    born_in_location text,
    city text not null,
    city_latitude numeric(9, 6),
    city_longitude numeric(9, 6),
    comments_enabled boolean default true not null,
    company text,
    country text,
    created_time timestamp with time zone default now() not null,
    drinks_per_month integer,
    education_level text,
    ethnicity text[],
    gender text not null,
    geodb_city_id text,
    has_kids integer,
    height_in_inches integer,
    id bigint primary key lovers_pkey generated always as identity not null,
    is_smoker boolean,
    is_vegetarian_or_vegan boolean,
    last_online_time timestamp with time zone default now() not null,
    looking_for_matches boolean default true not null,
    messaging_status text default 'open'::text not null,
    occupation text,
    occupation_title text,
    photo_urls text[],
    pinned_url text,
    political_beliefs text[],
    pref_age_max integer default 100 not null,
    pref_age_min integer default 18 not null,
    pref_gender text[] not null,
    pref_relation_styles text[] not null,
    referred_by_username text,
    region_code text,
    religious_belief_strength integer,
    religious_beliefs text,
    twitter text,
    university text,
    user_id text not null,
    visibility lover_visibility default 'member'::lover_visibility not null,
    wants_kids_strength integer default 0 not null,
    website text
  );

-- Row Level Security
alter table lovers enable row level security;

-- Policies
drop policy if exists "public read" on lovers;

create policy "public read" on lovers for
select
  using (true);

drop policy if exists "self update" on lovers;

create policy "self update" on lovers
for update
with
  check ((user_id = firebase_uid ()));

-- Indexes
drop index if exists lovers_pkey;

create unique index lovers_pkey on public.lovers using btree (id);

drop index if exists lovers_user_id_idx;

create index lovers_user_id_idx on public.lovers using btree (user_id);

drop index if exists unique_user_id;

create unique index unique_user_id on public.lovers using btree (user_id);
