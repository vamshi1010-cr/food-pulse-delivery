export interface ProcessModel {
  id: string;
  name: string;
  category: 'Prescriptive' | 'Evolutionary' | 'Agile' | 'Specialized';
  syllabusUnit: 'UNIT - I' | 'UNIT - II';
  description: string;
  keyPhases: string[];
  pros: string[];
  cons: string[];
  bestSuitedFor: string;
  suitabilityForFoodDelivery: {
    score: number; // 1-10
    reason: string;
  };
}

export interface UserStory {
  id: string;
  epic: 'Customer Ordering' | 'Payment & Checkout' | 'Order Tracking' | 'Restaurant Management' | 'Driver Delivery';
  title: string;
  asA: string;
  iWantTo: string;
  soThat: string;
  acceptanceCriteria: string[];
  storyPoints: number; // 1, 2, 3, 5, 8, 13
  priority: 'High' | 'Medium' | 'Low';
  status: 'Backlog' | 'In Sprint' | 'Completed';
}

export interface SRSSection {
  id: string;
  unit: string;
  sectionNumber: string;
  title: string;
  content: string;
  subsections?: { title: string; detail: string }[];
}

export interface COCOMOInputs {
  kloc: number;
  mode: 'Organic' | 'Semi-Detached' | 'Embedded';
  costPerPersonMonth: number;
}

export interface COCOMOResult {
  effortPersonMonths: number;
  developmentTimeMonths: number;
  averageStaffSize: number;
  totalCostINR: number;
  productivityKLOCPerPM: number;
}

export interface FPInputs {
  eiCount: number; // External Inputs
  eoCount: number; // External Outputs
  eqCount: number; // External Inquiries
  ilfCount: number; // Internal Logical Files
  eifCount: number; // External Interface Files
  vaf: number; // Value Adjustment Factor (0.65 to 1.35)
}

export interface RiskItem {
  id: string;
  category: 'Technical' | 'Business' | 'Operational' | 'Security';
  riskDescription: string;
  probability: 'High' | 'Medium' | 'Low';
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  riskScore: number;
  mitigationStrategy: string;
  contingencyPlan: string;
}

export interface DFDNode {
  id: string;
  name: string;
  type: 'External Entity' | 'Process' | 'Data Store';
  description: string;
}

export interface DFDLink {
  from: string;
  to: string;
  dataFlowName: string;
}

export interface DFDLevel {
  level: 0 | 1 | 2;
  title: string;
  description: string;
  nodes: DFDNode[];
  links: DFDLink[];
}

export interface TestCase {
  id: string;
  type: 'Black-Box' | 'White-Box';
  technique: 'Equivalence Partitioning' | 'Boundary Value Analysis' | 'Statement Coverage' | 'Branch Coverage';
  module: string;
  testCaseName: string;
  inputData: string;
  expectedOutput: string;
  actualStatus: 'Passed' | 'Failed' | 'Pending';
  codeSnippet?: string;
}

export interface QualityMetric {
  attribute: 'Maintainability' | 'Reliability' | 'Usability' | 'Efficiency' | 'Portability' | 'Security';
  model: 'McCall' | 'HP FURPS';
  score: number; // 0 - 100
  target: number; // 0 - 100
  description: string;
  measurementMethod: string;
}
