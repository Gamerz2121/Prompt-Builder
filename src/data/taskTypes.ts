import { TaskTypeConfig, TemplateStyleConfig, TaskTypeId, PromptFormState } from '../types';

export const TASK_TYPES: TaskTypeConfig[] = [
  // --- FREE TASK TYPES (3 Task Types) ---
  {
    id: 'email',
    title: 'Write an Email',
    description: 'Draft professional emails, follow-ups, pitch messages, or customer responses.',
    category: 'Communication',
    iconName: 'Mail',
    isPro: false,
    defaultTopic: 'Follow up on quarterly project status with client',
    topicPlaceholder: 'e.g., Asking for a raise, follow-up after interview, project deadline update...',
    toneOptions: ['Professional', 'Friendly & Casual', 'Persuasive', 'Urgent & Direct', 'Diplomatic', 'Enthusiastic'],
    defaultTone: 'Professional',
    lengthOptions: ['Concise (1-2 paragraphs)', 'Medium (~300 words)', 'Detailed & Thorough', 'Bullet Points'],
    defaultLength: 'Concise (1-2 paragraphs)',
    extraFields: [
      {
        key: 'recipient',
        label: 'Recipient / Relationship',
        placeholder: 'e.g., Senior Vice President, Client, Team Member',
        type: 'text',
      },
      {
        key: 'callToAction',
        label: 'Desired Outcome / Action',
        placeholder: 'e.g., Schedule 15-min call, approve budget, reply with feedback',
        type: 'text',
      }
    ]
  },
  {
    id: 'summarise',
    title: 'Summarise Text',
    description: 'Condense long articles, reports, meeting notes, or books into key insights.',
    category: 'Productivity',
    iconName: 'FileText',
    isPro: false,
    defaultTopic: 'Annual Q3 financial earnings report and strategic roadmap',
    topicPlaceholder: 'e.g., 10-page research paper on renewable energy, meeting transcript...',
    toneOptions: ['Objective & Neutral', 'Executive / High-Level', 'Simplified / ELI5', 'Actionable'],
    defaultTone: 'Objective & Neutral',
    lengthOptions: ['TL;DR (1-2 sentences)', 'Top 5 Key Bullet Points', 'Executive Summary (1 page)', 'Detailed Outline'],
    defaultLength: 'Top 5 Key Bullet Points',
    extraFields: [
      {
        key: 'focusArea',
        label: 'Key Focus Area',
        placeholder: 'e.g., Financial figures, action items, risks & challenges',
        type: 'text',
      }
    ]
  },
  {
    id: 'brainstorm',
    title: 'Brainstorm Ideas',
    description: 'Generate creative concepts, marketing angles, business strategies, or titles.',
    category: 'Creative',
    iconName: 'Lightbulb',
    isPro: false,
    defaultTopic: 'Growth marketing ideas for a new eco-friendly coffee brand',
    topicPlaceholder: 'e.g., YouTube video ideas for AI coding, remote team building activities...',
    toneOptions: ['Creative & Bold', 'Practical & Feasible', 'Disruptive & Innovative', 'Fun & Engaging'],
    defaultTone: 'Creative & Bold',
    lengthOptions: ['10 High-Impact Ideas', '5 Detailed Concepts', '20 Fast Idea Bullets', 'Matrix (Pros/Cons)'],
    defaultLength: '10 High-Impact Ideas',
    extraFields: [
      {
        key: 'targetMarket',
        label: 'Target Audience / Market',
        placeholder: 'e.g., Gen Z, B2B SaaS Founders, Fitness Enthusiasts',
        type: 'text',
      }
    ]
  },

  // --- PRO TASK TYPES (5+ Task Types) ---
  {
    id: 'fix_code',
    title: 'Fix & Refactor Code',
    description: 'Debug errors, optimize performance, refactor logic, or convert code languages.',
    category: 'Engineering',
    iconName: 'Code',
    isPro: true,
    defaultTopic: 'Fix memory leak in React useEffect state listener',
    topicPlaceholder: 'e.g., Async function throwing unhandled rejection, optimize SQL query...',
    toneOptions: ['Technical & Direct', 'Instructive / Educational', 'Senior Engineer Review', 'Strict & Clean'],
    defaultTone: 'Technical & Direct',
    lengthOptions: ['Code Fix + Explanation', 'Refactored Code Only', 'Step-by-Step Debug Guide', 'Comprehensive Code Review'],
    defaultLength: 'Code Fix + Explanation',
    extraFields: [
      {
        key: 'language',
        label: 'Programming Language / Framework',
        placeholder: 'e.g., TypeScript / React 19, Python / FastAPI, SQL',
        type: 'text',
        defaultValue: 'TypeScript / React'
      },
      {
        key: 'errorCode',
        label: 'Error Message / Snippet / Behavior',
        placeholder: 'Paste error message or described buggy behavior here...',
        type: 'textarea'
      }
    ]
  },
  {
    id: 'social_post',
    title: 'Write a Social Post',
    description: 'Craft viral LinkedIn posts, X/Twitter threads, or engaging Instagram captions.',
    category: 'Marketing',
    iconName: 'Share2',
    isPro: true,
    defaultTopic: 'Lessons learned launching a tech startup with $0 marketing budget',
    topicPlaceholder: 'e.g., Key take-aways from a tech conference, product feature launch...',
    toneOptions: ['Thought Leadership', 'Storytelling / Conversational', 'Witty & Punchy', 'Educational', 'Bold / Controversial'],
    defaultTone: 'Thought Leadership',
    lengthOptions: ['Short & Punchy (LinkedIn/X)', '1 Twitter/X Thread (5 posts)', 'Detailed Story Post', 'Headline + Caption + Hashtags'],
    defaultLength: 'Short & Punchy (LinkedIn/X)',
    extraFields: [
      {
        key: 'platform',
        label: 'Social Platform',
        placeholder: 'e.g., LinkedIn, Twitter/X, Instagram, Threads',
        type: 'select',
        options: ['LinkedIn', 'Twitter / X', 'Instagram', 'Threads', 'TikTok Script'],
        defaultValue: 'LinkedIn'
      },
      {
        key: 'hookStyle',
        label: 'Hook Style',
        placeholder: 'e.g., Surprising stat, personal mistake, counter-intuitive insight',
        type: 'text',
      }
    ]
  },
  {
    id: 'blog_post',
    title: 'Draft Blog / Article',
    description: 'Structure comprehensive SEO blog posts, guides, tutorials, or opinion pieces.',
    category: 'Writing',
    iconName: 'PenTool',
    isPro: true,
    defaultTopic: 'The Ultimate Guide to Building Web Apps with Modern AI Tools',
    topicPlaceholder: 'e.g., How to start a side hustle in 2026, 10 habits of productive developers...',
    toneOptions: ['Authoritative & Educational', 'Conversational & Engaging', 'Journalistic & Data-Driven', 'Step-by-Step Practical'],
    defaultTone: 'Authoritative & Educational',
    lengthOptions: ['Short Guide (~800 words)', 'Comprehensive Guide (~1500 words)', 'Article Outline & Hook Only', 'Long-form Deep Dive'],
    defaultLength: 'Comprehensive Guide (~1500 words)',
    extraFields: [
      {
        key: 'seoKeywords',
        label: 'Target SEO Keywords',
        placeholder: 'e.g., AI coding apps, React tutorial, web development 2026',
        type: 'text',
      }
    ]
  },
  {
    id: 'roleplay',
    title: 'Roleplay / Persona Expert',
    description: 'Assign a world-class expert persona to critique, advice, or interview you.',
    category: 'Consulting',
    iconName: 'UserCheck',
    isPro: true,
    defaultTopic: 'Critique my product strategy and pitch deck like a Silicon Valley VC',
    topicPlaceholder: 'e.g., Senior Systems Architect reviewing database schema, Interviewer testing React...',
    toneOptions: ['Critically Honest & Sharp', 'Supportive & Mentoring', 'Socratic & Questioning', 'Ruthless & Unfiltered'],
    defaultTone: 'Critically Honest & Sharp',
    lengthOptions: ['Interactive Conversation', 'Structured Feedback Matrix', 'Roleplay Simulation', 'Top Recommendations First'],
    defaultLength: 'Structured Feedback Matrix',
    extraFields: [
      {
        key: 'personaName',
        label: 'Persona / Role to Adopt',
        placeholder: 'e.g., Principal Staff Software Engineer at Google, Harsh Venture Capitalist',
        type: 'text',
      }
    ]
  },
  {
    id: 'data_analysis',
    title: 'Data & Table Analysis',
    description: 'Extract insights, generate SQL queries, or format raw data into actionable reports.',
    category: 'Analytics',
    iconName: 'BarChart3',
    isPro: true,
    defaultTopic: 'Analyze monthly customer churn rates and recommend retention strategies',
    topicPlaceholder: 'e.g., Compare sales revenue by region, clean messy CSV columns...',
    toneOptions: ['Analytical & Precise', 'Executive Summary Style', 'Data Science Rigorous', 'Plain Language Insights'],
    defaultTone: 'Analytical & Precise',
    lengthOptions: ['Key Insights + Action Items', 'SQL Query + Breakdown', 'Formatted Markdown Table', 'Full Analytical Report'],
    defaultLength: 'Key Insights + Action Items',
    extraFields: [
      {
        key: 'dataFormat',
        label: 'Input Data Type',
        placeholder: 'e.g., CSV list, JSON payload, SQL Database tables, sales metrics',
        type: 'text',
      }
    ]
  }
];

