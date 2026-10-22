# ORIGIN Conferences – Homepage

React + Vite + TypeScript + Tailwind CSS + Framer Motion + Lucide.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```
Deploy `dist/` to Vercel/Netlify (build: `npm run build`, output: `dist`).

## Edit content (all in `src/data/content.ts`)
- `site`: contact details, social links, CTA destinations, `newsletterEndpoint`
- `heroSlides`: replace sample videos with licensed/self-hosted files, e.g. put MP4s in `public/videos/` and use `/videos/hall.mp4`. Keep them under ~5 MB, 720p–1080p, no audio needed.
- `stats`, `conferences`, `testimonials`, `services`, `gallery`, `events`: all placeholder/demo data. Replace before launch.

## Notes
- Hero uses poster images on mobile and for reduced-motion users; video plays on larger screens.
- Newsletter makes no fake success: with no endpoint it tells the user nothing was saved.
- Images come from Unsplash and sample videos from Google's public sample bucket for development only. Swap for licensed media.
