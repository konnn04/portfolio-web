
import type {
  Site,
  Identity,
  Socials,
  School,
  Experience,
  Skills,
  Language,
  Certificate,
  More,
  Profile,
  MyInfo,
} from "@/types/my-info";

export const site: Site = {
  name: "Konnn04",
  url: "https://konnn04.dev",
  description:
    "Welcome to my personal portfolio website! I'm Konnn04, a passionate developer specializing in web development, software engineering, and open-source contributions.",
  author: "Konnn04",
  githubUsername: "konnn04",
  githubExcludeLangs: ["HTML", "CSS", "SCSS", "Less", "Dockerfile", "Makefile", "Shell"],
  discordUserId: "732157441889927239",
  repo: "https://github.com/konnn04/portfolio-web",
  features: {
    game: true,
    easterEgg: true,
    discord: true,
    github: true,
  },
};

export const identity: Identity = {
  firstName: "Trieu",
  middleName: "Thanh",
  lastName: "Nguyen",
  fullName: {
    vi: "Nguyễn Thanh Triều",
    en: "Thanh Trieu Nguyen",
  },
  role: "Fullstack Engineer",
  country: "Vietnam",
  city: "Ho Chi Minh",
  address: "Xuan Hoa Ward",
  discordDataUrl: "https://api.lanyard.rest/v1/users/732157441889927239",
  bio: {
    vi: "Là một lập trình viên chuyên Fullstack, tôi đang học hỏi thêm từng ngày...",
    en: "As a Fullstack developer, I am constantly learning and growing...",
  },
  slogan: {
    vi: "Nghĩ đơn giản, nhưng muốn làm việc lớn.",
    en: "Think simple, but aim to do big things.",
  },
};

export const socials: Socials = {
  github: { href: "https://github.com/konnn04", label: "konnn04" },
  linkedin: { href: "https://www.linkedin.com/in/konnn04/", label: "Trieu Thanh Nguyen" },
  facebook: { href: "https://www.facebook.com/konnn04", label: "konnn04" },
  mail: { href: "mailto:konnn1011.work@gmail.com", label: "konnn1011.work@gmail.com" },
  youtube: { href: "https://www.youtube.com/@konnn04", label: "konnn04" },
};

export const schools: School[] = [
  {
    name: {
      vi: "Trường Đại học Mở TP.HCM",
      en: "Ho Chi Minh City Open University",
    },
    majors: [
      {
        name: { vi: "Công nghệ thông tin", en: "Information Technology" },
        gpa: "3.22",
        startDate: "2022-09",
        endDate: "",
      },
    ],
    activities: [
      {
        name: {
          vi: "Chủ nhiệm CLB học thuật cấp khoa - MPClub",
          en: "Head of Faculty Academic Club - MPClub",
        },
        startDate: "2023-02",
        endDate: "2024-03",
        description: {
          vi: "Chủ nhiệm CLB MPClub. Quản lý tổ chức hoạt động học thuật cấp khoa và các cuộc thi",
          en: "Head of MPClub. Managed faculty-level academic activities and competitions",
        },
        links: ["https://mpclub.dev"],
      },
      {
        name: {
          vi: "Nghiên cứu Khoa học - Giải khuyến khích cấp trường 2025-2026",
          en: "Scientific Research - Consolation Prize at university level 2025-2026",
        },
        startDate: "2025-04",
        endDate: "2026-03",
        description: {
          vi: "Đề tài: Hệ thống giám sát thi cử trực tuyến thông minh",
          en: "Topic: Smart online exam monitoring system",
        },
      },
    ],
  },
];

export const experiences: Experience[] = [
  {
    type: "work",
    company: { vi: "Công ty TNHH Pizitech", en: "Pizitech Co., Ltd." },
    position: { vi: "Thực tập sinh", en: "Fullstack Intern" },
    startDate: "2025-10",
    endDate: "2026-02",
    description: {
      vi: "- Xây dựng hệ thống ERP cho SMEs với stack Laravel\n- Tích hợp Chatbot & tự động hóa quy trình kinh doanh",
      en: "- Built an ERP system for SMEs using Laravel\n- Integrated Chatbot & business process automation",
    },
    links: ["https://pizitech.com"],
  },
  {
    type: "work",
    company: { vi: "Test IO", en: "Test IO" },
    position: { vi: "Freelance Tester", en: "Freelance Tester" },
    startDate: "2025-12",
    description: {
      vi: "- Kiểm thử phần mềm freelance với hơn 100 bug được chấp nhận",
      en: "- Freelance software testing with over 100 accepted bugs",
    },
    links: ["https://tester.test.io/profile_pages/thanh_trieu_nguyen"],
  },
];

