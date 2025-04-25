import { LinkIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import Foldy from 'web/public/manifold-logo.svg'
import { Site } from 'common/socials'

export const PLATFORM_ICONS: {
  [key in Site]: (props: { className?: string }) => JSX.Element
} = {
  site: LinkIcon,
  x: (props) => <img {...props} src="/twitter-logo.svg" alt="x.com" />,
  discord: (props) => <img {...props} src="/discord-logo.svg" alt="Discord" />,
  manifold: ({ className, ...props }) => (
    <Foldy
      {...props}
      className={clsx(className, 'stroke-indigo-700 dark:stroke-indigo-400')}
      alt="Manifold"
    />
  ),
}

export const SocialIcon = (props: { site: string; className?: string }) => {
  const { site, ...rest } = props
  const Icon = PLATFORM_ICONS[site as Site] || PLATFORM_ICONS.site

  return <Icon {...rest} />
}
