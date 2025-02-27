create
or replace function public.firebase_uid () returns text language sql stable parallel SAFE as $function$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$function$;

create
or replace function public.calculate_earth_distance_km (
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
) returns double precision language plpgsql immutable as $function$
DECLARE
  radius_earth_km CONSTANT FLOAT := 6371;
  delta_lat FLOAT;
  delta_lon FLOAT;
  a FLOAT;
  c FLOAT;
BEGIN
  -- Convert degrees to radians
  lat1 := RADIANS(lat1);
  lon1 := RADIANS(lon1);
  lat2 := RADIANS(lat2);
  lon2 := RADIANS(lon2);

  -- Calculate differences
  delta_lat := lat2 - lat1;
  delta_lon := lon2 - lon1;

  -- Apply Haversine formula
  a := SIN(delta_lat / 2) ^ 2 + COS(lat1) * COS(lat2) * SIN(delta_lon / 2) ^ 2;
  c := 2 * ATAN2(SQRT(a), SQRT(1 - a));

  -- Calculate distance
  RETURN radius_earth_km * c;
END;
$function$;

create
or replace function public.can_access_private_messages (channel_id bigint, user_id text) returns boolean language sql parallel SAFE as $function$
select true
select exists (
    select 1 from private_user_message_channel_members
    where private_user_message_channel_members.channel_id = $1
      and private_user_message_channel_members.user_id = $2
)
$function$;

create
or replace function public.get_average_rating (user_id text) returns numeric language plpgsql as $function$
DECLARE
  result numeric;
BEGIN
  SELECT AVG(rating)::numeric INTO result
  FROM reviews
  WHERE vendor_id = user_id;
  RETURN result;
END;
$function$;

create
or replace function public.get_compatibility_questions_with_answer_count () returns setof record language plpgsql as $function$
BEGIN
    RETURN QUERY 
    SELECT 
        love_questions.*,
        COUNT(love_compatibility_answers.question_id) as answer_count
    FROM 
        love_questions
    LEFT JOIN 
        love_compatibility_answers ON love_questions.id = love_compatibility_answers.question_id
        WHERE love_questions.answer_type='compatibility_multiple_choice'
    GROUP BY 
        love_questions.id
    ORDER BY 
        answer_count DESC;
END;
$function$;

create
or replace function public.get_love_question_answers_and_lovers (p_question_id bigint) returns setof record language plpgsql as $function$
BEGIN
    RETURN QUERY
    SELECT 
        love_answers.question_id,
        love_answers.created_time,
        love_answers.free_response,
        love_answers.multiple_choice,
        love_answers.integer,
        lovers.age,
        lovers.gender,
        lovers.city,
        users.data
    FROM
        lovers
    JOIN
        love_answers ON lovers.user_id = love_answers.creator_id
    join 
        users on lovers.user_id = users.id 
    WHERE
        love_answers.question_id = p_question_id
    order by love_answers.created_time desc;
END;
$function$;

create
or replace function public.millis_interval (start_millis bigint, end_millis bigint) returns interval language sql immutable parallel SAFE as $function$
select millis_to_ts(end_millis) - millis_to_ts(start_millis)
$function$;

create
or replace function public.millis_to_ts (millis bigint) returns timestamp with time zone language sql immutable parallel SAFE as $function$
select to_timestamp(millis / 1000.0)
$function$;

create
or replace function public.random_alphanumeric (length integer) returns text language plpgsql as $function$
DECLARE
  result TEXT;
BEGIN
  WITH alphanum AS (
    SELECT ARRAY['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] AS chars
  )
  SELECT array_to_string(ARRAY (
    SELECT alphanum.chars[1 + floor(random() * 62)::integer]
    FROM alphanum, generate_series(1, length)
  ), '') INTO result;

  RETURN result;
END;
$function$;

create
or replace function public.to_jsonb (jsonb) returns jsonb language sql immutable parallel SAFE strict as $function$ select $1 $function$;

create
or replace function public.ts_to_millis (ts timestamp with time zone) returns bigint language sql immutable parallel SAFE as $function$
select (extract(epoch from ts) * 1000)::bigint
$function$;

create
or replace function public.ts_to_millis (ts timestamp without time zone) returns bigint language sql immutable parallel SAFE as $function$
select extract(epoch from ts)::bigint * 1000
$function$;
