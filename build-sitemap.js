#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取角色数据
const charactersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'characters.json'), 'utf8')
);

const baseUrl = 'https://www.characteraibots.com';
const today = new Date().toISOString().split('T')[0];

// Collect type pages
const typeDir = path.join(__dirname, 'type');
const typePages = fs.existsSync(typeDir)
  ? fs.readdirSync(typeDir).filter(f => f.endsWith('.html'))
  : [];

// Collect blog posts
const blogDir = path.join(__dirname, 'blog');
const blogPages = fs.existsSync(blogDir)
  ? fs.readdirSync(blogDir).filter(f => f.endsWith('.html'))
  : [];

// 生成 sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/quiz</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${typePages.map(f => `  <url>
    <loc>${baseUrl}/type/${f.replace('.html', '')}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
${blogPages.map(f => `  <url>
    <loc>${baseUrl}/blog/${f === 'index.html' ? '' : f.replace('.html', '')}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${f === 'index.html' ? '0.8' : '0.7'}</priority>
  </url>`).join('\n')}
${charactersData.map(char => `  <url>
    <loc>${baseUrl}/characters/${char.id}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
const totalUrls = 3 + typePages.length + blogPages.length + charactersData.length;
console.log(`✅ Generated sitemap.xml with ${totalUrls} URLs`);
console.log(`   - 1 quiz page`);
console.log(`   - ${typePages.length} type pages`);
console.log(`   - ${blogPages.length} blog pages`);
console.log(`   - ${charactersData.length} character pages`);
console.log(`📅 Last modified: ${today}`);
