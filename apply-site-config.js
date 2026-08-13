#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { SITE_URL } = require('./site-config');

const LEGACY_ORIGIN = 'https://www.characteraibots.com';
const roots = ['index.html', 'ai-roleplay-characters.html', 'is-character-ai-down.html', 'search.html', 'quiz.html', 'about.html', 'contact.html', 'privacy.html', 'terms.html', '404.html', 'sitemap.xml', 'robots.txt', 'characters', 'type', 'blog'];

function update(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    fs.readdirSync(target).forEach(name => update(path.join(target, name)));
    return;
  }
  if (!/\.(?:html|xml|txt)$/.test(target)) return;
  const original = fs.readFileSync(target, 'utf8');
  const configured = original.replaceAll(LEGACY_ORIGIN, SITE_URL);
  if (configured !== original) fs.writeFileSync(target, configured);
}

roots.forEach(root => update(path.join(__dirname, root)));
console.log(`Applied canonical site origin: ${SITE_URL}`);
