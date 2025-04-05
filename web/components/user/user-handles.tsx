import { LinkIcon } from '@heroicons/react/solid'
import { Row } from '../layout/row'
import clsx from 'clsx'
import Foldy from 'web/public/manifold-logo.svg'

export function UserHandles(props: {
  website?: string | null
  twitterHandle?: string | null
  discordHandle?: string | null
  manifoldHandle?: string | null
  className?: string
}) {
  const { website, discordHandle, manifoldHandle, className } = props

  const twitterHandle = props.twitterHandle
    ?.replace('https://', '')
    .replace('www.', '')
    .replace('twitter.com/', '')
    .replace('x.com/', '')
    .replace(/^@/, '')

  return (
    <Row
      className={clsx(
        'text-ink-400 flex-wrap items-center gap-2 sm:gap-4',
        className
      )}
    >
      {website && (
        <a
          target={'_blank'}
          href={
            'https://' + website.replace('http://', '').replace('https://', '')
          }
        >
          <Row className="items-center gap-1">
            <LinkIcon className="h-4 w-4" />
            <span className="text-ink-400 text-sm">{website}</span>
          </Row>
        </a>
      )}
      {twitterHandle && (
        <a target={'_blank'} href={`https://x.com/${twitterHandle}`}>
          <Row className="items-center gap-1">
            <img src="/twitter-logo.svg" className="h-4 w-4" alt="Twitter" />
            <span className="text-ink-400 text-sm">{twitterHandle}</span>
          </Row>
        </a>
      )}
      {discordHandle && (
        <a target={'_blank'} href="https://discord.com/invite/AYDw8dbrGS">
          <Row className="items-center gap-1">
            <img src="/discord-logo.svg" className="h-4 w-4" alt="Discord" />
            <span className="text-ink-400 text-sm">{discordHandle}</span>
          </Row>
        </a>
      )}
      {manifoldHandle && (
        <a target="_blank" href={`https://manifold.markets/${manifoldHandle}`}>
          <Row className="items-center gap-1">
            <Foldy
              className="h-4 w-4 stroke-indigo-700 dark:stroke-indigo-400"
              alt="Manifold"
            />
            <span className="text-ink-400 text-sm">{manifoldHandle}</span>
          </Row>
        </a>
      )}
    </Row>
  )
}
