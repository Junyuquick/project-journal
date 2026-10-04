import { describe, expect, it } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { remarkGlossary, loadGlossaryIds } from './remark-glossary.mjs';

const run = (md: string, terms = new Set(['ftp', 'oauth'])) => {
  const processor = unified().use(remarkParse).use(remarkMdx).use(remarkGlossary, { terms });
  return processor.runSync(processor.parse(md)) as any;
};
const find = (node: any, pred: (n: any) => boolean): any[] =>
  [...(pred(node) ? [node] : []), ...(node.children ?? []).flatMap((c: any) => find(c, pred))];

describe('remarkGlossary', () => {
  it('turns a glossary: link into a term button carrying its id and text', () => {
    const tree = run('Files go up over [FTP](glossary:ftp) to Vodien.');
    const [btn] = find(tree, (n) => n.type === 'mdxJsxTextElement');
    expect(btn.name).toBe('button');
    const attrs = Object.fromEntries(btn.attributes.map((a: any) => [a.name, a.value]));
    expect(attrs).toMatchObject({ type: 'button', class: 'term', 'data-term': 'ftp', 'aria-haspopup': 'dialog', 'aria-expanded': 'false' });
    expect(btn.children[0].value).toBe('FTP');
    expect(find(tree, (n) => n.type === 'link')).toHaveLength(0);
  });
  it('fails the build on an unknown term so a typo cannot ship', () => {
    expect(() => run('See [SFTP](glossary:sftp).')).toThrow('Unknown glossary term: sftp');
  });
  it('leaves ordinary links and code untouched', () => {
    const tree = run('A [site](https://example.com) and `glossary:ftp` in code.');
    expect(find(tree, (n) => n.type === 'link')).toHaveLength(1);
    expect(find(tree, (n) => n.type === 'inlineCode')[0].value).toBe('glossary:ftp');
    expect(find(tree, (n) => n.type === 'mdxJsxTextElement')).toHaveLength(0);
  });
  it('works inside headings and emphasis', () => {
    const tree = run('## How *[OAuth](glossary:oauth)* works');
    expect(find(tree, (n) => n.type === 'mdxJsxTextElement')).toHaveLength(1);
  });
  it('reads term ids from the glossary file', () => {
    const ids = loadGlossaryIds();
    expect(ids.size).toBeGreaterThan(0);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });
});
