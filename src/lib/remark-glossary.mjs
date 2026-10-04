// Turns Markdown links like [FTP](glossary:ftp) into term buttons that open a definition popover.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { visit, SKIP } from 'unist-util-visit';

const GLOSSARY = fileURLToPath(new URL('../content/glossary.yaml', import.meta.url));

export function loadGlossaryIds(path = GLOSSARY) {
  const terms = parse(readFileSync(path, 'utf8')) ?? [];
  return new Set(terms.map((t) => t.id));
}

const attr = (name, value) => ({ type: 'mdxJsxAttribute', name, value });

export function remarkGlossary({ terms } = { terms: new Set() }) {
  return (tree, file) => {
    visit(tree, 'link', (node, index, parent) => {
      if (!node.url.startsWith('glossary:')) return;
      const id = node.url.slice('glossary:'.length);
      if (!terms.has(id)) {
        const where = file?.path ? ` in ${file.path}` : '';
        throw new Error(`Unknown glossary term: ${id}${where}`);
      }
      parent.children[index] = {
        type: 'mdxJsxTextElement',
        name: 'button',
        attributes: [
          attr('type', 'button'),
          attr('class', 'term'),
          attr('data-term', id),
          attr('aria-haspopup', 'dialog'),
          attr('aria-expanded', 'false'),
        ],
        children: node.children,
      };
      return SKIP;
    });
  };
}
