import type { 
  ProcessModel, 
  UserStory, 
  SRSSection, 
  RiskItem, 
  DFDLevel, 
  TestCase, 
  QualityMetric 
} from '../types/se';

export const PROCESS_MODELS_DATA: ProcessModel[] = [
  {
    id: 'pm-agile-scrum',
    name: 'Agile Scrum Framework',
    category: 'Agile',
    syllabusUnit: 'UNIT - II',
    description: 'Iterative & incremental framework structured around 2-4 week Sprints, daily standups, backlog refinement, sprint review, and retrospective.',
    keyPhases: ['Product Backlog Grooming', 'Sprint Planning', '2-Week Sprint Execution', 'Daily Scrum', 'Sprint Review & Demo', 'Retrospective'],
    pros: ['High adaptability to changing market demands', 'Continuous customer feedback & early delivery', 'Risk reduction via short release cycles'],
    cons: ['Requires active client involvement', 'Scope creep risk if product backlog is poorly defined', 'Documentation can be minimal'],
    bestSuitedFor: 'Complex, rapidly evolving consumer web apps like Online Food Delivery where market conditions and feature requests fluctuate.',
    suitabilityForFoodDelivery: {
      score: 9.8,
      reason: 'RECOMMENDED MODEL: Enables fast rollout of features (e.g. UPI payments, live GPS map tracking, seasonal surge pricing) in 2-week Sprints based on real customer feedback.'
    }
  },
  {
    id: 'pm-waterfall',
    name: 'Prescriptive Waterfall Model',
    category: 'Prescriptive',
    syllabusUnit: 'UNIT - I',
    description: 'Classic sequential software process model where each phase (Requirements -> Design -> Implementation -> Testing -> Deployment) must be completely finished before moving to the next.',
    keyPhases: ['Requirement Analysis', 'System Design', 'Implementation & Coding', 'Integration & System Testing', 'Deployment & Maintenance'],
    pros: ['Clear documentation & milestone tracking', 'Easy to manage for fixed-scope projects', 'Well-defined deliverables at each phase'],
    cons: ['Inflexible to mid-project changes', 'No working software delivered until late in lifecycle', 'High risk if requirements are misstated'],
    bestSuitedFor: 'Regulated systems with rigid, non-changing requirements (e.g. Banking core, Aerospace control).',
    suitabilityForFoodDelivery: {
      score: 4.2,
      reason: 'Poor fit for food delivery start-ups due to inability to accommodate evolving user feedback or real-time location tracking API modifications mid-way.'
    }
  },
  {
    id: 'pm-prototyping',
    name: 'Evolutionary Prototyping Model',
    category: 'Evolutionary',
    syllabusUnit: 'UNIT - I',
    description: 'Iterative creation of quick visual working mockups to help stakeholders visualize requirements before full-scale engineering.',
    keyPhases: ['Requirements Gathering', 'Quick Design', 'Build Prototype', 'Customer Evaluation', 'Refine Requirements', 'Final Product Engineering'],
    pros: ['Excellent user engagement', 'Early detection of UX/UI flaws', 'Clarifies complex features like live map routing'],
    cons: ['Risk of fast prototyping leading to messy code architecture', 'User might mistake prototype for final production software'],
    bestSuitedFor: 'UI/UX intensive components like live delivery tracking map & checkout flow.',
    suitabilityForFoodDelivery: {
      score: 8.9,
      reason: 'Extremely effective for designing the real-time driver GPS tracking UI and restaurant menu customization interface before backend integration.'
    }
  },
  {
    id: 'pm-rad',
    name: 'Rapid Application Development (RAD)',
    category: 'Prescriptive',
    syllabusUnit: 'UNIT - I',
    description: 'High-speed adaptation of the linear sequential model using component-based construction and reusable libraries.',
    keyPhases: ['Business Modeling', 'Data Modeling', 'Process Modeling', 'Application Generation', 'Testing & Turnover'],
    pros: ['Dramatically reduced development time', 'High reuse of components'],
    cons: ['Requires strong, highly skilled team', 'Requires modular software architecture'],
    bestSuitedFor: 'Internal merchant & driver administrative dashboards.',
    suitabilityForFoodDelivery: {
      score: 7.5,
      reason: 'Good for rapidly building merchant portal and internal order dispatch engine using pre-built UI components.'
    }
  },
  {
    id: 'pm-spiral',
    name: 'The Spiral Model',
    category: 'Evolutionary',
    syllabusUnit: 'UNIT - I',
    description: 'Risk-driven process model generator coupling iterative prototyping with systematic Waterfall controls.',
    keyPhases: ['Determine Objectives', 'Identify & Resolve Risks', 'Development & Testing', 'Plan Next Phase'],
    pros: ['Unmatched risk management', 'Ideal for mission-critical enterprise systems'],
    cons: ['Expensive and high management overhead', 'Requires specialized risk assessment expertise'],
    bestSuitedFor: 'High-stakes financial transactions & large-scale payment gateway integrations.',
    suitabilityForFoodDelivery: {
      score: 6.8,
      reason: 'Excessive overhead for general app development, but useful during payment gateway security module design.'
    }
  }
];

