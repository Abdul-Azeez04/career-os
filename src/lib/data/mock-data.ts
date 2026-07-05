/**
 * Mock data for development without Supabase connection.
 * Populated with Abdul-Azeez's real content from PRD §12.
 * This file is the development-mode equivalent of the seed script.
 */
import type {
  SiteConfig, Experience, Certification, Skill,
  Project, Writing, Testimonial, ContactMessage,
} from '@/lib/supabase/database.types'

export const mockSiteConfig: SiteConfig = {
  id: '00000000-0000-0000-0000-000000000001',
  owner_name: 'Abdul-Azeez',
  tagline: 'Full-Stack AI Developer & Author',
  bio_short: 'I build intelligent web applications and write fiction that explores the boundaries of human experience. Currently studying Electrical & Electronics Engineering at LAUTECH while shipping production AI products on Upwork.',
  bio_long: `I'm Abdul-Azeez — a full-stack AI developer and author navigating the intersection of technology and storytelling.

By day, I architect and ship intelligent web applications for clients worldwide through Upwork, specializing in Next.js, TypeScript, and AI API integrations (OpenAI, Anthropic). My work spans from building AI-powered writing tools to real-time social analytics platforms.

By night (and sometimes by day too), I write under the name **@b00kaddict**. My debut series *Remnants* explores identity, loss, and resilience through speculative fiction. I also write poetry and essays on Substack.

I'm currently in my final year of Electrical & Electronics Engineering at Ladoke Akintola University of Technology (LAUTECH), where I also served in student leadership through LSUG.

**What drives me:** Building tools that augment human creativity, not replace it. Every project I take on — whether it's an AI writing assistant or a novel — is about making complex things feel simple and beautiful.`,
  avatar_url: null,
  resume_pdf_url: null,
  email: 'contact@abdul-azeez.dev',
  socials: {
    twitter: 'https://twitter.com/Adeyinka_A6',
    github: 'https://github.com/Abdul-Azeez04',
    linkedin: 'https://linkedin.com/in/abdul-azeez',
    substack: 'https://b00kaddict.substack.com',
    instagram: 'https://instagram.com/b00kaddict',
    upwork: 'https://www.upwork.com/freelancers/~Adeyinka_A6',
  },
  theme: {
    primary_color: '#D4A853',
    font_heading: 'Playfair Display',
    font_body: 'Inter',
    mode: 'dark',
  },
  seo: {
    title: 'Abdul-Azeez — Full-Stack AI Developer & Author',
    description: 'Full-Stack AI Developer specializing in Next.js, TypeScript, and AI integrations. Author of the Remnants series. Available for freelance work.',
    og_image: null,
  },
  show_writing: true,
  show_services: true,
  updated_at: new Date().toISOString(),
}

export const mockExperiences: Experience[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    type: 'education',
    title: 'B.Tech Electrical & Electronics Engineering',
    org: 'Ladoke Akintola University of Technology (LAUTECH)',
    location: 'Ogbomosho, Nigeria',
    start_date: '2021-09-01',
    end_date: '2026-07-01',
    description: 'Studying Electrical & Electronics Engineering with a focus on embedded systems and signal processing. Self-taught full-stack web development alongside formal studies.',
    highlights: [
      'Final year (500L) student',
      'Self-taught full-stack development alongside engineering curriculum',
      'Applied AI/ML concepts to engineering projects',
    ],
    sort_order: 0,
    is_published: true,
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    type: 'freelance',
    title: 'Full-Stack AI Developer',
    org: 'Upwork',
    location: 'Remote',
    start_date: '2024-01-01',
    end_date: null,
    description: 'Building production AI-powered web applications for global clients. Specializing in Next.js, TypeScript, Supabase, and AI API integrations (OpenAI, Anthropic, Claude).',
    highlights: [
      'Shipped 5+ production applications',
      'Specializing in AI-powered tools and platforms',
      'Next.js, TypeScript, Supabase, Vercel stack',
      'OpenAI & Anthropic API integration expert',
    ],
    sort_order: 1,
    is_published: true,
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    type: 'leadership',
    title: 'Student Leader',
    org: 'LAUTECH Students\' Union Government (LSUG)',
    location: 'LAUTECH, Ogbomosho',
    start_date: '2023-01-01',
    end_date: '2024-12-01',
    description: 'Served in student government, contributing to policy advocacy and student welfare initiatives.',
    highlights: [
      'Policy advocacy and student welfare',
      'Event organization and community building',
      'Cross-departmental collaboration',
    ],
    sort_order: 2,
    is_published: true,
  },
]

