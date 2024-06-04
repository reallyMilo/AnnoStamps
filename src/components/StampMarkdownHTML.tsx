import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'

import type { StampWithRelations } from '@/lib/prisma/queries'

const TEMPORARY_ATTRIBUTE = 'data-temp-href-target'
DOMPurify.addHook('beforeSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    if (!node.hasAttribute('target')) {
      node.setAttribute('target', '_blank')
    }

    if (node.hasAttribute('target')) {
      node.setAttribute(
        TEMPORARY_ATTRIBUTE,
        node.getAttribute('target') as string
      )
    }
  }
})

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute(TEMPORARY_ATTRIBUTE)) {
    node.setAttribute(
      'target',
      node.getAttribute(TEMPORARY_ATTRIBUTE) as string
    )
    node.removeAttribute(TEMPORARY_ATTRIBUTE)
    if (node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'referrer')
    }
  }
})

export const StampMarkdownHTML = ({
  description,
}: {
  description: StampWithRelations['description']
}) => {
  const renderer = {
    link(href: string, _: string | null | undefined, text: string) {
      const prependHttps = href.startsWith('https://')
        ? href
        : href.padStart(href.length + 8, 'https://')

      return `  
        <a class="link" href="${prependHttps}">
                ${text}
              </a>
        `
    },
  }

  marked.use({ renderer })

  const sanitizedDescription = DOMPurify.sanitize(
    marked.parse(description) as string
  )

  return (
    <div
      data-testid="stamp-markdown-html"
      className="stamp-markdown-html-wrapper"
      dangerouslySetInnerHTML={{
        __html: sanitizedDescription,
      }}
    ></div>
  )
}
