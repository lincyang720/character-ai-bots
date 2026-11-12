#!/usr/bin/env node

const fs = require('fs');
const { createHash } = require('crypto');
const path = require('path');
const { SITE_URL } = require('./site-config');

const styleVersion = createHash('sha256').update(fs.readFileSync(path.join(__dirname, 'style.css'))).digest('hex').slice(0, 12);
const LEGACY_ORIGIN = 'https://www.characteraibots.com';
const roots = ['index.html', 'ai-roleplay-characters.html', 'is-character-ai-down.html', 'search.html', 'quiz.html', 'submit-character.html', 'about.html', 'contact.html', 'privacy.html', 'terms.html', 'disclaimer.html', '404.html', 'sitemap.xml', 'robots.txt', 'ads.txt', 'characters', 'type', 'blog'];

const footerLinks = [
  ['/contact', 'Contact'],
  ['/privacy', 'Privacy Policy'],
  ['/disclaimer', 'Disclaimer']
];

function update(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    fs.readdirSync(target).forEach(name => update(path.join(target, name)));
    return;
  }
  if (!/\.(?:html|xml|txt)$/.test(target)) return;
  const original = fs.readFileSync(target, 'utf8');
  let configured = original.replaceAll(LEGACY_ORIGIN, SITE_URL);
  if (target.endsWith('.html') && configured.includes('class="breadcrumb"')) {
    configured = configured.replace(/(href="(?:\/|\.\.\/)?style\.css)(?:\?v=[a-f0-9]+)?"/g, `$1?v=${styleVersion}"`);
  }
  if (target.endsWith('.html')) {
    configured = configured.replace(/<footer\b[^>]*>[\s\S]*?^([ \t]*)<\/footer>/gim, (footer, indent) => {
      const missing = footerLinks.filter(([url]) => !footer.includes(`href="${url}"`) && !footer.includes(`href='${url}'`));
      if (missing.length === 0) return footer;
      const links = missing.map(([url, label]) => `<a href="${url}">${label}</a>`).join(' · ');
      return footer.replace(/^([ \t]*)<\/footer>/im, `${indent}    <p>${links}</p>\n${indent}</footer>`);
    });
  }
  if (configured !== original) fs.writeFileSync(target, configured);
}

roots.forEach(root => update(path.join(__dirname, root)));
console.log(`Applied canonical site origin: ${SITE_URL}`);
