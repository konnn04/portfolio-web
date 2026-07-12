/** Portfolio projects (pinned + newest ordering handled in lib/projects.ts). */
import type { Project } from "@/types/project";

export const projects: Project[] = [
  {
    "title": "Qiqi Studio",
    "slug": "qiqi-studio",
    "github": "https://github.com/konnn04/qiqi-studio",
    "website": "",
    "images": [
      "public/projects/qiqi-studio-001.png"
    ],
    "description": {
      "en": "A full-featured image delivery platform for photographers and studios. Clients can browse, select, and download optimized photos with minimal quality loss. Integrated with Google Drive via background workers for seamless image sync, compression, and delivery. Features real-time notifications, a lightweight gallery viewer, and a polished landing page.",
      "vi": "Nền tảng giao ảnh chuyên nghiệp dành cho studio và nhiếp ảnh gia. Khách hàng có thể duyệt, chọn và tải ảnh đã được tối ưu — giữ nguyên chất lượng nhưng dung lượng nhẹ nhất có thể. Tích hợp Google Drive với worker nền tự động đồng bộ, nén và phân phối ảnh. Hỗ trợ thông báo real-time, xem ảnh nhẹ nhàng trên trình duyệt, và landing page ấn tượng."
    },
    "langs": [
      "typescript"
    ],
    "contributors": [
      "konnn04"
    ],
    "tags": [
      "nextjs",
      "nestjs",
      "redis",
      "postgresql",
      "landing-page",
      "image-optimization",
      "google-drive"
    ],
    "joinAt": "2026-05-06",
    "pinned": true
  }, {
    "title": "Foxy Exam",
    "slug": "foxy-exam",
    "github": "https://github.com/konnn04/foxy-exam",
    "website": "",
    "images": [
      "public/projects/foxy-exam-001.png",
      "public/projects/foxy-exam-002.png",
      "public/projects/foxy-exam-003.png"
    ],
    "description": {
      "en": "Thesis project: Foxy Exam, a smart exam monitoring system utilizing a hybrid architecture with an Electron desktop client and microservices backend. Features multi-layer OS lockdown, multi-channel camera monitoring, AI-powered anomaly detection, and Zero-Trust architecture.",
      "vi": "Khóa luận thiết kế Foxy Exam, hệ thống giám sát thi cử thông minh dựa trên kiến trúc lai kết hợp ứng dụng desktop (Electron) và hệ sinh thái microservices. Tích hợp chống gian lận đa tầng (Lockdown OS), giám sát đa kênh, công nghệ AI phát hiện gian lận và kiến trúc Zero Trust."
    },
    "langs": [
      "typescript",
      "python",
      "javascript",
      "golang",
      "php"
    ],
    "contributors": [
      "konnn04"
    ],
    "tags": [
      "microservices",
      "electron",
      "typescript",
      "laravel",
      "react",
      "python",
      "adaface",
      "yolov26"
    ],
    "joinAt": "2025-12-01",
    "pinned": true
  },
  {
    "title": "Discord bot",
    "slug": "discord-bot",
    "github": "https://github.com/mpc-ou/discord-bot",
    "website": "https://discord.mpclub.dev/",
    "images": [
      "public/projects/discord-bot-001.png",
      "public/projects/discord-bot-002.png",
      "public/projects/discord-bot-003.png"
    ],
    "description": {
      "en": "A powerful, full-featured Discord bot with a modern web dashboard. Built for MPC Club with stability, performance, and ease of use in mind.",
      "vi": "Một bot Discord mạnh mẽ, đầy đủ tính năng với giao diện quản trị web hiện đại. Được xây dựng cho MPC Club với sự ổn định, hiệu suất và dễ sử dụng."
    },
    "langs": [
      "typescript"
    ],
    "contributors": [
      "konnn04"
    ],
    "tags": [
      "discord.js",
      "react",
      "typescript",
      "postgresql",
      "fastify",
      "shadcn/ui"
    ],
    "joinAt": "2025-01-09",
    "pinned": true
  },
  {
    "title": "MPClub Portfolio Website",
    "slug": "mpclub-portfolio-website",
    "github": "https://github.com/mpc-ou/mpc-web",
    "website": "https://mpclub.dev/",
    "images": [
      "public/projects/mpc-web-001.png",
      "public/projects/mpc-web-002.png",
      "public/projects/mpc-web-003.png",
      "public/projects/mpc-web-004.png"
    ],
    "description": {
      "en": "A website for MPC Club, using for introducing MPC Club.",
      "vi": "Một website cho MPC Club, dùng để giới thiệu về MPC Club."
    },
    "langs": [
      "typescript"
    ],
    "contributors": [
      "konnn04",
      "holedev"
    ],
    "tags": [
      "next.js",
      "typescript",
      "supabase",
      "shadcn/ui"
    ],
    "joinAt": "2025-12-05",
    "pinned": false
  },
  {
    "title": "MPC Extension",
    "slug": "mpc-extension",
    "github": "https://github.com/mpc-ou/mpc-extension",
    "website": "https://j2c.cc/mpc-extension/",
    "images": [
      "public/projects/mpc-extension-001.png",
      "public/projects/mpc-extension-002.png"
    ],
    "description": {
      "en": "An extension for browser, serving for HCMOU students to support GPA calculation and other learning tools",
      "vi": "Một extension cho trình duyệt, phục vụ cho sinh viên HCMOU hỗ trợ tính điểm GPA và các công cụ học tập khác"
    },
    "langs": [
      "typescript"
    ],
    "contributors": [
      "konnn04",
      "holedev",
      "antiennn",
      "quythanh"
    ],
    "tags": [
      "wxt",
      "typescript"
    ],
    "joinAt": "2024-03-27",
    "pinned": true
  },
  {
    "title": "Music fetcher wrapper",
    "slug": "music-fetcher-wrapper",
    "github": "https://github.com/Riikon-Team/rikn-music-fetcher-wrapper",
    "website": "https://www.npmjs.com/package/rikn-music-fetcher",
    "images": [
      "public/projects/rikn-music-fetcher-001.jpeg",
    ],
    "description": {
      "en": "Một thư viện tổng hợp các thư viện khác phục vụ cho viêc tải nhạc từ Du-túp và Sờ-Pọt-ti-phai, hỗ trợ các định dạng và lời bài hát, dùng cho Bot discord",
      "vi": "Một thư viện tổng hợp các thư viện khác phục vụ cho viêc tải nhạc từ Du-túp và Sờ-Pọt-ti-phai, hỗ trợ các định dạng và lời bài hát, dùng cho Bot discord"
    },
    "langs": [
      "typescript"
    ],
    "contributors": [
      "konnn04"
    ],
    "tags": [
      "typescript",
      "npm"
    ],
    "joinAt": "2025-10-03"
  },
  {
    "title": "EngTalk AI System",
    "slug": "engtalk-ai-system",
    "github": "https://github.com/konnn04/engtalk-ai-system",
    "website": "",
    "description": {
      "en": "A project serving for Research of Science 2024 (University level), developing an application for learning spoken English integrated with AI (only supports speaking)",
      "vi": "Một dự án phục vụ Nghiên cứu khoa học 2024 cấp trường, phát triển ứng dụng học tiếng anh giao tiếp tích hợp AI (chỉ hỗ trợ speaking)"
    },
    "langs": [
      "typescript",
      "python"
    ],
    "contributors": [
      "konnn04",
      "leviethaiquan"
    ],
    "tags": [
      "python",
      "typescript",
      "django",
      "flask",
      "fastapi",
      "reactnative"
    ],
    "joinAt": "2025-02-07"
  },
  {
    "title": "Dev Tab",
    "slug": "dev-tab",
    "github": "https://github.com/Riikon-Team/DevTab",
    "website": "",
    "description": {
      "en": "An extension for browser customizing newtab, serving for developers to support productivity",
      "vi": "Một extension cho trình duyệt tùy chỉnh lại newtab"
    },
    "langs": [
      "typescript"
    ],
    "contributors": [
      "konnn04",
      "Riiichan04"
    ],
    "tags": [
      "typescript",
      "wxt",
      "react"
    ],
    "joinAt": "2025-02-23"
  },
  {
    "title": "Rent House App",
    "slug": "rent-house-app",
    "github": "https://github.com/konnn04/rent-house-app",
    "website": "",
    "description": {
      "en": "A mobile application for searching and renting houses (for Modern Programming course)",
      "vi": "Một ứng dụng mobile phục vụ cho việc tìm kiếm và cho thuê nhà (cho môn Lập trình hiện đại)"
    },
    "langs": [
      "python",
      "javascript"
    ],
    "contributors": [
      "konnn04",
      "TriMinh07"
    ],
    "tags": [
      "python",
      "javascript",
      "django",
      "reactnative"
    ],
    "joinAt": "2025-03-21"
  }
];

export default projects;
