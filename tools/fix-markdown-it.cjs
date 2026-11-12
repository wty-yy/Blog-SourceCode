'use strict';

// markdown-it 13 uses Node's deprecated built-in punycode. Keep the renderer
// compatible while using the maintained standalone package instead.
const fs = require('node:fs');
const { createRequire } = require('node:module');
const rendererRequire = createRequire(require.resolve('hexo-renderer-markdown-it-plus'));
const file = rendererRequire.resolve('markdown-it/lib/index.js');
const source = fs.readFileSync(file, 'utf8');
const before = "require('punycode')";
const after = "require('punycode/')";
if (source.includes(before)) {
  fs.writeFileSync(file, source.replace(before, after));
} else if (!source.includes(after)) {
  throw new Error('markdown-it changed; review tools/fix-markdown-it.cjs');
}
