-- Set all existing profiles to member visibility
update lovers
set
  visibility = 'member';

-- Create the enum type
create type lover_visibility as enum('public', 'member');

-- Drop the default constraint
alter table lovers
alter column visibility
drop default;

-- Update the column to use the enum type
alter table lovers
alter column visibility
type lover_visibility using visibility::lover_visibility;

-- Add back the default with the new enum type
alter table lovers
alter column visibility
set default 'member'::lover_visibility;
