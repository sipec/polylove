import clsx from 'clsx'
import Link from 'next/link'
import Markdown from 'react-markdown'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import remarkBreaks from 'remark-breaks'
import remarkMentions from 'remark-mentions'
import { ExpandingImage } from '../editor/image'
import { proseClass } from './editor'
import { linkClass } from './site-link'

export function Richify(props: {
  text: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const { size = 'md', className } = props
  return (
    <div
      className={clsx(
        'ProseMirror',
        className,
        proseClass(size === 'sm' ? 'sm' : 'lg'),
        String.raw`empty:prose-p:after:content-["\00a0"]` // make empty paragraphs have height
      )}
    >
      <Markdown
        // skipHtml
        remarkPlugins={[
          disable,
          // remarkCustomBreaks,
          remarkGfm,
          [remarkMentions as any, { usernameLink: (u: string) => `/${u}` }],
          remarkBreaks,
          // remarkCustomLineEndings,
        ]}
        remarkRehypeOptions={{}}
        rehypePlugins={[rehypeMinifyWhitespace]}
        // disallowedElements={['table']}
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
        {props.text}
      </Markdown>
    </div>
  )
}

function disable(this: any) {
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
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmAutolinkLiteral } from 'micromark-extension-gfm-autolink-literal'
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

// turn all newlines into empty paragraphs
function remarkCustomBreaks(this: any) {
  const data = this.data()

  const micromarkExtensions =
    data.micromarkExtensions || (data.micromarkExtensions = [])
  const fromMarkdownExtensions =
    data.fromMarkdownExtensions || (data.fromMarkdownExtensions = [])

  micromarkExtensions.push({
    text: {
      ['\n']: {
        name: 'lineBreak',
        tokenize(effects: any, ok: any, nok: (arg0: any) => any) {
          return function (code: number) {
            if (code !== 10) return nok(code) // 10 is newline char
            effects.enter('lineBreak')
            effects.consume(code)
            effects.exit('lineBreak')
            return ok
          }
        },
      },
    },
  })

  fromMarkdownExtensions.push({
    enter: {
      paragraph(token: { children: any[] }) {
        // Split paragraph content on newlines
        token.children = token.children?.flatMap(
          (child: { type: string; value: string }) => {
            if (child.type === 'text') {
              return child.value
                .split('\n')
                .map((text: any, i: number, arr: string | any[]) => ({
                  type: 'text',
                  value: text,
                  ...(i < arr.length - 1 ? { break: true } : {}),
                }))
            }
            return child
          }
        )
      },
      list(token: { next: any; exit: boolean }) {
        // End list if next line is unindented
        const nextToken = token.next
        if (nextToken && !nextToken.indent) {
          token.exit = true
        }
      },
    },
    exit: {
      // Handle multiple newlines as empty paragraphs
      text(token: { value: any; children: any }) {
        const value = token.value
        if (value.includes('\n\n')) {
          const parts = value.split(/\n\n+/)
          token.children = parts.map((part: any) => ({
            type: 'paragraph',
            children: [{ type: 'text', value: part }],
          }))
        }
      },
    },
  })
}

function remarkCustomLineEndings() {
  const fromMarkdownExtensions = {
    enter: {
      lineEnding: () => undefined, // Optional: handle enter
    },
    exit: {
      lineEnding: function (this: any, token: any) {
        const context = this.stack[this.stack.length - 1]

        // Always create new text node with line break
        const siblings = context.children
        siblings.push({
          type: 'text',
          value: '\n',
          position: {
            start: { ...token.start },
            end: { ...token.end },
          },
        })

        // Or force a hard break
        // siblings.push({
        //   type: 'break',
        //   position: {
        //     start: point(token.start),
        //     end: point(token.end)
        //   }
        // })
      },
    },
    // Optionally allow EOLs in more node types
    canContainEols: ['paragraph', 'heading', 'list', 'listItem'],
  }

  return {
    from: { extensions: [fromMarkdownExtensions] },
  }
}
