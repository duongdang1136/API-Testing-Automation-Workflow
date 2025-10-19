// Data models for the AI Test Script Generation System

export interface APISpecification {
  id: string;
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  fields: APIField[];
  statusCodes: StatusCode[];
  businessRules: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface APIField {
  name: string;
  dataType: string;
  required: boolean;
  validation?: string;
  example?: string;
}

export interface StatusCode {
  code: number;
  description: string;
  scenario: string;
}

export interface TestRequirement {
  id: string;
  specId: string;
  title: string;
  description: string;
  testType: 'happy' | 'exception' | 'validation' | 'business-rule';
  priority: 'high' | 'medium' | 'low';
  criteria: string[];
  generatedAt: string;
}

export interface TestScript {
  id: string;
  requirementId: string;
  title: string;
  description: string;
  language: 'javascript' | 'python' | 'typescript';
  framework: string;
  code: string;
  steps: TestStep[];
  mockData?: any;
  generatedAt: string;
}

export interface TestStep {
  order: number;
  action: string;
  input?: any;
  expectedOutput?: any;
  assertion?: string;
}

export interface PostmanCollection {
  info: {
    name: string;
    description: string;
    schema: string;
  };
  item: PostmanItem[];
  variable?: PostmanVariable[];
}

export interface PostmanItem {
  name: string;
  request: {
    method: string;
    header: any[];
    body?: any;
    url: {
      raw: string;
      host: string[];
      path: string[];
    };
  };
  event?: PostmanEvent[];
  response?: any[];
}

export interface PostmanEvent {
  listen: 'prerequest' | 'test';
  script: {
    type: string;
    exec: string[];
  };
}

export interface PostmanVariable {
  key: string;
  value: string;
  type: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'QC' | 'BA' | 'Developer';
  avatar?: string;
}

export interface AuthUser extends User {
  password?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface TeamMember {
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  createdBy: string;
  teamMembers: TeamMember[];
  features: Feature[];
  createdAt: string;
  updatedAt: string;
}

export interface Feature {
  id: string;
  projectId: string;
  name: string;
  description: string;
  apiSpecs: string[]; // Array of APISpecification IDs
  status: 'pending' | 'in-progress' | 'completed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // Store generated test data
  generationState?: {
    requirements: TestRequirement[];
    testScripts: TestScript[];
    postmanCollection?: PostmanCollection;
  };
}

export interface Version {
  id: string;
  projectId: string;
  featureId?: string;
  versionNumber: string;
  title: string;
  description: string;
  changes: VersionChange[];
  testScripts: string[]; // Array of TestScript IDs
  postmanCollection?: PostmanCollection;
  createdBy: string;
  createdAt: string;
  status: 'draft' | 'published' | 'deprecated';
}

export interface VersionChange {
  type: 'added' | 'modified' | 'removed' | 'fixed';
  description: string;
  timestamp: string;
}

export interface ProcessLog {
  id: string;
  timestamp: string;
  step: number;
  action: string;
  status: 'success' | 'error' | 'processing';
  message: string;
  userId: string;
}

export interface FeatureGenerationState {
  feature: Feature;
  step: 'requirements' | 'scripts' | 'json' | 'completed';
  requirements: TestRequirement[];
  testScripts: TestScript[];
  postmanCollection?: PostmanCollection;
}
