# FE Sharing Vision Test

Single Page Application dashboard for article management built with Vue 3, Vite, Vue Router, Tailwind CSS, and Axios.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=https://your-api-base-url
```

## Views

- Dashboard (`/`) - Published, Drafts, and Trashed tabs with article table actions
- Add New (`/add-new`) - Create article with Publish or Draft actions
- Edit Article (`/edit/:id`) - Edit existing article by ID
- Preview (`/preview`) - Published article feed with pagination (limit/offset)

## Vercel

`vercel.json` is configured to rewrite all routes to `index.html` so Vue Router history mode works in production.
