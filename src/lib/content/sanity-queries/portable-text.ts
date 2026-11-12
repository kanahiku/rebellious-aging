import { resolveContentImage } from '../../sanity/image';
import type { BlogContentBlock, BlogPost } from '../types';
import { type FetchedImage, list, text } from './shared';
import { type SanityBlogPost, type SanityMarkDef, type SanityPortableBlock, type SanitySpan } from './contact-reviews';

export function portableBlockText(block: SanityPortableBlock): string {
  return Array.isArray(block.children) ? block.children.map((child) => child.text ?? '').join('') : '';
}

export function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function spansToHtml(children: SanitySpan[] | undefined, markDefs: SanityMarkDef[] | undefined): string {
  if (!Array.isArray(children)) return '';
  const defsMap = new Map((markDefs ?? []).map((d) => [d._key, d]));

  return children
    .map((span) => {
      if (span._type !== 'span') return '';
      let html = escapeHtml(span.text ?? '');
      for (const mark of span.marks ?? []) {
        const def = defsMap.get(mark);
        if (def?._type === 'link') {
          const targetAttr = def.blank !== false ? ' target="_blank" rel="noopener noreferrer"' : '';
          html = `<a href="${escapeHtml(def.href ?? '')}"${targetAttr}>${html}</a>`;
        } else if (mark === 'strong') {
          html = `<strong>${html}</strong>`;
        } else if (mark === 'em') {
          html = `<em>${html}</em>`;
        } else if (mark === 'underline') {
          html = `<u>${html}</u>`;
        } else if (mark === 'strike-through') {
          html = `<s>${html}</s>`;
        } else if (mark === 'code') {
          html = `<code>${html}</code>`;
        }
      }
      return html;
    })
    .join('');
}

export function portableTextToContentBlocks(body: SanityPortableBlock[] | null | undefined): BlogContentBlock[] {
  if (!Array.isArray(body)) return [];

  const result: BlogContentBlock[] = [];

  // Buffer for consecutive list items of the same type
  let listBuffer: { _key: string; html: string; level: number }[] = [];
  let listType: 'bullet' | 'number' | null = null;
  let listStartKey = '';

  function flushList() {
    if (!listBuffer.length || !listType) return;
    result.push({ _type: 'list', _key: `list-${listStartKey}`, listType, items: listBuffer });
    listBuffer = [];
    listType = null;
    listStartKey = '';
  }

  body.forEach((block, index) => {
    const key = block._key || `block-${index}`;

    // ── Image ─────────────────────────────────────────────────────────────────
    if (block._type === 'image') {
      flushList();
      const image = resolveContentImage({
        src: block.src,
        alt: block.alt,
        crop: block.crop,
        hotspot: block.hotspot,
        asset: block.asset,
      });
      if (!image?.src) return;
      const caption = typeof block.caption === 'string' ? block.caption.trim() : '';
      result.push({ _type: 'image', _key: key, image, ...(caption ? { caption } : {}) });
      return;
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    if (block._type === 'table') {
      flushList();
      const headerRow = (block.headerRow ?? []).filter(Boolean);
      if (headerRow.length < 2) return;
      result.push({
        _type: 'table',
        _key: key,
        ...(block.caption ? { caption: block.caption } : {}),
        headerRow,
        rows: (block.rows ?? []).map((row, ri) => ({
          _key: row._key || `row-${ri}`,
          cells: row.cells ?? [],
        })),
      });
      return;
    }

    // ── Callout ───────────────────────────────────────────────────────────────
    if (block._type === 'callout') {
      flushList();
      if (!block.text?.trim()) return;
      const calloutType = (['tip', 'info', 'warning', 'note'] as const).includes(
        block.calloutType as 'tip' | 'info' | 'warning' | 'note'
      )
        ? (block.calloutType as 'tip' | 'info' | 'warning' | 'note')
        : 'note';
      result.push({ _type: 'callout', _key: key, calloutType, text: block.text.trim() });
      return;
    }

    // ── Standard block ────────────────────────────────────────────────────────
    if (block._type !== 'block') return;

    const text = portableBlockText(block).trim();
    if (!text) return;

    const html = spansToHtml(block.children, block.markDefs) || escapeHtml(text);

    // Headings
    if (block.style === 'h1' || block.style === 'h2') {
      flushList();
      result.push({ _type: 'heading', _key: key, level: 2, text });
      return;
    }
    if (block.style === 'h3' || block.style === 'h4') {
      flushList();
      result.push({ _type: 'heading', _key: key, level: 3, text });
      return;
    }

    // List items
    if (block.listItem === 'bullet' || block.listItem === 'number') {
      if (listType !== block.listItem) {
        flushList();
        listType = block.listItem;
        listStartKey = key;
      }
      listBuffer.push({ _key: key, html, level: block.level ?? 1 });
      return;
    }

    // Paragraph / blockquote
    flushList();
    result.push({
      _type: 'paragraph',
      _key: key,
      text,
      html,
      ...(block.style === 'blockquote' ? { quote: true } : {}),
    });
  });

  flushList();
  return result;
}

export function portableTextToParagraphs(body: SanityPortableBlock[] | null | undefined): string[] {
  return portableTextToContentBlocks(body)
    .filter((block): block is Extract<BlogContentBlock, { _type: 'paragraph' }> => block._type === 'paragraph')
    .map((block) => block.text); // plain text only — used for excerpts and lead paragraphs
}

export function normalizeBlogPost(post: SanityBlogPost): BlogPost {
  const contentBlocks = portableTextToContentBlocks(post.body);
  const body = portableTextToParagraphs(post.body);
  const excerpt = post.excerpt || body[0] || '';
  return {
    title: post.title,
    slug: post.slug,
    excerpt,
    publishDate: post.publishDate,
    updatedAt: post.updatedAt,
    author: post.author,
    image: resolveContentImage(post.image as FetchedImage | undefined),
    relatedPages: (post.relatedPages ?? []).map((key) => key.replace(/^\/+/, '')).filter(Boolean),
    meta: {
      title: post.title,
      description: excerpt,
    },
    heroParagraphs: body.slice(0, 2),
    sections:
      body.length > 2
        ? [
            {
              _type: 'editorialSection',
              heading: post.title,
              paragraphs: body.slice(2),
            },
          ]
        : [],
    ctaBanner: {
      title: 'Get in touch',
      subtitle: 'Replace this banner copy from the Figma file.',
      ctaText: 'Start the assessment',
      ctaHref: 'https://robertpetersonmd.com/checkup',
    },
    body,
    contentBlocks,
  };
}
