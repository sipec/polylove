import clsx from 'clsx'
import Link from 'next/link'
import Markdown from 'react-markdown'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import remarkBreaks from 'remark-breaks'
import remarkMentions from 'remark-mentions'
import { Root } from 'remark-mentions/lib'
import { visit } from 'unist-util-visit'
import { ExpandingImage } from '../editor/image'
import { proseClass } from './editor'
import { linkClass } from './site-link'

export function Richify(props: {
  text: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const { size = 'md', className } = props

  // markdown collapses multiple newlines into just one paragraph break.
  // this is contrary to user intent so we hack it to put the extra breaks back in.
  // first, every \n surrounded by \n on both sides has '\' prepended
  // later, for paragraphs that contain only '\' we make them empty instead.

  const text = props.text
    .split('```')
    .map((chunk, i) =>
      i % 2 === 1
        ? chunk // odd chunks are code, don't change
        : chunk.replace(
            /\n{3,}/g,
            (match) => '\n' + '\n\\\n'.repeat(match.length - 2) + '\n'
          )
    )
    .join('```')

  return (
    <div
      className={clsx(
        'ProseMirror',
        className,
        proseClass(size === 'sm' ? 'sm' : 'lg'),
        'empty:prose-p:-mt-px empty:prose-p:pt-px' // make empty paragraphs have height
      )}
    >
      <Markdown
        remarkPlugins={[
          disableIndentCodeAndSetextHead,
          remarkGfm,
          [remarkMentions as any, { usernameLink: (u: string) => `/${u}` }],
          remarkBreaks,
          remarkUnslashLoneNewlines,
          // () => (tree: Root) => void console.dir(tree),
        ]}
        // remarkRehypeOptions={{}}
        rehypePlugins={[rehypeMinifyWhitespace]}
        components={{
          del: 's',
          img: ({ src, alt, title }) => (
            <ExpandingImage size={size} src={src!} alt={alt} title={title} />
          ),
          a: ({ href, children }) => (
            <Link href={href!} className={clsx(linkClass, 'text-primary-700')}>
              {children}
            </Link>
          ),
        }}
      >
        {text}
      </Markdown>
    </div>
  )
}

function disableIndentCodeAndSetextHead(this: any) {
  const data = this.data()
  const fromMarkdownExtensions =
    data.fromMarkdownExtensions || (data.fromMarkdownExtensions = [])

  fromMarkdownExtensions.push({
    enter: {
      codeIndented: () => undefined,
      setextHeading: () => undefined,
    },
    exit: {
      codeIndented: () => undefined,
      setextHeading: () => undefined,
      setextHeadingText: () => undefined,
      setextHeadingLineSequence: () => undefined,
    },
  })
}

// copied from remark-gfm but just auto-link and  strikethrough
import {
  gfmAutolinkLiteralFromMarkdown,
  gfmAutolinkLiteralToMarkdown,
} from 'mdast-util-gfm-autolink-literal'
import {
  gfmStrikethroughFromMarkdown,
  gfmStrikethroughToMarkdown,
} from 'mdast-util-gfm-strikethrough'
import { gfmAutolinkLiteral } from 'micromark-extension-gfm-autolink-literal'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { combineExtensions } from 'micromark-util-combine-extensions'

function remarkGfm(this: any) {
  const data = this.data()

  const micromarkExtensions =
    data.micromarkExtensions || (data.micromarkExtensions = [])
  const fromMarkdownExtensions =
    data.fromMarkdownExtensions || (data.fromMarkdownExtensions = [])
  const toMarkdownExtensions =
    data.toMarkdownExtensions || (data.toMarkdownExtensions = [])

  micromarkExtensions.push(
    combineExtensions([gfmAutolinkLiteral(), gfmStrikethrough()])
  )

  fromMarkdownExtensions.push([
    gfmAutolinkLiteralFromMarkdown(),
    gfmStrikethroughFromMarkdown(),
  ])

  toMarkdownExtensions.push({
    extensions: [gfmAutolinkLiteralToMarkdown(), gfmStrikethroughToMarkdown()],
  })
}

// replace paragraphs containing just '\' to contain nothing
const remarkUnslashLoneNewlines = () => (tree: Root) => {
  visit(tree, 'paragraph', (node) => {
    if (
      node.children.length === 1 &&
      node.children[0].type === 'text' &&
      node.children[0].value === '\\'
    ) {
      node.type = 'paragraph'
      node.children = []
    }
  })
}
