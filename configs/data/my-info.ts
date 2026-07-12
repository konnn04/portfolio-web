/**
 * Portfolio identity + personal data.
 * White-label the whole site by editing the two objects below.
 * Types are defined in `types/my-info.ts` for autocomplete & validation.
 *   - `site`    : identity, feature flags, GitHub/Discord handles
 *   - `profile` : bio, socials, education, experience, skills, certificates, "more"
 */

import type { Site, Profile, MyInfo } from "@/types/my-info";

export const site: Site = {
  "name": "Konnn04",
  "url": "https://konnn04.dev",
  "description": "Welcome to my personal portfolio website! I'm Konnn04, a passionate developer specializing in web development, software engineering, and open-source contributions.",
  "author": "Konnn04",
  "githubUsername": "konnn04",
  "githubExcludeLangs": [
    "HTML",
    "CSS",
    "SCSS",
    "Less",
    "Dockerfile",
    "Makefile",
    "Shell"
  ],
  "discordUserId": "732157441889927239",
  "repo": "https://github.com/konnn04/portfolio-web",
  "features": {
    "game": true,
    "easterEgg": false,
    "discord": true,
    "github": true
  }
};

export const profile: Profile = {
  "firstName": "Trieu",
  "middleName": "Thanh",
  "lastName": "Nguyen",
  "fullName": {
    "vi": "Nguyễn Thanh Triều",
    "en": "Thanh Trieu Nguyen"
  },
  "role": "Fullstack Engineer",
  "country": "Vietnam",
  "city": "Ho Chi Minh",
  "address": "Xuan Hoa Ward",
  "discordDataUrl": "https://api.lanyard.rest/v1/users/732157441889927239",
  "bio": {
    "vi": "Là một lập trình viên chuyên Fullstack, tôi đang học hỏi thêm từng ngày...",
    "en": "As a Fullstack developer, I am constantly learning and growing..."
  },
  "slogan": {
    "vi": "Nghĩ đơn giản, nhưng muốn làm việc lớn.",
    "en": "Think simple, but aim to do big things."
  },
  "socials": {
    "github": {
      "href": "https://github.com/konnn04",
      "label": "konnn04"
    },
    "linkedin": {
      "href": "https://www.linkedin.com/in/konnn04/",
      "label": "Trieu Thanh Nguyen"
    },
    "facebook": {
      "href": "https://www.facebook.com/konnn04",
      "label": "konnn04"
    },
    "mail": {
      "href": "mailto:konnn1011.work@gmail.com",
      "label": "konnn1011.work@gmail.com"
    },
    "youtube": {
      "href": "https://www.youtube.com/@konnn04",
      "label": "konnn04"
    }
  },
  "schools": [
    {
      "name": {
        "vi": "Trường Đại học Mở TP.HCM",
        "en": "Ho Chi Minh City Open University"
      },
      "majors": [
        {
          "name": {
            "vi": "Công nghệ thông tin",
            "en": "Information Technology"
          },
          "gpa": "3.22",
          "startDate": "2022-09",
          "endDate": ""
        }
      ],
      "activities": [
        {
          "name": {
            "vi": "Chủ nhiệm CLB học thuật cấp khoa - MPClub",
            "en": "Head of Faculty Academic Club - MPClub"
          },
          "startDate": "2023-02",
          "endDate": "2024-03",
          "description": {
            "vi": "Chủ nhiệm CLB MPClub. Quản lý tổ chức hoạt động học thuật cấp khoa và các cuộc thi",
            "en": "Head of MPClub. Managed faculty-level academic activities and competitions"
          },
          "links": [
            "https://mpclub.dev"
          ]
        },
        {
          "name": {
            "vi": "Nghiên cứu Khoa học - Giải khuyến khích cấp trường 2025-2026",
            "en": "Scientific Research - Consolation Prize at university level 2025-2026"
          },
          "startDate": "2025-04",
          "endDate": "2026-03",
          "description": {
            "vi": "Đề tài: Hệ thống giám sát thi cử trực tuyến thông minh",
            "en": "Topic: Smart online exam monitoring system"
          }
        }
      ]
    }
  ],
  "publish": [],
  "experiences": [
    {
      "type": "work",
      "company": {
        "vi": "Công ty TNHH Pizitech",
        "en": "Pizitech Co., Ltd."
      },
      "position": {
        "vi": "Thực tập sinh",
        "en": "Fullstack Intern"
      },
      "startDate": "2025-10",
      "endDate": "2026-02",
      "description": {
        "vi": "- Xây dựng hệ thống ERP cho SMEs với stack Laravel\n- Tích hợp Chatbot & tự động hóa quy trình kinh doanh",
        "en": "- Built an ERP system for SMEs using Laravel\n- Integrated Chatbot & business process automation"
      },
      "links": [
        "https://pizitech.com"
      ]
    },
    {
      "type": "work",
      "company": {
        "vi": "Test IO",
        "en": "Test IO"
      },
      "position": {
        "vi": "Freelance Tester",
        "en": "Freelance Tester"
      },
      "startDate": "2025-12",
      "description": {
        "vi": "- Kiểm thử phần mềm freelance với hơn 100 bug được chấp nhận",
        "en": "- Freelance software testing with over 100 accepted bugs"
      },
      "links": [
        "https://tester.test.io/profile_pages/thanh_trieu_nguyen"
      ]
    }
  ],
  "achievements": [],
  "skills": {
    "lang": [
      "TypeScript",
      "Python",
      "PHP",
      "Golang"
    ],
    "frameworks": [
      "Next.js",
      "React",
      "React Native",
      "Fastify",
      "Django",
      "Flask",
      "Laravel",
      "Gin"
    ],
    "databases": [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis"
    ],
    "tools": [
      "Docker",
      "Git",
      "Nginx",
      "Apache",
      "Supabase",
      "Cloudflare"
    ]
  },
  "languages": [
    {
      "name": {
        "vi": "Tiếng Việt",
        "en": "Vietnamese"
      },
      "level": {
        "vi": "Bản ngữ",
        "en": "Native"
      }
    },
    {
      "name": {
        "vi": "Tiếng Anh",
        "en": "English"
      },
      "level": {
        "vi": "B1 (Intermediate)",
        "en": "B1 (Intermediate)"
      }
    }
  ],
  "certificates": [
    {
      "name": {
        "vi": "Chứng chỉ Tiếng Anh B1 VSTEP",
        "en": "VSTEP English Certificate - B1"
      },
      "organization": {
        "vi": "Trường Đại học Mở TP.HCM",
        "en": "Ho Chi Minh City Open University"
      },
      "issueDate": "2026-04"
    }
  ],
  "donate": [],
  "more": {
    "games": [
      "Elden Ring",
      "Minecraft",
      "Counter-Strike 2",
      "Hades",
      "Hollow Knight"
    ],
    "hobbies": {
      "vi": [
        "Chơi guitar",
        "Cà phê specialty",
        "Đọc truyện sci-fi",
        "Chụp ảnh film",
        "Vọc phần cứng"
      ],
      "en": [
        "Playing guitar",
        "Specialty coffee",
        "Reading sci-fi",
        "Film photography",
        "Tinkering with hardware"
      ]
    },
    "music": [
      {
        "title": "lofi hip hop — beats to code to",
        "url": "https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM"
      },
      {
        "title": "Deep Focus",
        "url": "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ"
      }
    ],
    "secretProjects": [
      {
        "name": "Nyx — self-hosted note engine",
        "description": {
          "vi": "Dự án cá nhân chưa công bố: một công cụ ghi chú markdown chạy nền, đồng bộ end-to-end.",
          "en": "An unreleased personal project: a background markdown note engine with end-to-end sync."
        },
        "url": "https://github.com/konnn04"
      },
      {
        "name": "Pixel oven",
        "description": {
          "vi": "Trình tạo pixel-art từ ảnh, đang thử nghiệm shader WebGL.",
          "en": "An image-to-pixel-art generator, experimenting with WebGL shaders."
        },
        "url": "https://github.com/konnn04"
      }
    ]
  }
};

const myInfo: MyInfo = { site, profile };
export default myInfo;
