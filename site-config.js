const SITE_URL = (process.env.SITE_URL || 'https://www.characteraibots.com').replace(/\/$/, '');
const LAST_REVIEWED = process.env.CONTENT_REVIEW_DATE || new Date().toISOString().slice(0, 10);

function toSchemaDateTime(value) {
  if (!value) return toSchemaDateTime(LAST_REVIEWED);
  if (String(value).includes('T')) return String(value);
  return `${value}T00:00:00+08:00`;
}

module.exports = {
  SITE_URL,
  SITE_NAME: 'CharacterAIBots',
  SITE_TAGLINE: 'Independent AI character directory',
  LAST_REVIEWED,
  LAST_REVIEWED_DATETIME: process.env.CONTENT_REVIEW_DATETIME || toSchemaDateTime(LAST_REVIEWED),
  toSchemaDateTime,
  NEWSLETTER_ACTION: process.env.NEWSLETTER_ACTION || '',
  DISCLAIMER: 'CharacterAIBots.com is an independent directory and is not affiliated with, endorsed by, or sponsored by Character.AI or its parent company. All product names, logos, and brands are property of their respective owners.',
};
