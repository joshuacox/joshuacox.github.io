import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import toc from '@jsdevtools/rehype-toc';
import rehypeStringify from 'rehype-stringify';
import { siteConfig } from '@/config/site';

function preprocessJekyllMarkdown(content: string): string {
  let processed = content;

  // Replace {% raw %} and {% endraw %}
  processed = processed.replace(/{%\s*raw\s*%}/g, '');
  processed = processed.replace(/{%\s*endraw\s*%}/g, '');

  // Convert Jekyll code highlight blocks: {% highlight <lang> %} ... {% endhighlight %}
  processed = processed.replace(/{%\s*highlight\s+([a-zA-Z0-9_-]+)\s*%}/g, '```$1');
  processed = processed.replace(/{%\s*endhighlight\s*%}/g, '```');

  // Replace common site variables
  processed = processed.replace(/{{\s*site\.url\s*}}/g, siteConfig.url);
  processed = processed.replace(/{{\s*site\.baseurl\s*}}/g, '');
  processed = processed.replace(/{{\s*site\.org_name\s*}}/g, siteConfig.name);
  processed = processed.replace(/{{\s*site\.org_summary\s*}}/g, siteConfig.orgSummary);
  processed = processed.replace(/{{\s*site\.author\s*}}/g, siteConfig.author);

  return processed;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const cleaned = preprocessJekyllMarkdown(markdown);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['heading-anchor'],
      },
    })
    .use(toc, {
      cssClasses: {
        toc: 'page-outline',
        link: 'page-link text-[var(--neon-accent)] hover:underline',
      }
    })
    .use(rehypeStringify)
    .process(cleaned);

  return String(file);
}
