-- This file is autogenerated from regen-schema.ts
create table if not exists
  private_user_message_channels (
    created_time timestamp with time zone default now() not null,
    id bigint primary key private_user_message_channels_pkey generated always as identity not null,
    last_updated_time timestamp with time zone default now() not null,
    title text
  );

-- Row Level Security
alter table private_user_message_channels enable row level security;

-- Policies
drop policy if exists "public read" on private_user_message_channels;

create policy "public read" on private_user_message_channels for all using (true);

-- Indexes
/*
DROP INDEX IF EXISTS private_user_message_channels_pkey;

CREATE UNIQUE INDEX private_user_message_channels_pkey ON public.private_user_message_channels USING btree (id);

*/