export const SRS_IEEE_DOCUMENT: SRSSection[] = [
  {
    id: 'srs-1',
    unit: 'UNIT - II',
    sectionNumber: '1.0',
    title: 'Introduction & Scope',
    content: 'This document defines the Software Requirements Specification (SRS) for the FoodPulse Online Food Delivery System, complying with IEEE Std 830-1998 standards.',
    subsections: [
      { title: '1.1 System Purpose', detail: 'FoodPulse is a multi-tenant cloud-native food delivery platform connecting hungry consumers, local partner restaurants, and real-time delivery drivers.' },
      { title: '1.2 Scope', detail: 'Includes Customer Mobile/Web App, Restaurant Admin Dashboard, Driver GPS Dispatch Engine, Payment Gateway Integration (UPI/Cards), and Real-Time Order Tracking via WebSockets.' }
    ]
  },
  {
    id: 'srs-2',
    unit: 'UNIT - II',
    sectionNumber: '2.0',
    title: 'Overall Product Description',
    content: 'System architecture, user classes, operating environment, and design constraints.',
    subsections: [
      { title: '2.1 User Classes & Characteristics', detail: 'Customer (browses menus, places orders, tracks delivery), Restaurant Owner (manages menu, accepts orders, tracks preparation), Delivery Partner (accepts dispatch, navigates route), System Admin.' },
      { title: '2.2 Operating Environment', detail: 'Cross-browser web app (React 18), mobile responsive, Node.js backend microservices, MongoDB database, Google Maps / Leaflet GPS API.' }
    ]
  },
  {
    id: 'srs-3',
    unit: 'UNIT - II',
    sectionNumber: '3.0',
    title: 'Specific Requirements (Functional & Non-Functional)',
    content: 'Detailed functional behavior and quantitative performance requirements.',
    subsections: [
      { title: 'FR-01: Dish Search & Filtering', detail: 'System shall allow filtering by Veg/Non-Veg, Rating (>4.0), Cuisine, Price range, and Delivery speed (<30 mins).' },
      { title: 'FR-02: Real-time Live GPS Tracking', detail: 'System shall stream driver latitude/longitude coordinates to customer map at 3-second interval via WebSocket connection.' },
      { title: 'NFR-01: Performance', detail: '95% of search queries shall return results within 450ms. Page load time under 1.5 seconds on 4G network.' },
      { title: 'NFR-02: Security', detail: 'All payment data must comply with PCI-DSS guidelines. User auth handled via JWT with OAuth 2.0 SSL/TLS encryption.' },
      { title: 'NFR-03: Availability', detail: 'System uptime requirement is 99.95% (maximum planned downtime < 4 hours per year).' }
    ]
  }
];