export const TEMPLATE_STYLES: TemplateStyleConfig[] = [
  {
    id: 'basic',
    name: 'Basic Template',
    description: 'Simple, direct prompt structure framing topic, tone, and length.',
    isPro: false,
    badge: 'FREE'
  },
  {
    id: 'detailed',
    name: 'Detailed & Structured',
    description: 'Includes context background, explicit objective, rules, and formatting rules.',
    isPro: true,
    badge: 'PRO'
  },
  {
    id: 'expert',
    name: 'Expert Persona Framing',
    description: 'Assigns top-tier domain expertise persona, standards, and rigorous constraints.',
    isPro: true,
    badge: 'PRO'
  },
  {
    id: 'chain_of_thought',
    name: 'Chain-of-Thought (CoT)',
    description: 'Forces step-by-step internal reasoning before delivering the final answer.',
    isPro: true,
    badge: 'PRO'
  },
  {
    id: 'markdown_formatted',
    name: 'Markdown & Variables',
    description: 'Clean structured layout with dynamic placeholders, headings, and strict output rules.',
    isPro: true,
    badge: 'PRO'
  },
  {
    id: 'few_shot',
    name: 'Few-Shot / Example Guided',
    description: 'Includes strict input/output format specifications and example guidelines.',
    isPro: true,
    badge: 'PRO'
  }
];

