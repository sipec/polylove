# Manifold Love

Creating a new kind of dating app. Or perhaps a new take on an old kind.

## Setup

### Dependencies

prerequisite: brew install opentofu (fork of terraform), docker, and yarn

then run `yarn` to install dependencies

### Creating the Firebase project

Sign up for [Firebase](https://console.firebase.google.com).

Create a new project.

Instal the [`gcloud` CLI](https://cloud.google.com/sdk/docs/install)

Authenticate to Secret Manager using `gcloud`

Go to Project Settings > Service Account > Firebase Admin SDK

Generate a new private key.

Place the file somewhere on your computer. NOT IN THE REPO

Install the [Firebase CLI](https://firebase.google.com/docs/cli).

Select your project using the CLI:

```sh
firebase use --add
# Select project ID
# Set alias to `polylove`
```

Set the environment variable `GOOGLE_APPLICATION_CREDENTIALS_POLYLOVE` and `GOOGLE_APPLICATION_CREDENTIALS_DEV` to the absolute path of your credential file.

### Creating the Supabase DB

Create a new project on [Supabase](https://supabase.com). Make sure to create the project in the **US West** region, as it's currently the hardcoded region in the connection code.

Export `SUPABASE_INSTANCE_ID` with the instance id displayed in your Supabase API settings.

### Creating the secrets in Google Secret Manager

Enable Google Secret Manager in the [Google Cloud console](https://console.cloud.google.com/apis/api/secretmanager.googleapis.com/overview). You will need to activate billing on your project.

Create one secret for each key in common/src/secrets.ts. The important ones are the Supabase credentials which you can find in your Supabase API settings. You probably can put random values for the rest and let the features be broken.

Run this command to get your service account email:

```sh
> gcloud iam service-accounts list --project=FIREBASE-PROJECT-ID

DISPLAY NAME       EMAIL                    DISABLED
firebase-adminsdk  [SERVICE-ACCOUNT-EMAIL]  False
```

Now run this command:

```sh
gcloud projects add-iam-policy-binding FIREBASE-PROJECT-ID \
    --member="serviceAccount:SERVICE-ACCOUNT-EMAIL" \
    --role="roles/secretmanager.secretAccessor"
```

## Run the migrations

Run the migrations using `psql`:

```sh
psql -h aws-0-us-west-1.pooler.supabase.com -p 6543 -d postgres -U postgres.SUPABASE-ID < MIGRATION_FILE
```

Run the migrations in this order:

```
backend/supabase/functions.sql
backend/supabase/love_answers.sql
backend/supabase/lovers.sql
backend/supabase/lover_comments.sql
backend/supabase/love_compatibility_answers.sql
backend/supabase/love_likes.sql
backend/supabase/love_questions.sql
backend/supabase/love_ships.sql
backend/supabase/love_stars.sql
backend/supabase/love_waitlist.sql
backend/supabase/private_users.sql
backend/supabase/private_user_messages.sql
backend/supabase/private_user_message_channels.sql
backend/supabase/private_user_message_channel_members.sql
backend/supabase/private_user_seen_message_channels.sql
backend/supabase/users.sql
backend/supabase/user_events.sql
backend/supabase/user_notifications.sql
```

## Running

Run `yarn dev` to start the server.

See also [knowledge.md](knowledge.md), which is docs for AI coders.