export const AGILE_USER_STORIES: UserStory[] = [
  {
    id: 'us-101',
    epic: 'Customer Ordering',
    title: 'Customizing Dish Addons & Options',
    asA: 'Hungry Customer',
    iWantTo: 'Select spice levels, portion size, and extra toppings before adding a dish to my cart',
    soThat: 'My order matches my exact culinary preferences and dietary needs.',
    acceptanceCriteria: [
      'Modal opens when clicking a dish with addon groups.',
      'Required groups (e.g. portion size) must block item addition until selected.',
      'Price dynamically updates in real-time as toppings are checked.'
    ],
    storyPoints: 5,
    priority: 'High',
    status: 'Completed'
  },
  {
    id: 'us-102',
    epic: 'Order Tracking',
    title: 'Real-time Live GPS Map & Driver ETA',
    asA: 'Ordering Customer',
    iWantTo: 'See the live vehicle location of my assigned delivery partner moving on an interactive map',
    soThat: 'I know exactly when my food will arrive at my doorstep without calling support.',
    acceptanceCriteria: [
      'Map renders restaurant location, customer address pin, and moving vehicle marker.',
      'ETA counter auto-decrements every minute.',
      'Direct call/message driver CTA button present on tracking bar.'
    ],
    storyPoints: 8,
    priority: 'High',
    status: 'Completed'
  },
  {
    id: 'us-103',
    epic: 'Payment & Checkout',
    title: 'Instant Promo Coupon Discount',
    asA: 'Budget-conscious Customer',
    iWantTo: 'Apply valid promo coupon codes (e.g. SE2026 or CBITFOOD) at checkout',
    soThat: 'I get immediate percentage or flat discount on my order total.',
    acceptanceCriteria: [
      'Input box allows typing custom coupon string.',
      'Shows error alert if min order threshold not met.',
      'Deducts discount from total amount immediately.'
    ],
    storyPoints: 3,
    priority: 'Medium',
    status: 'Completed'
  },
  {
    id: 'us-104',
    epic: 'Restaurant Management',
    title: 'Menu Item Availability Toggle',
    asA: 'Restaurant Manager',
    iWantTo: 'Toggle items as Out-of-Stock instantly from my portal',
    soThat: 'Customers cannot order dishes that have run out during rush hours.',
    acceptanceCriteria: [
      'Toggle switch updates database state immediately.',
      'Disabled items show grayed out "Sold Out" tag on customer mobile app.'
    ],
    storyPoints: 3,
    priority: 'High',
    status: 'In Sprint'
  }
];

export const RISK_MATRIX: RiskItem[] = [
  {
    id: 'risk-1',
    category: 'Technical',
    riskDescription: 'Map API Rate Limit Exhaustion / Latency Spikes during peak lunch hours (12 PM - 2 PM).',
    probability: 'High',
    impact: 'High',
    riskScore: 16,
    mitigationStrategy: 'Implement Map Coordinate Caching, Throttle WebSocket polling to 5s, and setup fallback OpenStreetMap layer.',
    contingencyPlan: 'Fall back to static distance radius text updates if live map renders fail.'
  },
  {
    id: 'risk-2',
    category: 'Security',
    riskDescription: 'Payment Gateway Callback Timeout during UPI transaction verification.',
    probability: 'Medium',
    impact: 'Critical',
    riskScore: 15,
    mitigationStrategy: 'Implement Webhook listener retry mechanism with exponential backoff and dual-verification handshake.',
    contingencyPlan: 'Auto-hold order state as "Pending Payment Verification" for 5 minutes before release.'
  },
  {
    id: 'risk-3',
    category: 'Operational',
    riskDescription: 'Driver Shortage / Unassigned Order Bottleneck during heavy rainfall.',
    probability: 'High',
    impact: 'High',
    riskScore: 16,
    mitigationStrategy: 'Dynamic Surge Pricing algorithm & expanding delivery radius bounds.',
    contingencyPlan: 'Notify customer before order placement about extended 45-minute delivery window.'
  }
];

