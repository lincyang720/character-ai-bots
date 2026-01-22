#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取角色数据
const charactersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'characters.json'), 'utf8')
);

const baseUrl = 'https://characteraibots.com';
const today = new Date().toISOString().split('T')[0];

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
${charactersData.map(char => `  <url>
    <loc>${baseUrl}/characters/${char.id}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

// 写入文件
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);
console.log(`✅ Generated sitemap.xml with ${charactersData.length + 2} URLs`);
console.log(`📍 Base URL: ${baseUrl}`);
console.log(`📅 Last modified: ${today}`);