export const skills: Skills = {
  lang: ["TypeScript", "Python", "PHP", "Golang"],
  frameworks: ["Next.js", "React", "React Native", "Fastify", "Django", "Flask", "Laravel", "Gin"],
  databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  tools: ["Docker", "Git", "Nginx", "Apache", "Supabase", "Cloudflare"],
};

export const languages: Language[] = [
  {
    name: { vi: "Tiếng Việt", en: "Vietnamese" },
    level: { vi: "Bản ngữ", en: "Native" },
  },
  {
    name: { vi: "Tiếng Anh", en: "English" },
    level: { vi: "B1 (Intermediate)", en: "B1 (Intermediate)" },
  },
];

export const certificates: Certificate[] = [
  {
    name: { vi: "Chứng chỉ Tiếng Anh B1 VSTEP", en: "VSTEP English Certificate - B1" },
    organization: { vi: "Trường Đại học Mở TP.HCM", en: "Ho Chi Minh City Open University" },
    issueDate: "2026-04",
  },
  {
    name: { vi: "Chứng chỉ Trí tuệ nhân tạo (AI)", en: "Artificial Intelligence Course" },
    organization: { vi: "Samsung Innovation Campus ", en: " Samsung Innovation Campus" },
    issueDate: "2024-08",
  },

];

export const more: More = {
  games: [
    { name: "Neverness to Everness", username: "konnn04", level: "Lv50" },
    { name: "Honkai: Star Rail", username: "konnn04", level: "Lv70", uid: "800447829" },
    { name: "Minecraft" },
    { name: "Umamusume: Pretty Derby", level: "Lv50+" },
    { name: "PUBG", level: "Lv200+" },
  ],
  hobbies: [
    { name: { vi: "Cầu lông", en: "Badminton" }, startYear: 2019 },
    { name: { vi: "Đá bóng", en: "Playing football" }, startYear: 2019, endYear: 2020 },
    { name: { vi: "Xem phim", en: "Watching movies" } },
    { name: { vi: "Nghe nhạc", en: "Listening to music" } },
    { name: { vi: "Thích code", en: "Enjoy coding" } },
  ],
  movies: [
    // { title: "Interstellar", year: 2014 },
    // { title: "Your Name (Kimi no Na wa)", year: 2016 },
    // { title: "The Matrix", year: 1999 },
    // { title: "Spirited Away", year: 2001 },
  ],
  books: [
    // { title: "Clean Code", author: "Robert C. Martin", year: 2008 },
    // { title: "The Pragmatic Programmer", author: "Hunt & Thomas", year: 1999 },
    // { title: "Sapiens", author: "Yuval Noah Harari", year: 2011 },
  ],
  music: [
    { url: "https://open.spotify.com/track/5BgztqoQ6NHOhNg5yq8SUQ?si=a6aab87f36f04d03"},
    { url: "https://open.spotify.com/track/59hVbgr8rfYkDbHfr8RcGI?si=2864283727c14f35"},
    { url: "https://open.spotify.com/track/4oE7MyJhqSD3BaHRpNs8Nl?si=f0a9218170ce4410"},
    { url: "https://open.spotify.com/track/0vXAYEWak7KiyGdbth8Gz6?si=b569597d95504230" },
  ],
  secretProjects: [
    // {
    //   name: "Nyx — self-hosted note engine",
    //   description: {
    //     vi: "Dự án cá nhân chưa công bố: một công cụ ghi chú markdown chạy nền, đồng bộ end-to-end.",
    //     en: "An unreleased personal project: a background markdown note engine with end-to-end sync.",
    //   },
    //   url: "https://github.com/konnn04",
    // },
    // {
    //   name: "Pixel oven",
    //   description: {
    //     vi: "Trình tạo pixel-art từ ảnh, đang thử nghiệm shader WebGL.",
    //     en: "An image-to-pixel-art generator, experimenting with WebGL shaders.",
    //   },
    //   url: "https://github.com/konnn04",
    // },
  ],
};

export const profile: Profile = {
  ...identity,
  socials,
  schools,
  publish: [],
  experiences,
  achievements: [],
  skills,
  languages,
  certificates,
  donate: [],
  more,
};

const myInfo: MyInfo = { site, profile };
export default myInfo;