export const DFD_LEVEL_0: DFDLevel = {
  level: 0,
  title: 'Level 0 Context Diagram - Online Food Delivery System',
  description: 'High-level system boundary showing primary external entities interacting with the core FoodPulse System.',
  nodes: [
    { id: 'E1', name: 'Customer', type: 'External Entity', description: 'Places orders, pays, tracks delivery, leaves reviews' },
    { id: 'E2', name: 'Restaurant Partner', type: 'External Entity', description: 'Accepts orders, updates menu, updates prep status' },
    { id: 'E3', name: 'Delivery Partner', type: 'External Entity', description: 'Accepts dispatch, streams GPS coordinates, marks delivered' },
    { id: 'E4', name: 'Payment Gateway (Razorpay/UPI)', type: 'External Entity', description: 'Processes card/UPI payments & settlement' },
    { id: 'P0', name: '0.0 FoodPulse Core Platform System', type: 'Process', description: 'Central engine orchestrating all food delivery transactions' }
  ],
  links: [
    { from: 'E1', to: 'P0', dataFlowName: 'Order Details, Payment Info, Delivery Address' },
    { from: 'P0', to: 'E1', dataFlowName: 'Order Confirmation, Live GPS Tracking, Invoice' },
    { from: 'P0', to: 'E2', dataFlowName: 'Incoming Order Notification, Customer Details' },
    { from: 'E2', to: 'P0', dataFlowName: 'Accept/Reject Order, Menu & Prep Status' },
    { from: 'P0', to: 'E3', dataFlowName: 'Delivery Request, Pickup Address & Route' },
    { from: 'E3', to: 'P0', dataFlowName: 'GPS Location Coordinates, Delivery Confirmation' },
    { from: 'P0', to: 'E4', dataFlowName: 'Payment Auth Request' },
    { from: 'E4', to: 'P0', dataFlowName: 'Payment Auth Token / Success Status' }
  ]
};

export const DFD_LEVEL_1: DFDLevel = {
  level: 1,
  title: 'Level 1 Data Flow Diagram - Subsystem Deconstruction',
  description: 'Decomposes Process 0.0 into 5 core functional processes and major data stores.',
  nodes: [
    { id: 'P1', name: '1.0 User Authentication & Profile', type: 'Process', description: 'Manages sessions & address books' },
    { id: 'P2', name: '2.0 Order & Menu Management', type: 'Process', description: 'Handles cart, menu filtering, item pricing' },
    { id: 'P3', name: '3.0 Payment Processing Service', type: 'Process', description: 'Validates coupons, calculates taxes, invokes gateway' },
    { id: 'P4', name: '4.0 Dispatch & Live GPS Tracking', type: 'Process', description: 'Matches drivers & streams coordinate updates' },
    { id: 'P5', name: '5.0 Rating & Feedback Engine', type: 'Process', description: 'Collects & aggregates customer dish reviews' },
    { id: 'D1', name: 'D1: Customer Data Store', type: 'Data Store', description: 'User accounts, saved addresses, preferences' },
    { id: 'D2', name: 'D2: Restaurant & Menu Data Store', type: 'Data Store', description: 'Dishes, prices, addons, opening hours' },
    { id: 'D3', name: 'D3: Transaction & Order Data Store', type: 'Data Store', description: 'Order history, bill breakdown, payment logs' },
    { id: 'D4', name: 'D4: Driver & Location Log Store', type: 'Data Store', description: 'Active driver positions, vehicle data' }
  ],
  links: [
    { from: 'P2', to: 'D2', dataFlowName: 'Fetch Menu Items' },
    { from: 'P2', to: 'D3', dataFlowName: 'Write Order Record' },
    { from: 'P3', to: 'D3', dataFlowName: 'Update Payment Status' },
    { from: 'P4', to: 'D4', dataFlowName: 'Stream Driver GPS Pins' }
  ]
};

