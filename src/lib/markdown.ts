import type sanitize from 'sanitize-html'

import { marked, type Renderer, type RendererObject } from 'marked'
import sanitizeHtml from 'sanitize-html'

import type { StampWithRelations } from '@/lib/prisma/models'
//https://github.com/apostrophecms/sanitize-html?tab=readme-ov-file#default-options
const sanitizeOptions = {
  allowedAttributes: {
    a: ['href', 'target'],
  },
  allowedSchemes: ['https'],
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
  allowedSchemesByTag: {},
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'dd',
    'div',
    'dl',
    'dt',
    'hr',
    'li',
    'ol',
    'p',
    'pre',
    'ul',
    'a',
    'abbr',
    'b',
    'bdi',
    'bdo',
    'br',
    'cite',
    'code',
    'em',
    'i',
    'small',
    'span',
    'strong',
    'sub',
    'sup',
    'time',
    'u',
    'caption',
    'col',
    'colgroup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
  ],
  allowProtocolRelative: true,
  disallowedTagsMode: 'discard',
  enforceHtmlBoundary: true,
  nonBooleanAttributes: [
    'class',
    'color',
    'cols',
    'colspan',
    'content',
    'datetime',
    'href',
    'label',
    'lang',
    'list',
    'rows',
    'rowspan',
    'sandbox',
    'scope',
    'shape',
    'size',
    'sizes',
    'slot',
    'span',
    'src',
    'style',
    'target',
    'title',
  ],
  parseStyleAttributes: true,
  selfClosing: [
    'img',
    'br',
    'hr',
    'area',
    'base',
    'basefont',
    'input',
    'link',
    'meta',
  ],
} satisfies sanitize.IOptions

export const parseAndSanitizedMarkdown = (
  description: StampWithRelations['unsafeDescription'],
) => {
  const renderer = {
    link({ href, tokens }) {
      const prependHttps = href.startsWith('https://')
        ? href
        : href.padStart(href.length + 8, 'https://')

      const text = this.parser.parseInline(tokens)

      return `  
            <a target="_blank" href="${prependHttps}">
                    ${text}
                  </a>
            `
    },
  } satisfies RendererObject
  marked.use({ renderer })

  return sanitizeHtml(marked.parse(description) as string, sanitizeOptions)
}