export const mockCertifications: Certification[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    title: 'Full-Stack Web Development',
    issuer: 'freeCodeCamp',
    issue_date: '2023-06-01',
    expiry_date: null,
    credential_url: 'https://freecodecamp.org/certification',
    badge_image_url: null,
    sort_order: 0,
    is_published: true,
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    title: 'AI & Machine Learning Fundamentals',
    issuer: 'Coursera',
    issue_date: '2024-03-01',
    expiry_date: null,
    credential_url: 'https://coursera.org/verify',
    badge_image_url: null,
    sort_order: 1,
    is_published: true,
  },
]

export const mockSkills: Skill[] = [
  { id: '30000000-0000-0000-0000-000000000001', name: 'React', category: 'framework', proficiency: 5, sort_order: 0 },
  { id: '30000000-0000-0000-0000-000000000002', name: 'Next.js', category: 'framework', proficiency: 5, sort_order: 1 },
  { id: '30000000-0000-0000-0000-000000000003', name: 'TypeScript', category: 'language', proficiency: 5, sort_order: 2 },
  { id: '30000000-0000-0000-0000-000000000004', name: 'JavaScript', category: 'language', proficiency: 5, sort_order: 3 },
  { id: '30000000-0000-0000-0000-000000000005', name: 'Python', category: 'language', proficiency: 4, sort_order: 4 },
  { id: '30000000-0000-0000-0000-000000000006', name: 'Node.js', category: 'framework', proficiency: 4, sort_order: 5 },
  { id: '30000000-0000-0000-0000-000000000007', name: 'Supabase', category: 'tool', proficiency: 5, sort_order: 6 },
  { id: '30000000-0000-0000-0000-000000000008', name: 'PostgreSQL', category: 'tool', proficiency: 4, sort_order: 7 },
  { id: '30000000-0000-0000-0000-000000000009', name: 'Vercel', category: 'tool', proficiency: 5, sort_order: 8 },
  { id: '30000000-0000-0000-0000-000000000010', name: 'Tailwind CSS', category: 'framework', proficiency: 5, sort_order: 9 },
  { id: '30000000-0000-0000-0000-000000000011', name: 'OpenAI API', category: 'tool', proficiency: 5, sort_order: 10 },
  { id: '30000000-0000-0000-0000-000000000012', name: 'Anthropic API', category: 'tool', proficiency: 4, sort_order: 11 },
  { id: '30000000-0000-0000-0000-000000000013', name: 'Git', category: 'tool', proficiency: 4, sort_order: 12 },
  { id: '30000000-0000-0000-0000-000000000014', name: 'Figma', category: 'tool', proficiency: 3, sort_order: 13 },
  { id: '30000000-0000-0000-0000-000000000015', name: 'Creative Writing', category: 'creative', proficiency: 5, sort_order: 14 },
  { id: '30000000-0000-0000-0000-000000000016', name: 'Crochet', category: 'creative', proficiency: 3, sort_order: 15 },
  { id: '30000000-0000-0000-0000-000000000017', name: 'Illustration', category: 'creative', proficiency: 3, sort_order: 16 },
]

