export interface WorkflowStepType {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  agent: string;
}

export interface WorkflowType {
  id: number;
  phaseId: number;
  name: string;
  description: string;
  coordinator: string;
  steps: WorkflowStepType[];
}

export const workflows: WorkflowType[] = [
  {
    id: 1,
    phaseId: 1,
    name: "Ideation & Planning",
    description: "A comprehensive workflow to take your business idea from concept to a fully-developed launch plan.",
    coordinator: "Business Development Agent",
    steps: [
      {
        id: 1,
        stepNumber: 1,
        title: "Business Concept Refinement",
        description: "The Ideation Agent works with the entrepreneur to clarify and refine the business concept through guided exploration.",
        agent: "Ideation Agent"
      },
      {
        id: 2,
        stepNumber: 2,
        title: "Brand Foundation Development",
        description: "Marketing & Branding Agent creates initial brand identity based on the refined business concept.",
        agent: "Marketing & Branding Agent"
      },
      {
        id: 3,
        stepNumber: 3,
        title: "Financial Planning",
        description: "Finance & Budgeting Agent develops initial financial projections and startup budget requirements.",
        agent: "Finance & Budgeting Agent"
      },
      {
        id: 4,
        stepNumber: 4,
        title: "Strategic Roadmap Creation",
        description: "Business Development Agent synthesizes all inputs to create a comprehensive business strategy and launch roadmap.",
        agent: "Business Development Agent"
      }
    ]
  },
  {
    id: 2,
    phaseId: 2,
    name: "Launch & Establish",
    description: "A coordinated workflow to successfully bring your business to market and establish your brand presence.",
    coordinator: "Dashboard Agent",
    steps: [
      {
        id: 5,
        stepNumber: 1,
        title: "Product/Service Development",
        description: "Product Development Agent guides the creation and refinement of initial offerings.",
        agent: "Product Development Agent"
      },
      {
        id: 6,
        stepNumber: 2,
        title: "Content Creation Pipeline",
        description: "Content Strategy and Planner Agents collaborate to develop content strategy and calendar, while Copywriter creates assets.",
        agent: "Content Strategy Agent"
      },
      {
        id: 7,
        stepNumber: 3,
        title: "Customer Journey Design",
        description: "Onboarding Agent creates smooth customer acquisition and onboarding processes.",
        agent: "Onboarding Agent"
      },
      {
        id: 8,
        stepNumber: 4,
        title: "Launch Execution",
        description: "Dashboard Agent coordinates launch activities across all departments, ensuring synchronization and alignment.",
        agent: "Dashboard Agent"
      }
    ]
  },
  {
    id: 3,
    phaseId: 3,
    name: "Growth & Optimization",
    description: "A data-driven workflow to optimize your established business and drive growth through targeted improvements.",
    coordinator: "Business Development Agent",
    steps: [
      {
        id: 9,
        stepNumber: 1,
        title: "Performance Analysis",
        description: "BLS Data Handler Agent analyzes market and performance data to identify growth opportunities.",
        agent: "BLS Data Handler Agent"
      },
      {
        id: 10,
        stepNumber: 2,
        title: "Customer Experience Improvement",
        description: "Customer Experience Feedback Agent collects and analyzes user feedback to identify improvement areas.",
        agent: "Customer Experience Feedback Agent"
      },
      {
        id: 11,
        stepNumber: 3,
        title: "Search Visibility Enhancement",
        description: "SEO Strategist Agent implements optimization strategies to improve content and website performance.",
        agent: "SEO Strategist Agent"
      },
      {
        id: 12,
        stepNumber: 4,
        title: "Growth Strategy Refinement",
        description: "Business Development Agent consolidates insights to refine and evolve the business growth strategy.",
        agent: "Business Development Agent"
      }
    ]
  },
  {
    id: 4,
    phaseId: 4,
    name: "Scaling Beyond $10M",
    description: "A strategic workflow to scale your successful business to enterprise level with robust systems and processes.",
    coordinator: "Scale Strategy Agent",
    steps: [
      {
        id: 13,
        stepNumber: 1,
        title: "Scalability Assessment",
        description: "Scale Strategy Agent evaluates current business model and identifies scaling opportunities and limitations.",
        agent: "Scale Strategy Agent"
      },
      {
        id: 14,
        stepNumber: 2,
        title: "Market Expansion Planning",
        description: "BLS Data Handler Agent identifies new market opportunities and expansion strategies.",
        agent: "BLS Data Handler Agent"
      },
      {
        id: 15,
        stepNumber: 3,
        title: "Systems & Process Design",
        description: "Enterprise Architect Agent designs scalable infrastructure, systems, and processes to support growth.",
        agent: "Enterprise Architect Agent"
      },
      {
        id: 16,
        stepNumber: 4,
        title: "Scale Execution Framework",
        description: "Scale Strategy Agent creates a comprehensive framework for executing growth at scale while maintaining quality.",
        agent: "Scale Strategy Agent"
      }
    ]
  }
];
