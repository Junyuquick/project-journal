// Internal links carry the site's base path (the site lives in a subfolder on GitHub Pages).
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** url('/glossary') → '/project-journal/glossary'; url('/') → '/project-journal/'. */
export const url = (path: string) => base + path;

/** The current path without the base, for "which page am I on" checks. */
export const pagePath = (pathname: string) => (pathname.startsWith(base) ? pathname.slice(base.length) : pathname) || '/';