export function assemblePrompt(state: PromptFormState): string {
  const task = TASK_TYPES.find((t) => t.id === state.taskTypeId) || TASK_TYPES[0];
  const topic = state.topic.trim() || task.defaultTopic;
  const tone = state.tone || task.defaultTone;
  const length = state.length || task.defaultLength;
  const audience = state.audience.trim();
  const constraints = state.constraints.trim();
  const extra = state.extraInputs || {};

  switch (state.templateStyle) {
    case 'basic': {
      let prompt = `Task: ${task.title}\n`;
      prompt += `Topic / Subject: ${topic}\n`;
      prompt += `Tone: ${tone}\n`;
      prompt += `Length / Output Format: ${length}\n`;

      if (audience) {
        prompt += `Target Audience: ${audience}\n`;
      }

      Object.entries(extra).forEach(([key, value]) => {
        if (value && value.trim()) {
          const fieldDef = task.extraFields?.find(f => f.key === key);
          const label = fieldDef ? fieldDef.label : key;
          prompt += `${label}: ${value.trim()}\n`;
        }
      });

      if (constraints) {
        prompt += `Key Constraints / Instructions: ${constraints}\n`;
      }

      prompt += `\nPlease provide a clear, well-formatted response following the instructions above.`;
      return prompt;
    }

    case 'detailed': {
      let prompt = `### CONTEXT & OBJECTIVE\n`;
      prompt += `You are acting as an expert assistant. Your objective is to assist with the following task:\n`;
      prompt += `• Primary Task: ${task.title}\n`;
      prompt += `• Core Topic: ${topic}\n\n`;

      prompt += `### PARAMETERS & SPECIFICATIONS\n`;
      prompt += `• Desired Tone: ${tone}\n`;
      prompt += `• Expected Length & Format: ${length}\n`;
      if (audience) prompt += `• Target Audience: ${audience}\n`;

      const extraEntries = Object.entries(extra).filter(([_, val]) => val && val.trim());
      if (extraEntries.length > 0) {
        extraEntries.forEach(([key, val]) => {
          const fieldDef = task.extraFields?.find(f => f.key === key);
          const label = fieldDef ? fieldDef.label : key;
          prompt += `• ${label}: ${val.trim()}\n`;
        });
      }

      prompt += `\n### QUALITY CONSTRAINTS & GUIDELINES\n`;
      prompt += `1. Avoid generic filler, fluff, or conversational preambles.\n`;
      prompt += `2. Ensure all content is directly relevant to the target audience and purpose.\n`;
      if (constraints) {
        prompt += `3. Additional Constraints: ${constraints}\n`;
      } else {
        prompt += `3. Use modern formatting with bold headings, clean lists, and actionable phrasing.\n`;
      }

      prompt += `\n### OUTPUT REQUEST\n`;
      prompt += `Generate the final completed output now.`;
      return prompt;
    }

    case 'expert': {
      let prompt = `ROLE DEFINITION:\n`;
      prompt += `Act as a world-class 10x expert specialist in ${task.category} with decades of industry mastery.\n\n`;

      prompt += `MISSION:\n`;
      prompt += `Execute the following task with exceptional precision, insight, and polish:\n`;
      prompt += `"${task.title}: ${topic}"\n\n`;

      prompt += `EXECUTION STANDARDS:\n`;
      prompt += `- Tone: ${tone} (Maintain this voice consistently throughout)\n`;
      prompt += `- Format & Scope: ${length}\n`;
      if (audience) prompt += `- Audience: Tailored specifically for ${audience}\n`;

      Object.entries(extra).forEach(([key, value]) => {
        if (value && value.trim()) {
          const fieldDef = task.extraFields?.find(f => f.key === key);
          const label = fieldDef ? fieldDef.label : key;
          prompt += `- ${label}: ${value.trim()}\n`;
        }
      });

      if (constraints) {
        prompt += `- Explicit Constraints: ${constraints}\n`;
      }

      prompt += `\nCRITICAL DIRECTIVE:\n`;
      prompt += `Do not give standard, low-effort template answers. Apply high-value domain knowledge, strategic depth, and crisp formatting. Proceed directly to the output.`;
      return prompt;
    }

    case 'chain_of_thought': {
      let prompt = `Goal: ${task.title}\n`;
      prompt += `Topic: ${topic}\n`;
      prompt += `Tone: ${tone} | Target Length: ${length}\n`;
      if (audience) prompt += `Audience: ${audience}\n`;

      Object.entries(extra).forEach(([key, value]) => {
        if (value && value.trim()) {
          const fieldDef = task.extraFields?.find(f => f.key === key);
          const label = fieldDef ? fieldDef.label : key;
          prompt += `${label}: ${value.trim()}\n`;
        }
      });

      if (constraints) prompt += `Constraints: ${constraints}\n`;

      prompt += `\nINSTRUCTIONS (CHAIN OF THOUGHT):\n`;
      prompt += `To ensure maximum accuracy and quality, please follow these explicit reasoning steps before providing your final response:\n\n`;
      prompt += `Step 1: Analyze the core objective, audience needs, and key parameters.\n`;
      prompt += `Step 2: Outline the main key sections or strategic angles required.\n`;
      prompt += `Step 3: Refine tone to match "${tone}" and eliminate unnecessary fluff or cliché language.\n`;
      prompt += `Step 4: Present your thought process briefly under a "### Reasoning & Analysis" heading, followed by the final output under a "### Final Output" heading.`;

      return prompt;
    }

    case 'markdown_formatted': {
      let prompt = `# Prompt: ${task.title}\n\n`;
      prompt += `> **Task Category:** ${task.category}  \n`;
      prompt += `> **Tone:** ${tone}  \n`;
      prompt += `> **Output Length:** ${length}\n\n`;

      prompt += `## 🎯 Primary Topic\n${topic}\n\n`;

      if (audience) {
        prompt += `## 👥 Target Audience\n${audience}\n\n`;
      }

      const extraEntries = Object.entries(extra).filter(([_, val]) => val && val.trim());
      if (extraEntries.length > 0) {
        prompt += `## ⚙️ Additional Parameters\n`;
        extraEntries.forEach(([key, val]) => {
          const fieldDef = task.extraFields?.find(f => f.key === key);
          const label = fieldDef ? fieldDef.label : key;
          prompt += `- **${label}:** ${val.trim()}\n`;
        });
        prompt += `\n`;
      }

      prompt += `## 📋 Requirements & Constraints\n`;
      prompt += `- Format output using clean Markdown syntax (headings, bullet points, code blocks where appropriate).\n`;
      if (constraints) {
        prompt += `- ${constraints}\n`;
      } else {
        prompt += `- Ensure tone is consistently ${tone}.\n`;
      }

      prompt += `\n---\n*Please generate the output below according to these instructions.*`;
      return prompt;
    }

    case 'few_shot': {
      let prompt = `System Directive:\n`;
      prompt += `You are an AI specialized in ${task.category}. Follow the structural pattern and guidelines below to complete the request.\n\n`;

      prompt += `[REQUEST DETAILS]\n`;
      prompt += `Task: ${task.title}\n`;
      prompt += `Topic: ${topic}\n`;
      prompt += `Tone: ${tone}\n`;
      prompt += `Format: ${length}\n`;
      if (audience) prompt += `Audience: ${audience}\n`;
      if (constraints) prompt += `Constraints: ${constraints}\n`;

      prompt += `\n[EXPECTED OUTPUT STYLE GUIDELINE]\n`;
      prompt += `- High-impact opening line that grabs attention immediately.\n`;
      prompt += `- Logical body progression with zero fluff or robotic phrases.\n`;
      prompt += `- Clear, actionable conclusion or call to action.\n\n`;

      prompt += `[ACTION]\n`;
      prompt += `Generate the response following this quality bar now.`;
      return prompt;
    }

    default:
      return `Task: ${task.title}\nTopic: ${topic}\nTone: ${tone}\nFormat: ${length}\n\nPlease generate the response.`;
  }
}
