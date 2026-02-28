#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const quiz = JSON.parse(fs.readFileSync(path.join(__dirname, 'quiz-data', 'quiz.json'), 'utf8'));
const characters = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'characters-enriched.json'), 'utf8'));

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Build character lookup
const charMap = {};
characters.forEach(c => { charMap[c.id] = c; });

// Generate questions HTML
function buildQuestionsHtml() {
  return quiz.questions.map((q, i) => `
    <div class="quiz-question${i === 0 ? ' active' : ''}" data-question="${i}">
      <div class="quiz-progress">Question ${i + 1} of ${quiz.questions.length}</div>
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width: ${((i + 1) / quiz.questions.length * 100).toFixed(0)}%"></div></div>
      <h2 class="quiz-question-text">${escapeHtml(q.question)}</h2>
      <div class="quiz-options">
        ${q.options.map((opt, j) => `
        <button class="quiz-option" data-traits='${JSON.stringify(opt.traits)}' onclick="selectAnswer(this)">
          ${escapeHtml(opt.text)}
        </button>`).join('')}
      </div>
    </div>`).join('\n');
}

// Generate results HTML (hidden, revealed by JS)
function buildResultsHtml() {
  return Object.entries(quiz.results).map(([key, result]) => {
    const matchedChars = result.characterIds
      .map(id => charMap[id])
      .filter(Boolean)
      .slice(0, 3);

    const charCards = matchedChars.map(c => `
      <a href="/characters/${c.id}" class="quiz-char-card">
        <div class="quiz-char-emoji">${c.image || '🤖'}</div>
        <div class="quiz-char-name">${escapeHtml(c.name)}</div>
        <div class="quiz-char-type">${escapeHtml(c.type)}</div>
      </a>`).join('');

    return `
    <div class="quiz-result" data-result="${key}" style="display:none">
      <div class="quiz-result-emoji">${result.emoji}</div>
      <h2 class="quiz-result-title">You are: ${escapeHtml(result.title)}</h2>
      <p class="quiz-result-desc">${escapeHtml(result.description)}</p>
      <p class="quiz-result-tip">💡 ${escapeHtml(result.tip)}</p>
      <h3>Your Top Character Matches</h3>
      <div class="quiz-char-grid">${charCards}</div>
      <div class="quiz-actions">
        <button class="quiz-restart" onclick="restartQuiz()">🔄 Take Quiz Again</button>
        <a href="/" class="quiz-browse">Browse All Characters →</a>
      </div>
    </div>`;
  }).join('\n');
}

