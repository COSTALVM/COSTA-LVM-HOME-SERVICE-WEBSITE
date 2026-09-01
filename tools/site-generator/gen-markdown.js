/* Markdown twins for the agent content negotiation in .htaccess.
   An agent sending `Accept: text/markdown` is served <page>/index.md instead
   of the HTML. These are generated from the built HTML, not hand-written, so
   they cannot drift from what the site actually says.

   Run after gen-index.js and gen-services.js:
     node gen-markdown.js
*/

const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Users\\felipefreitas_trajet\\Desktop\\COSTA LVM HOME SERVICE';
const SITE = path.join(ROOT, 'site');

const PAGES = ['', 'services', 'estimate', 'privacy', 'terms', 'redirect'];

/* Entities we actually emit. Everything else stays literal — this is a
   converter for our own known output, not a general HTML parser. */
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  nbsp: ' ', mdash: '\u2014', ndash: '\u2013', middot: '\u00b7',
  hellip: '\u2026', copy: '\u00a9', reg: '\u00ae', deg: '\u00b0',
  rsquo: '\u2019', lsquo: '\u2018', ldquo: '\u201c', rdquo: '\u201d',
  eacute: '\u00e9', egrave: '\u00e8', ecirc: '\u00ea',
  aacute: '\u00e1', agrave: '\u00e0', acirc: '\u00e2', atilde: '\u00e3',
  iacute: '\u00ed', oacute: '\u00f3', ocirc: '\u00f4', otilde: '\u00f5',
  uacute: '\u00fa', uuml: '\u00fc', ccedil: '\u00e7', ntilde: '\u00f1',
  times: '\u00d7'
};

/* Numeric entities are decoded generically, so an unmapped accent can never
   leak through as a raw `&eacute;` the way it did on the first run. */
function decode(s) {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, function (match, body) {
    if (body[0] === '#') {
      var hex = body[1] === 'x' || body[1] === 'X';
      var code = parseInt(hex ? body.slice(2) : body.slice(1), hex ? 16 : 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    if (ENTITIES[body] !== undefined) return ENTITIES[body];
    var lower = ENTITIES[body.toLowerCase()];
    if (lower === undefined) return match;
    // &Eacute; -> \u00c9, from the lowercase table.
    return body[0] === body[0].toUpperCase() ? lower.toUpperCase() : lower;
  });
}

function text(html) {
  return decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

function convert(html) {
  // Keep only the document body's main content.
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let body = main ? main[1] : html;

  // Drop everything that carries no meaning in markdown.
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    // Visually hidden helpers are for screen readers, and would read as
    // duplicated words here.
    .replace(/<span class="sr-only"[\s\S]*?<\/span>/gi, '');

  const out = [];
  const seen = new Set();

  // Walk the block-level elements in document order.
  /* The lookahead is load-bearing: without it the `p` alternative matches
     the "p" of `<picture>`, and the block then runs to the first `</p>`,
     swallowing every heading in between. Same trap for `li` vs `<link>`. */
  const blocks = body.match(
    /<(h1|h2|h3|h4|p|li|figcaption|dt|dd|summary)(?=[\s>/])[^>]*>[\s\S]*?<\/\1>/gi
  ) || [];

  for (const block of blocks) {
    const tag = block.match(/^<(\w+)/)[1].toLowerCase();
    let inner = block.replace(/^<\w+[^>]*>/, '').replace(/<\/\w+>$/, '');

    // Links survive as markdown; other inline tags are dropped by text().
    inner = inner.replace(
      /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
      (m, href, label) => {
        const clean = text(label);
        if (!clean) return '';
        return `[${clean}](${href})`;
      }
    );
    inner = inner.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
    inner = inner.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');

    const value = text(inner);
    if (!value) continue;

    // The same phrase can appear in a card and in its aria label.
    const key = tag + '|' + value;
    if (seen.has(key)) continue;
    seen.add(key);

    if (tag === 'h1') out.push('# ' + value);
    else if (tag === 'h2') out.push('## ' + value);
    else if (tag === 'h3' || tag === 'summary') out.push('### ' + value);
    else if (tag === 'h4') out.push('#### ' + value);
    else if (tag === 'li') out.push('- ' + value);
    else if (tag === 'figcaption') out.push('*' + value + '*');
    else out.push(value);
  }

  // Collapse the runs of list items into tight blocks, keep one blank line
  // between everything else.
  let md = '';
  for (let i = 0; i < out.length; i++) {
    const line = out[i];
    const prev = out[i - 1];
    const bothList = prev && prev.startsWith('- ') && line.startsWith('- ');
    md += (i === 0 ? '' : bothList ? '\n' : '\n\n') + line;
  }
  return md.trim() + '\n';
}

let written = 0;
for (const page of PAGES) {
  const htmlPath = path.join(SITE, page, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.warn('skipped (no html): /' + page);
    continue;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');

  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/i) || [, ''])[1];
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/i) || [, ''])[1];

  const header =
    '---\n' +
    'title: ' + decode(title).trim() + '\n' +
    'description: ' + decode(desc).trim() + '\n' +
    (canonical ? 'canonical: ' + canonical + '\n' : '') +
    'generated: ' + new Date().toISOString().slice(0, 10) + '\n' +
    '---\n\n';

  const md = header + convert(html);
  fs.writeFileSync(path.join(SITE, page, 'index.md'), md, 'utf8');
  written++;
  console.log(
    '/' + (page || '') + ' -> index.md  ' + (md.length / 1024).toFixed(1) + ' KB'
  );
}

console.log(written + ' markdown twins written.');
