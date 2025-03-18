# Manifold Love

Creating a new kind of dating app. Or perhaps a new take on an old kind.

## Setup

### Dependencies

prerequisite: brew install opentofu (fork of terraform), docker, and yarn

then run `yarn` to install dependencies

### Creating the Firebase project

Sign up for [Firebase](https://console.firebase.google.com).

Create a new project.

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

Set the environment variable `GOOGLE_APPLICATION_CREDENTIALS_POLYLOVE` to the absolute path of your credential file.

## Running

Run `yarn dev` to start the server.

See also [knowledge.md](knowledge.md), which is docs for AI coders.
