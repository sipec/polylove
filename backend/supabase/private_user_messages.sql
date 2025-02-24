-- Row Level Security
alter table private_user_messages enable row level security;

-- Indexes
drop index if exists private_user_messages_channel_id_idx;

create index private_user_messages_channel_id_idx on public.private_user_messages using btree (channel_id, created_time desc);
