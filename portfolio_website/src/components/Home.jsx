import React, { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Home.css";
import Picture348w from "./Images/profile-image-desktop.png";
import Picture646w from "./Images/profile-image-tablet.jpg";
import Picture890w from "./Images/profile-image-mobile.png";
import Ring from "./Images/design.svg";
import Circle from "./Images/Oval1.svg";
import AnimalDesign from "./Images/Dog_sales.jpg";
import SquidGame from "./Images/Squid_game.jpg";
import Invalid from "./Images/icon-invalid.svg";
import Soole from "./Images/Soole.png";
import Chacebyte from "./Images/Chacebyte.png";
import AIGenius from "./Images/AIGenius.png";
import Nobox from "./Images/Nobox.png";
import CrmPipeline from "./Images/pipedrive-crm.png";

// ─── Chatbot Knowledge Base ───────────────────────────────────────────────────
const WHATSAPP_LINK = "https://wa.me/2349167712906";
const CALENDLY_LINK = "https://calendly.com/jegedeglory007/quick-update-call";
const FORMSUBMIT_TOKEN = "0ecb6e1d1765e420a5a2db8c0dcb8e47";

const getBotReply = (userMsg) => {
  const raw = (userMsg || "").trim();
  const msg = raw.toLowerCase().replace(/[^\w\s@.-]/g, " ").replace(/\s+/g, " ").trim();

  // ── 1. Pleasantries & Greetings ──
  if (/^(thank|thanks|thx|appreciate|cheers|good job|awesome|great work|cool|nice|dope|love it)/i.test(msg)) {
    return {
      text: "You're very welcome! 😊 Jegshaddy puts real passion into every project. Feel free to ask about pricing, services, or how we can collaborate!",
      actions: [
        { label: "💰 Pricing", trigger: "Pricing" },
        { label: "💼 Services", trigger: "Services" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
      ],
    };
  }

  if (/^(bye|goodbye|see ya|later|cya|take care|have a good)/i.test(msg)) {
    return {
      text: "Thanks for stopping by! 🙏 Feel free to return anytime or reach out whenever you're ready to build something great. Have an awesome day! 🚀",
      actions: [
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
      ],
    };
  }

  if (/^(hi|hello|hey|howdy|hiya|sup|yo|good\s*(morning|afternoon|evening)|what'?s up)/i.test(msg)) {
    return {
      text: "Hey there! 👋 I'm Jegshaddy's assistant. I can help you with services, pricing, CRM automations, email marketing, projects, or booking a call.\n\nWhat would you like to explore today?",
      actions: [
        { label: "💰 Pricing", trigger: "Pricing" },
        { label: "💼 Services", trigger: "Services" },
        { label: "⚡ CRM & Automations", trigger: "CRM & Automations" },
        { label: "📧 Email Marketing", trigger: "Email Marketing" },
        { label: "🌐 No-Code Sites", trigger: "No-Code Websites" },
        { label: "📁 Projects", trigger: "Projects" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
      ],
    };
  }

  // ── 2. Pricing (Specific services & full guide) ──
  if (/(pric|rate|cost|how much|fee|charge|budget|quote|estimate|pricing)/i.test(msg)) {
    // CRM & Automations pricing
    if (/(crm|automat|zapier|make|workflow|integromat)/i.test(msg)) {
      return {
        text: "⚡ **CRM & Automations Pricing:**\n\n• **Single Workflow / Integration** (e.g. Zapier, Make scenario) — from $150\n• **Complete CRM Setup & Pipeline** (HubSpot, GoHighLevel, Airtable) — from $250 – $500\n• **Advanced Multi-Platform Systems** (webhooks, custom syncs, billing bots) — custom package\n\nAutomate your lead handling and save hours every week. Want to discuss your setup?",
        actions: [
          { label: "📅 Book a Discovery Call", url: CALENDLY_LINK },
          { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
          { label: "💰 Full Pricing Guide", trigger: "Pricing" },
        ],
      };
    }

    // Email Marketing pricing
    if (/(email|newsletter|campaign|klaviyo|mailchimp|brevo|convertkit|drip|sequence|flow)/i.test(msg)) {
      return {
        text: "📧 **Email Marketing Pricing:**\n\n• **Template Design & Coding** (responsive, branded) — from $150\n• **Automated Email Sequences** (Welcome, Nurture, Abandoned Cart) — from $250\n• **Full Account Setup & Strategy** (Klaviyo, Mailchimp, Brevo, ConvertKit) — from $350\n\nReady to turn your subscribers into repeat paying customers?",
        actions: [
          { label: "📅 Book a Discovery Call", url: CALENDLY_LINK },
          { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
          { label: "💰 Full Pricing Guide", trigger: "Pricing" },
        ],
      };
    }

    // No-Code Website pricing
    if (/(no\s*code|nocode|webflow|wordpress|wix|squarespace|shopify)/i.test(msg)) {
      return {
        text: "🌐 **No-Code Website Pricing:**\n\n• **Single-Page Landing Page** — from $200\n• **Multi-Page Website** (Webflow, WordPress, Wix, Squarespace) — from $250 – $600\n• **E-commerce or CMS Integration** — from $450\n\nIncludes complete responsive design, SEO setup, and an easy-to-use client editing dashboard!",
        actions: [
          { label: "📅 Book a Call", url: CALENDLY_LINK },
          { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
          { label: "💰 Full Pricing Guide", trigger: "Pricing" },
        ],
      };
    }

    // UI/UX Design pricing
    if (/(ui|ux|figma|design)/i.test(msg) && !/(web|app|site|code)/i.test(msg)) {
      return {
        text: "🎨 **UI/UX Design Pricing:**\n\n• **Single Screen / Landing Page Design** (Figma) — from $200\n• **Full Product Design & Interactive Prototype** — from $400+\n• **Design System & Components** — custom tailored package\n\nIncludes wireframes, mobile & desktop mockups, and developer-ready specs!",
        actions: [
          { label: "📅 Book a Call", url: CALENDLY_LINK },
          { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
          { label: "💰 Full Pricing Guide", trigger: "Pricing" },
        ],
      };
    }

    // Web apps / Full-stack pricing
    if (/(app|web\s*app|custom\s*web|full\s*stack|frontend|react|next)/i.test(msg)) {
      return {
        text: "💻 **Custom Web App & Development Pricing:**\n\n• **Frontend Web App** (React, Next.js) — starting from $400\n• **Full-Stack Application** (Backend, DB, Auth, APIs) — from $600 – $1,500+\n• **API Integration & Feature Add-ons** — from $200\n\nBuilt for speed, scalability, and seamless user experience!",
        actions: [
          { label: "📅 Book a Call", url: CALENDLY_LINK },
          { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
          { label: "💰 Full Pricing Guide", trigger: "Pricing" },
        ],
      };
    }

    // Master Pricing Overview (matches user's exact specification)
    return {
      text: "💰 Pricing depends on the scope of the project:\n\n• **Landing pages** — starting from $200\n• **Full websites / web apps** — from $400\n• **No-Code Website Design** — from $250\n• **CRM & Automations** — from $250\n• **Email Marketing** — from $150\n• **UI/UX Design** — from $200\n• **Monthly retainer** — custom packages available\n\nFor an accurate quote tailored to your project, let's jump on a quick call!",
      actions: [
        { label: "📅 Book a Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
        { label: "⚡ CRM & Automations", trigger: "CRM & Automations" },
        { label: "📧 Email Marketing", trigger: "Email Marketing" },
        { label: "🌐 No-Code Websites", trigger: "No-Code Websites" },
      ],
    };
  }

  // ── 3. Timeline & Turnaround ──
  if (/(timeline|turnaround|how\s*long|duration|deadline|delivery|speed|turn\s*around)/i.test(msg)) {
    return {
      text: "⏱️ **Project Turnaround Timelines:**\n\n• **Landing Pages & No-Code Sites** — 3–5 days\n• **CRM & Workflow Automations** — 2–5 days\n• **Email Marketing Sequences** — 2–4 days\n• **UI/UX Design Projects** — 1–2 weeks\n• **Full Web Apps & Platforms** — 2–6 weeks\n\n*Have an urgent deadline? Rush delivery is available upon request!*",
      actions: [
        { label: "📅 Check Availability", url: CALENDLY_LINK },
        { label: "💬 WhatsApp for Rush Job", url: WHATSAPP_LINK },
        { label: "💰 View Pricing", trigger: "Pricing" },
      ],
    };
  }

  // ── 4. Availability & Hiring ──
  if (/(availab|free|hire|hiring|contract|freelance|full\s*time|full-time|remote|open\s*to)/i.test(msg)) {
    return {
      text: "🟢 **Availability Status:**\n\nJegshaddy is **currently accepting new projects**! Available for:\n\n• Freelance client projects\n• Monthly retainers & ongoing maintenance\n• Contract roles & remote engineering positions\n\nLet's connect to discuss how he can support your team or business!",
      actions: [
        { label: "📅 Book a Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
      ],
    };
  }

  // ── 5. Process & How We Work Together ──
  if (/(process|how\s*do\s*we\s*(work|start)|steps?|workflow|how\s*it\s*works|onboarding)/i.test(msg)) {
    return {
      text: "🔄 **How We Work Together (5-Step Process):**\n\n1. **Discovery & Strategy** — We align on your goals, requirements, timeline, and deliverables\n2. **Proposal & Blueprint** — Clear milestone roadmap and transparent quote\n3. **Design & Build** — Development begins with regular preview updates\n4. **Review & Refinement** — Interactive feedback rounds until everything is pixel-perfect\n5. **Launch & Handover** — Deployment, client walkthrough, and post-launch support\n\nReady to get started?",
      actions: [
        { label: "📅 Book Discovery Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
        { label: "💰 View Pricing", trigger: "Pricing" },
      ],
    };
  }

  // ── 6. Book a Call / Calendly ──
  if (/(book|call|calendly|meeting|consult|schedule)/i.test(msg)) {
    return {
      text: "Let's talk! 🤝 You can book a free 30-minute discovery call directly on Calendly — no strings attached.",
      actions: [
        { label: "📅 Book a Call Now", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
      ],
    };
  }

  // ── 7. WhatsApp ──
  if (/(whatsapp|whats\s*app|wp|wa)/i.test(msg)) {
    return {
      text: "Prefer instant messaging? 📲 Reach out directly on WhatsApp for a quick response!",
      actions: [
        { label: "💬 Open WhatsApp", url: WHATSAPP_LINK },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
      ],
    };
  }

  // ── 8. Contact Form / Reach out ──
  if (/(contact|reach\s*out|get\s*in\s*touch|send\s*(a\s*)?message|contact\s*form)/i.test(msg) && !/(email\s*market|newsletter|sequence|flow|drip)/i.test(msg)) {
    return {
      text: "📬 You can reach out via the contact form at the bottom of this page, chat on WhatsApp, or book a quick call. Pick whatever works best for you!",
      actions: [
        { label: "📅 Book a Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
      ],
    };
  }

  // ── 9. Location & Timezone ──
  if (/(location|where\s*are\s*you|where\s*do\s*you\s*live|country|timezone|time\s*zone|nigeria|lagos)/i.test(msg)) {
    return {
      text: "🌍 **Location & Working Hours:**\n\nBased in **Nigeria (WAT / UTC+1)**.\n\nJegede works seamlessly with international clients across the **US (EST/PST)**, **UK (GMT/BST)**, **Europe (CET)**, and beyond through scheduled overlap calls and responsive asynchronous communication.",
      actions: [
        { label: "📅 Book a Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
      ],
    };
  }

  // ── 10. Revisions & Guarantee & Maintenance ──
  if (/(revision|guarantee|refund|change|support|maintenance|retainer|warranty)/i.test(msg)) {
    return {
      text: "🛡️ **Revisions & Quality Guarantee:**\n\n• **Revisions Included** — Iterative revisions during development until you are 100% satisfied\n• **Post-Launch Warranty** — Complimentary 14–30 days of bug fixing and adjustments after deployment\n• **Monthly Maintenance** — Retainer options available for ongoing updates, automations, and tech support\n\nClient peace of mind is guaranteed!",
      actions: [
        { label: "💰 View Retainer Pricing", trigger: "Pricing" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
      ],
    };
  }

  // ── 11. Payment Terms & Methods ──
  if (/(payment|pay\b|paying\b|how\s*(do\s*i|can\s*i|to)\s*pay|deposit|invoice|wire|transfer|stripe|paypal|wise)/i.test(msg)) {
    return {
      text: "💳 **Payment Structure & Methods:**\n\n• **Structure** — 50% upfront to lock in the schedule, and 50% upon final approval and project delivery\n• **Milestones** — Larger platforms can be divided into 3–4 milestone installments\n• **Accepted Methods** — Bank Transfer, Wise, PayPal, Crypto, or direct invoicing\n\nTransparent, secure, with no surprise costs.",
      actions: [
        { label: "💰 View Pricing", trigger: "Pricing" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
      ],
    };
  }

  // ── 12. Mobile Apps / Responsiveness ──
  if (/(mobile\s*app|responsive|mobile\s*friendly|pwa|ios|android)/i.test(msg)) {
    return {
      text: "📱 **Mobile & Responsive Development:**\n\nEvery build is 100% mobile-first and tested across all smartphone, tablet, and desktop screen sizes. Cross-platform mobile apps and Progressive Web Apps (PWAs) are also available depending on project needs.",
      actions: [
        { label: "📁 View Projects", trigger: "Projects" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
      ],
    };
  }

  // ── 13. About Glory / Who is Jegshaddy? ──
  if (/(who\s*(are\s*you|is\s*(glory|jegede|jegshaddy))|about\s*(you|yourself|glory|jegede|jegshaddy)|who\s*made\s*this|your\s*bio|your\s*background|your\s*experience|your\s*story)/i.test(msg)) {
    return {
      text: "👋 **About Jegede Glory (Jegshaddy):**\n\nJegede Glory is a versatile **Software Developer, UI/UX Designer, and Automation Specialist** based in Nigeria, working with international brands and clients.\n\nHe crafts high-converting websites, robust custom web apps (React/Next.js), no-code solutions (Webflow, WordPress), and automated business workflows (Zapier, Make, CRM pipelines) that drive real growth.",
      actions: [
        { label: "💼 View Services", trigger: "Services" },
        { label: "📁 View Projects", trigger: "Projects" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
      ],
    };
  }

  // ── 14. CRM & Automations Capabilities ──
  if (/(crm|automat|zapier|make\.com|make|integromat|workflow|pipeline|gohighlevel|ghl|hubspot|fluid|pipedrive|activecampaign)/i.test(msg)) {
    return {
      text: "⚡ **CRM & Workflow Automations:**\n\nJegshaddy helps businesses cut out hours of manual work by connecting tools and streamlining client pipelines:\n\n• **CRM Setup & Optimization** — HubSpot, GoHighLevel, Pipedrive, Fluid, Zoho\n• **Workflow Automation** — Zapier, Make.com, custom webhooks & REST APIs\n• **Lead & Sales Pipelines** — Auto-capture leads, sync to CRM, and trigger instant alerts\n• **Billing & Onboarding Sync** — Stripe/PayPal integrations connecting to contracts and emails\n\n**Starting from $250**. Would you like to automate your business operations?",
      actions: [
        { label: "💰 Automation Pricing", trigger: "CRM Pricing" },
        { label: "📅 Book a Discovery Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
        { label: "📧 Email Marketing", trigger: "Email Marketing" },
      ],
    };
  }

  // ── 15. Email Marketing Capabilities ──
  if (/(email\s*market|newsletter|klaviyo|mailchimp|brevo|convertkit|beehiiv|drip|email\s*sequence|email\s*flow)/i.test(msg)) {
    return {
      text: "📧 **Email Marketing & Funnels:**\n\nTurn one-off visitors into loyal, paying customers with high-converting email systems:\n\n• **Automated Sequences** — Welcome series, nurture flows, abandoned cart & re-engagement\n• **Custom Templates** — Responsive, branded HTML email designs that render cleanly on all devices\n• **Platform Setups** — Klaviyo, Mailchimp, Brevo, ConvertKit, Beehiiv\n• **Segmentation & Strategy** — Targeted campaigns designed to maximize open and click rates\n\n**Starting from $150**. Ready to launch or optimize your email marketing?",
      actions: [
        { label: "💰 Email Pricing", trigger: "Email Marketing Pricing" },
        { label: "📅 Book a Discovery Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
        { label: "⚡ CRM & Automations", trigger: "CRM & Automations" },
      ],
    };
  }

  // ── 16. No-Code Website Design Capabilities ──
  if (/(no\s*code|nocode|webflow|wordpress|wix|squarespace|shopify|elementor)/i.test(msg)) {
    return {
      text: "🌐 **No-Code Website Design:**\n\nLaunch a modern, pixel-perfect website fast that you can manage easily without touching code:\n\n• **Platforms** — Webflow, WordPress, Wix Studio, Squarespace, Shopify\n• **Custom Design** — Tailored to your brand aesthetic, not cookie-cutter templates\n• **Responsive & SEO-Ready** — Fast loading, mobile-optimized, and search engine friendly\n• **Client Handover** — Easy walkthrough so you can edit text, swap images, and add content anytime\n\n**Starting from $250**. Need a new website or a refresh?",
      actions: [
        { label: "💰 No-Code Pricing", trigger: "No-Code Pricing" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
        { label: "📁 View Projects", trigger: "Projects" },
      ],
    };
  }

  // ── 17. UI / UX Design ──
  if (/(ui\s*\/\s*ux|uiux|ui\s*design|ux\s*design|figma|wireframe|prototype|mockup)/i.test(msg)) {
    return {
      text: "🎨 **UI/UX & Product Design:**\n\nVisually stunning, intuitive interfaces engineered for conversion:\n\n• **Tools** — Figma, modern prototyping tools\n• **Deliverables** — Wireframes, interactive click-through prototypes, component libraries\n• **Modern Aesthetics** — High-contrast dark/light modes, accessible typography, sleek layouts\n• **Developer Handoff** — Cleanly organized assets and specs ready for engineering\n\n**Starting from $200**. Need a design system or prototype?",
      actions: [
        { label: "💰 UI/UX Pricing", trigger: "UI/UX Pricing" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
        { label: "📁 View Projects", trigger: "Projects" },
      ],
    };
  }

  // ── 18. Tech Stack & Frontend / Full-Stack Coding ──
  if (/(tech\s*stack|stack|technolog|react|next\.?js|javascript|typescript|frontend|front\s*end|backend|node|coding|developer|development)/i.test(msg)) {
    return {
      text: "💻 **Tech Stack & Engineering Skills:**\n\nJegshaddy builds scalable, clean-code web applications using modern technologies:\n\n• **Frontend** — React.js, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, SCSS, Tailwind CSS\n• **Backend & APIs** — Node.js, Express, REST APIs, database integration\n• **Deployment & Versioning** — Git, GitHub, Vercel, Render\n• **Design & Tools** — Figma, Postman\n\nCode is modular, maintainable, responsive, and performance-tuned.",
      actions: [
        { label: "📁 View Projects", trigger: "Projects" },
        { label: "💰 View Pricing", trigger: "Pricing" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
      ],
    };
  }

  // ── 19. Projects & Portfolio Showcase ──
  if (/(portfolio|case\s*stud|sample|demo|soole|chacebyte|ai\s*genius|nobox|squid|pet\s*rescue|past\s*work|show\s*(me\s*)?(your\s*)?(project|work)|what\s*(have\s*you|did\s*you)\s*(built|made|created)|projects\b)/i.test(msg)) {
    return {
      text: "🚀 **Featured Projects by Jegshaddy:**\n\n• **Pipedrive CRM Setup** — Sales pipeline, custom deal stages & lead workflow automations\n• **SOÓLÈ** — Mobility waitlist platform (HTML, CSS, JS)\n• **Chacebyte** — Tech corporate & consulting platform (React, TypeScript, SCSS, APIs)\n• **AI Genius** — AI-powered chat application (React, API Integration)\n• **NOBOX** — Modern cloud product & UI/UX showcase\n• **Pet Rescue & Squid Game** — Creative interactive web experiences\n\nExplore live links and details in the **Projects** section right below on this page!",
      actions: [
        { label: "💼 All Services", trigger: "Services" },
        { label: "💰 View Pricing", trigger: "Pricing" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
        { label: "💬 Chat on WhatsApp", url: WHATSAPP_LINK },
      ],
    };
  }

  // ── 20. General Services Overview ──
  if (/(service|what\s*(do|can)\s*you\s*(do|offer|build|make)|help)/i.test(msg)) {
    return {
      text: "🛠️ **Here's what Jegshaddy does:**\n\n• **Frontend & Web Apps** — React, Next.js, HTML/CSS, TypeScript\n• **No-Code Websites** — Wix, WordPress, Webflow, Squarespace, Shopify\n• **CRM & Automations** — Zapier, Make.com, HubSpot, lead pipelines\n• **Email Marketing** — Campaigns, drip sequences, newsletter design\n• **UI/UX Design** — Figma, responsive prototypes & design systems\n• **Full-Stack Web & Mobile Apps** — Backend APIs, databases & integrations\n\nWhat would you like to build?",
      actions: [
        { label: "💰 Pricing Guide", trigger: "Pricing" },
        { label: "⚡ CRM & Automations", trigger: "CRM & Automations" },
        { label: "📧 Email Marketing", trigger: "Email Marketing" },
        { label: "🌐 No-Code Websites", trigger: "No-Code Websites" },
        { label: "📁 Featured Projects", trigger: "Projects" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
      ],
    };
  }

  // ── 21. Smart Fallback ──
  return {
    text: "That's a great question! While I don't have the exact answer in my quick reference, Jegshaddy will be happy to walk you through it directly. 🚀\n\nFeel free to explore our services, check out pricing, or reach out directly:",
    actions: [
      { label: "💰 Pricing", trigger: "Pricing" },
      { label: "💼 Services", trigger: "Services" },
      { label: "⚡ CRM & Automations", trigger: "CRM & Automations" },
      { label: "📧 Email Marketing", trigger: "Email Marketing" },
      { label: "📁 Projects", trigger: "Projects" },
      { label: "📅 Book a Call", url: CALENDLY_LINK },
      { label: "💬 WhatsApp", url: WHATSAPP_LINK },
    ],
  };
};

// ─── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ message, type, visible }) => (
  <div className={`toast toast_${type} ${visible ? "toast_visible" : ""}`}>
    <span>{type === "success" ? "✅" : "❌"}</span>
    <p>{message}</p>
  </div>
);

// ─── Chatbot Component ────────────────────────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Hi there! 👋 I'm Jegshaddy's virtual assistant. Ask me anything — pricing, services, CRM automations, email marketing, projects, or how to get started!",
      actions: [
        { label: "💰 Pricing", trigger: "Pricing" },
        { label: "💼 Services", trigger: "Services" },
        { label: "⚡ CRM & Automations", trigger: "CRM & Automations" },
        { label: "📧 Email Marketing", trigger: "Email Marketing" },
        { label: "🌐 No-Code Sites", trigger: "No-Code Websites" },
        { label: "📁 Projects", trigger: "Projects" },
        { label: "📅 Book a Call", url: CALENDLY_LINK },
        { label: "💬 WhatsApp", url: WHATSAPP_LINK },
      ],
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const idCounter = useRef(2);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages, scrollToBottom]);

  const addMessage = (from, text, actions = []) => {
    const id = idCounter.current++;
    setMessages((prev) => [...prev, { id, from, text, actions }]);
    return id;
  };

  const handleSend = useCallback(
    (textOverride) => {
      const text = (textOverride || inputVal).trim();
      if (!text) return;

      addMessage("user", text);
      setInputVal("");
      setIsTyping(true);

      setTimeout(() => {
        const reply = getBotReply(text);
        setIsTyping(false);
        addMessage("bot", reply.text, reply.actions);
      }, 800 + Math.random() * 400);
    },
    [inputVal]
  );

  const handleQuickAction = (action) => {
    if (action.trigger) {
      // Quick reply chip that sends a predefined message
      handleSend(action.trigger);
    } else if (action.url) {
      window.open(action.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatText = (text) => {
    // Bold **text** and line breaks
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <React.Fragment key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < text.split("\n").length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="chatbot_toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {hasUnread && !isOpen && <span className="chatbot_badge">1</span>}
      </button>

      {/* Chat Window */}
      <div className={`chatbot_window ${isOpen ? "chatbot_open" : ""}`} role="dialog" aria-label="Chat assistant">
        <div className="chatbot_header">
          <div className="chatbot_avatar">JG</div>
          <div className="chatbot_header_info">
            <h3>Jegshaddy's Assistant</h3>
            <span className="chatbot_status">
              <span className="chatbot_dot"></span> Online
            </span>
          </div>
          <button
            className="chatbot_close_btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        <div className="chatbot_messages" role="log" aria-live="polite">
          {messages.map((msg) => (
            <div key={msg.id} className={`chatbot_message chatbot_message_${msg.from}`}>
              {msg.from === "bot" && (
                <div className="chatbot_msg_avatar">JG</div>
              )}
              <div className="chatbot_bubble">
                <p>{formatText(msg.text)}</p>
                {msg.actions && msg.actions.length > 0 && (
                  <div className="chatbot_actions">
                    {msg.actions.map((action, i) => (
                      <button
                        key={i}
                        className="chatbot_action_btn"
                        onClick={() => handleQuickAction(action)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chatbot_message chatbot_message_bot">
              <div className="chatbot_msg_avatar">JG</div>
              <div className="chatbot_bubble chatbot_typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot_input_area">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask me anything..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="chatbot_input"
            aria-label="Type a message"
          />
          <button
            className="chatbot_send_btn"
            onClick={() => handleSend()}
            aria-label="Send message"
            disabled={!inputVal.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Main Home Component ──────────────────────────────────────────────────────
const Home = () => {
  const form = useRef();
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [isSending, setIsSending] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value?.trim() || "";
    const email = document.getElementById("email")?.value?.trim() || "";
    const message = document.getElementById("message")?.value?.trim() || "";

    if (!name || !email || !message) {
      showToast("Please fill in all fields before sending.", "error");
      return;
    }

    setIsSending(true);

    const formData = { name, email, message };

    // 1. If a custom backend URL is explicitly configured, try it first
    if (process.env.REACT_APP_BACKEND_URL) {
      try {
        const response = await axios.post(
          process.env.REACT_APP_BACKEND_URL,
          formData
        );
        if (response.data && response.data.success) {
          setIsSending(false);
          showToast("Message sent! I'll get back to you soon. 🎉", "success");
          if (form.current) form.current.reset();
          return;
        }
      } catch (backendError) {
        console.warn(
          "Custom backend unavailable, falling back to direct delivery:",
          backendError
        );
      }
    }

    // 2. Direct delivery to Gmail via FormSubmit (reliable, no local server needed)
    try {
      const response = await axios.post(
        `https://formsubmit.co/ajax/${FORMSUBMIT_TOKEN}`,
        {
          name,
          email,
          message,
          _subject: `New Portfolio Message from ${name}`,
          _template: "table",
          _captcha: "false",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      setIsSending(false);

      const resData = response.data || {};
      const isSuccess =
        resData.success === true ||
        resData.success === "true" ||
        resData.status === "success";
      const isActivation =
        typeof resData.message === "string" &&
        resData.message.toLowerCase().includes("activation");

      if (isSuccess) {
        showToast("Message sent! I'll get back to you soon. 🎉", "success");
        if (form.current) form.current.reset();
      } else if (isActivation) {
        showToast(
          "Activation email sent to jegsboy007@gmail.com! Please click 'Activate Form' in your inbox (one-time setup).",
          "success"
        );
        if (form.current) form.current.reset();
      } else {
        showToast(
          resData.message || "Oops! That didn't go through. Please try again.",
          "error"
        );
      }
    } catch (error) {
      setIsSending(false);
      console.error("Error sending email:", error);
      showToast("Oops! That didn't go through. Please try again.", "error");
    }
  };

  return (
    <div>
      {/* ── Toast Notification ── */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
      />

      {/* ── Chatbot ── */}
      <Chatbot />

      <header className="header">
        <h2 className="visually_hidden">Header</h2>
        <div className="wrapper">
          <nav className="header_nav">
            <a href="/" className="header_home">
              jegshaddy
              <span className="visually_hidden">{"{to home page}"}</span>
            </a>

            <a href="https://github.com/Jegedeglory" className="header_social">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                aria-labelledby="socialGithub"
                role="img"
              >
                <title id="socialGithub">Github</title>
                <path
                  fill="#FFF"
                  fill-rule="evenodd"
                  d="M12.304 0C5.506 0 0 5.506 0 12.304c0 5.444 3.522 10.042 8.413 11.672.615.108.845-.261.845-.584 0-.292-.015-1.261-.015-2.291-3.091.569-3.891-.754-4.137-1.446-.138-.354-.738-1.446-1.261-1.738-.43-.23-1.046-.8-.016-.815.97-.015 1.661.892 1.892 1.261 1.107 1.86 2.876 1.338 3.584 1.015.107-.8.43-1.338.784-1.646-2.738-.307-5.598-1.368-5.598-6.074 0-1.338.477-2.446 1.26-3.307-.122-.308-.553-1.569.124-3.26 0 0 1.03-.323 3.383 1.26.985-.276 2.03-.415 3.076-.415 1.046 0 2.092.139 3.076.416 2.353-1.6 3.384-1.261 3.384-1.261.676 1.691.246 2.952.123 3.26.784.861 1.26 1.953 1.26 3.307 0 4.721-2.875 5.767-5.613 6.074.446.385.83 1.123.83 2.277 0 1.645-.015 2.968-.015 3.383 0 .323.231.708.846.584a12.324 12.324 0 0 0 8.382-11.672C24.607 5.506 19.101 0 12.304 0Z"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/jegedeglory"
              className="header_social"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                aria-labelledby="socialLinkedIn"
                role="img"
              >
                <title id="socialLinkedIn">LinkedIn</title>
                <path
                  fill="#FFF"
                  fill-rule="evenodd"
                  d="M5.551 3.304c-1.14 0-2.067.926-2.067 2.064 0 1.14.928 2.066 2.067 2.066a2.066 2.066 0 0 0 0-4.13ZM3.767 8.998v11.453h3.562L7.33 8.998H3.767Zm5.798 0V20.45l3.554.002.002-5.668c0-1.454.253-2.941 2.132-2.941 1.851 0 1.851 1.755 1.851 3.036v5.571l3.559-.001v-6.28c0-2.834-.517-5.457-4.27-5.457-1.763 0-2.916.997-3.368 1.85h-.05V8.997h-3.41ZM22.435 24H1.982c-.976 0-1.77-.777-1.77-1.732V1.731C.212.776 1.006 0 1.982 0h20.453c.98 0 1.777.776 1.777 1.73v20.538c0 .955-.797 1.732-1.777 1.732Z"
                />
              </svg>
            </a>
            <a href="https://x.com/jegshady" className="header_social">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="20"
                aria-labelledby="socialTwitter"
                role="img"
              >
                <title id="socialTwitter"> Twitter</title>
                <path
                  fill="#FFF"
                  d="M23.492 2.705a9.563 9.563 0 0 1-2.742.751 4.788 4.788 0 0 0 2.1-2.643 9.536 9.536 0 0 1-3.033 1.159 4.778 4.778 0 0 0-8.14 4.357 13.564 13.564 0 0 1-9.844-4.99 4.774 4.774 0 0 0-.646 2.4 4.778 4.778 0 0 0 2.124 3.977 4.765 4.765 0 0 1-2.163-.598v.061a4.778 4.778 0 0 0 3.832 4.684 4.812 4.812 0 0 1-2.158.082 4.78 4.78 0 0 0 4.462 3.316 9.584 9.584 0 0 1-5.932 2.045c-.38 0-.762-.022-1.14-.067a13.508 13.508 0 0 0 7.32 2.146c8.787 0 13.59-7.277 13.59-13.589 0-.205-.004-.412-.013-.617a9.71 9.71 0 0 0 2.381-2.471l.002-.003Z"
                />
              </svg>
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="wrapper  hero_wrapper bottom_border">
            <div className="hero_content">
              <picture>
                <source media="(min-width: 62.5em)" srcset={Picture348w} />
                <source media="(min-width: 37.5em)" srcset={Picture646w} />
                <img
                  src={Picture890w}
                  className="hero_image"
                  alt=""
                  width={174}
                  height={383}
                />
              </picture>
              <img
                src={Ring}
                alt=""
                width={530}
                height={129}
                className="hero_rings"
              />
              <img
                src={Circle}
                alt=""
                width={129}
                height={129}
                className="hero_circle"
              />
              <div className="hero_text">
                <h1 className="hero_headline header_xl">
                  Welcome on board!
                  <br /> I'm <span>Jegede Glory</span>
                </h1>
                <p className="hero_description">
                  Based in Nigeria, I'm a Software developer, aspiring to build
                  &amp; learn new things about the web that users love
                </p>
                {/* ── Hero CTA Buttons ── */}
                <div className="hero_cta_group">
                  <a
                    href="https://wa.link/slcgup"
                    className="hero_contact underline"
                  >
                    {" "}
                    Contact me
                  </a>
                  <a
                    href={CALENDLY_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero_book_call underline"
                  >
                    {" "}
                    Book a Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="skills">
          <h2 className="visually_hidden">Skills</h2>
          <h2 className="projects_headline header_xl wrapper">Tech Stacks</h2>
          <div className="wrapper skills_wrapper bottom_border">
<p align="center" style={{display: "inline-flex", gap: "20px"}}> 
  <a href="https://www.figma.com/" target="_blank" rel="noreferrer"> 
    <img src="https://www.vectorlogo.zone/logos/figma/figma-icon.svg" alt="figma" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://nextjs.org/" target="_blank" rel="noreferrer"> 
    <img src="https://cdn.worldvectorlogo.com/logos/nextjs-2.svg" alt="nextjs" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://sass-lang.com" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sass/sass-original.svg" alt="sass" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"> 
    <img src="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" alt="tailwind" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> 
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" style={{width: "clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)", height:"clamp(2.5rem, 0.4167rem + 6.6667vw, 6.25rem)"}}/> 
  </a> 
  <br />
</p>


</div>
          <img
            src={Ring}
            alt=""
            width={530}
            height={129}
            className="skills_rings"
          />
        </section>
        <section className="projects">
          <div className="wrapper projects_wrapper">
            <div className="projects_grid">
              <h2 className="projects_headline header_xl">Projects</h2>
              <a
                href="https://wa.link/slcgup"
                className="projects_contact underline"
              >
                {" "}
                Contact me
              </a>

              <div className="projects_item">
                <picture className="projects_picture">
                  <source media="(min-width: 62.5em)" srcSet={Soole} />
                  <img
                    src={Soole}
                    alt=""
                    width={343}
                    height={253}
                    className="projects_image"
                  />
                </picture>
                <h3 className="projects_name">SOÓLÈ</h3>
                <p className="project_tags">
                  <span>HTML</span>
                  <span>CSS</span>
                  <span>Javascript</span>
                </p>
                <div className="projects_links">
                  <a href="https://soole-waitlist.vercel.app/" className="underline">
                    View Project
                  </a>
                  <a href="https://github.com/Jegedeglory/soole" className="underline">
                    View code
                  </a>
                </div>
              </div>
              <div className="projects_item">
                <picture className="projects_picture">
                  <source media="(min-width: 62.5em)" srcSet={CrmPipeline} />
                  <img
                    src={CrmPipeline}
                    alt="Pipedrive CRM Setup & Pipeline"
                    width={343}
                    height={253}
                    className="projects_image"
                  />
                </picture>
                <h3 className="projects_name">Pipedrive CRM Setup</h3>
                <p className="project_tags">
                  <span>PIPEDRIVE</span>
                  <span>CRM SETUP</span>
                  <span>SALES PIPELINE</span>
                  <span>AUTOMATIONS</span>
                </p>
                <div className="projects_links">
                  <a
                    href={CALENDLY_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Book Setup Call
                  </a>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Inquire on WhatsApp
                  </a>
                </div>
              </div>
              <div className="projects_item">
                <picture className="projects_picture">
                  <source media="(min-width: 62.5em)" srcSet={Chacebyte} />
                  <img
                    src={Chacebyte}
                    alt=""
                    width={343}
                    height={253}
                    className="projects_image"
                  />
                </picture>
                <h3 className="projects_name">Chacebyte</h3>
                <p className="project_tags">
                  <span>HTML</span>
                  <span>SCSS</span>
                  <span>TYPESCRIPT</span>
                  <span>REACT</span>
                  <span>API INTEGRATION</span>
                </p>
                <div className="projects_links">
                  <a href="https://www.chacebyteng.com/" className="underline">
                    View Project
                  </a>
                  <a href="https://github.com/Jegedeglory" className="underline">
                    View code
                  </a>
                </div>
              </div>
              <div className="projects_item">
                <picture className="projects_picture">
                  <source media="(min-width: 62.5em)" srcSet={AIGenius} />
                  <img
                    src={AIGenius}
                    alt=""
                    width={343}
                    height={253}
                    className="projects_image"
                  />
                </picture>
                <h3 className="projects_name">AI Genius</h3>
                <p className="project_tags">
                  <span>AI</span>
                  <span>CHATBOT</span>
                  <span>REACT</span>
                  <span>API</span>
                </p>
                <div className="projects_links">
                  <a href="https://aigenius.chat" className="underline">
                    View Project
                  </a>
                  <a href="https://github.com/Jegedeglory" className="underline">
                    View code
                  </a>
                </div>
              </div>
              <div className="projects_item">
                <picture className="projects_picture">
                  <source media="(min-width: 62.5em)" srcSet={Nobox} />
                  <img
                    src={Nobox}
                    alt=""
                    width={343}
                    height={253}
                    className="projects_image"
                  />
                </picture>
                <h3 className="projects_name">NOBOX</h3>
                <p className="project_tags">
                  <span>UI/UX</span>
                  <span>REACT</span>
                  <span>API</span>
                </p>
                <div className="projects_links">
                  <a href="https://nobox-site.vercel.app" className="underline">
                    View Project
                  </a>
                  <a href="https://github.com/Jegedeglory" className="underline">
                    View code
                  </a>
                </div>
              </div>
              <div className="projects_item">
                <picture className="projects_picture">
                  <source media="(min-width: 62.5em)" srcSet={AnimalDesign} />
                  <img
                    src={AnimalDesign}
                    alt=""
                    width={343}
                    height={253}
                    className="projects_image"
                  />
                </picture>
                <h3 className="projects_name">Pet rescue</h3>
                <p className="project_tags">
                  <span>HTML</span>
                  <span>CSS</span>
                </p>
                <div className="projects_links">
                  <a href="/" className="underline">
                    View Project
                  </a>
                  <a href="/" className="underline">
                    View Code
                  </a>
                </div>
              </div>
              <div className="projects_item">
                <picture className="projects_picture">
                  <source media="(min-width: 62.5em)" srcSet={SquidGame} />
                  <img
                    src={SquidGame}
                    alt=""
                    width={343}
                    height={253}
                    className="projects_image"
                  />
                </picture>
                <h3 className="projects_name">Squid game</h3>
                <p className="project_tags">
                  <span>HTML</span>
                  <span>CSS</span>
                </p>
                <div className="projects_links">
                  <a href="https://dashboard.nobox.cloud/upload/folders/67ebba38e9ce287a7ac15b4c" className="underline">
                    View Project
                  </a>
                  <a href="https://github.com/Jegedeglory" className="underline">
                    View code
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
        <section className="contact bg_less_dark">
          <div className="wrapper contact_wrapper bottom_border">
            <div className="contact_text">
              <h2 className="contact_headline header_xl">Contact</h2>
              <p className="contact_description">
                I would really love to hear about your project and how I can be
                of help. Please, feel free to enlighten me about it and I will
                get back to you as soon as possible.
              </p>
              {/* ── Quick contact options ── */}
              <div className="contact_quick_actions">
                <a
                  href={CALENDLY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {" "}
                  Book a Call
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {" "}
                  WhatsApp
                </a>
              </div>
            </div>
            <form
              action=""
              ref={form}
              onSubmit={sendEmail}
              className="contact_form"
            >
              <div className="contact_control">
                <label htmlFor="name" className="visually_hidden">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  name="name"
                  required
                />
                <img
                  src={Invalid}
                  alt=""
                  className="contact_invalid_icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="contact_control">
                <label htmlFor="email" className="visually_hidden">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  placeholder="Email"
                  name="email"
                  required
                />
                <img
                  src={Invalid}
                  alt=""
                  className="contact_invalid_icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="contact_control">
                <label htmlFor="message" className="visually_hidden">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  placeholder="Message"
                  cols={30}
                  rows={3}
                  required
                ></textarea>
                <img
                  src={Invalid}
                  alt=""
                  className="contact_invalid_icon"
                  width={24}
                  height={24}
                />
              </div>
              <div className="contact_control align_right">
                <button type="submit" disabled={isSending}>
                  {isSending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
          <img
            src={Ring}
            alt=""
            width={530}
            height={129}
            className="contact_rings"
          />
        </section>
      </main>
      <footer className="footer bg_less_dark">
        <h2 className="visually_hidden">Footer</h2>
        <div className="wrapper">
          <nav className="header_nav">
            <a href="/" className="header_home">
              jegshaddy
              <span className="visually_hidden">{"{to home page}"}</span>
            </a>

            <a href="https://github.com/Jegedeglory" className="header_social">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                aria-labelledby="socialGithub"
                role="img"
              >
                <title id="socialGithub">Github</title>
                <path
                  fill="#FFF"
                  fill-rule="evenodd"
                  d="M12.304 0C5.506 0 0 5.506 0 12.304c0 5.444 3.522 10.042 8.413 11.672.615.108.845-.261.845-.584 0-.292-.015-1.261-.015-2.291-3.091.569-3.891-.754-4.137-1.446-.138-.354-.738-1.446-1.261-1.738-.43-.23-1.046-.8-.016-.815.97-.015 1.661.892 1.892 1.261 1.107 1.86 2.876 1.338 3.584 1.015.107-.8.43-1.338.784-1.646-2.738-.307-5.598-1.368-5.598-6.074 0-1.338.477-2.446 1.26-3.307-.122-.308-.553-1.569.124-3.26 0 0 1.03-.323 3.383 1.26.985-.276 2.03-.415 3.076-.415 1.046 0 2.092.139 3.076.416 2.353-1.6 3.384-1.261 3.384-1.261.676 1.691.246 2.952.123 3.26.784.861 1.26 1.953 1.26 3.307 0 4.721-2.875 5.767-5.613 6.074.446.385.83 1.123.83 2.277 0 1.645-.015 2.968-.015 3.383 0 .323.231.708.846.584a12.324 12.324 0 0 0 8.382-11.672C24.607 5.506 19.101 0 12.304 0Z"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/jegedeglory"
              className="header_social"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                aria-labelledby="socialLinkedIn"
                role="img"
              >
                <title id="socialLinkedIn">LinkedIn</title>
                <path
                  fill="#FFF"
                  fill-rule="evenodd"
                  d="M5.551 3.304c-1.14 0-2.067.926-2.067 2.064 0 1.14.928 2.066 2.067 2.066a2.066 2.066 0 0 0 0-4.13ZM3.767 8.998v11.453h3.562L7.33 8.998H3.767Zm5.798 0V20.45l3.554.002.002-5.668c0-1.454.253-2.941 2.132-2.941 1.851 0 1.851 1.755 1.851 3.036v5.571l3.559-.001v-6.28c0-2.834-.517-5.457-4.27-5.457-1.763 0-2.916.997-3.368 1.85h-.05V8.997h-3.41ZM22.435 24H1.982c-.976 0-1.77-.777-1.77-1.732V1.731C.212.776 1.006 0 1.982 0h20.453c.98 0 1.777.776 1.777 1.73v20.538c0 .955-.797 1.732-1.777 1.732Z"
                />
              </svg>
            </a>
            <a href="https://x.com/jegshady" className="header_social">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="20"
                aria-labelledby="socialTwitter"
                role="img"
              >
                <title id="socialTwitter"> Twitter</title>
                <path
                  fill="#FFF"
                  d="M23.492 2.705a9.563 9.563 0 0 1-2.742.751 4.788 4.788 0 0 0 2.1-2.643 9.536 9.536 0 0 1-3.033 1.159 4.778 4.778 0 0 0-8.14 4.357 13.564 13.564 0 0 1-9.844-4.99 4.774 4.774 0 0 0-.646 2.4 4.778 4.778 0 0 0 2.124 3.977 4.765 4.765 0 0 1-2.163-.598v.061a4.778 4.778 0 0 0 3.832 4.684 4.812 4.812 0 0 1-2.158.082 4.78 4.78 0 0 0 4.462 3.316 9.584 9.584 0 0 1-5.932 2.045c-.38 0-.762-.022-1.14-.067a13.508 13.508 0 0 0 7.32 2.146c8.787 0 13.59-7.277 13.59-13.589 0-.205-.004-.412-.013-.617a9.71 9.71 0 0 0 2.381-2.471l.002-.003Z"
                />
              </svg>
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Home;
