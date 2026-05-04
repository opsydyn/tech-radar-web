// DDD Term definitions for tooltips
// Following CLAUDE.md standards: comprehensive domain knowledge base

import type { TooltipDefinition } from './UbiquitousLanguageCloud.data';

// ============================================================================
// Domain-Driven Design Term Definitions
// ============================================================================

export const DDD_DEFINITIONS: Record<string, TooltipDefinition> = {
  'Bounded Context': {
    definition: 'A boundary within which a particular domain model is defined and applicable',
    category: 'strategic',
    importance: 100,
    examples: ['User Management Context', 'Billing Context', 'Inventory Context']
  },
  
  'Ubiquitous Language': {
    definition: 'A common language used by all team members to connect activities with the software',
    category: 'strategic',
    importance: 95,
    examples: ['Domain terms', 'Business vocabulary', 'Shared understanding']
  },
  
  'Core Domain': {
    definition: 'The primary area of business focus that provides competitive advantage',
    category: 'strategic',
    importance: 90,
    examples: ['Revenue generation', 'Key differentiator', 'Strategic value']
  },
  
  'Context Map': {
    definition: 'A visual representation of how different bounded contexts relate to each other',
    category: 'strategic',
    importance: 85,
    examples: ['Shared kernel', 'Customer-supplier', 'Conformist']
  },
  
  'Subdomain': {
    definition: 'A part of the overall domain that can be developed independently',
    category: 'strategic',
    importance: 80,
    examples: ['Core', 'Supporting', 'Generic']
  },
  
  'Supporting Domain': {
    definition: 'Important but not core - supports the core domain',
    category: 'strategic',
    importance: 75,
    examples: ['User management', 'Notifications', 'Analytics']
  },
  
  'Generic Domain': {
    definition: 'Common functionality that can be bought or outsourced',
    category: 'strategic',
    importance: 70,
    examples: ['Authentication', 'Logging', 'Email services']
  },
  
  'Aggregate': {
    definition: 'A cluster of objects that can be treated as a single unit for data changes',
    category: 'tactical',
    importance: 88,
    examples: ['Order + OrderItems', 'Customer + Addresses', 'Product + Variants']
  },
  
  'Entity': {
    definition: 'An object with a distinct identity that runs through time and state changes',
    category: 'tactical',
    importance: 85,
    examples: ['User', 'Order', 'Product']
  },
  
  'Value Object': {
    definition: 'An object that describes aspects of the domain with no conceptual identity',
    category: 'tactical',
    importance: 82,
    examples: ['Money', 'Address', 'DateRange']
  },
  
  'Aggregate Root': {
    definition: 'The only member of an aggregate that outside objects are allowed to reference',
    category: 'tactical',
    importance: 80,
    examples: ['Order (not OrderItem)', 'Customer (not Address)', 'Product (not Variant)']
  },
  
  'Domain Event': {
    definition: 'Something that happened in the domain that domain experts care about',
    category: 'tactical',
    importance: 78,
    examples: ['OrderPlaced', 'PaymentReceived', 'UserRegistered']
  },
  
  'Repository': {
    definition: 'Encapsulates the logic needed to access data sources',
    category: 'tactical',
    importance: 75,
    examples: ['UserRepository', 'OrderRepository', 'ProductRepository']
  },
  
  'Anti-Corruption Layer': {
    definition: 'A layer that prevents external concepts from polluting your domain model',
    category: 'tactical',
    importance: 72,
    examples: ['API adapters', 'Data transformers', 'External service wrappers']
  },
  
  'Domain Service': {
    definition: 'A service that encapsulates domain logic that doesn\'t belong to an entity or value object',
    category: 'tactical',
    importance: 70,
    examples: ['PricingService', 'ValidationService', 'CalculationService']
  },
  
  'Factory': {
    definition: 'An object responsible for creating complex objects and aggregates',
    category: 'tactical',
    importance: 65,
    examples: ['OrderFactory', 'UserFactory', 'ProductFactory']
  },
  
  'Specification': {
    definition: 'A predicate that determines if an object satisfies certain criteria',
    category: 'tactical',
    importance: 60,
    examples: ['EligibleForDiscount', 'OverdueInvoice', 'ValidEmail']
  },
  
  'Model-Driven Design': {
    definition: 'Design approach where the domain model is the primary tool for solving problems',
    category: 'mindset',
    importance: 85,
    examples: ['Code reflects domain', 'Model drives design', 'Domain first']
  },
  
  'Business Rules': {
    definition: 'Constraints and policies that govern how the business operates',
    category: 'mindset',
    importance: 80,
    examples: ['Discount policies', 'Validation rules', 'Workflow constraints']
  },
  
  'Domain Logic': {
    definition: 'The core business logic that implements the rules and processes of the domain',
    category: 'mindset',
    importance: 75,
    examples: ['Pricing calculations', 'Inventory management', 'Order processing']
  },
  
  'Domain Expert': {
    definition: 'A person with deep knowledge of the business domain',
    category: 'mindset',
    importance: 72,
    examples: ['Business analysts', 'Product owners', 'Subject matter experts']
  },
  
  'Knowledge Crunching': {
    definition: 'The process of extracting and refining domain knowledge',
    category: 'mindset',
    importance: 68,
    examples: ['Collaborative modeling', 'Domain exploration', 'Iterative learning']
  },
  
  'Continuous Learning': {
    definition: 'The practice of constantly acquiring new knowledge and skills in the domain',
    category: 'mindset',
    importance: 65,
    examples: ['Domain workshops', 'Regular retrospectives', 'Knowledge sharing']
  },
  
  'Collaboration': {
    definition: 'Working together with domain experts and team members to build shared understanding',
    category: 'mindset',
    importance: 62,
    examples: ['Pair programming', 'Event storming sessions', 'Cross-functional teams']
  },
  
  'Event Storming': {
    definition: 'A workshop technique for exploring complex business domains',
    category: 'implementation',
    importance: 85,
    examples: ['Domain events', 'Commands', 'Aggregates']
  },
  
  'Event Sourcing': {
    definition: 'Storing all changes to application state as a sequence of events',
    category: 'implementation',
    importance: 78,
    examples: ['Event store', 'Replay events', 'Audit trail']
  },
  
  'CQRS': {
    definition: 'Command Query Responsibility Segregation - separate read and write models',
    category: 'implementation',
    importance: 76,
    examples: ['Command handlers', 'Query handlers', 'Separate databases']
  },
  
  'Hexagonal Architecture': {
    definition: 'Architecture pattern that isolates the core logic from outside concerns',
    category: 'implementation',
    importance: 68,
    examples: ['Ports and adapters', 'Dependency inversion', 'Testable core']
  },
  
  'Invariant': {
    definition: 'A business rule that must always be true within an aggregate',
    category: 'implementation',
    importance: 65,
    examples: ['Order total = sum of items', 'Account balance >= 0', 'Unique username']
  },
  
  'Transaction Boundary': {
    definition: 'The scope within which data changes are treated as a single atomic operation',
    category: 'implementation',
    importance: 62,
    examples: ['Aggregate boundary', 'Database transaction', 'Saga compensation']
  },
  
  'Onion Architecture': {
    definition: 'Layered architecture with domain at the center and dependencies pointing inward',
    category: 'implementation',
    importance: 58,
    examples: ['Domain core', 'Application services', 'Infrastructure layer']
  },
  
  'Clean Architecture': {
    definition: 'Architecture that keeps business rules independent of frameworks and external concerns',
    category: 'implementation',
    importance: 55,
    examples: ['Use cases', 'Entities', 'Interface adapters']
  },
  
  'Ports and Adapters': {
    definition: 'Pattern that isolates core logic from external systems through well-defined interfaces',
    category: 'implementation',
    importance: 52,
    examples: ['Database adapter', 'API port', 'Message queue adapter']
  },
  
  'Saga Pattern': {
    definition: 'Pattern for managing distributed transactions across multiple aggregates or services',
    category: 'implementation',
    importance: 50,
    examples: ['Choreography saga', 'Orchestration saga', 'Compensation actions']
  }
} as const;