export interface AgentType {
  id: number;
  name: string;
  description: string;
  category: string;
  phase: number;
  coordinator: boolean;
  expertise: string[];
  capabilities: string[];
  whenToUse: string[];
  relatedAgents: number[];
}

export interface PhaseType {
  id: number;
  name: string;
  description: string;
  workflowDescription: string;
}

// Define the 4 phases of business growth
export const phases: PhaseType[] = [
  {
    id: 1,
    name: "Ideation & Planning",
    description: "The journey begins with clarifying the business concept and laying foundational strategies.",
    workflowDescription: "Start with Business Development Agent to coordinate your ideation and planning process from concept to launch roadmap."
  },
  {
    id: 2,
    name: "Launch & Establish",
    description: "Focus shifts to product development, market entry, and establishing the business presence.",
    workflowDescription: "Dashboard Agent coordinates launch activities, ensuring synchronization between product development, marketing, and customer experience."
  },
  {
    id: 3,
    name: "Growth & Optimization",
    description: "After establishing market presence, focus shifts to optimization, improving customer experience, and expanding market reach.",
    workflowDescription: "Business Development Agent returns to oversee growth initiatives, aligning optimization efforts with the evolving business strategy."
  },
  {
    id: 4,
    name: "Scaling Beyond $10M",
    description: "The business has proven its model and now focuses on scaling operations, expanding market share, and potentially exploring new markets.",
    workflowDescription: "Scale Strategy Agent leads this phase, coordinating operational expansion while maintaining quality and corporate culture."
  }
];

