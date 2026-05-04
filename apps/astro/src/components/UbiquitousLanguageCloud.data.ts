// DDD Term definitions and sample data for UbiquitousLanguageCloud
// Following CLAUDE.md standards: domain-driven data organization

import type { WordCategory } from './UbiquitousLanguageCloud.domain';

// ============================================================================
// Types for Data Organization
// ============================================================================

export type TermDefinition = {
  readonly text: string;
  readonly value: number;
  readonly category: WordCategory;
};

export type TooltipDefinition = {
  readonly definition: string;
  readonly category: WordCategory;
  readonly importance: number;
  readonly examples?: readonly string[];
};

// ============================================================================
// DDD Term Data (Strategic, Tactical, Mindset, Implementation)
// ============================================================================

export const DDD_TERMS: readonly TermDefinition[] = [
  // Strategic design terms (high importance)
  { text: 'Bounded Context', value: 100, category: 'strategic' },
  { text: 'Ubiquitous Language', value: 95, category: 'strategic' },
  { text: 'Core Domain', value: 90, category: 'strategic' },
  { text: 'Context Map', value: 85, category: 'strategic' },
  { text: 'Subdomain', value: 80, category: 'strategic' },
  { text: 'Supporting Domain', value: 75, category: 'strategic' },
  { text: 'Generic Domain', value: 70, category: 'strategic' },

  // Tactical design terms (medium-high importance)
  { text: 'Aggregate', value: 88, category: 'tactical' },
  { text: 'Entity', value: 85, category: 'tactical' },
  { text: 'Value Object', value: 82, category: 'tactical' },
  { text: 'Aggregate Root', value: 80, category: 'tactical' },
  { text: 'Domain Event', value: 78, category: 'tactical' },
  { text: 'Repository', value: 75, category: 'tactical' },
  { text: 'Anti-Corruption Layer', value: 72, category: 'tactical' },
  { text: 'Domain Service', value: 70, category: 'tactical' },
  { text: 'Factory', value: 65, category: 'tactical' },
  { text: 'Specification', value: 60, category: 'tactical' },

  // Mindset terms (medium importance)
  { text: 'Model-Driven Design', value: 85, category: 'mindset' },
  { text: 'Business Rules', value: 80, category: 'mindset' },
  { text: 'Domain Logic', value: 75, category: 'mindset' },
  { text: 'Domain Expert', value: 72, category: 'mindset' },
  { text: 'Knowledge Crunching', value: 68, category: 'mindset' },
  { text: 'Continuous Learning', value: 65, category: 'mindset' },
  { text: 'Collaboration', value: 62, category: 'mindset' },

  // Implementation terms (varied importance with wider spread)
  { text: 'Event Storming', value: 85, category: 'implementation' },
  { text: 'Event Sourcing', value: 78, category: 'implementation' },
  { text: 'CQRS', value: 76, category: 'implementation' },
  { text: 'Hexagonal Architecture', value: 68, category: 'implementation' },
  { text: 'Invariant', value: 65, category: 'implementation' },
  { text: 'Transaction Boundary', value: 62, category: 'implementation' },
  { text: 'Onion Architecture', value: 58, category: 'implementation' },
  { text: 'Clean Architecture', value: 55, category: 'implementation' },
  { text: 'Ports and Adapters', value: 52, category: 'implementation' },
  { text: 'Saga Pattern', value: 50, category: 'implementation' },
] as const;

// ============================================================================
// Category Colors (Design Tokens Integration Point)
// ============================================================================

export const CATEGORY_COLORS: Record<WordCategory, string> = {
  strategic: '#22c55e',     // Better green with good contrast
  tactical: '#3b82f6',      // Better blue with good contrast
  mindset: '#ef4444',       // Better red with good contrast
  implementation: '#f59e0b'  // Better amber with good contrast
} as const;