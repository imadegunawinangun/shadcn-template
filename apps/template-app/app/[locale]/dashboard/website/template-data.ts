/**
 * Template content definitions for landing page templates.
 * This file is intentionally NOT a Server Action file so it can be
 * imported safely by both Client Components (for preview) and
 * Server Actions (for database seeding).
 */
export const TEMPLATES_CONTENT: Record<string, any> = {
  blank: {
    content: [],
    root: {
      title: "",
      status: "draft",
      metaDescription: "",
      metaKeywords: "",
      featuredImage: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
      robotsIndex: "index",
      robotsFollow: "follow",
      theme: {}
    },
    zones: {}
  },
  saas: {
    content: [
      {
        type: "Hero",
        props: {
          variant: "003",
          badge: "New Release",
          title: "Scale Your Business to the Next Level",
          subtitle: "The ultimate SaaS platform for ambitious teams to track analytics, automate workflows, and grow revenue in real-time.",
          ctaText: "Get Started Free",
          id: "Hero-1"
        }
      },
      {
        type: "TrustBar",
        props: {
          title: "Trusted by over 10,000+ fast-growing companies worldwide",
          companies: [
            { name: "Google" },
            { name: "Microsoft" },
            { name: "Stripe" },
            { name: "Airbnb" }
          ],
          id: "TrustBar-1"
        }
      },
      {
        type: "Features",
        props: {
          title: "Powerful Features Built for Scale",
          subtitle: "Everything you need to automate your operations and unlock exponential business growth.",
          features: [
            {
              title: "Real-time Analytics",
              description: "Monitor and analyze your conversion rates, traffic, and user behavior in real-time with zero lag.",
              icon: "trending-up"
            },
            {
              title: "Automated Workflows",
              description: "Design and execute powerful cross-platform automations with our simple visual editor.",
              icon: "zap"
            },
            {
              title: "Enterprise Security",
              description: "Rest easy with banking-grade 256-bit encryption, row-level security, and audit logs.",
              icon: "shield"
            }
          ],
          id: "Features-1"
        }
      },
      {
        type: "Stats",
        props: {
          title: "Our Metrics Speak For Themselves",
          stats: [
            { value: "99.99%", label: "Uptime SLA Guarantee" },
            { value: "150M+", label: "API Requests Processed Daily" },
            { value: "24/7", label: "Dedicated Enterprise Support" }
          ],
          id: "Stats-1"
        }
      },
      {
        type: "Testimonials",
        props: {
          title: "Real Feedback from Industry Leaders",
          subtitle: "Discover how high-growth teams accelerate operations and build trust worldwide.",
          testimonials: [
            {
              name: "Jessica Vance",
              text: "This platform completely changed our productivity. The real-time metrics let us spot bottlenecks instantly."
            },
            {
              name: "Sarah Connor",
              text: "Our engineering velocity doubled within the first month. Excellent support team too!"
            }
          ],
          id: "Testimonials-1"
        }
      },
      {
        type: "Pricing",
        props: {
          title: "Simple, Transparent Pricing Plans",
          subtitle: "Choose the perfect plan for your business size. No hidden fees or surprise upgrades.",
          tiers: [
            {
              name: "Starter",
              price: "29",
              features: [
                "Up to 3 team members",
                "Core automation features",
                "Standard email support",
                "10,000 API requests/mo"
              ]
            },
            {
              name: "Pro Business",
              price: "79",
              featured: true,
              badge: "Best",
              features: [
                "Up to 15 team members",
                "Advanced analytics suite",
                "Priority 24/7 support",
                "100,000 API requests/mo",
                "Custom domain integration"
              ]
            }
          ],
          id: "Pricing-1"
        }
      },
      {
        type: "FAQ",
        props: {
          title: "Frequently Asked Questions",
          subtitle: "Have questions? We have answers to help you get started.",
          faqs: [
            {
              question: "Is there a free trial available?",
              answer: "Yes, we offer a fully featured 14-day free trial. No credit card is required to sign up."
            },
            {
              question: "Can I upgrade or downgrade my plan later?",
              answer: "Absolutely! You can change your subscription tier, add team members, or cancel at any time directly from your billing dashboard."
            },
            {
              question: "Is my data secure with your platform?",
              answer: "Security is our top priority. We employ advanced AES-256 encryption at rest and TLS 1.3 in transit, fully compliant with GDPR and SOC 2."
            }
          ],
          id: "FAQ-1"
        }
      },
      {
        type: "CTA",
        props: {
          title: "Ready to Transform Your Workflow?",
          subtitle: "Join thousands of high-performing teams who scale their business using our platform today.",
          ctaText: "Start Your 14-Day Free Trial",
          id: "CTA-1"
        }
      }
    ],
    root: {
      title: "",
      status: "draft",
      metaDescription: "SaaS and Product Landing Page Template",
      metaKeywords: "saas, product, software",
      featuredImage: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
      robotsIndex: "index",
      robotsFollow: "follow",
      theme: {}
    },
    zones: {}
  },
  agency: {
    content: [
      {
        type: "Hero",
        props: {
          title: "We Design & Build Next-Gen Digital Products",
          subtitle: "A premium boutique agency transforming ideas into stunning user interfaces, scalable platforms, and world-class digital experiences.",
          ctaText: "Book a Discovery Call",
          id: "Hero-2"
        }
      },
      {
        type: "TrustBar",
        props: {
          title: "Elite Brands We Collaborate With",
          companies: [
            { name: "Google" },
            { name: "Microsoft" },
            { name: "Stripe" },
            { name: "Airbnb" }
          ],
          id: "TrustBar-2"
        }
      },
      {
        type: "Services",
        props: {
          title: "Our Elite Services Catalog",
          subtitle: "We combine cutting-edge UI/UX design, custom engineering, and smart product strategy to unlock value.",
          features: [
            {
              title: "UX/UI Product Design",
              description: "High-fidelity wireframes, interactive user flows, and modern design systems that captivate and convert.",
              icon: "palette"
            },
            {
              title: "Full-Stack Custom Dev",
              description: "Responsive web apps, mobile solutions, and robust APIs engineered with Next.js, React, Node, and Postgres.",
              icon: "code"
            },
            {
              title: "AI & Automation Integrations",
              description: "Integrate advanced LLMs, agentic workflows, and automated bots directly into your existing infrastructure.",
              icon: "cpu"
            }
          ],
          id: "Services-1"
        }
      },
      {
        type: "Process",
        props: {
          title: "Our Streamlined Engagement Process",
          subtitle: "How we work together to turn your product vision into a polished digital reality.",
          steps: [
            {
              title: "1. Discovery & Strategy",
              description: "We dive deep into your target audience, user problems, technical goals, and product scope."
            },
            {
              title: "2. High-Fidelity Design",
              description: "Our senior designers craft stunning visual interfaces, custom branding palettes, and interactive prototypes."
            },
            {
              title: "3. Agile Custom Development",
              description: "Our elite engineers build clean, type-safe, production-ready code with continuous CI/CD staging reviews."
            },
            {
              title: "4. Launch & Scaling Support",
              description: "We assist in deployment, speed optimization, and ongoing maintenance to guarantee smooth sailing."
            }
          ],
          id: "Process-1"
        }
      },
      {
        type: "Stats",
        props: {
          title: "Delivering Unmatched Creative Results",
          stats: [
            { value: "150+", label: "Products Launched Successfully" },
            { value: "98%", label: "Client Satisfaction Rating" },
            { value: "$50M+", label: "Client Revenue Generated" }
          ],
          id: "Stats-2"
        }
      },
      {
        type: "Team",
        props: {
          title: "Meet Our Creative Pioneers",
          subtitle: "An elite team of senior engineers, product designers, and strategists obsessed with pixel-perfection.",
          members: [
            { name: "Alex Rivier", role: "Principal Product Designer" },
            { name: "Sarah Chen", role: "Lead Full-Stack Engineer" },
            { name: "Marcus Stone", role: "Principal AI Solutions Architect" }
          ],
          id: "Team-1"
        }
      },
      {
        type: "Testimonials",
        props: {
          title: "What Our Partners Say About Us",
          subtitle: "Real endorsements from fast-growing businesses that trusted us to design and engineer their key systems.",
          testimonials: [
            {
              name: "Robert Downey",
              text: "The strategy session alone was worth the partnership. They built our entire fintech portal in 6 weeks."
            },
            {
              name: "Emily Blunt",
              text: "Exceptional designers who understand conversion psychology. Highly recommended!"
            }
          ],
          id: "Testimonials-2"
        }
      },
      {
        type: "FAQ",
        props: {
          title: "Frequently Asked Agency Questions",
          subtitle: "Clear answers to commonly asked questions about projects, pricing, and timelines.",
          faqs: [
            {
              question: "Berapa lama proses pembuatan proyek?",
              answer: "Untuk proyek standar berkisar 4-8 minggu dari wireframe hingga peluncuran."
            },
            {
              question: "Apakah tim saya dilibatkan dalam revisi?",
              answer: "Ya, kami menggunakan sistem tinjauan mingguan di mana tim Anda dapat memberikan masukan langsung pada prototipe visual."
            }
          ],
          id: "FAQ-2"
        }
      },
      {
        type: "CTA",
        props: {
          title: "Have a Project in Mind?",
          subtitle: "Let's connect and discuss how we can build a world-class digital solution for your company.",
          ctaText: "Schedule Free Strategy Session ↗",
          id: "CTA-2"
        }
      }
    ],
    root: {
      title: "",
      status: "draft",
      metaDescription: "Agency & Business Landing Page Template",
      metaKeywords: "agency, business, design, engineering",
      featuredImage: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
      robotsIndex: "index",
      robotsFollow: "follow",
      theme: {}
    },
    zones: {}
  },
  sales: {
    content: [
      {
        type: "Hero",
        props: {
          title: "The Smarter Way to Relieve Daily Stress",
          subtitle: "An organic, award-winning daily botanical supplement designed to boost focus, enhance sleep, and restore calm naturally.",
          ctaText: "Order Yours Today & Save 30%",
          id: "Hero-3"
        }
      },
      {
        type: "TrustBar",
        props: {
          title: "Featured & Certified By",
          companies: [
            { name: "Vogue" },
            { name: "Men's Health" },
            { name: "Healthline" },
            { name: "TechCrunch" }
          ],
          id: "TrustBar-3"
        }
      },
      {
        type: "Problems",
        props: {
          title: "The Hidden Costs of Modern Daily Stress",
          subtitle: "Constant deadlines, low sleep, and burnout ruin our productivity, focus, and long-term health.",
          features: [
            {
              title: "Chronic Mental Fatigue",
              description: "Waking up tired, relying on heavy caffeine, and feeling completely drained before mid-afternoon.",
              icon: "battery-low"
            },
            {
              title: "Poor Focus & Distraction",
              description: "Struggling to concentrate on deep tasks, mind wandering, and losing hours to unproductive multitasking.",
              icon: "eye-off"
            },
            {
              title: "Disrupted Sleep Cycles",
              description: "Tossing and turning at night with a racing mind, failing to enter deep restorative sleep phases.",
              icon: "moon"
            }
          ],
          id: "Problems-1"
        }
      },
      {
        type: "Solution",
        props: {
          title: "Unlock Your True Potential, Naturally",
          subtitle: "Our premium blend of organic adaptogens helps your body resist stress, improve cognitive stamina, and sleep deep.",
          features: [
            {
              title: "Restore Emotional Balance",
              description: "Naturally regulates stress hormones (cortisol) to keep you calm and composed in high-pressure settings.",
              icon: "heart"
            },
            {
              title: "Enhance Cognitive Flow",
              description: "Improves brain micro-circulation and neurotransmitter balance to let you enter state of deep flow.",
              icon: "sparkles"
            },
            {
              title: "Wake Up Fully Restored",
              description: "Promotes deep REM sleep without grogginess or dependence, ensuring you wake up energetic.",
              icon: "sun"
            }
          ],
          id: "Solution-1"
        }
      },
      {
        type: "Scarcity",
        props: {
          title: "Hurry! Limited Special Stock Available",
          subtitle: "Due to high demand and organic sourcing, our current batch is 85% sold out. Order within the next 24 hours to secure yours.",
          features: [
            {
              title: "85% Sold Out",
              description: "Our hand-harvested adaptogen crop has extremely limited yields. Next restock will take 60 days."
            },
            {
              title: "30% Special Discount",
              description: "Order today and receive a 30% first-time customer discount plus free worldwide express shipping."
            }
          ],
          id: "Scarcity-1"
        }
      },
      {
        type: "Testimonials",
        props: {
          title: "Loved by 50,000+ Calm Customers",
          subtitle: "Real reviews from verified buyers who successfully reclaimed their focus and energy.",
          testimonials: [
            {
              name: "Jessica Vance",
              text: "This botanical blend completely changed my workday. My anxiety is gone and my focus is sharper than ever!"
            },
            {
              name: "Daniel K.",
              text: "I used to wake up exhausted every morning. After 2 weeks of using this, I sleep like a baby and wake up fully energized."
            }
          ],
          id: "Testimonials-3"
        }
      },
      {
        type: "Pricing",
        props: {
          title: "Choose Your Wellness Bundle",
          subtitle: "Save up to 45% when ordering multi-month bundles. Cancel subscription anytime.",
          tiers: [
            {
              name: "1-Month Supply",
              price: "$39",
              features: [
                "1 Bottle (30 capsules)",
                "Standard shipping",
                "100% money-back guarantee"
              ]
            },
            {
              name: "3-Month Bundle (Best Value)",
              price: "$89",
              features: [
                "3 Bottles (90 capsules)",
                "Save 25% instantly",
                "Free express shipping",
                "100% money-back guarantee"
              ]
            },
            {
              name: "6-Month Bundle (Family Pack)",
              price: "$149",
              features: [
                "6 Bottles (180 capsules)",
                "Save 45% instantly",
                "Free express shipping",
                "Bonus: Daily wellness guides",
                "100% money-back guarantee"
              ]
            }
          ],
          id: "Pricing-2"
        }
      },
      {
        type: "FAQ",
        props: {
          title: "Pertanyaan Umum Tentang Produk Kami",
          subtitle: "Klarifikasi penting mengenai dosis, keamanan bahan, dan kebijakan garansi uang kembali.",
          faqs: [
            {
              question: "Apakah produk ini aman dikonsumsi harian?",
              answer: "Ya, semua bahan alami bersertifikasi organik, bebas kafein, dan bebas pengawet."
            },
            {
              question: "Kapan saya bisa merasakan hasilnya?",
              answer: "Sebagian besar pengguna merasakan ketenangan mental dalam 30-45 menit pertama."
            }
          ],
          id: "FAQ-3"
        }
      },
      {
        type: "CTA",
        props: {
          title: "Reclaim Your Focus & Calm Today",
          subtitle: "Try it 100% risk-free. If you don't love it, we'll refund your entire purchase, no questions asked.",
          ctaText: "Shop Risk-Free Now",
          id: "CTA-3"
        }
      }
    ],
    root: {
      title: "",
      status: "draft",
      metaDescription: "Sales & Product E-commerce Landing Page Template",
      metaKeywords: "sales page, ecommerce, product, adaptogens",
      featuredImage: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
      robotsIndex: "index",
      robotsFollow: "follow",
      theme: {}
    },
    zones: {}
  },
  portfolio: {
    content: [
      {
        type: "Hero",
        props: {
          title: "Crafting High-Performance Digital Experiences",
          subtitle: "I am a full-stack engineer and digital designer specializing in building scalable web applications, custom integrations, and premium brand identities.",
          ctaText: "View Case Studies ↘",
          id: "Hero-portfolio"
        }
      },
      {
        type: "TrustBar",
        props: {
          title: "Worked with Elite Teams at",
          companies: [
            { name: "Vercel" },
            { name: "Figma" },
            { name: "Supabase" },
            { name: "Neon" }
          ],
          id: "TrustBar-portfolio"
        }
      },
      {
        type: "Services",
        props: {
          title: "My Creative & Technical Services",
          subtitle: "Combining clean code with high-end aesthetics to deliver digital products that stand out.",
          features: [
            {
              title: "Web & Mobile Development",
              description: "Responsive, high-speed applications built with Next.js, React, Drizzle, and tailored Tailwind or CSS animations.",
              icon: "code"
            },
            {
              title: "System & API Integrations",
              description: "Connecting database systems, headless platforms, payments (Stripe), and custom server actions seamlessly.",
              icon: "link"
            },
            {
              title: "Brand Design & UI/UX",
              description: "Creating highly visual brand identity systems, high-fidelity mockups, and premium interactive designs.",
              icon: "palette"
            }
          ],
          id: "Services-portfolio"
        }
      },
      {
        type: "Stats",
        props: {
          title: "Track Record of Engineering Excellence",
          stats: [
            { value: "50+", label: "Products Launched Successfully" },
            { value: "100%", label: "On-Time Milestone Delivery" },
            { value: "5★", label: "Average Client Rating" }
          ],
          id: "Stats-portfolio"
        }
      },
      {
        type: "Process",
        props: {
          title: "My Structured Development Process",
          subtitle: "A highly collaborative and iterative approach designed to deliver premium products efficiently.",
          features: [
            {
              title: "1. Strategy & Wireframe",
              description: "Defining technical scope, user journeys, and core visual aesthetics before writing any code."
            },
            {
              title: "2. Fast-Track Prototype",
              description: "Building high-fidelity interactive models so you can test layout and usability early in the process."
            },
            {
              title: "3. Robust Engineering",
              description: "Writing pixel-perfect, clean, and thoroughly tested components deployed to cloud serverless infrastructures."
            }
          ],
          id: "Process-portfolio"
        }
      },
      {
        type: "Testimonials",
        props: {
          title: "Endorsements from Founders & CTOs",
          subtitle: "What industry leaders say about my technical skills, delivery speed, and brand value.",
          testimonials: [
            {
              name: "Jason Fried",
              text: "An absolute pleasure to work with. Clean code, beautiful design sense, and excellent communication."
            },
            {
              name: "Guillermo Rauch",
              text: "Brings complex serverless ideas to life with flawless type-safe architectures."
            }
          ],
          id: "Testimonials-portfolio"
        }
      },
      {
        type: "FAQ",
        props: {
          title: "Frequently Asked Questions",
          subtitle: "Find answers regarding contract work, tech stack preferences, and availability.",
          faqs: [
            {
              question: "Apakah menerima pekerjaan kontrak atau full-time?",
              answer: "Saya menerima proyek konsultasi premium kontrak serta tawaran peran full-time strategis."
            },
            {
              question: "Teknologi apa saja yang Anda kuasai?",
              answer: "Next.js, TypeScript, React, Tailwind CSS, Node.js, PostgreSQL, Drizzle/Prisma, dan integrasi AI/LLM."
            }
          ],
          id: "FAQ-portfolio"
        }
      },
      {
        type: "CTA",
        props: {
          title: "Have a Vision for a Premium Product?",
          subtitle: "Let's collaborate to bring your digital vision to life with world-class engineering and exceptional design.",
          ctaText: "Let's Get in Touch",
          id: "CTA-portfolio"
        }
      }
    ],
    root: {
      title: "",
      status: "draft",
      metaDescription: "Professional Portfolio & Resume Landing Page",
      metaKeywords: "portfolio, resume, software engineer, digital designer",
      featuredImage: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
      robotsIndex: "index",
      robotsFollow: "follow",
      theme: {}
    },
    zones: {}
  },
  webinar: {
    content: [
      {
        type: "Hero",
        props: {
          title: "Mastering the Future of AI Software Engineering",
          subtitle: "Join our exclusive free 90-minute masterclass and learn to build, compile, and deploy autonomous monorepo systems in record time.",
          ctaText: "Register for Free Masterclass ↗",
          id: "Hero-webinar"
        }
      },
      {
        type: "TrustBar",
        props: {
          title: "Co-hosted & Sponsored by",
          companies: [
            { name: "Neon" },
            { name: "OpenAI" },
            { name: "Vercel" },
            { name: "Clerk" }
          ],
          id: "TrustBar-webinar"
        }
      },
      {
        type: "Scarcity",
        props: {
          title: "Exclusive Training Event - 100 Seats Only",
          subtitle: "Due to server bandwidth and live interactive Q&A limitations, access is strictly capped. Claim your free pass before registration closes.",
          features: [
            {
              title: "Saturday, 3:00 PM WIB",
              description: "Live interactive workshop including source code downloads, blueprint handouts, and a dedicated live Q&A panel."
            },
            {
              title: "Only 12 Seats Left",
              description: "Registration closes automatically when capacity is reached. No replays will be sent to non-registered users."
            }
          ],
          id: "Scarcity-webinar"
        }
      },
      {
        type: "Problems",
        props: {
          title: "Why Traditional Coding is Becoming Obsolete",
          subtitle: "Relying on manual code writing and disconnected local workflows is a recipe for slow delivery, massive overhead, and career stagnation.",
          features: [
            {
              title: "Wasted Hours on Redundancy",
              description: "Spending endless time writing boilerplate code, configuring dependencies, and fixing minor config bugs.",
              icon: "clock"
            },
            {
              title: "Complex Monorepo Overhead",
              description: "Struggling to synchronize schemas, database migrations, and shared packages across complex frameworks.",
              icon: "alert-triangle"
            },
            {
              title: "Missing out on Agentic Power",
              description: "Not utilizing advanced agentic workflows that can code, refactor, and verify system integration autonomously.",
              icon: "cpu"
            }
          ],
          id: "Problems-webinar"
        }
      },
      {
        type: "Solution",
        props: {
          title: "Adopt the Agentic Engineering Blueprint",
          subtitle: "Learn the exact workflow tools and monorepo configurations to double your deployment speed and design premium systems.",
          features: [
            {
              title: "Autonomous Tool Integration",
              description: "Leverage standard database interfaces, server actions, and shared registries for lightning-fast feature assembly.",
              icon: "check"
            },
            {
              title: "Unified Branding Architecture",
              description: "Learn to build CSS-variable-injected components that apply brand identity changes instantly across your entire site.",
              icon: "paint-brush"
            },
            {
              title: "Production-Ready Monorepos",
              description: "Structure Next.js and Prisma/Drizzle setups for smooth transpilation, zero type errors, and instant serverless deploys.",
              icon: "box"
            }
          ],
          id: "Solution-webinar"
        }
      },
      {
        type: "Stats",
        props: {
          title: "Proven Blueprint Outcomes",
          stats: [
            { value: "10k+", label: "Engineers Trained" },
            { value: "2.5x", label: "Average Velocity Increase" },
            { value: "0", label: "Config Errors Post-Deploy" }
          ],
          id: "Stats-webinar"
        }
      },
      {
        type: "Testimonials",
        props: {
          title: "Success Stories from Active Engineers",
          subtitle: "Read feedback from software developers who applied the monorepo masterclass to double their performance.",
          testimonials: [
            {
              name: "David Heinemeier",
              text: "This masterclass completely shifted how I view AI programming. A must-watch for modern engineers."
            },
            {
              name: "Linus T.",
              text: "Finally, a practical course on monorepo architectures that does not skip the hard parts."
            }
          ],
          id: "Testimonials-webinar"
        }
      },
      {
        type: "FAQ",
        props: {
          title: "Frequently Asked Questions",
          subtitle: "Common answers regarding prerequisites, requirements, and scheduled slots.",
          faqs: [
            {
              question: "Siapa target audiens untuk kelas ini?",
              answer: "Webinar ini dirancang untuk Software Engineers, Project Managers, Product Designers, dan tech founders yang ingin mempercepat alur kerja digital menggunakan kerangka kerja monorepo modern dan sistem kecerdasan buatan."
            },
            {
              question: "Apakah masterclass ini benar-benar gratis?",
              answer: "Ya, 100% gratis. Live workshop dan semua blueprint referensi dibagikan tanpa biaya tambahan untuk peserta terdaftar."
            },
            {
              question: "Apakah rekaman webinar akan tersedia?",
              answer: "Rekaman webinar hanya akan dikirimkan kepada peserta yang terdaftar secara resmi sebelum acara dimulai."
            }
          ],
          id: "FAQ-webinar"
        }
      },
      {
        type: "CTA",
        props: {
          title: "Claim Your Free Masterclass Pass Now",
          subtitle: "Don't miss the opportunity to unlock exponential productivity. Secure your seat today and start building at warp speed.",
          ctaText: "Secure My Free Seat",
          id: "CTA-webinar"
        }
      }
    ],
    root: {
      title: "",
      status: "draft",
      metaDescription: "Live Webinar Event Registration Landing Page",
      metaKeywords: "webinar, masterclass, training, software engineering, AI",
      featuredImage: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      canonicalUrl: "",
      robotsIndex: "index",
      robotsFollow: "follow",
      theme: {}
    },
    zones: {}
  }
};