// Define the 16 agents
export const agents: AgentType[] = [
  // Phase 1: Ideation & Planning
  {
    id: 1,
    name: "Business Development Agent",
    description: "Oversees the ideation and planning process, connecting insights from specialized agents to form a cohesive business strategy.",
    category: "Strategy",
    phase: 1,
    coordinator: true,
    expertise: ["Business Planning", "Strategic Development", "Market Analysis", "Resource Allocation"],
    capabilities: [
      "Coordinate multiple specialized agents into a cohesive business strategy",
      "Identify strategic gaps in business planning",
      "Recommend optimal resource allocation for startups",
      "Create comprehensive business roadmaps"
    ],
    whenToUse: [
      "When developing a new business concept from scratch",
      "When pivoting an existing business model",
      "When creating a comprehensive business plan",
      "When needing a strategic overview of your business idea"
    ],
    relatedAgents: [2, 3, 4, 5]
  },
  {
    id: 2,
    name: "Ideation Agent",
    description: "Helps entrepreneurs refine business concepts, validate ideas, and identify potential market opportunities through brainstorming sessions.",
    category: "Strategy",
    phase: 1,
    coordinator: false,
    expertise: ["Concept Development", "Market Opportunity Analysis", "Idea Validation", "Creative Problem Solving"],
    capabilities: [
      "Generate and refine business concepts",
      "Evaluate market viability of business ideas",
      "Identify unique value propositions",
      "Facilitate structured brainstorming sessions"
    ],
    whenToUse: [
      "When you have a rough business idea that needs development",
      "When exploring potential market opportunities",
      "When validating business concepts before investment",
      "When looking for creative solutions to business problems"
    ],
    relatedAgents: [1, 3, 6]
  },
  {
    id: 3,
    name: "Marketing & Branding Agent",
    description: "Develops initial brand identity, creates style guides, color palettes, and core messaging for product/service design.",
    category: "Marketing",
    phase: 1,
    coordinator: false,
    expertise: ["Brand Development", "Visual Identity", "Messaging Strategy", "Target Audience Analysis"],
    capabilities: [
      "Create comprehensive brand guidelines",
      "Develop core brand messaging and voice",
      "Design color palettes and visual identity elements",
      "Define target audience personas"
    ],
    whenToUse: [
      "When establishing a new brand from scratch",
      "When refreshing an existing brand identity",
      "When creating consistent marketing materials",
      "When developing targeted messaging for specific audiences"
    ],
    relatedAgents: [1, 8, 9]
  },
  {
    id: 4,
    name: "Finance & Budgeting Agent",
    description: "Establishes financial projections, startup budget requirements, and identifies potential funding sources.",
    category: "Finance",
    phase: 1,
    coordinator: false,
    expertise: ["Financial Projections", "Startup Budgeting", "Funding Strategy", "Cash Flow Management"],
    capabilities: [
      "Create detailed financial models and projections",
      "Develop startup and operational budgets",
      "Identify appropriate funding sources and strategies",
      "Analyze financial viability of business concepts"
    ],
    whenToUse: [
      "When creating financial projections for investors",
      "When establishing startup budgets",
      "When seeking appropriate funding options",
      "When analyzing financial viability of business models"
    ],
    relatedAgents: [1, 13, 15]
  },
  {
    id: 5,
    name: "Editor-in-Chief Agent",
    description: "Reviews business plans, financial projections, and brand guidelines for accuracy, clarity, and consistency.",
    category: "Content",
    phase: 1,
    coordinator: false,
    expertise: ["Content Review", "Quality Assurance", "Consistency Checking", "Communication Enhancement"],
    capabilities: [
      "Review and refine business documentation",
      "Ensure consistency across all business materials",
      "Improve clarity and professionalism of written content",
      "Standardize terminology and brand voice"
    ],
    whenToUse: [
      "When finalizing business plans or pitch decks",
      "When preparing documents for investors or partners",
      "When ensuring consistency across business materials",
      "When improving clarity of business communications"
    ],
    relatedAgents: [1, 9, 10]
  },
  
  // Phase 2: Launch & Establish
  {
    id: 6,
    name: "Dashboard Agent",
    description: "Monitors agent activities, prioritizes tasks, and ensures synchronization between product development, marketing, and customer experience.",
    category: "Strategy",
    phase: 2,
    coordinator: true,
    expertise: ["Project Management", "Cross-functional Coordination", "Launch Strategy", "Performance Monitoring"],
    capabilities: [
      "Coordinate complex launch activities across teams",
      "Monitor key performance indicators during launch",
      "Identify and address bottlenecks in launch process",
      "Ensure alignment between product, marketing, and customer experience"
    ],
    whenToUse: [
      "When managing the launch of new products or services",
      "When coordinating cross-functional business activities",
      "When establishing business operations and workflows",
      "When monitoring initial business performance metrics"
    ],
    relatedAgents: [7, 8, 9, 10, 11]
  },
  {
    id: 7,
    name: "Product Development Agent",
    description: "Guides the creation of market-ready products or services tailored to the business niche.",
    category: "Product",
    phase: 2,
    coordinator: false,
    expertise: ["Product Strategy", "Feature Prioritization", "MVP Development", "Product Roadmapping"],
    capabilities: [
      "Define minimum viable product specifications",
      "Prioritize product features based on market needs",
      "Create product development roadmaps",
      "Guide user experience and interface design"
    ],
    whenToUse: [
      "When developing new products or services",
      "When defining MVP features and specifications",
      "When creating product roadmaps",
      "When refining existing products based on market feedback"
    ],
    relatedAgents: [6, 11, 12]
  },
  {
    id: 8,
    name: "Content Strategy Agent",
    description: "Develops strategic content roadmap aligned with business goals and target audience needs.",
    category: "Marketing",
    phase: 2,
    coordinator: false,
    expertise: ["Content Planning", "Audience Engagement", "Value Proposition Communication", "Content ROI"],
    capabilities: [
      "Create comprehensive content strategies",
      "Align content with business objectives",
      "Develop content that addresses customer journey touchpoints",
      "Establish content performance metrics"
    ],
    whenToUse: [
      "When developing a content marketing strategy",
      "When planning content across multiple channels",
      "When aligning content with business objectives",
      "When establishing thought leadership in your industry"
    ],
    relatedAgents: [3, 6, 9]
  },
  {
    id: 9,
    name: "Content Planner Agent",
    description: "Creates detailed social media and content calendars to establish brand presence.",
    category: "Marketing",
    phase: 2,
    coordinator: false,
    expertise: ["Editorial Calendar Development", "Social Media Planning", "Content Distribution", "Audience Targeting"],
    capabilities: [
      "Create detailed editorial and social media calendars",
      "Plan content distribution across channels",
      "Optimize posting schedules for maximum engagement",
      "Coordinate content themes and campaigns"
    ],
    whenToUse: [
      "When establishing a content publishing schedule",
      "When planning social media content",
      "When developing multi-channel content campaigns",
      "When organizing content production workflows"
    ],
    relatedAgents: [3, 6, 8, 10]
  },
  {
    id: 10,
    name: "Copywriter & Author Agent",
    description: "Produces website copy, marketing materials, and potentially ebooks or job aids to establish expertise.",
    category: "Content",
    phase: 2,
    coordinator: false,
    expertise: ["Persuasive Writing", "Brand Voice Development", "Website Copy", "Marketing Collateral"],
    capabilities: [
      "Create compelling website and marketing copy",
      "Develop longer-form content like ebooks and guides",
      "Write consistent with established brand voice",
      "Craft persuasive calls-to-action"
    ],
    whenToUse: [
      "When creating website copy and marketing materials",
      "When developing lead magnets like ebooks or guides",
      "When establishing a consistent brand voice",
      "When writing sales-oriented content"
    ],
    relatedAgents: [5, 8, 9]
  },
  {
    id: 11,
    name: "Onboarding Agent",
    description: "Develops customer onboarding processes to ensure positive first experiences with the business.",
    category: "Customer Experience",
    phase: 2,
    coordinator: false,
    expertise: ["Customer Journey Mapping", "User Onboarding", "Experience Optimization", "Customer Retention"],
    capabilities: [
      "Design effective customer onboarding flows",
      "Create welcome sequences and materials",
      "Optimize first-time user experience",
      "Reduce early customer churn"
    ],
    whenToUse: [
      "When designing customer onboarding processes",
      "When creating welcome email sequences",
      "When improving product adoption rates",
      "When reducing early customer confusion or frustration"
    ],
    relatedAgents: [6, 7, 12]
  },
  
  // Phase 3: Growth & Optimization
  {
    id: 12,
    name: "SEO Strategist Agent",
    description: "Implements keyword research and optimization strategies to improve search visibility across platforms.",
    category: "Marketing",
    phase: 3,
    coordinator: false,
    expertise: ["Keyword Research", "On-page SEO", "Content Optimization", "Search Performance Analysis"],
    capabilities: [
      "Conduct comprehensive keyword research",
      "Optimize website content for search engines",
      "Develop SEO content strategies",
      "Track and improve search rankings"
    ],
    whenToUse: [
      "When improving website visibility in search engines",
      "When developing SEO-optimized content",
      "When analyzing search performance metrics",
      "When competing for specific keyword rankings"
    ],
    relatedAgents: [8, 9, 13]
  },
  {
    id: 13,
    name: "Customer Experience Feedback Agent",
    description: "Gathers and analyzes customer feedback to identify improvement opportunities in products and services.",
    category: "Customer Experience",
    phase: 3,
    coordinator: false,
    expertise: ["Feedback Collection", "Customer Insights", "Experience Improvement", "Satisfaction Measurement"],
    capabilities: [
      "Design effective feedback collection systems",
      "Analyze customer feedback for actionable insights",
      "Identify experience pain points and opportunities",
      "Recommend product and service improvements"
    ],
    whenToUse: [
      "When gathering customer feedback on products or services",
      "When measuring customer satisfaction metrics",
      "When identifying experience improvement opportunities",
      "When prioritizing product enhancements based on user feedback"
    ],
    relatedAgents: [7, 11, 12, 14]
  },
  {
    id: 14,
    name: "BLS Data Handler Agent",
    description: "Accesses and analyzes industry data to identify market trends and opportunities for business growth.",
    category: "Strategy",
    phase: 3,
    coordinator: false,
    expertise: ["Market Research", "Data Analysis", "Industry Trends", "Competitive Intelligence"],
    capabilities: [
      "Analyze industry and market data",
      "Identify emerging market trends",
      "Generate competitive intelligence reports",
      "Provide data-driven growth recommendations"
    ],
    whenToUse: [
      "When researching industry trends and opportunities",
      "When analyzing competitive landscape",
      "When making data-driven strategic decisions",
      "When identifying new market opportunities"
    ],
    relatedAgents: [1, 4, 15, 16]
  },
  
  // Phase 4: Scaling Beyond $10M
  {
    id: 15,
    name: "Scale Strategy Agent",
    description: "Develops comprehensive strategies for scaling operations, teams, and market reach beyond initial success.",
    category: "Strategy",
    phase: 4,
    coordinator: true,
    expertise: ["Scalability Planning", "Operational Expansion", "Market Penetration", "Growth Funding"],
    capabilities: [
      "Create scalable business models and processes",
      "Develop strategies for market expansion",
      "Plan operational scaling roadmaps",
      "Identify strategic growth funding options"
    ],
    whenToUse: [
      "When planning to scale successful business operations",
      "When expanding into new markets or segments",
      "When seeking growth capital or investment",
      "When building infrastructure for significant growth"
    ],
    relatedAgents: [14, 16]
  },
  {
    id: 16,
    name: "Enterprise Architect Agent",
    description: "Designs scalable business systems, processes, and organizational structures to support growth beyond $10M.",
    category: "Operations",
    phase: 4,
    coordinator: false,
    expertise: ["Systems Design", "Process Optimization", "Organizational Structure", "Scalable Infrastructure"],
    capabilities: [
      "Design scalable business systems and processes",
      "Optimize organizational structure for growth",
      "Implement enterprise-grade infrastructure",
      "Create operational playbooks and documentation"
    ],
    whenToUse: [
      "When designing systems to support significant growth",
      "When restructuring organization for scalability",
      "When implementing enterprise-grade processes",
      "When creating operational standards and playbooks"
    ],
    relatedAgents: [14, 15]
  }
];
