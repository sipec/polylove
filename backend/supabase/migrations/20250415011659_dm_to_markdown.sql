-- To preserve existing chat messages, instead run messages-to-markdown.ts
--
-- If this errors content is already no longer jsonb
assert (
  select
    count(*) > 0
  from
    private_user_messages
  where
    content ->> 'type' = 'doc'
),
'No Tiptap messages found';

alter table private_user_messages
drop column content;

alter table private_user_messages
add column content text not null default '';

alter table private_user_messages
alter column content
drop default
