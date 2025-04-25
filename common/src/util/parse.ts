import { JSONContent } from '@tiptap/core'
import { find } from 'linkifyjs'
import { compareTwoStrings } from 'string-similarity'
import { tiptapToMarkdown } from './tiptap-to-markdown'

/** get first url in text. like "notion.so " -> "http://notion.so"; "notion" -> null */
export function getUrl(text: string) {
  const results = find(text, 'url')
  return results.length ? results[0].href : null
}

export const beginsWith = (text: string, query: string) =>
  text.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())

export const wordIn = (word: string, corpus: string) => {
  word = word.toLocaleLowerCase()
  corpus = corpus.toLocaleLowerCase()

  return corpus.includes(word) || compareTwoStrings(word, corpus) > 0.7
}

const checkAgainstQuery = (query: string, corpus: string) =>
  query.split(' ').every((word) => wordIn(word, corpus))

export const searchInAny = (query: string, ...fields: string[]) =>
  fields.some((field) => checkAgainstQuery(query, field))

export function parseJsonContentToText(content: JSONContent | string) {
  return typeof content === 'string' ? content : tiptapToMarkdown(content)
}