export const mockProjects: Project[] = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    slug: 'convrt-ai',
    title: 'CONVRT.AI',
    summary: 'AI-powered conversion optimization platform that analyzes user behavior and generates data-driven recommendations to improve website performance.',
    problem: 'Businesses struggle to understand why visitors don\'t convert. Traditional A/B testing is slow and requires significant traffic volume to reach statistical significance.',
    solution: 'Built an AI-powered analytics platform that uses machine learning to analyze user behavior patterns and generate actionable conversion optimization recommendations in real-time, without requiring large traffic volumes.',
    stack: ['Next.js', 'TypeScript', 'OpenAI API', 'Supabase', 'Tailwind CSS', 'Vercel'],
    role: 'Full-Stack Developer',
    outcome: 'Delivered a production-ready platform capable of processing real-time analytics and generating AI-driven insights for conversion optimization.',
    live_url: null,
    repo_url: null,
    cover_image_url: null,
    gallery: null,
    is_featured: true,
    is_published: true,
    sort_order: 0,
    created_at: '2024-08-01T00:00:00Z',
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    slug: 'inkwell-ai',
    title: 'InkWell AI',
    summary: 'An intelligent writing assistant that helps authors craft, edit, and refine their manuscripts using AI-powered tools while preserving their unique voice.',
    problem: 'Writers often struggle with writer\'s block, inconsistent tone, and the tedious revision process. Existing AI writing tools tend to override the author\'s voice rather than enhance it.',
    solution: 'Created a writing assistant that learns each author\'s style and provides contextual suggestions, plot analysis, and editing recommendations that preserve the writer\'s unique voice.',
    stack: ['Next.js', 'TypeScript', 'Anthropic API', 'Supabase', 'Tailwind CSS'],
    role: 'Full-Stack Developer & Product Designer',
    outcome: 'Launched on Vercel with active users. The tool helps writers maintain consistency across long-form works while accelerating the editing process.',
    live_url: 'https://inkwell-ai.vercel.app',
    repo_url: 'https://github.com/Abdul-Azeez04/inkwell-ai',
    cover_image_url: null,
    gallery: null,
    is_featured: true,
    is_published: true,
    sort_order: 1,
    created_at: '2024-06-01T00:00:00Z',
  },
  {
    id: '40000000-0000-0000-0000-000000000003',
    slug: 'socialpulse',
    title: 'SocialPulse',
    summary: 'Real-time social media analytics dashboard that tracks engagement metrics, sentiment analysis, and trend forecasting across multiple platforms.',
    problem: 'Content creators and marketers need to monitor their social media performance across multiple platforms, but existing tools are expensive and fragmented.',
    solution: 'Built a unified analytics dashboard that aggregates data from multiple social platforms, performs AI-powered sentiment analysis, and provides trend forecasting to optimize content strategy.',
    stack: ['Next.js', 'TypeScript', 'Node.js', 'Supabase', 'Recharts', 'Tailwind CSS'],
    role: 'Full-Stack Developer',
    outcome: 'Delivered a comprehensive analytics platform with real-time data visualization and AI-powered insights.',
    live_url: null,
    repo_url: null,
    cover_image_url: null,
    gallery: null,
    is_featured: true,
    is_published: true,
    sort_order: 2,
    created_at: '2024-04-01T00:00:00Z',
  },
  {
    id: '40000000-0000-0000-0000-000000000004',
    slug: 'the-radar-news',
    title: 'The Radar News',
    summary: 'A modern news aggregation platform with AI-curated content, personalized feeds, and clean reading experience.',
    problem: 'News consumption is fragmented across dozens of sources, and most news sites are cluttered with ads and poor UX.',
    solution: 'Built a clean, fast news platform that aggregates content from multiple sources, uses AI to categorize and prioritize stories, and delivers a distraction-free reading experience.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel'],
    role: 'Full-Stack Developer',
    outcome: 'Live at theradarnews.vercel.app — a fast, clean news reading experience with AI-powered curation.',
    live_url: 'https://theradarnews.vercel.app',
    repo_url: null,
    cover_image_url: null,
    gallery: null,
    is_featured: false,
    is_published: true,
    sort_order: 3,
    created_at: '2024-02-01T00:00:00Z',
  },
  {
    id: '40000000-0000-0000-0000-000000000005',
    slug: 'alfabyte-gadgets',
    title: 'AlfaByte Gadgets',
    summary: 'E-commerce platform for consumer electronics with AI-powered product recommendations and seamless checkout experience.',
    problem: 'Small gadget retailers need professional e-commerce presences but can\'t afford enterprise solutions.',
    solution: 'Built a performant, SEO-optimized e-commerce storefront with intelligent product recommendations and a frictionless purchase flow.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vercel'],
    role: 'Full-Stack Developer',
    outcome: 'Delivered a production-ready e-commerce platform with fast load times and strong SEO performance.',
    live_url: null,
    repo_url: null,
    cover_image_url: null,
    gallery: null,
    is_featured: false,
    is_published: true,
    sort_order: 4,
    created_at: '2023-11-01T00:00:00Z',
  },
]

