export const SITE_ORDER = [
  'site', // personal site
  'x', // twitter
  'discord',
  'manifold',
] as const

export type Site = (typeof SITE_ORDER)[number]

// this is a lie, actually people can have anything in their links
export type Socials = { [key in Site]?: string }

export const strip = (site: Site, input: string) =>
  stripper[site]?.(input) ?? input

const stripper: { [key in Site]: (input: string) => string } = {
  site: (s) => s.replace(/^(https?:\/\/)/, ''),
  x: (s) =>
    s
      .replace(/^(https?:\/\/)?(www\.)?(twitter|x)(\.com\/)/, '')
      .replace(/^@/, '')
      .replace(/\/$/, ''),
  discord: (s) => s,
  manifold: (s) =>
    s
      .replace(/^(https?:\/\/)?(manifold\.markets\/)/, '')
      .replace(/^@/, '')
      .replace(/\/$/, ''),
}

export const getSocialUrl = (site: Site, handle: string) =>
  urler[site]?.(handle) ?? urler.site(handle)

const urler: { [key in Site]: (handle: string) => string } = {
  site: (s) => (s.startsWith('http') ? s : `https://${s}`),
  x: (s) => `https://x.com/${s}`,
  discord: (s) =>
    (s.length === 17 || s.length === 18) && !isNaN(parseInt(s, 10))
      ? `https://discord.com/users/${s}` // discord user id
      : 'https://discord.com/invite/AYDw8dbrGS', // our server
  manifold: (s) => `https://manifold.markets/${s}`,
}

export const PLATFORM_LABELS: { [key in Site]: string } = {
  site: 'Website',
  x: 'Twitter/X',
  discord: 'Discord',
  manifold: 'Manifold',
}
