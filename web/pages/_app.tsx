import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { useEffect } from 'react'
import { AuthProvider, AuthUser } from 'web/components/auth-context'
import { useHasLoaded } from 'web/hooks/use-has-loaded'
import '../styles/globals.css'
import { getIsNative } from 'web/lib/native/is-native'
import { postMessageToNative } from 'web/lib/native/post-message'
import { Major_Mono_Display, Figtree } from 'next/font/google'
import clsx from 'clsx'

// See https://nextjs.org/docs/basic-features/font-optimization#google-fonts
// and if you add a font, you must add it to tailwind config as well for it to work.

function firstLine(msg: string) {
  return msg.replace(/\r?\n[\s\S]*/, '')
}

const logoFont = Major_Mono_Display({
  weight: ['400'],
  variable: '--font-logo',
  subsets: ['latin'],
})

const mainFont = Figtree({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-main',
  subsets: ['latin'],
})

// It can be very hard to see client logs on native, so send them manually
if (getIsNative()) {
  const log = console.log.bind(console)
  console.log = (...args) => {
    postMessageToNative('log', { args })
    log(...args)
  }
  console.error = (...args) => {
    postMessageToNative('log', { args })
    log(...args)
  }
}

function printBuildInfo() {
  // These are undefined if e.g. dev server
  if (process.env.NEXT_PUBLIC_VERCEL_ENV) {
    const env = process.env.NEXT_PUBLIC_VERCEL_ENV
    const msg = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE
    const owner = process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER
    const repo = process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG
    const sha = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
    const url = `https://github.com/${owner}/${repo}/commit/${sha}`
    console.info(`Build: ${env} / ${firstLine(msg || '???')} / ${url}`)
  }
}

// specially treated props that may be present in the server/static props
type ManifoldPageProps = { auth?: AuthUser }

function MyApp({ Component, pageProps }: AppProps<ManifoldPageProps>) {
  useEffect(printBuildInfo, [])
  useHasLoaded()

  const title = 'Manifold.love — Bet on love!'
  const description =
    "Find the love of your life and bet on your friends’ relationships ❤️ Who says love and money don't mix?"

  return (
    <>
      <Head>
        <title>{title}</title>

        <meta
          property="og:title"
          name="twitter:title"
          content={title}
          key="title"
        />
        <meta name="description" content={description} key="description1" />
        <meta
          property="og:description"
          name="twitter:description"
          content={description}
          key="description2"
        />
        <meta property="og:url" content="https://manifold.markets" key="url" />
        <meta property="og:site_name" content="Manifold" />
        <meta name="twitter:card" content="summary" key="card" />
        <meta name="twitter:site" content="@manifoldmarkets" />
        <meta
          name="twitter:image"
          content="https://manifold.love/bet-on-love.png"
          key="image2"
        />
        <meta
          property="og:image"
          content="https://manifold.love/bet-on-love.png"
          key="image1"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no"
        />
      </Head>
      <div
        className={clsx(
          'font-figtree contents font-normal',
          logoFont.variable,
          mainFont.variable
        )}
      >
        <AuthProvider serverUser={pageProps.auth}>
          <Component {...pageProps} />
        </AuthProvider>
        {/* Workaround for https://github.com/tailwindlabs/headlessui/discussions/666, to allow font CSS variable */}
        <div id="headlessui-portal-root">
          <div />
        </div>
      </div>
      {/* LOVE TODO: Reenable one tap setup */}
      {/* <GoogleOneTapSetup /> */}
    </>
  )
}

export default MyApp
