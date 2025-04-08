import { type JSONContent } from '@tiptap/core' // Assuming you have the correct import for JSONContent

export function tiptapToMarkdown(doc: JSONContent) {
  if (doc.type !== 'doc') console.warn('not a doc')
  return recurse(doc)
}

// block behavoirs:
// - list, codeblock: alter what new lines look like (starting, indenting, etc)
// - always start new line: end of paragraph, hardbreak

// get newline segments
function recurse(node: JSONContent): string {
  const content = node.content ?? []

  // Handle text nodes
  if (node.type === 'text') {
    let text = node.text || ''

    // escape characters
    if (!node.marks?.some((mark) => mark.type === 'code')) {
      text = text
        .replace(/\\/g, '\\\\') // \ -> \\
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
    }

    // Apply marks to the text
    if (node.marks) {
      const reversed = [...node.marks].reverse()
      reversed.forEach((mark) => {
        switch (mark.type) {
          case 'bold':
            text = `**${text}**`
            break
          case 'italic':
            text = `*${text}*`
            break
          case 'link':
            text = `[${text}](${mark.attrs?.href || ''})`
            break
          case 'code':
            text = `\`${text}\``
            break
          case 'strike':
            text = `~~${text}~~`
            break

          default:
            console.error('Unhandled mark type:', mark.type)
            break
        }
      })
    }

    return text
  } else if (node.type === 'horizontalRule') {
    return '\n---\n'
  } else if (node.type === 'hardBreak') {
    return ' ' + ' ' + '\n'
  } else if (node.type === 'image') {
    const { src = '', alt = '', title } = node.attrs ?? {}
    return `![${alt}](${src}${title ? ` "${title}"` : ''})`
  }

  // Handle contentful block nodes
  else if (node.type === 'orderedList') {
    // TODO: doesn't support 100+
    const start = node.attrs?.start || 1
    return (
      joinBlockChildren(
        content.map(
          (child, i) => `${start + i}.`.padEnd(4, ' ') + recurse(child)
        )
      ) + '\n'
    )
  } else if (node.type === 'bulletList') {
    return (
      joinBlockChildren(content.map((child) => `-   ${recurse(child)}`)) + '\n'
    )
  } else if (node.type === 'listItem') {
    return joinBlockChildren(content.map(recurse))
      .split('\n')
      .map((line, i) => (i === 0 ? line : ' '.repeat(4) + line))
      .join('\n')
  } else if (node.type === 'blockquote') {
    return (
      '\n' +
      joinBlockChildren(content.map(recurse))
        .split('\n')
        .map((line) => '> ' + line)
        .join('\n') +
      '\n'
    )
  } else if (node.type === 'paragraph') {
    return content.map(recurse).join('')
  } else if (node.type === 'heading') {
    const level = node.attrs?.level || 1
    return '\n' + '#'.repeat(level) + ' ' + content.map(recurse).join('') + '\n'
  } else if (node.type === 'codeBlock') {
    let md = '\n'
    md += '```' + (node.attrs?.language ?? '') + '\n'
    md += content.map(recurse).join('') + '\n'
    md += '```' + '\n'
    return md
  } else if (node.type === 'mention') {
    return `@${node.attrs?.label}`
  } else if (node.type === 'doc') {
    return joinBlockChildren(content.map(recurse)) + '\n'
  } else {
    console.log('Unhandled block type:', node.type)
    const attributes = Object.entries(node.attrs ?? {})
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')

    return (
      `<${node.type} ${attributes}>` +
      content.map(recurse).join('') +
      `</${node.type}>`
    )
  }
}

// join with "margin collapse"
const joinBlockChildren = (children: string[]) => {
  let md = ''
  for (let c of children) {
    let bot = 0
    while (md.endsWith('\n')) bot++, (md = md.slice(0, -1))
    let top = 0
    while (c.startsWith('\n')) top++, (c = c.slice(1))

    md = md + '\n'.repeat(Math.max(bot, top) + 1) + c
  }
  return md.trim()
}

// join inline children: .join('')

const sanitize = (text: string) =>
  text.replace(/([#_*`[\]()<>{}+-.!|\\])/g, '\\$1')