export const TEST_CASES_DATA: TestCase[] = [
  {
    id: 'tc-101',
    type: 'Black-Box',
    technique: 'Equivalence Partitioning',
    module: 'Coupon Validator (`applyCouponCode`)',
    testCaseName: 'Valid Promo Code with Subtotal >= Threshold',
    inputData: 'Coupon: "SE2026", Subtotal: ₹550 (Min: ₹300)',
    expectedOutput: 'Discount applied: ₹100 (50% max ₹100), Status: Success',
    actualStatus: 'Passed',
    codeSnippet: `function applyCouponCode(code: string, subtotal: number) {
  if (code === 'SE2026') {
    if (subtotal < 300) return { valid: false, msg: 'Min order ₹300 required' };
    const discount = Math.min(subtotal * 0.5, 100);
    return { valid: true, discount };
  }
  return { valid: false, msg: 'Invalid Coupon' };
}`
  },
  {
    id: 'tc-102',
    type: 'Black-Box',
    technique: 'Boundary Value Analysis',
    module: 'Delivery Distance Calculation (`calculateDeliveryFee`)',
    testCaseName: 'Distance precisely at 5.0 km boundary',
    inputData: 'Distance: 5.0 km',
    expectedOutput: 'Fee = ₹35 (Base rate up to 5km). Boundary testing 4.9km (₹35), 5.0km (₹35), 5.1km (₹45)',
    actualStatus: 'Passed',
    codeSnippet: `function calculateDeliveryFee(distanceKm: number): number {
  if (distanceKm <= 0) return 0;
  if (distanceKm <= 5.0) return 35; // Base boundary
  if (distanceKm <= 10.0) return 35 + Math.ceil(distanceKm - 5) * 10;
  return 85;
}`
  },
  {
    id: 'tc-103',
    type: 'White-Box',
    technique: 'Statement Coverage',
    module: 'Order Status Transition Matrix',
    testCaseName: 'Verify all execution paths in order state machine',
    inputData: 'Transition sequence: PLACED -> CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED',
    expectedOutput: '100% Statement Coverage achieved across all state guard clauses.',
    actualStatus: 'Passed',
    codeSnippet: `function transitionOrderStatus(current: OrderStatus, next: OrderStatus): boolean {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PLACED: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PREPARING', 'CANCELLED'],
    PREPARING: ['OUT_FOR_DELIVERY'],
    OUT_FOR_DELIVERY: ['DELIVERED'],
    DELIVERED: [],
    CANCELLED: []
  };
  return validTransitions[current]?.includes(next) ?? false;
}`
  },
  {
    id: 'tc-104',
    type: 'White-Box',
    technique: 'Branch Coverage',
    module: 'Cyclomatic Complexity $V(G) = 4$',
    testCaseName: 'Branch testing for surge pricing multiplier logic',
    inputData: 'Inputs: isRaining=true, activeDrivers=3, pendingOrders=15',
    expectedOutput: 'Evaluates True/False branches for high demand, low driver count, and weather flags.',
    actualStatus: 'Passed',
    codeSnippet: `function calculateSurgeMultiplier(isRaining: boolean, activeDrivers: number, pendingOrders: number): number {
  let multiplier = 1.0;
  if (isRaining) multiplier += 0.3; // Branch 1
  if (activeDrivers > 0 && (pendingOrders / activeDrivers) > 3) { // Branch 2 & 3
    multiplier += 0.5;
  }
  return Math.min(multiplier, 2.5); // Branch 4 clamp
}`
  }
];

export const QUALITY_METRICS_DATA: QualityMetric[] = [
  {
    attribute: 'Maintainability',
    model: 'McCall',
    score: 92,
    target: 85,
    description: 'Effort required to locate and fix an error in operational code.',
    measurementMethod: 'Cyclomatic Complexity average < 5 per function & Modular component isolation.'
  },
  {
    attribute: 'Reliability',
    model: 'McCall',
    score: 96,
    target: 95,
    description: 'Extent to which software performs intended function with required precision.',
    measurementMethod: 'Mean Time Between Failures (MTBF) > 720 hours & automated unit test coverage > 90%.'
  },
  {
    attribute: 'Usability',
    model: 'HP FURPS',
    score: 95,
    target: 90,
    description: 'Effort required to learn, operate, input, and interpret app output.',
    measurementMethod: 'System Usability Scale (SUS) score > 88/100 & Order placement under 4 clicks.'
  },
  {
    attribute: 'Efficiency',
    model: 'McCall',
    score: 90,
    target: 85,
    description: 'Amount of computing resources and code required to perform a function.',
    measurementMethod: 'API P95 Response latency < 450ms & dynamic bundle size < 350KB.'
  },
  {
    attribute: 'Portability',
    model: 'McCall',
    score: 94,
    target: 90,
    description: 'Ease of transferring application from one browser/hardware environment to another.',
    measurementMethod: 'Cross-browser testing (Chrome, Safari, Firefox, Edge) & Responsive Breakpoints.'
  },
  {
    attribute: 'Security',
    model: 'HP FURPS',
    score: 98,
    target: 95,
    description: 'Protection of sensitive user details and financial transaction credentials.',
    measurementMethod: 'OWASP Top 10 compliance, SSL 256-bit encryption & zero hardcoded tokens.'
  }
];
