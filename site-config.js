const SITE_URL = (process.env.SITE_URL || 'https://www.characteraibots.com').replace(/\/$/, '');

module.exports = {
  SITE_URL,
  SITE_NAME: 'AI Character Guide',
  SITE_TAGLINE: 'Independent AI character directory',
  LAST_REVIEWED: process.env.CONTENT_REVIEW_DATE || new Date().toISOString().slice(0, 10),
  NEWSLETTER_ACTION: process.env.NEWSLETTER_ACTION || '',
  DISCLAIMER: 'CharacterAIBots.com is an independent directory and is not affiliated with, endorsed by, or sponsored by Character.AI or its parent company. All product names, logos, and brands are property of their respective owners.',
};
