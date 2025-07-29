# Secure the Bag Hustle Planner

A privacy-first planner for exotic dancers to manage shifts, maximize income, and scale careers.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run locally:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Environment Variables
- Create a `.env.local` file for secrets and API keys.
- Example:
  ```env
  NEXT_PUBLIC_API_URL=https://api.example.com
  SECRET_KEY=your-secret
  ```

## Production Readiness Checklist
- [x] Custom 404 and 500 pages
- [x] SEO meta tags and Open Graph
- [x] Security headers
- [x] Linting and formatting
- [x] PWA manifest, robots.txt, sitemap.xml
- [x] CI/CD workflow (see `.github/workflows/ci.yml`)
- [x] Jest test setup
- [x] Analytics integration (see `layout.tsx`)

## Deployment
- Recommended: [Vercel](https://vercel.com/) or any Node.js host

## License
MIT
