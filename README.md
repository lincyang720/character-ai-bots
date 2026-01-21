# Character AI Bots

A comprehensive, SEO-optimized directory of 50+ character AI bots for roleplay on Character.AI, JanitorAI, and SpicyChat platforms.

🌐 **Live Site**: [characteraibots.com](https://characteraibots.com)

## Features

- 📚 **50+ Character Profiles** - Diverse AI roleplay characters including yandere, tsundere, vampire, fantasy, and more
- 🔍 **Advanced Search** - Filter by type, difficulty, rating, platform, and tags
- ⚡ **Server-Side Rendering** - Pre-rendered content for optimal SEO performance
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎯 **SEO Optimized** - Complete meta tags, Schema.org structured data, Open Graph, and Twitter Cards
- ♿ **Accessible** - All links include descriptive title attributes

## Project Structure

```
character-ai-bots/
├── index.html              # Homepage with character directory
├── search.html             # Advanced search page
├── characters/             # 49 individual character pages
├── data/
│   └── characters.json     # Character data source
├── js/
│   ├── characters.js       # Character data loading
│   ├── filters.js          # Homepage filtering
│   ├── search.js           # Search functionality
│   └── rating.js           # Rating widget
├── build-index.js          # Build script for homepage
├── build-search.js         # Build script for search page
├── generate-pages.js       # Generate character detail pages
└── style.css               # Global styles
```

## Build Scripts

### Generate All Pages
```bash
# Generate homepage with all character cards
node build-index.js

# Generate search page with top 12 characters
node build-search.js

# Generate all 49 character detail pages
node generate-pages.js
```

### Development Server
```bash
# Start local HTTP server
python3 -m http.server 8000

# Visit http://localhost:8000
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Deploy automatically
4. Configure custom domain: characteraibots.com

### Manual Deployment
Upload all files to your web server. No build process required - all pages are pre-generated.

## SEO Features

- ✅ Optimized meta titles (40-60 characters)
- ✅ Descriptive meta descriptions
- ✅ Schema.org structured data (WebSite, ItemList, CreativeWork)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card metadata
- ✅ Canonical URLs
- ✅ Semantic HTML5 structure
- ✅ FAQ section for featured snippets
- ✅ Title attributes on all links
- ✅ Server-side rendered content

## Character Data Format

Each character in `data/characters.json` includes:

```json
{
  "id": "character-slug",
  "name": "Character Name",
  "displayName": "Display Name",
  "type": "Character Type",
  "category": "Category",
  "difficulty": "Easy|Medium|Hard",
  "popularity": 5.0,
  "rating": 4.8,
  "reviews": 1234,
  "image": "🎭",
  "description": "Character description...",
  "personality": ["trait1", "trait2"],
  "scenarios": ["scenario1", "scenario2"],
  "tags": ["tag1", "tag2"],
  "platforms": {
    "characterai": "https://...",
    "janitorai": "https://...",
    "spicychat": "https://..."
  }
}
```

## Adding New Characters

1. Add character data to `data/characters.json`
2. Run build scripts:
   ```bash
   node build-index.js
   node build-search.js
   node generate-pages.js
   ```
3. Commit and deploy

## Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build**: Node.js scripts for static site generation
- **Deployment**: Vercel / Static hosting
- **SEO**: Schema.org, Open Graph, Twitter Cards

## Performance

- ⚡ Static HTML pages (no runtime rendering)
- 🎯 Pre-rendered character cards
- 📦 Minimal JavaScript dependencies
- 🚀 Fast page loads

## License

For entertainment purposes only. Character AI platforms (Character.AI, JanitorAI, SpicyChat) are property of their respective owners.

## Contributing

This is a curated directory. To suggest characters or improvements, please open an issue.

---

Built with ❤️ for the AI roleplay community
