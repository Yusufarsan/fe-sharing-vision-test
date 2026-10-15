# Article CMS - Frontend (Sharing Vision Technical Test)

Frontend application for the Article Management System built with **Vue 3**, **Vite**, **Vue Router**, and **Tailwind CSS**. It connects to the Golang REST API backend to manage, edit, trash, and preview articles.

---

## Features

- **Dashboard / All Posts (`/`)**
  - Tabs filter for **Published**, **Drafts**, and **Trashed** with dynamic post count badges.
  - Data table displaying Article Title, Category pill badges, and quick actions.
  - Move to trash (soft delete) functionality with real-time UI refresh.
  - Quick link to the Edit page.
- **Add New Article (`/add`)**
  - Form validation with live character counters:
    - Title: Minimum 20 characters
    - Content: Minimum 200 characters
  - Dual action buttons: **Publish** (sets status to `publish`) and **Save as Draft** (sets status to `draft`).
  - Error alert displaying validation messages returned from the backend.
- **Edit Article (`/edit/:id`)**
  - Automatically fetches and populates existing article data.
  - Update and publish or update as draft.
- **Blog Preview (`/preview`)**
  - Public blog feed displaying only published articles.
  - Clean card layouts with formatted publish dates and categories.
  - Built-in pagination controls.

---

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API with `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)

---

## Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- The Backend API server running (by default on `http://localhost:8080`)

---

## Environment Configuration

Create or verify the `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

> **Note:** If your backend runs on a different port or domain (e.g. production deployment on Render), update `VITE_API_BASE_URL` accordingly.

---

## How to Run

### 1. Clone & Enter Project Directory
```bash
git clone <repository-url>
cd fe-sharing-vision-test
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be accessible at:
 **[http://localhost:5173](http://localhost:5173)**

---

## Production Build

To create an optimized production bundle:

```bash
npm run build
```

The production-ready assets will be generated in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## Project Structure

```text
fe-sharing-vision-test/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and styles
│   ├── components/         # Reusable Vue components
│   ├── router/
│   │   └── index.js        # Vue Router configuration
│   ├── services/
│   │   └── api.js          # Axios instance configured with base URL
│   ├── views/              # Page components
│   │   ├── Dashboard.vue   # All Posts with tabs (Published, Drafts, Trashed)
│   │   ├── AddArticle.vue  # New article creation form
│   │   ├── EditArticle.vue # Edit article form
│   │   └── Preview.vue     # Public preview feed with pagination
│   ├── App.vue             # Main application layout & navbar
│   ├── main.js             # Application entry point
│   └── style.css           # Global stylesheet & Tailwind directives
├── .env                    # Environment variables
├── index.html              # HTML template
├── package.json            # Project dependencies & scripts
├── postcss.config.js       # PostCSS config for Tailwind
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```
