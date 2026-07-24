export type Tier = 'free' | 'pro';

export type TaskTypeId = 
  | 'email'
  | 'summarise'
  | 'brainstorm'
  | 'fix_code'
  | 'social_post'
  | 'blog_post'
  | 'roleplay'
  | 'data_analysis';

export interface TaskTypeConfig {
  id: TaskTypeId;
  title: string;
  description: string;
  category: string;
  iconName: string;
  isPro: boolean;
  defaultTopic: string;
  topicPlaceholder: string;
  toneOptions: string[];
  defaultTone: string;
  lengthOptions: string[];
  defaultLength: string;
  extraFields?: {
    key: string;
    label: string;
    placeholder: string;
    type: 'text' | 'textarea' | 'select';
    options?: string[];
    defaultValue?: string;
  }[];
}

export type TemplateStyleId = 
  | 'basic'
  | 'detailed'
  | 'expert'
  | 'chain_of_thought'
  | 'markdown_formatted'
  | 'few_shot';

export interface TemplateStyleConfig {
  id: TemplateStyleId;
  name: string;
  description: string;
  isPro: boolean;
  badge?: string;
}

export interface PromptFormState {
  taskTypeId: TaskTypeId;
  topic: string;
  tone: string;
  length: string;
  audience: string;
  constraints: string;
  templateStyle: TemplateStyleId;
  extraInputs: Record<string, string>;
}

export interface SavedPrompt {
  id: string;
  title: string;
  taskTypeId: TaskTypeId;
  promptText: string;
  createdAt: number;
  isFavorite: boolean;
  formState: PromptFormState;
}