export const mockWritings: Writing[] = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    slug: 'the-awakening',
    title: 'The Awakening',
    type: 'excerpt',
    series: 'Remnants',
    body_markdown: `# The Awakening

*Book One of the Remnants Series*

The first light didn't come from the sun.

It came from within — a slow, burning pulse that started somewhere behind my ribs and spread outward like ink in water. I didn't know what I was yet. None of us did. We were just... awake. Suddenly, terribly awake.

The city had been dead for three years before we arrived. Not dead in the way cities die — slowly, building by building, family by family. Dead the way a light goes out. One moment, eight million lives humming in concert. The next: silence.

They called us the Remnants. The ones who woke up after the world forgot how to sleep.

---

*The Awakening is the first installment of the Remnants series, exploring identity, loss, and resilience in a world that has moved on without its inhabitants.*

> "What does it mean to be human when humanity has already written its own ending?"

Available on Substack. Follow **@b00kaddict** for updates on the series.`,
    cover_image_url: null,
    external_url: 'https://b00kaddict.substack.com',
    is_published: true,
    published_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    slug: 'the-forsaken',
    title: 'The Forsaken',
    type: 'excerpt',
    series: 'Remnants',
    body_markdown: `# The Forsaken

*Book Two of the Remnants Series*

They told us the world ended on a Tuesday.

I don't remember Tuesdays. I don't remember most of the days that came before — only the ones that came after, when the silence became a sound of its own. When we learned that being forgotten was not the worst thing that could happen to you.

Being remembered was.

---

The second Remnant stirred in what used to be a hospital. She had no name, no memory, no anchor to the life she'd lived before. Only fragments — a melody she couldn't place, the phantom weight of a hand in hers, and a single word scratched into her forearm in her own handwriting:

*RUN.*

---

*The Forsaken continues the Remnants series, delving deeper into the mysteries of the awakening and the forces that watch from the shadows.*`,
    cover_image_url: null,
    external_url: 'https://b00kaddict.substack.com',
    is_published: true,
    published_at: '2024-06-01T00:00:00Z',
  },
  {
    id: '50000000-0000-0000-0000-000000000003',
    slug: 'fragments-of-becoming',
    title: 'Fragments of Becoming',
    type: 'poem',
    series: null,
    body_markdown: `# Fragments of Becoming

I am not yet whole,
but I am not broken—
I am becoming.

Each line of code, a stitch.
Each chapter written, a bridge
between who I was
and who the morning
has yet to meet.

There is grace in the unfinished.
There is power in the draft.

I build with both hands—
one holding a keyboard,
the other, a pen—
and the world watches me
make something
from nothing
again.

---

*Written somewhere between a debug session and a deadline.*`,
    cover_image_url: null,
    external_url: null,
    is_published: true,
    published_at: '2024-09-15T00:00:00Z',
  },
  {
    id: '50000000-0000-0000-0000-000000000004',
    slug: 'on-building-things-that-matter',
    title: 'On Building Things That Matter',
    type: 'essay',
    series: null,
    body_markdown: `# On Building Things That Matter

There's a question I ask myself before starting any project: *Will this still matter in a year?*

Not commercially — markets shift, trends evaporate. I mean emotionally. Intellectually. Will the person using this thing feel something? Will it solve a problem they didn't know how to articulate?

The best software I've built has always started from frustration. InkWell AI started because I was tired of AI writing tools that erased my voice instead of amplifying it. The Radar News started because I wanted to read the news without feeling like I was being yelled at.

## The intersection

I write code and I write fiction, and people always ask how those two things connect. The answer is simple: both are about creating experiences. A well-architected application and a well-structured novel share the same DNA — clarity of purpose, respect for the audience, and an obsession with the details nobody notices but everybody feels.

## What I've learned

After shipping products on Upwork and publishing fiction on Substack, here's what I know to be true:

1. **Simplicity is a feature, not a compromise.** The hardest problems deserve the cleanest solutions.
2. **Ship early, but not sloppy.** There's a difference between "minimum viable" and "minimum effort."
3. **Your tools don't define you.** Frameworks come and go. Problem-solving is forever.
4. **Write for one person.** Whether it's code or prose, if it works perfectly for one person, it works.

---

*Originally published on Substack.*`,
    cover_image_url: null,
    external_url: 'https://b00kaddict.substack.com',
    is_published: true,
    published_at: '2025-01-10T00:00:00Z',
  },
]

export const mockTestimonials: Testimonial[] = [
  {
    id: '60000000-0000-0000-0000-000000000001',
    author_name: 'Sarah Chen',
    author_role: 'Startup Founder',
    quote: 'Abdul-Azeez delivered exactly what we needed — a clean, fast AI-powered platform that our users love. His ability to understand both the technical requirements and the user experience is rare.',
    avatar_url: null,
    source: 'Upwork',
    sort_order: 0,
    is_published: true,
  },
  {
    id: '60000000-0000-0000-0000-000000000002',
    author_name: 'Michael Torres',
    author_role: 'Product Manager, TechCorp',
    quote: 'Working with Abdul-Azeez was a masterclass in efficient development. He took our vague requirements and turned them into a polished product in half the expected timeline.',
    avatar_url: null,
    source: 'Upwork',
    sort_order: 1,
    is_published: true,
  },
  {
    id: '60000000-0000-0000-0000-000000000003',
    author_name: 'Amina Okafor',
    author_role: 'Fellow Author',
    quote: 'His writing has this quiet intensity that stays with you long after you put it down. The Remnants series is unlike anything I\'ve read — technically precise yet deeply human.',
    avatar_url: null,
    source: 'Substack',
    sort_order: 2,
    is_published: true,
  },
]

export const mockMessages: ContactMessage[] = [
  {
    id: '70000000-0000-0000-0000-000000000001',
    name: 'Demo User',
    email: 'demo@example.com',
    message: 'This is a sample contact message for the admin dashboard preview.',
    status: 'new',
    created_at: new Date().toISOString(),
  },
]
