# 🚀 Portfolio Web

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Lanyard](https://img.shields.io/badge/Discord_Presence-5865F2?style=for-the-badge&logo=discord&logoColor=white)

A high-performance, aesthetically premium portfolio website built with **Next.js 15**, **TypeScript**, and **Framer Motion**. Featuring a retro cyberpunk aesthetic, real-time Discord activity tracking, and a robust multi-language blog engine.

## ✨ Features

### 🌌 Premium Visual Experience

- **Retro Cyberpunk Grid**: A vibrant, animated neon grid with floating parallax developer icons.
- **Advanced Parallax**: Smooth, multi-layered parallax effects on hero text and background elements.
- **Scroll Reveal**: Intelligent entrance animations for all sections as users scroll.
- **Responsive Navigation**: Adaptive header for desktop and a sleek **Mobile Dock** for handheld devices.

### 🎮 Discord Live Presence

- Real-time activity tracking powered by **Lanyard API**.
- **Interactive Bubbles**: Activity thumbnails that expand on hover to show detailed status (Spotify, Games, Studio).
- **Live Timers**: Elapsed time tracking for current activities.
- **Direct Actions**: Quick links to Spotify tracks or activity-specific buttons.

### 📝 Modern Blog System

- **Markdown Core**: High-performance rendering of Markdown content.
- **Smart Filtering**: Categorization, real-time search, and sorting (Latest/Oldest).
- **SEO Ready**: Per-page dynamic metadata, OpenGraph tags, and Twitter Cards.
- **Sticky Tools**: Social share sticky bar and optimized reading layout.

### 📁 Project Showcase

- **Dynamic Grid**: Card-based presentation of personal and professional work.
- **Detail Modals (7xl)**: Immersive detail views with image carousels.
- **Pro Image Viewing**: High-quality lightboxes using `react-medium-image-zoom`.

### 🌐 Core Infrastructure

- **Internationalization (i18n)**: Full support for English and Vietnamese.
- **SEO Optimized**: Auto-generated `sitemap.xml` and `robots.txt`.
- **Modern Stack**: Built with Radix UI, Lucide Icons, and Embla Carousel.

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20 or higher
- **pnpm** (recommended), npm, or yarn

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/konnn04/portfolio-web.git
   cd portfolio-web
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   The project reads personal information from `/configs/my-info.json`. Ensure your Discord ID is correctly configured for the Lanyard integration.

4. **Launch Development Server**

   ```bash
   pnpm dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## 🛠️ Project Structure

```text
portfolio-web/
├── app/                  # Next.js App Router
│   ├── (main)/           # Primary page layouts and routes
│   ├── api/              # API routes (search, activity)
│   ├── sitemap.ts        # Dynamic sitemap generator
│   └── robots.ts         # SEO configuration
├── components/           # React components
│   ├── blogs/            # Blog implementation details
│   ├── projects/         # Project cards and modals
│   ├── sections/         # Page sections (Hero, Retro Grid)
│   ├── ui/               # Base Shadcn/Radix components
│   └── providers/        # i18n and Global contexts
├── configs/              # Data & Messages
│   ├── messages/         # i18n JSON (en, vi)
│   ├── my-projects.json  # Portfolio data
│   └── my-info.json      # Personal profile configuration
├── lib/                  # Core logic & Utility functions
├── types/                # TypeScript definitions
└── public/               # Static assets & images
```

## 📝 Key Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build production bundle
pnpm start            # Start production server
pnpm lint             # Run ESLint validation
pnpm run precommit    # Manual post-validation script
```

## 🔐 Configuration

Most of the content is data-driven. You can customize the site by editing:

- `configs/my-info.json`: Personal details, socials, and avatar.
- `configs/my-projects.json`: Projects list and image paths.
- `configs/messages/`: Translation strings for all UI elements.

---

Made with ❤️ by [Konnn04](https://github.com/konnn04)