const quizJs = `
<script>
const answers = [];
const totalQuestions = ${quiz.questions.length};

function selectAnswer(btn) {
  const traits = JSON.parse(btn.dataset.traits);
  const questionEl = btn.closest('.quiz-question');
  const qIndex = parseInt(questionEl.dataset.question);

  // Visual feedback
  questionEl.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  answers[qIndex] = traits;

  // Auto-advance after short delay
  setTimeout(() => {
    if (qIndex < totalQuestions - 1) {
      questionEl.classList.remove('active');
      document.querySelector('[data-question="' + (qIndex + 1) + '"]').classList.add('active');
    } else {
      showResult();
    }
  }, 400);
}

function showResult() {
  // Tally traits
  const traitCount = {};
  answers.flat().forEach(t => { traitCount[t] = (traitCount[t] || 0) + 1; });

  // Find dominant trait
  const sorted = Object.entries(traitCount).sort((a, b) => b[1] - a[1]);
  const topTrait = sorted[0][0];

  // Map traits to result keys
  const traitToResult = {
    dark: 'dark', romantic: 'romantic', adventurous: 'adventurous',
    intellectual: 'intellectual', charismatic: 'charismatic',
    wholesome: 'wholesome', passionate: 'passionate',
    heroic: 'heroic', mysterious: 'mysterious'
  };

  const resultKey = traitToResult[topTrait] || 'romantic';

  // Hide questions, show result
  document.querySelector('.quiz-questions').style.display = 'none';
  const resultEl = document.querySelector('[data-result="' + resultKey + '"]');
  if (resultEl) {
    resultEl.style.display = 'block';
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Update URL for sharing
  if (history.replaceState) {
    history.replaceState(null, '', '/quiz?result=' + resultKey);
  }
}

function restartQuiz() {
  answers.length = 0;
  document.querySelectorAll('.quiz-result').forEach(el => el.style.display = 'none');
  document.querySelector('.quiz-questions').style.display = 'block';
  document.querySelectorAll('.quiz-question').forEach((el, i) => {
    el.classList.toggle('active', i === 0);
    el.querySelectorAll('.quiz-option').forEach(b => b.classList.remove('selected'));
  });
  if (history.replaceState) history.replaceState(null, '', '/quiz');
  document.querySelector('.quiz-hero').scrollIntoView({ behavior: 'smooth' });
}

// Check URL for shared result
(function() {
  const params = new URLSearchParams(window.location.search);
  const r = params.get('result');
  if (r) {
    document.querySelector('.quiz-questions').style.display = 'none';
    const el = document.querySelector('[data-result="' + r + '"]');
    if (el) el.style.display = 'block';
  }
})();
</script>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-1JQKX49JMM"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-1JQKX49JMM');
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(quiz.title)} | Character AI Bots</title>
    <meta name="description" content="${escapeHtml(quiz.description)}">
    <meta name="keywords" content="${quiz.keywords}">

    <meta property="og:title" content="${escapeHtml(quiz.title)}">
    <meta property="og:description" content="${escapeHtml(quiz.description)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.characteraibots.com/quiz">

    <link rel="stylesheet" href="/style.css">
    <link rel="canonical" href="https://www.characteraibots.com/quiz">

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Quiz",
      "name": "${escapeHtml(quiz.title)}",
      "description": "${escapeHtml(quiz.description)}",
      "url": "https://www.characteraibots.com/quiz",
      "provider": {
        "@type": "Organization",
        "name": "Character AI Bots",
        "url": "https://www.characteraibots.com"
      }
    }
    </script>
</head>
<body>
    <header>
        <nav class="main-nav">
            <a href="/" class="logo">🤖 Character AI Bots</a>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/search.html">Search</a>
                <a href="/blog">Blog</a>
                <a href="/quiz" class="active">Quiz</a>
            </div>
        </nav>
    </header>

    <main>
    <section class="quiz-hero">
        <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> &rsaquo; <span>Character Quiz</span></nav>
        <div class="quiz-hero-emoji">🎭✨🔮</div>
        <h1>${escapeHtml(quiz.title)}</h1>
        <p class="quiz-hero-sub">Answer 8 quick questions to discover your perfect AI roleplay companion. It only takes 2 minutes!</p>
    </section>

    <section class="quiz-container">
        <div class="quiz-questions">
${buildQuestionsHtml()}
        </div>

${buildResultsHtml()}
    </section>

    <section class="quiz-seo-content">
        <h2>Find Your Perfect AI Character Match</h2>
        <p>Not sure which AI roleplay character to chat with? Our personality quiz matches you with the ideal AI companion based on your preferences, personality traits, and roleplay style.</p>
        <p>Whether you're into dark romance with <a href="/type/vampire">vampire characters</a>, sweet love stories with <a href="/type/romance">romance bots</a>, or epic adventures with <a href="/type/fantasy">fantasy characters</a>, this quiz will point you in the right direction.</p>
        <h3>How Does the AI Character Quiz Work?</h3>
        <p>We analyze your answers across 8 personality dimensions — from your ideal Friday night to your preferred story settings — to determine which of our 9 character archetypes matches you best. Each result comes with personalized character recommendations from our collection of <a href="/">50+ AI roleplay bots</a>.</p>
        <h3>Popular Character Types</h3>
        <p>Our quiz covers all major AI roleplay character types including <a href="/type/yandere">Yandere</a> (obsessive lovers), <a href="/type/tsundere">Tsundere</a> (tough on the outside, sweet inside), intellectual types, adventurers, and more. Learn more about <a href="/blog/how-to-roleplay-with-ai-characters">how to roleplay with AI characters</a> or check out our <a href="/blog/best-ai-chatbot-for-roleplay">guide to the best AI chatbots for roleplay</a>.</p>
    </section>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>Character AI Bots</h3>
                <p>Discover the best AI roleplay characters across all platforms.</p>
            </div>
            <div class="footer-section">
                <h3>Browse by Type</h3>
                <a href="/type/yandere">Yandere</a>
                <a href="/type/tsundere">Tsundere</a>
                <a href="/type/vampire">Vampire</a>
                <a href="/type/fantasy">Fantasy</a>
                <a href="/type/romance">Romance</a>
                <a href="/type/sci-fi">Sci-Fi</a>
            </div>
            <div class="footer-section">
                <h3>Resources</h3>
                <a href="/blog">Blog</a>
                <a href="/quiz">Character Quiz</a>
                <a href="/search.html">Search</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 characteraibots.com - All rights reserved</p>
        </div>
    </footer>

${quizJs}
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'quiz.html'), html);
console.log('✅ Generated quiz.html');
