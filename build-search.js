#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 读取角色数据
const charactersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'characters.json'), 'utf8')
);

// 生成初始角色卡片（前12个最受欢迎的）
function generateInitialCharacterCards(characters) {
  const topCharacters = characters
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 12);

  return topCharacters.map(char => `
                <a href="/characters/${char.id}" class="character-card" title="View ${char.name} - ${char.type} AI Roleplay Bot">
                    <div class="character-icon">${char.image}</div>
                    <h3>${char.name}</h3>
                    <p>${char.description.substring(0, 100)}...</p>
                    <div class="character-footer">
                        <span class="rating">⭐ ${char.rating}</span>
                        <span class="type-badge">${char.type}</span>
                    </div>
                </a>
            `).join('');
}

// 读取现有的 search.html
let searchHTML = fs.readFileSync(path.join(__dirname, 'search.html'), 'utf8');

// 替换空的 results-grid 为预渲染的内容
const initialCards = generateInitialCharacterCards(charactersData);
searchHTML = searchHTML.replace(
  '<div id="results-grid" class="characters-grid">\n                    <!-- Results will be loaded here -->\n                </div>',
  `<div id="results-grid" class="characters-grid">
${initialCards}
                </div>`
);

// 更新 results-count 显示初始数量
searchHTML = searchHTML.replace(
  '<span id="results-count">Loading...</span>',
  `<span id="results-count">Showing 12 of ${charactersData.length} characters</span>`
);

// 写入文件
fs.writeFileSync(path.join(__dirname, 'search.html'), searchHTML);
console.log('✅ Generated search.html with server-side rendered initial results!');
console.log(`📊 Pre-rendered 12 most popular characters out of ${charactersData.length} total`);
