# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development Commands

#### Primary Development (pnpm/npm)
- `pnpm dev` - Start Astro development server (in apps/astro/)
- `pnpm moon check` - Run Moon checks across all projects
- `pnpm moon ci` - Run Moon CI tasks
- `pnpm build` - Build the Astro application (runs `astro check && astro build`)
- `pnpm test` - Run tests once
- `pnpm test:watch` - Run tests in watch mode

#### Alternative Commands for Mac/Unix Users (Make)

**Quick Reference:**
- `make help` - Show all available Make targets with descriptions
- `make dev` - Start Astro development server (alias for `make astro-dev`)

**Development & Building:**
- `make check` - Run Moon checks across all projects
- `make ci` - Run Moon CI tasks
- `make test` - Run tests once
- `make test-watch` - Run tests in watch mode
- `make astro-dev` - Start Astro development server
- `make astro-build` - Build Astro application
- `make mastra-dev` - Run Mastra development server

**Code Quality & Formatting:**
- `make biome` - Format code with Biome
- `make commit` - Create a commit using Commitizen
- `make sherif` - Run sherif (dependency management)
- `make code-owners` - Sync CODEOWNERS file based on Moon configuration

**Project-Specific Tasks:**
- `make astro task=<taskname>` - Run specific Astro task via Moon
- `make rust task=<taskname>` - Run specific Rust task via Moon  
- `make ratatui task=<taskname>` - Run specific Ratatui task via Moon
- `make run task=<taskname> project=<project>` - Run any Moon task for any project

**Rust Components:**
- `make cargo-build` - Build Rust ADR generator
- `make cargo-run` - Run Rust ADR generator

**Upgrades & Maintenance:**
- `make astro-upgrade` - Upgrade Astro to the latest version

**API Testing (Comprehensive Suite):**
- `make api-help` - Show all API testing commands with examples
- `make api-test-all` - Run tests for all API endpoints
- `make api-validate` - Validate that all API endpoints are responding
- `make api-benchmark` - Simple benchmark of API response times

**Core API Endpoints:**
- `make api-blips` - Get all blips from the API
- `make api-blip ID=48` - Get specific blip by ID
- `make api-quadrant QUADRANT=tools` - Get blips for specific quadrant
- `make api-rels` - Get API relationship documentation

**Document Freshness Testing:**
- `make api-freshness-docs` - Get freshness test API documentation
- `make api-freshness-get IDENTIFIER=react DOC_TYPE=auto` - Test document freshness via GET
- `make api-freshness-post IDENTIFIER=react DOC_TYPE=auto` - Test document freshness via POST
- `make api-freshness-examples` - Run multiple freshness test examples
- `make api-freshness-bulk DOC_TYPE=blip LIMIT=5` - Test bulk document freshness queries
- `make api-freshness-bulk-critical DOC_TYPE=all LIMIT=10` - Get critical freshness documents only
- `make api-freshness-stats DOC_TYPE=all` - Get freshness statistics
- `make api-freshness-all-modes` - Test all freshness API modes
- `make api-freshness-all-critical-blips` - Get ALL critical blips using pagination

**API Utilities:**
- `make api-headers ENDPOINT=blips` - Show response headers for API request
- `make api-save ENDPOINT=blips FILE=blips.json` - Save API response to file
- `make api-peek ENDPOINT=blips LIMIT=30` - View first N lines of API response
- `make api-links ENDPOINT=blips` - Extract and display _links from API response
- `make install-jq` - Install jq JSON processor for better output formatting

**Common Make Usage Examples:**
```bash
# Development
make dev                              # Start development server
make check                           # Run all checks
make test                           # Run tests

# API Testing
make api-freshness-get IDENTIFIER=React.js DOC_TYPE=blip
make api-freshness-bulk DOC_TYPE=blip LIMIT=5
make api-blip ID=37
make api-quadrant QUADRANT=platforms
make api-save ENDPOINT=blips FILE=all-blips.json

# Project Tasks
make astro task=build               # Build Astro project
make rust task=test                # Test Rust project
make run task=lint project=astro   # Run lint task for Astro project
```

**For Users Preferring Traditional Commands:**
- Use `pnpm` commands for package management and basic development
- Use `make` commands for streamlined development workflow and comprehensive API testing
- Both approaches are equivalent - choose based on your preference

### Maintaining Make Configuration

**As the application evolves, update Make targets:**

**When adding new features:**
- Add corresponding Make targets to appropriate `.make/*.mk` files
- Follow the existing pattern: `target: ## Description`
- Update this CLAUDE.md documentation with new commands

**Make file organization:**
- `.make/common.mk` - Help system and common utilities
- `.make/development.mk` - Development workflow commands
- `.make/testing.mk` - Testing and CI commands  
- `.make/projects.mk` - Project-specific tasks
- `.make/api.mk` - API testing and validation

**Adding new Make targets:**
```makefile
# In appropriate .make/*.mk file
new-feature: ## Description of what this does
	command-to-run

new-feature-with-params: ## Description (usage: make new-feature-with-params PARAM=value)
	command-with-$(PARAM)
```

**After adding new targets:**
1. Test the new commands work correctly
2. Update this CLAUDE.md file with the new commands
3. Run `make help` to verify help text displays properly
4. Document any required parameters or environment variables

**Examples of targets to add as app evolves:**
- Database migration commands: `make db-migrate`, `make db-reset`
- Deployment commands: `make deploy-staging`, `make deploy-prod`
- Performance testing: `make perf-test`, `make load-test`
- Security scanning: `make security-scan`, `make audit`
- Documentation generation: `make docs-build`, `make docs-serve`
- Environment setup: `make setup-dev`, `make setup-prod`

## Architecture Overview

This is a monorepo containing a tech radar application with multiple components:

### Project Structure
- **Package Manager**: pnpm@9.15.0 with workspace support
- **Monorepo Tool**: Moon for task orchestration
- **Main Application**: Astro-based web app with React components
- **Rust Tools**: ADR generators (CLI and TUI versions)

### Key Technologies
- **Frontend**: Astro, React 19, TypeScript
- **Styling**: Vanilla Extract CSS-in-JS
- **Data Visualization**: Visx, D3, Observable Plot
- **State Management**: XState, Nanostores
- **Database**: Drizzle ORM with PostgreSQL/Neon
- **AI Integration**: CopilotKit, Mastra
- **Testing**: Vitest, React Testing Library

### Main Applications
1. **apps/astro/** - Primary web application
   - Tech radar visualization
   - Blip management system
   - Architecture debt tracking
   - Document freshness monitoring
   - AI-powered features

2. **apps/rust_adr_gen/** - CLI ADR generator
3. **apps/ratatui_adr-gen/** - Terminal UI ADR generator
4. **apps/docs/** - Documentation site

### Important Files
- **Configuration**: `astro.config.mts`, `moon.yml` files
- **Database**: `drizzle.config.ts`, `src/db/` directory
- **Styling**: `src/styles/` with Vanilla Extract setup
- **API**: `src/pages/api/` with OpenAPI integration

## Development Workflow

### Starting Development
```bash
# Install dependencies
pnpm install

# Start dev server
cd apps/astro && pnpm dev
# or
make dev
```

### Before Committing

**Using pnpm:**
1. Run type checking: `pnpm build` (includes astro check)
2. Run tests: `pnpm test`
3. Format code: `pnpm prettier`
4. Lint code: `pnpm lint`

**Using Make (alternative):**
1. Run all checks: `make check` (includes type checking)
2. Run tests: `make test`
3. Format code: `make biome`
4. Create commit: `make commit` (uses Commitizen)

### Working with Database
- Schema: `apps/astro/src/db/drizzle-schema.ts`
- Migrations: `apps/astro/drizzle/` directory
- Generate migrations: `pnpm drizzle-kit generate`

### AI Features
- CopilotKit integration for AI chat
- Mastra agents for tech analysis
- Tech radar AI recommendations

## Important Notes

### Package Management
- Uses pnpm workspaces with Moon for task coordination
- Shared packages in `packages/` for TypeScript config and Biome setup
- Node.js 22.12.0 required

### Testing Strategy
- Vitest for unit/integration tests
- React Testing Library for component tests
- Property-based testing with fast-check
- API testing via Make targets

### Code Organization
- Components use Vanilla Extract for styling
- State management with XState machines
- API endpoints follow OpenAPI specification
- Modular architecture with clear separation of concerns

## Coding Preferences & Patterns

### Architecture Patterns
- **Imperative Shell / Functional Core**: Separate pure business logic from I/O operations
- **Domain-Driven Design**: Use expressive domain types and ubiquitous language
- **Repository Pattern**: Abstract database operations behind interfaces
- **Container/Presentation Pattern**: Separate business logic from UI components

### TypeScript & Functional Programming
- **Effect Library Patterns**: Use Effect's Match API for pattern matching and functional composition
- **F#-Inspired Domain Modeling**: Create branded types to make illegal states unrepresentable
- **Smart Constructors**: ALWAYS favor smart constructors for domain value creation and validation
- **Function Composition**: Prefer `flow` over `pipe` for reusable pipelines, use `pipe` for one-off data transformations
- **Result Types**: Prefer `Result<T, E>` over throwing exceptions
- **Discriminated Unions**: Use tagged unions for type safety
- **Immutability**: Prefer `readonly` properties and immutable data structures

### Function Composition: flow vs pipe
Understanding when to use `flow` vs `pipe` is crucial for creating maintainable functional code.

#### Use `flow` for:
- **Reusable Pipelines**: Creating function compositions that can be reused
- **Point-Free Style**: Building pure function pipelines without data
- **Function Libraries**: Creating reusable transformation utilities
- **Higher-Order Functions**: When you need to pass composed functions around

#### Use `pipe` for:
- **One-off Transformations**: Direct data transformation in a single location
- **Data-First Operations**: When you have specific data to transform immediately
- **Simple Chains**: Short, context-specific transformation chains

#### Examples:
```typescript
// ✅ Use flow for reusable pipelines
const findPresetNamePipeline = flow(
  EffectArray.findFirst,
  Option.map((preset: PresetScenario) => preset.name),
  Option.getOrNull,
);

const findDescriptionPipeline = <T extends CouplingParameterValue>() => flow(
  EffectArray.findFirst<CouplingParameterRange<T>>,
  Option.map((range: CouplingParameterRange<T>) => range.description),
  Option.getOrElse(() => createParameterDescription("Unknown range"))
);

// Usage: pipeline can be reused with different predicates
const result1 = findPresetNamePipeline(predicate1)(data);
const result2 = findPresetNamePipeline(predicate2)(data);

// ✅ Use pipe for one-off data transformations
const validateContextValues = (context: Context): boolean => 
  pipe(
    { strength: context.strength, distance: context.distance, volatility: context.volatility },
    Schema.decodeUnknownEither(BalancedCouplingParamsSchema),
    Either.isRight,
  );

// ❌ Don't use pipe when you need reusability
const findName = (predicate) => (data) => pipe(data, EffectArray.findFirst(predicate), /* ... */);

// ❌ Don't use flow for simple one-off operations
const result = flow(Schema.decodeUnknownEither(schema), Either.isRight)(simpleData);
```

### Smart Constructors (Strongly Preferred)
Smart constructors are factory functions that encapsulate domain validation and ensure type safety. They are essential for maintaining domain invariants and preventing invalid states.

#### Benefits of Smart Constructors:
1. **Encapsulate Validation**: Hide validation logic inside constructor functions
2. **Type Safety**: Guarantee valid domain objects are created
3. **Single Source of Truth**: Centralize validation rules
4. **Prevent Invalid States**: Make illegal states unrepresentable at compile time
5. **Clear API**: Provide obvious entry points for domain object creation
6. **Refactoring Safety**: Changes to validation logic happen in one place

#### Examples:

Here's a comprehensive example following Scott Wlaschin's "Domain Modeling Made Functional" principles:

```typescript title="Domain Model - Car Marketplace" {1-7} mark={42-49} ins={51-58} del={95-99}
// ✅ F#-Inspired Domain Model - Car Marketplace Example
// Following "Domain Modeling Made Functional" principles

// 🏷️ Branded types for domain concepts (Make Illegal States Unrepresentable)
type VIN = string & { readonly __brand: 'VIN' };
type Make = string & { readonly __brand: 'Make' };
type Model = string & { readonly __brand: 'Model' };
type Year = number & { readonly __brand: 'Year' };
type Mileage = number & { readonly __brand: 'Mileage' };
type Currency = 'USD' | 'EUR' | 'GBP';
type DealerId = string & { readonly __brand: 'DealerId' };

// 🚨 Domain errors as discriminated unions (not exceptions!)
type DomainError = 
  | { type: 'ValidationError'; field: string; message: string }
  | { type: 'BusinessRuleError'; rule: string; message: string };

// 💎 Value Object with proper validation
type Price = {
  readonly amount: number;
  readonly currency: Currency;
};

// 🛡️ Smart constructor for Price with validation
const createPrice = (amount: number, currency: Currency): Result<Price, DomainError> => {
  if (amount < 0) {
    return err({ 
      type: 'ValidationError', 
      field: 'amount', 
      message: 'Price cannot be negative' 
    });
  }
  if (amount > 10000000) {
    return err({ 
      type: 'BusinessRuleError', 
      rule: 'MaxPrice', 
      message: 'Price exceeds maximum allowed value' 
    });
  }
  return ok({ amount, currency });
};

// 🔍 Smart constructors for branded types with domain validation
const createVIN = (vin: string): Result<VIN, DomainError> => {
  const trimmed = vin.trim();
  if (trimmed.length !== 17) {
    return err({ 
      type: 'ValidationError', 
      field: 'vin', 
      message: 'VIN must be exactly 17 characters' 
    });
  }
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(trimmed)) {
    return err({ 
      type: 'ValidationError', 
      field: 'vin', 
      message: 'VIN contains invalid characters' 
    });
  }
  return ok(trimmed as VIN);
};

const createYear = (year: number): Result<Year, DomainError> => {
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear + 1) {
    return err({ 
      type: 'ValidationError', 
      field: 'year', 
      message: `Year must be between 1900 and ${currentYear + 1}` 
    });
  }
  return ok(year as Year);
};

// 🏗️ Entity as immutable data structure (not OOP class!)
type Car = {
  readonly vin: VIN;
  readonly make: Make;
  readonly model: Model;
  readonly year: Year;
  readonly mileage: Mileage;
  readonly price: Price;
};

// 🔧 Smart constructor that composes other smart constructors
const createCar = (data: {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  amount: number;
  currency: Currency;
}): Result<Car, DomainError> => {
  // Validate all inputs using smart constructors
  const vinResult = createVIN(data.vin);
  const makeResult = createMake(data.make);
  const modelResult = createModel(data.model);
  const yearResult = createYear(data.year);
  const mileageResult = createMileage(data.mileage);
  const priceResult = createPrice(data.amount, data.currency);
  
  // Combine all validation results functionally
  return Result.combine(vinResult, makeResult, modelResult, yearResult, mileageResult, priceResult)
    .map(([vin, make, model, year, mileage, price]) => ({
      vin, make, model, year, mileage, price
    }));
};

// 📦 Functional aggregate with pure functions (not mutable class)
type Listing = {
  readonly dealerId: DealerId;
  readonly cars: readonly Car[];
};

// 🔄 Pure functions for aggregate operations (immutable updates)
const addCarToListing = (listing: Listing, car: Car): Listing => ({
  ...listing,
  cars: [...listing.cars, car] // Creates new array, doesn't mutate
});

const searchCars = (listing: Listing, query: SearchQuery): readonly Car[] => {
  return listing.cars.filter(car =>
    (!query.make || car.make === query.make) &&
    (!query.model || car.model === query.model) &&
    (!query.year || car.year === query.year) &&
    (!query.maxPrice || car.price.amount <= query.maxPrice)
  );
};

// 🔍 Value Object for search with proper types
type SearchQuery = {
  readonly make?: Make;
  readonly model?: Model;
  readonly year?: Year;
  readonly maxPrice?: number;
};

// ❌ ANTI-PATTERNS TO AVOID:

// ❌ Mutable classes with methods (not functional!)
class BadListing {
  private cars: Car[] = [];
  addCar(car: Car): void { 
    this.cars.push(car); // Mutation breaks functional principles!
  }
}

// ❌ Weak smart constructors without validation
const badCreatePrice = (amount: number, currency: string): Price => ({
  amount, 
  currency: currency as Currency // No validation, unsafe casting!
});

// ❌ Using primitive types directly (primitive obsession)
const createCarBadly = (vin: string, year: number): Car => {
  // No validation, no domain protection!
  return { vin: vin as VIN, year: year as Year, /* ... */ };
};
```

This example demonstrates key principles from "Domain Modeling Made Functional":

- **🏷️ Branded Types**: Make illegal states unrepresentable
- **🛡️ Smart Constructors**: Validate at creation time, return Result types  
- **🚨 Error as Values**: Use discriminated unions, not exceptions
- **💎 Value Objects**: Immutable data with validation
- **🔄 Pure Functions**: No mutations, functional composition
- **📦 Functional Aggregates**: Data + pure functions, not OOP classes

#### Smart Constructor Guidelines:
- **Always Use for Domain Values**: Never create domain objects directly
- **Include Validation**: Validate inputs and return Result types when validation can fail
- **Compose Constructors**: Use smaller smart constructors to build larger ones
- **Fail Fast**: Catch invalid states at creation time, not usage time
- **Domain Language**: Use domain-appropriate names (e.g., `createCouplingStrength` not `makeNumber`)
- **Immutable Results**: Return readonly/immutable objects
- **Export Constructors**: Make smart constructors the primary API for domain object creation

### Type Design Philosophy
```typescript
// ✅ Preferred: Domain-specific branded types
type CouplingStrength = number & { readonly __brand: 'CouplingStrength' };
type CouplingDistance = number & { readonly __brand: 'CouplingDistance' };

// ✅ Preferred: Discriminated unions with clear semantics
type CouplingParameterKind = 
  | 'CouplingStrength'
  | 'CouplingDistance' 
  | 'CouplingVolatility';

// ❌ Avoid: Generic primitives and 'any' types
type DescriptionRange = { min: number; max: number; };
type UserData = { name: string; data: any; }; // ❌ FORBIDDEN: 'any' type
```

### CSS & Design System Patterns
- **Constraints-Based Design**: Use design tokens and systematic constraints
- **Vanilla Extract**: Leverage CSS-in-JS with functional composition patterns
- **Atomic Design**: Build reusable atomic components and compositions
- **No Hardcoded Values**: All styling should use design tokens
- **Functional CSS Utilities**: Create composable utility functions

### State Management
- **XState for Complex Logic**: Use state machines for complex business workflows
- **Effect Match Patterns**: Leverage functional pattern matching in state machines
- **Consolidated Actions**: Prefer single universal actions over multiple redundant ones
- **Pure Functions**: Keep state update logic pure and testable
- **Event-Driven Architecture**: Favor event emission over direct actor communication
- **Minimal Actor Usage**: Use actors sparingly, prefer events for component communication

### XState Architecture Patterns

#### When to Use Actors vs Events vs Child Machines

Understanding when to use different XState patterns is crucial for maintainable state management.

##### ✅ Prefer Event Emission for Component Communication

Event emission provides loose coupling, better testability, and clearer data flow than direct actor communication.

```typescript
// ✅ Preferred: Event-driven communication
const parentMachine = setup({
  types: {
    events: {} as 
      | { type: 'USER_SELECTED'; userId: string }
      | { type: 'DATA_LOADED'; data: UserData[] }
      | { type: 'ERROR_OCCURRED'; error: string }
  }
}).createMachine({
  on: {
    USER_SELECTED: {
      actions: emit(({ event }) => ({
        type: 'userSelected',
        userId: event.userId
      }))
    },
    DATA_LOADED: {
      actions: [
        'cacheData',
        emit(({ event }) => ({
          type: 'dataReady', 
          data: event.data
        }))
      ]
    }
  }
});

// Child components listen to events (pure XState patterns)
const childComponent = () => {
  const [state, send] = useMachine(childMachine, {
    input: ({ spawn }) => {
      // ✅ Use machine input and spawning for parent-child communication
      const parentActor = spawn(parentMachine);
      return { parentActor };
    }
  });
  
  // ✅ Handle parent events through machine actions and transitions
  // No useEffect needed - all handled in machine definition
};
```

##### ✅ Use Child Machines for Distinct Sub-Workflows

Child machines are appropriate when you have a clearly bounded sub-workflow that manages its own lifecycle.

```typescript
// ✅ Good: Child machine for file upload workflow
const fileUploadMachine = setup({
  types: {
    context: {} as { file: File; progress: number; url?: string },
    events: {} as 
      | { type: 'START_UPLOAD' }
      | { type: 'UPLOAD_PROGRESS'; progress: number }
      | { type: 'UPLOAD_COMPLETE'; url: string }
      | { type: 'UPLOAD_ERROR'; error: string }
  }
}).createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: { START_UPLOAD: 'uploading' }
    },
    uploading: {
      invoke: {
        src: 'uploadFile',
        onDone: { 
          target: 'completed',
          actions: assign(({ event }) => ({ url: event.output }))
        },
        onError: { 
          target: 'failed',
          actions: assign(({ event }) => ({ error: event.error }))
        }
      },
      on: {
        UPLOAD_PROGRESS: {
          actions: assign(({ event }) => ({ progress: event.progress }))
        }
      }
    },
    completed: { type: 'final' },
    failed: {
      on: { START_UPLOAD: 'uploading' }
    }
  }
});

// Parent machine spawns child for specific workflow
const documentMachine = setup({
  types: {
    context: {} as { 
      uploadActors: Record<string, ActorRefFrom<typeof fileUploadMachine>>
    }
  }
}).createMachine({
  context: { uploadActors: {} },
  on: {
    START_FILE_UPLOAD: {
      actions: assign(({ context, event, spawn }) => {
        const uploadActor = spawn(fileUploadMachine, {
          id: `upload-${event.fileId}`,
          input: { file: event.file }
        });
        
        return {
          uploadActors: {
            ...context.uploadActors,
            [event.fileId]: uploadActor
          }
        };
      })
    }
  }
});
```

##### ❌ Avoid Actors for Simple State Sharing

Don't use actors when simple event emission or context sharing would suffice.

```typescript
// ❌ Overengineered: Actor for simple counter
const counterActor = setup({
  types: {
    context: {} as { count: number },
    events: {} as { type: 'INCREMENT' } | { type: 'DECREMENT' }
  }
}).createMachine({
  context: { count: 0 },
  on: {
    INCREMENT: { actions: assign(({ context }) => ({ count: context.count + 1 })) },
    DECREMENT: { actions: assign(({ context }) => ({ count: context.count - 1 })) }
  }
});

// ✅ Better: Simple state in parent machine with events
const appMachine = setup({
  types: {
    context: {} as { count: number },
    events: {} as { type: 'INCREMENT' } | { type: 'DECREMENT' }
  }
}).createMachine({
  context: { count: 0 },
  on: {
    INCREMENT: {
      actions: [
        assign(({ context }) => ({ count: context.count + 1 })),
        emit(({ context }) => ({ type: 'countChanged', count: context.count + 1 }))
      ]
    }
  }
});
```

#### When to Use Actors

Use actors **only** when you need:

1. **Independent Lifecycles**: Each actor manages its own complete lifecycle
2. **Concurrent Workflows**: Multiple independent processes running simultaneously  
3. **Resource Management**: Each actor owns and manages specific resources
4. **Isolated State**: State that shouldn't be shared or coupled with parent
5. **Dynamic Creation**: Unknown number of similar workflows created at runtime

##### ✅ Good Actor Use Cases:

```typescript
// ✅ Independent user sessions
const userSessionMachine = setup({
  types: {
    context: {} as { 
      userId: string; 
      lastActivity: Date; 
      permissions: string[] 
    }
  }
}).createMachine({
  initial: 'active',
  states: {
    active: {
      after: {
        300000: 'warning' // 5 minute timeout
      },
      on: {
        ACTIVITY: {
          target: 'active',
          actions: assign({ lastActivity: () => new Date() })
        }
      }
    },
    warning: {
      after: {
        60000: 'expired' // 1 minute warning
      },
      on: {
        ACTIVITY: 'active',
        EXTEND_SESSION: 'active'
      }
    },
    expired: { type: 'final' }
  }
});

// App machine manages multiple user sessions
const appMachine = setup({
  types: {
    context: {} as { 
      userSessions: Record<string, ActorRefFrom<typeof userSessionMachine>>
    }
  }
}).createMachine({
  context: { userSessions: {} },
  on: {
    USER_LOGIN: {
      actions: assign(({ context, event, spawn }) => ({
        userSessions: {
          ...context.userSessions,
          [event.userId]: spawn(userSessionMachine, {
            id: `session-${event.userId}`,
            input: { userId: event.userId }
          })
        }
      }))
    },
    USER_LOGOUT: {
      actions: [
        ({ context, event }) => {
          context.userSessions[event.userId]?.stop();
        },
        assign(({ context, event }) => {
          const { [event.userId]: removed, ...remaining } = context.userSessions;
          return { userSessions: remaining };
        })
      ]
    }
  }
});

// ✅ Background data synchronization
const syncMachine = setup({
  types: {
    context: {} as { 
      lastSync: Date; 
      pendingItems: string[]; 
      retryCount: number 
    }
  }
}).createMachine({
  initial: 'idle',
  states: {
    idle: {
      after: {
        30000: 'syncing' // Sync every 30 seconds
      },
      on: {
        FORCE_SYNC: 'syncing',
        ADD_PENDING_ITEM: {
          actions: assign(({ context, event }) => ({
            pendingItems: [...context.pendingItems, event.itemId]
          }))
        }
      }
    },
    syncing: {
      invoke: {
        src: 'performSync',
        onDone: {
          target: 'idle',
          actions: assign({
            lastSync: () => new Date(),
            pendingItems: [],
            retryCount: 0
          })
        },
        onError: {
          target: 'retrying',
          actions: assign(({ context }) => ({
            retryCount: context.retryCount + 1
          }))
        }
      }
    },
    retrying: {
      after: {
        5000: [
          { target: 'syncing', guard: ({ context }) => context.retryCount < 3 },
          { target: 'failed' }
        ]
      }
    },
    failed: {
      on: {
        RETRY_SYNC: 'syncing'
      }
    }
  }
});
```

##### ❌ Avoid Actors For:

1. **Simple State Coordination**: Use events or shared context instead
2. **UI Component State**: Use local component state or parent machine context
3. **Request/Response Patterns**: Use invoke with promises
4. **Temporary Calculations**: Use pure functions or actions
5. **Parent-Child Data Flow**: Use events and context passing

```typescript
// ❌ Don't use actors for simple request/response
const fetchUserActor = setup({...}).createMachine({...}); // Overkill

// ✅ Use invoke for request/response
const userMachine = setup({
  actors: {
    fetchUser: fromPromise(async ({ input }: { input: { userId: string } }) => {
      const response = await fetch(`/api/users/${input.userId}`);
      return response.json();
    })
  }
}).createMachine({
  states: {
    loading: {
      invoke: {
        src: 'fetchUser',
        input: ({ context }) => ({ userId: context.userId }),
        onDone: {
          target: 'loaded',
          actions: assign(({ event }) => ({ user: event.output }))
        }
      }
    }
  }
});
```

#### Guidelines for XState Architecture:

1. **Start Simple**: Begin with single machine + events, add complexity only when needed
2. **Favor Events**: Use event emission for component communication over direct actor references
3. **Actors for Independence**: Only use actors for truly independent workflows with separate lifecycles
4. **Child Machines for Sub-workflows**: Use when you have bounded, distinct processes
5. **Avoid Actor Chains**: Don't create long chains of actor communication
6. **Test Isolation**: Actors should be testable in isolation
7. **Resource Ownership**: Each actor should own and manage its resources
8. **Cleanup Properly**: Always handle actor cleanup to prevent memory leaks

#### Event-Driven Patterns:

```typescript
// ✅ Event-driven architecture example
const blogMachine = setup({
  types: {
    events: {} as 
      | { type: 'ARTICLE_CREATED'; article: Article }
      | { type: 'COMMENT_ADDED'; articleId: string; comment: Comment }
      | { type: 'USER_SUBSCRIBED'; userId: string; articleId: string }
  }
}).createMachine({
  on: {
    ARTICLE_CREATED: {
      actions: [
        'saveArticle',
        emit(({ event }) => ({
          type: 'articlePublished',
          article: event.article
        }))
      ]
    },
    COMMENT_ADDED: {
      actions: [
        'saveComment',
        emit(({ event }) => ({
          type: 'commentNotification',
          articleId: event.articleId,
          comment: event.comment
        }))
      ]
    }
  }
});

// Separate concerns with pure XState (no useEffect needed)
const notificationMachine = setup({
  types: {
    events: {} as { type: 'COMMENT_NOTIFICATION'; articleId: string; comment: Comment }
  },
  actors: {
    sendNotification: fromPromise(async ({ input }: { 
      input: { articleId: string; comment: Comment } 
    }) => {
      return sendNotification(input.articleId, input.comment);
    })
  }
}).createMachine({
  on: {
    COMMENT_NOTIFICATION: {
      invoke: {
        src: 'sendNotification',
        input: ({ event }) => ({ 
          articleId: event.articleId, 
          comment: event.comment 
        })
      }
    }
  }
});

const analyticsMachine = setup({
  types: {
    events: {} as { type: 'ARTICLE_PUBLISHED'; article: Article }
  },
  actors: {
    trackEvent: fromPromise(async ({ input }: { 
      input: { eventName: string; data: EventData } 
    }) => {
      return analytics.track(input.eventName, input.data);
    })
  }
}).createMachine({
  on: {
    ARTICLE_PUBLISHED: {
      invoke: {
        src: 'trackEvent',
        input: ({ event }) => ({
          eventName: 'article_published',
          data: { id: event.article.id }
        })
      }
    }
  }
});

// Services just use machines - no useEffect anywhere
const NotificationService = () => {
  useMachine(notificationMachine);
  return null;
};

const AnalyticsService = () => {
  useMachine(analyticsMachine);
  return null;
};
```

### Code Quality Standards
- **No Redundancy**: Consolidate duplicate patterns and eliminate redundant code
- **Single Source of Truth**: Centralize configuration and avoid duplication
- **Type Safety**: Use TypeScript to its fullest - make invalid states unrepresentable
- **Functional Composition**: Prefer function composition over imperative code
- **Clear Domain Language**: Use ubiquitous domain language in code and types
- **Lookup Tables Over Control Flow**: Prefer lookup tables/objects over switch statements, if-else chains, and nested ternaries
- **Named Boolean Conditions**: Extract complex boolean expressions into named constants for clarity

### Control Flow & Conditional Logic Patterns

#### Prefer Lookup Tables Over Control Structures
Lookup tables provide better maintainability, readability, and performance than traditional control flow statements.

##### ✅ Use Lookup Tables For:
- **Mapping Values**: Direct value-to-value transformations
- **Configuration Data**: Status mappings, color schemes, text lookups
- **State Transitions**: Simple state machine transitions
- **Enum-like Mappings**: When you have finite, known options
- **Range-Based Logic**: Using range configurations instead of nested conditions

##### ❌ Avoid Switch/If-Else Chains For:
- **Simple mappings** that can be expressed as objects
- **Status or type** conversions with known finite options
- **Configuration** that changes frequently

#### Examples:

```typescript
// ✅ Preferred: Lookup tables with domain-specific types
const couplingStrengthDescriptions: Record<number, string> = {
  1: "Contract coupling (APIs only)",
  2: "Contract coupling (APIs only)", 
  3: "Model coupling (shared types/schemas)",
  // ...
};

// ✅ Better: Range-based lookup tables
const strengthConfig: CouplingParameterConfig<CouplingStrength> = {
  parameterKind: 'CouplingStrength',
  ranges: [
    createRange<CouplingStrength>(1, 2, "Contract coupling (APIs only)"),
    createRange<CouplingStrength>(3, 5, "Model coupling (shared types/schemas)"),
    // ...
  ],
};

// ✅ Preferred: Status mapping objects
const httpStatusMessages = {
  200: "Success",
  400: "Bad Request", 
  404: "Not Found",
  500: "Internal Server Error"
} as const;

// ❌ Avoid: Switch statements for simple mappings
const getStatusMessage = (status: number): string => {
  switch (status) {
    case 200: return "Success";
    case 400: return "Bad Request";
    case 404: return "Not Found";
    case 500: return "Internal Server Error";
    default: return "Unknown";
  }
};

// ❌ Avoid: If-else chains for mappings
const getDescription = (value: number): string => {
  if (value === 1 || value === 2) {
    return "Contract coupling (APIs only)";
  } else if (value >= 3 && value <= 5) {
    return "Model coupling (shared types/schemas)";
  } else if (value >= 6 && value <= 8) {
    return "Functional coupling (uses internal logic)";
  } else {
    return "Unknown";
  }
};

// ❌ Avoid: Nested ternaries
const getLevel = (score: number): string => 
  score >= 9 ? "Excellent" : score >= 7 ? "Good" : score >= 5 ? "Moderate" : "Poor";
```

#### Named Boolean Conditions (Strongly Preferred)
Extract complex boolean expressions into named constants that express business intent clearly.

##### Benefits:
1. **Self-Documenting**: Code reads like natural language
2. **Reusable**: Named conditions can be reused across functions
3. **Testable**: Individual conditions can be unit tested
4. **Maintainable**: Changes to business rules happen in one place
5. **Debuggable**: Easier to set breakpoints and inspect specific conditions

##### Examples:

```typescript
// ✅ Preferred: Named boolean conditions
const isHighVolatilityImbalance = balance > modularity && volatility >= 7;
const isRobustAndResilient = balance === modularity && modularity >= 8;
const isLowBalance = balance < 5;
const isUrgentAction = balance < 3 && volatility >= 8;
const isStableArchitecture = modularity >= 8 && volatility <= 3;

// Use in conditional logic
const balanceText = Match.value({
  isHighVolatilityImbalance,
  isRobustAndResilient, 
  isLowBalance,
}).pipe(
  Match.when({ isHighVolatilityImbalance: true }, () => 
    "Balance is higher than modularity due to high volatility. Consider decoupling."),
  Match.when({ isRobustAndResilient: true }, () => 
    "Architecture is robust and resilient to change."),
  Match.when({ isLowBalance: true }, () => 
    "Balance is low. This module is at risk for maintainability issues."),
  Match.orElse(() => "Balance is acceptable for most scenarios.")
);

// ✅ Preferred: Domain-specific boolean predicates
const isValidCouplingStrength = (value: number): boolean => value >= 1 && value <= 10;
const isLegacySystem = (volatility: number): boolean => volatility <= 2;
const requiresImmedateAttention = (balance: number, volatility: number): boolean => 
  balance < 3 && volatility >= 8;

// ❌ Avoid: Inline complex conditions
if (balance > modularity && volatility >= 7) { /* unclear intent */ }
if (balance === modularity && modularity >= 8) { /* hard to understand */ }

// ❌ Avoid: Unnamed magic numbers in conditions  
if (balance < 5) { /* what does 5 represent? */ }
if (volatility >= 7) { /* why 7? */ }
```

#### When to Use Traditional Control Flow:
- **Complex branching logic** that doesn't map well to lookup tables
- **Dynamic conditions** that depend on runtime state
- **Performance-critical paths** where object lookup overhead matters
- **Pattern matching** with Effect's Match API for discriminated unions

#### Guidelines:
1. **Start with lookup tables** - can they solve your problem?
2. **Extract complex conditions** into named boolean constants
3. **Use domain language** in condition names
4. **Group related conditions** into objects or classes
5. **Consider Effect Match** for complex discriminated union handling
6. **Document magic numbers** with named constants
7. **Test conditions independently** when possible

### Avoiding Boolean Blindness (Critical Pattern)

Boolean blindness occurs when using primitive boolean values instead of expressive types that capture domain meaning. This leads to unclear APIs, runtime errors, and maintainability issues.

#### What is Boolean Blindness?
Boolean blindness happens when functions accept or return `boolean` values that lose semantic meaning, making code harder to understand and prone to errors.

#### Problems with Boolean Blindness:
1. **Unclear Intent**: `processData(data, true, false)` - what do the booleans mean?
2. **Parameter Confusion**: Easy to swap boolean parameters accidentally
3. **Lost Domain Knowledge**: Boolean doesn't capture the business concept
4. **Runtime Errors**: No compile-time protection against wrong values
5. **Poor Readability**: Code requires mental mapping of boolean to meaning

#### Solutions: Discriminated Unions & Domain Types

##### ✅ Use Discriminated Unions Instead of Booleans:

```typescript
// ❌ Boolean Blindness - unclear meaning
type ValidationResult = {
  isValid: boolean;
  hasErrors: boolean;
  isComplete: boolean;
};

function processValidation(result: ValidationResult): void {
  if (result.isValid && !result.hasErrors && result.isComplete) {
    // What combination of booleans actually means "success"?
  }
}

// ✅ Discriminated Union - explicit domain states
type ValidationOutcome = 
  | { type: 'Success'; data: ValidatedData }
  | { type: 'ValidationError'; errors: ValidationError[] }
  | { type: 'IncompleteData'; missingFields: string[] }
  | { type: 'SystemError'; error: Error };

function processValidation(outcome: ValidationOutcome): void {
  Match.value(outcome).pipe(
    Match.tag('Success', ({ data }) => {
      // Clear success case - no ambiguity
    }),
    Match.tag('ValidationError', ({ errors }) => {
      // Clear error case with specific error data
    }),
    Match.exhaustive
  );
}

// ❌ Boolean parameters - meaning unclear
function createUser(userData: UserData, isActive: boolean, isVerified: boolean): User {
  // What does isActive: false, isVerified: true mean?
}

// ✅ Domain-specific types - meaning explicit
type UserStatus = 
  | 'Active'
  | 'Inactive' 
  | 'Suspended'
  | 'Pending';

type VerificationStatus = 
  | 'Verified'
  | 'Unverified'
  | 'VerificationPending'
  | 'VerificationFailed';

function createUser(
  userData: UserData, 
  status: UserStatus, 
  verification: VerificationStatus
): User {
  // Crystal clear what each parameter represents
}
```

##### ✅ Domain-Specific Boolean Types:

```typescript
// ❌ Primitive boolean - loses domain meaning
function setFeatureFlag(name: string, enabled: boolean): void {
  // enabled: true could mean many things
}

// ✅ Domain-specific boolean type - preserves meaning
type FeatureState = 'Enabled' | 'Disabled';
type FeatureVisibility = 'Public' | 'Internal' | 'Hidden';

function setFeatureFlag(
  name: string, 
  state: FeatureState,
  visibility: FeatureVisibility
): void {
  // Clear domain language - no ambiguity
}

// ❌ Boolean blindness in business logic
function calculatePrice(
  basePrice: number,
  hasDiscount: boolean,
  isPremium: boolean,
  isEarlyBird: boolean
): number {
  // Complex boolean combinations are error-prone
  if (hasDiscount && isPremium && !isEarlyBird) {
    return basePrice * 0.9;
  } else if (!hasDiscount && isPremium && isEarlyBird) {
    return basePrice * 0.85;
  }
  // ... more confusing combinations
}

// ✅ Domain-specific discriminated union
type PricingTier = 
  | { type: 'Standard'; discountCode?: string }
  | { type: 'Premium'; membershipLevel: 'Silver' | 'Gold' | 'Platinum' }
  | { type: 'EarlyBird'; registrationDate: Date }
  | { type: 'Corporate'; contractDiscount: number };

function calculatePrice(basePrice: number, tier: PricingTier): number {
  return Match.value(tier).pipe(
    Match.tag('Standard', ({ discountCode }) => 
      discountCode ? basePrice * 0.95 : basePrice
    ),
    Match.tag('Premium', ({ membershipLevel }) => 
      basePrice * getPremiumDiscount(membershipLevel)
    ),
    Match.tag('EarlyBird', ({ registrationDate }) => 
      basePrice * getEarlyBirdDiscount(registrationDate)
    ),
    Match.tag('Corporate', ({ contractDiscount }) => 
      basePrice * (1 - contractDiscount)
    ),
    Match.exhaustive
  );
}
```

##### ✅ State Management Without Boolean Blindness:

```typescript
// ❌ Boolean blindness in state
type LoadingState = {
  isLoading: boolean;
  hasError: boolean;
  hasData: boolean;
};

// What does isLoading: false, hasError: false, hasData: false mean?
// Is it initial state? Empty result? Some other state?

// ✅ Explicit state modeling
type DataState<T, E = Error> = 
  | { type: 'Idle' }
  | { type: 'Loading' }
  | { type: 'Success'; data: T }
  | { type: 'Error'; error: E }
  | { type: 'Empty' };

// Impossible states are now unrepresentable
// Clear progression: Idle -> Loading -> Success/Error/Empty
```

#### Benefits of Avoiding Boolean Blindness:

1. **Type Safety**: Compiler prevents invalid state combinations
2. **Self-Documenting**: Code expresses business intent clearly
3. **Refactoring Safety**: Changes to domain logic are caught at compile time
4. **Better Testing**: Each state can be tested independently
5. **Impossible States**: Make invalid states unrepresentable
6. **Clear APIs**: Function signatures express exactly what they do

#### Migration Strategy:

```typescript
// Step 1: Identify boolean blindness patterns
function oldFunction(data: Data, flag1: boolean, flag2: boolean): Result {
  // Multiple boolean parameters = code smell
}

// Step 2: Model the domain properly
type ProcessingMode = 'Fast' | 'Thorough' | 'Safe';
type OutputFormat = 'JSON' | 'XML' | 'CSV';

// Step 3: Replace with domain types
function newFunction(data: Data, mode: ProcessingMode, format: OutputFormat): Result {
  // Clear, type-safe, self-documenting
}

// Step 4: Use discriminated unions for complex state
type ProcessingResult<T> = 
  | { type: 'Success'; data: T; processingTime: number }
  | { type: 'PartialSuccess'; data: T; warnings: Warning[] }
  | { type: 'Failure'; error: ProcessingError; retryable: boolean };
```

#### Guidelines for Avoiding Boolean Blindness:

1. **Question Every Boolean**: Does this boolean represent a domain concept?
2. **Use Discriminated Unions**: For state that can be one of several options
3. **Create Domain Types**: Even for simple on/off states, use domain language
4. **Make Impossible States Unrepresentable**: Use types to prevent invalid combinations
5. **Prefer Match/Switch**: Use pattern matching with discriminated unions
6. **Name States Explicitly**: 'Enabled'/'Disabled' instead of true/false
7. **Avoid Boolean Parameters**: Especially multiple boolean parameters in functions

### Refactoring Principles
1. **Preserve Functionality**: Maintain existing behavior while improving structure
2. **Incremental Improvement**: Make small, focused changes with clear benefits
3. **Type-Driven Refactoring**: Use types to guide safe refactoring
4. **Pattern Consolidation**: Identify and eliminate repeated patterns
5. **Domain Modeling**: Continuously improve domain representation

### Error Handling Philosophy (Critical)

We follow functional programming languages (Rust, Haskell, F#) in treating errors as **values, not exceptions**. This approach provides better type safety, composability, and predictability.

#### RFC 9457 Problem Details for HTTP APIs

We use [RFC 9457 Problem Details](https://datatracker.ietf.org/doc/html/rfc9457) as our standard for HTTP error responses. This RFC provides a standardized way to carry machine-readable details of errors in HTTP responses.

##### Why RFC 9457?
1. **Standardization**: Industry-standard format for error responses
2. **Machine-Readable**: Structured error information for client processing
3. **Extensible**: Allows custom properties while maintaining compatibility
4. **Interoperability**: Well-established standard used by major APIs
5. **Clear Semantics**: Unambiguous error communication between services

##### RFC 9457 Structure:
```typescript
// RFC 9457 Problem Details format
type ProblemDetails = {
  type: string;        // URI reference identifying the problem type
  title: string;       // Human-readable summary
  status: number;      // HTTP status code
  detail?: string;     // Human-readable explanation specific to this occurrence
  instance?: string;   // URI reference identifying this specific occurrence
  [key: string]: any;  // Extension members allowed
};

// Example implementation
const ValidationProblem: ProblemDetails = {
  type: "https://example.com/probs/validation-error",
  title: "Validation Error", 
  status: 400,
  detail: "The 'strength' parameter must be between 1 and 10",
  instance: "/api/coupling/validate",
  invalidParams: [
    { name: "strength", reason: "out of range", value: 15 }
  ]
};
```

#### Values Over Exceptions (Strongly Preferred)

**Never throw exceptions** for expected error cases. Use Result types that make error handling explicit and composable.

##### Why Values Over Exceptions?

1. **Type Safety**: Errors are part of the function signature
2. **Composability**: Result types can be chained and composed functionally
3. **Performance**: No stack unwinding or exception handling overhead
4. **Predictability**: All possible outcomes are explicit in types
5. **Functional Composition**: Works seamlessly with functional programming patterns
6. **Error Propagation**: Clear, explicit error propagation through call chains

##### ✅ Preferred: Result Types for Expected Errors

```typescript
// ✅ Use Result types for domain operations
type ValidationResult<T> = Result<T, ValidationError>;
type DomainResult<T> = Result<T, DomainError>;
type ApiResult<T> = Result<T, ApiError>;

// Domain errors as values
type DomainError = 
  | ValidationError
  | BusinessRuleError  
  | NotFoundError
  | ConcurrencyError;

type ValidationError = {
  type: 'ValidationError';
  field: string;
  message: string;
  violations: ValidationViolation[];
};

type BusinessRuleError = {
  type: 'BusinessRuleError';
  rule: string;
  message: string;
  context: Record<string, unknown>;
};

// Smart constructors return Results
const createCouplingStrength = (value: number): DomainResult<CouplingStrength> => {
  if (value < 1 || value > 10) {
    return err({
      type: 'ValidationError',
      field: 'strength',
      message: 'Coupling strength must be between 1 and 10',
      violations: [{ constraint: 'range', expected: '1-10', actual: value }]
    });
  }
  return ok(value as CouplingStrength);
};

// API operations return Results
const createBlip = async (data: BlipCreateData): Promise<ApiResult<Blip>> => {
  // Validate input
  const validationResult = validateBlipData(data);
  if (validationResult.isErr()) {
    return validationResult; // Error propagation without exceptions
  }

  // Business logic
  const blipResult = await BlipService.create(validationResult.value);
  if (blipResult.isErr()) {
    return blipResult; // Domain errors propagate as values
  }

  // Success case
  return ok(blipResult.value);
};
```

##### ✅ Functional Error Composition

```typescript
// Chain operations with automatic error propagation
const processUserRegistration = async (userData: UserData): Promise<ApiResult<User>> => {
  return pipe(
    userData,
    validateUserData,
    Result.flatMap(createUser),
    Result.flatMap(sendWelcomeEmail),
    Result.flatMap(logUserCreation)
  );
};

// Combine multiple validation results
const validateCompleteUserProfile = (data: UserProfileData): ValidationResult<UserProfile> => {
  const emailResult = validateEmail(data.email);
  const ageResult = validateAge(data.age);
  const nameResult = validateName(data.name);
  
  return Result.combine(emailResult, ageResult, nameResult)
    .map(([email, age, name]) => ({ email, age, name }));
};
```

##### ❌ Avoid: Exceptions for Expected Errors

```typescript
// ❌ Don't throw exceptions for domain errors
const createCouplingStrength = (value: number): CouplingStrength => {
  if (value < 1 || value > 10) {
    throw new Error("Invalid coupling strength"); // Makes error handling unpredictable
  }
  return value as CouplingStrength;
};

// ❌ Don't use try-catch for business logic
const processData = (data: Data): ProcessedData => {
  try {
    const validated = validateData(data); // Might throw
    const transformed = transformData(validated); // Might throw
    return transformed;
  } catch (error) {
    // Unclear what errors are possible, poor composability
    throw new ProcessingError("Processing failed", error);
  }
};
```

#### When Exceptions Are Acceptable

Use exceptions **only** for truly exceptional circumstances:

1. **System Failures**: Out of memory, file system errors, network infrastructure failures
2. **Programming Errors**: Null pointer dereferences, array bounds violations, type errors
3. **Infrastructure Issues**: Database connection failures, external service unavailability
4. **Unrecoverable States**: Corrupted data, invalid system configuration

```typescript
// ✅ Exceptions for system failures
const readConfigFile = (path: string): Config => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    // System failure - file system issue
    throw new SystemError(`Cannot read config file: ${path}`, error);
  }
};

// ✅ Result for expected validation
const parseUserAge = (input: string): Result<Age, ValidationError> => {
  const age = parseInt(input, 10);
  if (isNaN(age) || age < 0 || age > 150) {
    return err(new ValidationError('age', 'Must be a valid age between 0 and 150'));
  }
  return ok(age as Age);
};
```

#### HTTP API Error Mapping

```typescript
// Map domain errors to RFC 9457 Problem Details
const mapDomainErrorToProblemDetails = (error: DomainError, baseUrl: string): ProblemDetails => {
  return Match.value(error).pipe(
    Match.tag('ValidationError', (err) => ({
      type: `${baseUrl}/problems/validation-error`,
      title: 'Validation Error',
      status: 400,
      detail: err.message,
      invalidParams: err.violations.map(v => ({
        name: err.field,
        reason: v.constraint,
        value: v.actual
      }))
    })),
    Match.tag('BusinessRuleError', (err) => ({
      type: `${baseUrl}/problems/business-rule-violation`,
      title: 'Business Rule Violation',
      status: 422,
      detail: err.message,
      rule: err.rule,
      context: err.context
    })),
    Match.tag('NotFoundError', (err) => ({
      type: `${baseUrl}/problems/not-found`,
      title: 'Resource Not Found',
      status: 404,
      detail: err.message,
      resource: err.resource
    })),
    Match.exhaustive
  );
};

// API endpoint with proper error handling
export const POST: APIRoute = async ({ request, url }) => {
  const result = await createBlip(await request.json());
  
  return result.match(
    (blip) => new Response(JSON.stringify(blip), { status: 201 }),
    (error) => {
      const problem = mapDomainErrorToProblemDetails(error, url.origin);
      return new Response(JSON.stringify(problem), { 
        status: problem.status,
        headers: { 'Content-Type': 'application/problem+json' }
      });
    }
  );
};
```

#### Guidelines for Error Handling:

1. **Use Result Types**: For all domain operations that can fail predictably
2. **Never Throw for Domain Errors**: Business validation, rule violations, not found errors
3. **Exceptions Only for System Failures**: Infrastructure, programming errors, unrecoverable states
4. **RFC 9457 for HTTP APIs**: Standardized error format for client consumption
5. **Compose Errors Functionally**: Use Result.flatMap, Result.combine for error propagation
6. **Map Errors at Boundaries**: Convert domain errors to appropriate formats (HTTP, logs, etc.)
7. **Make Errors Explicit**: Function signatures should show possible error types

### API Design
- **Functional Core in APIs**: Separate HTTP concerns from business logic
- **Result Types**: Use Result types for error handling instead of exceptions  
- **RFC 9457 Error Format**: Use Problem Details for standardized HTTP error responses
- **Domain Services**: Create domain services for business operations
- **Repository Interfaces**: Abstract data access behind domain interfaces

### Testing Strategy
- **Pure Function Testing**: Test business logic as pure functions
- **Property-Based Testing**: Use fast-check for property-based testing
- **Domain Model Testing**: Test domain invariants and business rules
- **Integration Testing**: Test the imperative shell integration points

## Test-Driven Development (TDD) Standards

We follow **strict Test-Driven Development** for all new features and functionality. Every piece of new code must be driven by tests, and our tests must work as expected on a regular basis.

### TDD Philosophy

#### **Core Principle: Tests First, Always**
- **Never write production code without a failing test first**
- Tests define the contract and behavior before implementation
- Implementation exists to make tests pass, not the other way around

#### **Benefits in Our Functional Codebase:**
1. **Type Safety Verification**: Tests verify our domain types work correctly
2. **Smart Constructor Validation**: Tests ensure domain invariants are enforced
3. **Business Logic Correctness**: Tests verify pure function behavior
4. **Functional Composition**: Tests verify complex pipelines work end-to-end
5. **Result Type Handling**: Tests ensure error cases are handled properly

### The Red-Green-Refactor Cycle

#### **🔴 Red Phase - Write a Failing Test**
1. **Understand the requirement** - What exact behavior do we need?
2. **Write the simplest test** that exercises that behavior
3. **Run the test** and watch it fail (confirms test is working)
4. **Verify error message** is meaningful and helpful

#### **🟢 Green Phase - Make It Pass**  
1. **Write minimal code** to make the test pass
2. **No gold-plating** - implement exactly what the test requires
3. **Run tests** to confirm green state
4. **Commit immediately** when green

#### **🔄 Refactor Phase - Clean Up**
1. **Improve code structure** without changing behavior
2. **Apply our coding patterns** (smart constructors, functional composition)
3. **Run tests continuously** during refactoring
4. **Ensure all tests stay green**

### TDD Workflow for New Features

#### **1. Domain Objects & Smart Constructors**

```typescript
// 🔴 RED: Write test first
describe('CouplingStrength', () => {
  it('should create valid coupling strength for values 1-10', () => {
    const result = createCouplingStrength(5);
    expect(result.isOk()).toBe(true);
    expect(result.value).toBe(5);
  });

  it('should reject coupling strength below 1', () => {
    const result = createCouplingStrength(0);
    expect(result.isErr()).toBe(true);
    expect(result.error.type).toBe('ValidationError');
  });

  it('should reject coupling strength above 10', () => {
    const result = createCouplingStrength(11);
    expect(result.isErr()).toBe(true);
    expect(result.error.field).toBe('strength');
  });
});

// 🟢 GREEN: Implement smart constructor
const createCouplingStrength = (value: number): DomainResult<CouplingStrength> => {
  if (value < 1 || value > 10) {
    return err({
      type: 'ValidationError',
      field: 'strength', 
      message: 'Coupling strength must be between 1 and 10',
      violations: [{ constraint: 'range', expected: '1-10', actual: value }]
    });
  }
  return ok(value as CouplingStrength);
};
```

#### **2. Pure Business Logic Functions**

```typescript
// 🔴 RED: Test pure function behavior
describe('calculateModularity', () => {
  it('should calculate modularity as absolute difference plus 1', () => {
    expect(calculateModularity(8, 2)).toBe(7); // |8-2| + 1 = 7
    expect(calculateModularity(3, 7)).toBe(5); // |3-7| + 1 = 5
    expect(calculateModularity(5, 5)).toBe(1); // |5-5| + 1 = 1
  });

  it('should handle edge cases correctly', () => {
    expect(calculateModularity(1, 10)).toBe(10); // |1-10| + 1 = 10
    expect(calculateModularity(10, 1)).toBe(10); // |10-1| + 1 = 10
  });
});

// 🟢 GREEN: Implement pure function
export const calculateModularity = (
  strength: number,
  distance: number,
): number => Math.abs(strength - distance) + 1;
```

#### **3. Functional Pipelines & Composition**

```typescript
// 🔴 RED: Test flow composition
describe('findPresetNamePipeline', () => {
  const testData = [
    { name: 'Test1', strength: 5, distance: 3, volatility: 2 },
    { name: 'Test2', strength: 8, distance: 1, volatility: 9 }
  ];

  it('should find preset name when match exists', () => {
    const predicate = (preset: PresetScenario) => preset.strength === 5;
    const pipeline = findPresetNamePipeline(predicate);
    
    expect(pipeline(testData)).toBe('Test1');
  });

  it('should return null when no match exists', () => {
    const predicate = (preset: PresetScenario) => preset.strength === 99;
    const pipeline = findPresetNamePipeline(predicate);
    
    expect(pipeline(testData)).toBeNull();
  });
});

// 🟢 GREEN: Implement reusable pipeline
const findPresetNamePipeline = (
  predicate: (preset: PresetScenario) => boolean,
) =>
  flow(
    EffectArray.findFirst(predicate),
    Option.map((preset: PresetScenario) => preset.name),
    Option.getOrNull,
  );
```

#### **4. XState Machines**

```typescript
// 🔴 RED: Test state transitions
describe('BalancedCouplingMachine', () => {
  it('should update strength and recalculate preset', () => {
    const machine = createActor(balancedCouplingMachine).start();
    
    machine.send({ type: 'SET_STRENGTH', value: 8 });
    
    expect(machine.getSnapshot().context.strength).toBe(8);
    expect(machine.getSnapshot().context.activePreset).toBe('Legacy Integration');
  });

  it('should clear active preset when no match found', () => {
    const machine = createActor(balancedCouplingMachine).start();
    
    machine.send({ type: 'SET_STRENGTH', value: 7 });
    
    expect(machine.getSnapshot().context.activePreset).toBeNull();
  });
});

// 🟢 GREEN: Implement machine with Effect Match
export const updateContextFunctionally = (
  context: Context,
  event: Events,
): Context => {
  const effectEvent = toEffectEvent(event);
  return handleContextUpdate(context, effectEvent);
};
```

#### **5. API Endpoints**

```typescript
// 🔴 RED: Test API with Result types
describe('POST /api/blips', () => {
  it('should create blip with valid data', async () => {
    const validBlipData = {
      name: 'React',
      quadrant: 'languages-frameworks',
      ring: 'adopt',
      description: 'JavaScript library'
    };

    const response = await POST({ request: new Request('/', { 
      method: 'POST', 
      body: JSON.stringify(validBlipData) 
    }) });

    expect(response.status).toBe(201);
    const blip = await response.json();
    expect(blip.name).toBe('React');
  });

  it('should return RFC 9457 problem details for validation errors', async () => {
    const invalidData = { name: '' }; // Missing required fields

    const response = await POST({ request: new Request('/', { 
      method: 'POST', 
      body: JSON.stringify(invalidData) 
    }) });

    expect(response.status).toBe(400);
    expect(response.headers.get('Content-Type')).toBe('application/problem+json');
    
    const problem = await response.json();
    expect(problem.type).toContain('/problems/validation-error');
    expect(problem.title).toBe('Validation Error');
  });
});
```

### Property-Based Testing with fast-check

For complex domain logic, use property-based testing to verify invariants:

```typescript
// 🔴 RED: Define properties that should always hold
describe('Coupling calculations', () => {
  it('modularity should always be positive', () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 10 }), // strength
      fc.integer({ min: 1, max: 10 }), // distance
      (strength, distance) => {
        const modularity = calculateModularity(strength, distance);
        return modularity > 0;
      }
    ));
  });

  it('balance should never be less than modularity', () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 10 }), // modularity
      fc.integer({ min: 1, max: 10 }), // volatility
      (modularity, volatility) => {
        const balance = calculateBalance(modularity, volatility);
        return balance >= modularity;
      }
    ));
  });

  it('smart constructors should be idempotent for valid inputs', () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 10 }),
      (validValue) => {
        const result1 = createCouplingStrength(validValue);
        const result2 = createCouplingStrength(validValue);
        
        return result1.isOk() && result2.isOk() && 
               result1.value === result2.value;
      }
    ));
  });
});
```

### Testing Guidelines & Best Practices

#### **Test Structure**
- **Arrange-Act-Assert** pattern for clarity
- **Given-When-Then** for behavior-driven scenarios
- **Descriptive test names** that explain the scenario
- **One assertion per logical concept**

#### **Test Categories**

**Unit Tests (Fastest, Most Frequent):**
- Pure functions (calculations, transformations)
- Smart constructors and domain objects
- Individual XState actions and guards
- Utility functions and pipelines

**Integration Tests (Medium Speed):**
- XState machine state transitions
- API endpoint request/response cycles
- Database operations with test data
- Service layer orchestration

**End-to-End Tests (Slowest, Least Frequent):**
- Complete user workflows
- Cross-service communication
- Browser automation scenarios
- Performance and load testing

#### **Test Data Management**

```typescript
// 🔴 RED: Create test builders for complex objects
const buildPresetScenario = (overrides: Partial<PresetScenario> = {}): PresetScenario => ({
  name: 'Test Scenario',
  strength: 5,
  distance: 5,
  volatility: 5,
  description: 'Test description',
  ...overrides
});

// Use in tests
it('should find matching preset by exact parameters', () => {
  const preset = buildPresetScenario({ 
    name: 'Legacy Integration',
    strength: 8, 
    distance: 2, 
    volatility: 2 
  });
  
  const result = findMatchingPreset(8, 2, 2, [preset]);
  expect(result).toBe('Legacy Integration');
});
```

### Test Commands & Workflow

#### **Running Tests**
```bash
# Run all tests
pnpm test
make test

# Run tests in watch mode (TDD workflow)
pnpm test:watch
make test-watch

# Run specific test file
pnpm test coupling.test.ts

# Run tests with coverage
pnpm test:coverage
```

#### **TDD Development Workflow**
1. **Start watch mode**: `pnpm test:watch`
2. **Write failing test** for new behavior
3. **Implement minimal code** to pass
4. **Refactor while staying green**
5. **Commit when tests pass**
6. **Repeat for next requirement**

### Test Maintenance & Quality

#### **Regular Test Maintenance**
- **Run full test suite** before every commit
- **Update tests** when requirements change
- **Remove obsolete tests** when features are removed
- **Refactor test code** to follow our patterns

#### **Test Quality Checks**
- **All tests must pass** before merging
- **Test coverage** should remain high for core business logic
- **No flaky tests** - tests must be deterministic
- **Fast feedback** - unit tests should run in milliseconds

#### **Test-First Enforcement**

**For Claude Code assistance:**
- Always request "Write the test first" for new functionality
- Verify tests fail before implementation
- Ensure tests follow our domain modeling patterns
- Include property-based tests for complex logic

**Quality Gates:**
- ✅ Test exists and fails initially
- ✅ Implementation makes test pass  
- ✅ Test follows our coding patterns
- ✅ All existing tests remain green
- ✅ Code follows functional programming principles

### Examples of Good TDD Practices

#### **Domain Logic TDD:**
```typescript
// 🔴 RED: Test domain behavior
describe('Tech Radar Business Logic', () => {
  it('should classify blip as outdated when last updated over 18 months ago', () => {
    const oldDate = new Date();
    oldDate.setMonth(oldDate.getMonth() - 20);
    
    const blip = buildBlip({ lastUpdated: oldDate });
    const classification = classifyBlipFreshness(blip);
    
    expect(classification.type).toBe('Outdated');
    expect(classification.monthsOld).toBeGreaterThan(18);
  });
});
```

#### **Error Handling TDD:**
```typescript
// 🔴 RED: Test Result type error cases
describe('Blip validation', () => {
  it('should return ValidationError for invalid quadrant', () => {
    const invalidBlipData = { quadrant: 'invalid-quadrant' };
    
    const result = validateBlipData(invalidBlipData);
    
    expect(result.isErr()).toBe(true);
    expect(result.error.type).toBe('ValidationError');
    expect(result.error.field).toBe('quadrant');
  });
});
```

This TDD approach ensures our functional programming patterns, domain modeling, and error handling philosophy are all verified through comprehensive tests that drive the implementation.

## Documentation Standards (Diátaxis Framework)

We follow the [Diátaxis framework](https://diataxis.fr/) for all documentation, READMEs, and how-to guides. This systematic approach ensures our documentation serves users effectively across different contexts and needs.

### The Four Documentation Types

Diátaxis organizes documentation into four distinct types, each serving different user needs and contexts:

#### 1. **Tutorials** (Learning-Oriented)
**Purpose**: Guide newcomers through their first successful experience
**Audience**: Complete beginners who need to build confidence
**Format**: Step-by-step lessons with guaranteed outcomes

**When to create tutorials:**
- Onboarding new team members
- Introducing new technologies or frameworks
- Setting up development environments

**Tutorial characteristics:**
- Start from absolute zero knowledge
- Provide concrete, specific steps
- Ensure every step works reliably
- Focus on building confidence, not comprehensive understanding
- Include expected outcomes at each step

**Example tutorial topics:**
- "Getting Started with the Tech Radar"
- "Your First Blip: Adding a New Technology"
- "Setting Up Your Development Environment"

#### 2. **How-To Guides** (Problem-Oriented)
**Purpose**: Show how to solve specific real-world problems
**Audience**: Users with some experience who need to accomplish a task
**Format**: Goal-oriented instructions that assume basic knowledge

**When to create how-to guides:**
- Documenting common development tasks
- Explaining deployment procedures
- Covering troubleshooting scenarios

**How-to guide characteristics:**
- Start with a clear problem statement
- Provide practical, actionable steps
- Assume prerequisite knowledge
- Focus on the solution, not explanation
- Include variants and alternatives when relevant

**Example how-to topics:**
- "How to Add a New Quadrant to the Tech Radar"
- "How to Configure API Rate Limiting"
- "How to Debug XState Machine Issues"
- "How to Deploy to Production"

#### 3. **Reference** (Information-Oriented)
**Purpose**: Provide authoritative, comprehensive information
**Audience**: Experienced users who need specific facts
**Format**: Systematic, encyclopedic coverage

**When to create reference documentation:**
- API documentation
- Configuration options
- Code standards and conventions
- Architecture decision records (ADRs)

**Reference characteristics:**
- Comprehensive and authoritative
- Structured for easy lookup
- Consistent in format and style
- Factual, not explanatory
- Includes examples of usage

**Example reference topics:**
- "API Endpoint Reference"
- "Configuration Schema"
- "Make Command Reference" (already implemented)
- "TypeScript Coding Standards" (already implemented)

#### 4. **Explanation** (Understanding-Oriented)
**Purpose**: Clarify concepts, provide context, and deepen understanding
**Audience**: Users who want to understand the "why" behind decisions
**Format**: Discursive, contextual discussion

**When to create explanations:**
- Architectural decisions and rationale
- Design philosophy and principles
- Technology choices and trade-offs
- Domain modeling concepts

**Explanation characteristics:**
- Discuss concepts and their relationships
- Provide context and background
- Explain trade-offs and alternatives
- Connect to broader principles
- Support understanding rather than action

**Example explanation topics:**
- "Why We Use Functional Programming Patterns"
- "Understanding the Imperative Shell/Functional Core Architecture"
- "The Philosophy Behind Our Error Handling Approach"
- "Tech Radar as a Decision-Making Tool"

### Benefits of the Diátaxis Framework

#### **For Users:**
1. **Clear Expectations**: Users know what type of help they're getting
2. **Appropriate Depth**: Content matches their current need and context
3. **Efficient Navigation**: Can quickly find the right type of documentation
4. **Progressive Learning**: Natural progression from tutorials → how-tos → reference → explanation

#### **For Authors:**
1. **Clear Purpose**: Each piece has a defined role and scope
2. **Consistent Quality**: Framework provides quality guidelines for each type
3. **Reduced Overlap**: Clear boundaries prevent redundant content
4. **Maintainable Structure**: Systematic organization makes updates easier

#### **For the Project:**
1. **Professional Documentation**: Industry-standard approach used by major projects
2. **User Adoption**: Better documentation leads to faster onboarding and fewer support requests
3. **Knowledge Preservation**: Systematic capture of different types of knowledge
4. **Scalability**: Framework scales from small to large documentation sets

### Implementation Guidelines

#### **Documentation Planning Matrix:**

| User Need | New to Project | Familiar with Project |
|-----------|----------------|----------------------|
| **I want to learn** | Tutorial | Explanation |
| **I want to do something** | How-to Guide | Reference |

#### **Content Creation Process:**

1. **Identify the Type**: Which quadrant does this content belong to?
2. **Define the Audience**: Who specifically will use this?
3. **Set the Scope**: What exactly should this cover?
4. **Choose the Format**: What structure best serves the type?
5. **Write with Purpose**: Stay focused on the type's specific goal

#### **Quality Checklist by Type:**

**Tutorials:**
- [ ] Can a complete beginner follow this successfully?
- [ ] Does each step have a clear, verifiable outcome?
- [ ] Is the path from start to finish unambiguous?
- [ ] Does this build confidence and motivation?

**How-to Guides:**
- [ ] Is the problem clearly stated upfront?
- [ ] Are the steps practical and actionable?
- [ ] Does this solve a real user need?
- [ ] Are prerequisites clearly stated?

**Reference:**
- [ ] Is the information complete and authoritative?
- [ ] Is it structured for easy lookup?
- [ ] Is the format consistent throughout?
- [ ] Are examples provided where needed?

**Explanation:**
- [ ] Does this deepen understanding of concepts?
- [ ] Is the context and rationale clear?
- [ ] Are connections to broader principles made?
- [ ] Does this answer "why" questions effectively?

### Documentation Maintenance

#### **Regular Reviews:**
- **Quarterly**: Review all tutorials for accuracy with current setup
- **After major changes**: Update affected how-to guides and reference docs
- **Continuous**: Keep explanations current with architectural decisions

#### **User Feedback Integration:**
- Track which documentation types users struggle with
- Identify gaps where one type is missing
- Monitor for content that spans multiple types (often needs splitting)

#### **Evolution Patterns:**
1. **Start with how-to guides** for immediate user needs
2. **Add tutorials** when onboarding becomes frequent
3. **Develop reference** as features stabilize
4. **Create explanations** to capture architectural wisdom

### Examples in Our Project

#### **Current Documentation (Diátaxis Classification):**

**Reference Documentation:**
- CLAUDE.md → Reference (coding standards, patterns, commands)
- HELP_CLAUDE.md → Reference (collaboration patterns)
- Make command documentation → Reference (command reference)

**How-to Guides (Needed):**
- Setting up the development environment
- Adding a new technology to the radar
- Deploying the application
- Debugging common issues

**Tutorials (Needed):**
- Your first contribution to the tech radar
- Understanding coupling analysis through hands-on examples

**Explanations (Partially Exists):**
- Architecture patterns → Explanation (already in CLAUDE.md)
- Functional programming philosophy → Explanation (already in CLAUDE.md)
- Tech radar methodology → Explanation (needed)

This framework ensures our documentation grows systematically and serves all user types effectively, from newcomers taking their first steps to experts seeking specific reference information.

## Working with Claude Code

### Keeping Claude Precise and On-Track

This section provides guidance for maintaining focused, productive sessions with Claude Code while adhering to project standards.

#### Essential Practices

##### 1. Always Reference This File
- **Start sessions** by asking Claude to read and acknowledge this CLAUDE.md file
- **Redirect when needed**: If Claude deviates from established patterns, reference specific sections of this file
- **Update continuously**: Add new patterns and preferences to this file as the project evolves

##### 2. Be Specific About Context
```
❌ Vague: "Fix the coupling component"
✅ Specific: "@apps/astro/src/components/BalancedCouplingExplorer.machine.ts has type errors with Match.type() usage - fix using Match.value().pipe() pattern"

❌ Generic: "Refactor this for better performance" 
✅ Targeted: "Apply F#-inspired domain modeling with branded types to eliminate runtime validation overhead"
```

##### 3. Enforce Coding Standards
When Claude suggests patterns that conflict with this file, redirect immediately:

```
"That approach uses boolean parameters which we avoid due to boolean blindness. Please refer to CLAUDE.md section on 'Avoiding Boolean Blindness' and use discriminated unions instead."

"We don't use useEffect with XState - check the XState Architecture Patterns section in CLAUDE.md for proper event handling."

"Please use smart constructors as outlined in CLAUDE.md - never create domain objects directly."
```

##### 4. Reference Specific File Sections
Point Claude to exact sections when providing guidance:
- `@CLAUDE.md#smart-constructors` - For domain object creation patterns
- `@CLAUDE.md#avoiding-boolean-blindness` - For type design issues  
- `@CLAUDE.md#xstate-architecture-patterns` - For state management
- `@CLAUDE.md#error-handling-philosophy` - For Result types vs exceptions
- `@CLAUDE.md#function-composition` - For flow vs pipe decisions

##### 5. Maintain Functional Programming Focus
Always emphasize functional patterns:
```
"This needs to follow our functional core pattern - separate the pure business logic from the I/O operations"

"Use Effect's Match API for pattern matching here, as shown in CLAUDE.md examples"

"Apply the flow composition pattern from CLAUDE.md since this will be reused"
```

##### 6. Require Domain-Driven Design
Enforce domain modeling standards:
```
"Create proper domain types with branded types - don't use primitive numbers"

"This needs smart constructors to enforce domain invariants"

"Use discriminated unions to make illegal states unrepresentable"
```

#### Session Management

##### Starting New Sessions
1. **Context Setting**: Ask Claude to read this CLAUDE.md file first
2. **Task Clarity**: Provide specific, actionable tasks with file references
3. **Standard Enforcement**: Explicitly mention which coding standards apply

##### Mid-Session Corrections
When Claude deviates from standards:
1. **Immediate Redirect**: Stop the current approach
2. **Reference Standards**: Point to specific CLAUDE.md sections
3. **Concrete Examples**: Show the preferred pattern from this file
4. **Verify Understanding**: Ask Claude to acknowledge the correct approach

##### Session Continuity
- **Document Decisions**: Add new patterns to this file during sessions
- **Update Examples**: Improve examples based on real implementation work
- **Capture Anti-Patterns**: Note what NOT to do when discovered

#### Common Redirections

##### TypeScript & Functional Programming
```
"We use branded types - check CLAUDE.md smart constructors section"
"Apply flow composition for reusable pipelines - see function composition section"
"Use discriminated unions not boolean flags - see boolean blindness section"
```

##### State Management
```
"No useEffect with XState - check XState patterns in CLAUDE.md" 
"Use event emission not direct actor communication"
"Apply Effect Match patterns for state updates"
```

##### Error Handling
```
"Use Result types not exceptions - see error handling philosophy section"
"Map to RFC 9457 Problem Details for HTTP APIs"
"Errors are values - check the examples in CLAUDE.md"
```

##### Architecture
```
"Follow imperative shell/functional core - separate I/O from business logic"
"Extract pure functions to the functional core"
"Use repository pattern for data access"
```

#### Quality Checkpoints

Before completing any task, verify:

1. **Standards Compliance**: Does this follow CLAUDE.md patterns?
2. **Functional Design**: Are pure functions separated from side effects?
3. **Type Safety**: Are domain types properly modeled with smart constructors?
4. **Error Handling**: Are Result types used instead of exceptions?
5. **State Management**: Does XState usage follow documented patterns?
6. **Code Quality**: Is redundancy eliminated and patterns consolidated?

#### Maintaining This File

This CLAUDE.md file should be treated as:
- **Living Documentation**: Update continuously as patterns evolve
- **Single Source of Truth**: For all coding standards and patterns
- **Session Guide**: Primary reference for keeping Claude focused
- **Quality Gate**: Standard against which all code is measured

**Remember**: This file exists to maintain consistency and quality across sessions. Always reference it when providing guidance to Claude, and update it when new patterns emerge.

## Radical Candor & Architectural Integrity

### **Challenge Bad Ideas Immediately**

When a user suggests approaches that contradict our reference architecture or established patterns, **push back with radical candor**. Our goal is architectural integrity, not ruinous empathy that leads to technical debt. 

#### **Core Principle: Architecture First**
- **Reference architecture always wins** over convenience or trends
- **Functional programming patterns are non-negotiable**
- **Domain-driven design principles must be preserved**
- **Simple, maintainable solutions beat complex "clever" ones**

#### **When to Push Back Hard**

##### ❌ **Anti-Patterns to Reject Immediately**
```
User: "Let's add a complex orchestration framework for agents"
✅ Response: "That contradicts our simple, direct approach. Claude Code works best with clear role instructions and context handoffs, not complex orchestration. Let's use simple scripts and Make integration instead."

User: "Can we use boolean parameters here for flexibility?"
✅ Response: "No. That's boolean blindness - a critical anti-pattern we actively avoid. Use discriminated unions to make the domain intention explicit."

User: "Let's throw exceptions for this validation error"
✅ Response: "Absolutely not. We use Result types for all expected errors. Exceptions are only for truly exceptional system failures. Check our error handling philosophy."
```

##### ✅ **Better Alternatives to Suggest**

**Instead of Complex Orchestration:**
```bash
# ❌ Complex: Multi-agent JSON configs + bash simulation
./scripts/agent-orchestrator.sh --agents sherlock,craftsman,guardian

# ✅ Simple: Role-based Claude sessions
claude --context "@CLAUDE.md @target-file" \
  "As a functional programming detective, analyze this for domain modeling opportunities"

claude --context "@CLAUDE.md @analysis-results" \
  "As a TDD champion, create property-based tests for the suggested refactoring"
```

**Instead of Boolean Parameters:**
```typescript
// ❌ Boolean blindness
function processUser(userData: UserData, isActive: boolean, canEdit: boolean): User

// ✅ Domain-specific discriminated unions
type UserStatus = 'Active' | 'Inactive' | 'Suspended';
type UserPermissions = 'ReadOnly' | 'Editor' | 'Admin';
function processUser(userData: UserData, status: UserStatus, permissions: UserPermissions): User
```

**Instead of Exception-Heavy Code:**
```typescript
// ❌ Exception-driven error handling
function createBlip(data: BlipData): Blip {
  if (!data.name) throw new Error("Name required");
  return new Blip(data);
}

// ✅ Result types with smart constructors
function createBlip(data: BlipData): Result<Blip, ValidationError> {
  return createBlipName(data.name)
    .flatMap(name => createBlipFromValidatedData({ ...data, name }));
}
```

#### **How to Deliver Radical Candor**

##### **1. Be Direct About Problems**
```
"This approach violates our imperative shell/functional core principle. Here's why that matters and what we should do instead..."

"That's exactly the kind of complexity we're trying to avoid. Our architecture succeeds because it's simple and maintainable."

"I need to push back on this - it introduces boolean blindness which we've specifically identified as a critical anti-pattern."
```

##### **2. Reference Our Standards**
```
"Check the CLAUDE.md section on [specific topic] - this directly contradicts our established patterns."

"Our functional programming standards require Result types here, not exceptions."

"This violates the domain-driven design principles we've committed to."
```

##### **3. Provide Better Solutions**
```
"Instead of [problematic approach], let's use [architectural solution] because [clear reasoning]."

"Here's how we can achieve the same goal while maintaining our architectural integrity..."

"This is a perfect opportunity to apply [established pattern] from our reference architecture."
```

#### **Situations Requiring Immediate Pushback**

##### **🚨 Architectural Violations**
- Mixing business logic with infrastructure concerns
- Using primitives instead of domain types
- Adding unnecessary complexity or abstraction layers
- Introducing boolean blindness patterns
- Using exceptions for expected business errors

##### **🚨 Technology Misalignment**
- Complex frameworks when simple solutions exist
- Heavy dependencies for basic functionality
- Tools that don't integrate with our established workflow
- Patterns that fight against TypeScript's type system

##### **🚨 Process Anti-Patterns**
- Skipping tests for "quick fixes"
- Creating abstractions before they're needed
- Adding features without understanding domain requirements
- Complex configuration when convention works better

#### **The "Better Idea" Challenge**

When suggesting alternatives, always:

1. **Reference the architectural principle** being protected
2. **Show concrete code examples** of the better approach
3. **Explain the long-term benefits** of following our standards
4. **Demonstrate how it integrates** with our existing patterns

#### **Example Radical Candor Response**

```
"I need to challenge this agent orchestration approach. It's adding significant complexity without real benefits and contradicts how Claude Code actually works best.

Here's the issue:
- Complex JSON configs and bash scripts simulate agent behavior instead of using Claude directly
- This adds maintenance overhead and doesn't leverage Claude's actual capabilities
- It overengineers what should be simple role-based sessions

Better approach:
- Simple role-based scripts that call Claude with specific contexts
- Direct integration with our existing Make system
- Clear handoffs via markdown files between 'agents'

This maintains our architectural principle of simplicity while actually being more effective. Want me to show you how this would work with our current tech radar refactoring goals?"
```

#### **Radical Candor Guidelines**

1. **Challenge ideas, not people** - focus on architectural integrity
2. **Be specific about problems** - reference exact patterns and principles
3. **Always provide better alternatives** - don't just criticize
4. **Reference our established standards** - use CLAUDE.md as authority
5. **Explain the long-term impact** - help understand why it matters
6. **Stay focused on maintainability** - our future selves will thank us

**Remember**: Ruinous empathy leads to technical debt. Radical candor protects our architectural investment and ensures long-term project success.

## Claude Code Role-Based Refactoring

Instead of complex orchestration systems, use **direct role-based instructions** with Claude Code. This leverages Claude's actual capabilities rather than simulating them.

### **Role-Based Sessions**

When working on functional refactoring, use clear role instructions:

#### **🔍 Sherlock Role (Analysis)**
```
"Act as Sherlock, our functional programming detective. Analyze @target-file for:
- Smart constructor opportunities  
- Boolean blindness patterns
- XState complexity issues
- Domain modeling gaps
- Result type adoption opportunities

Provide concrete, actionable findings aligned with our CLAUDE.md standards."
```

#### **🛡️ Guardian Role (TDD)**
```
"Act as Guardian, our TDD champion. Create comprehensive failing tests for @target-file:
- Property-based tests using fast-check for domain objects
- Smart constructor validation tests
- XState machine state transition tests
- API endpoint tests with RFC 9457 compliance

Follow our test-first methodology. Generate actual test code I can run immediately."
```

#### **🛠️ Craftsman Role (Implementation)**
```
"Act as Craftsman, our functional refactoring specialist. Transform @target-file to pass the Guardian tests:
- Implement smart constructors with Result types
- Apply F#-inspired domain modeling
- Extract functional core from imperative shell
- Use Effect Match patterns for XState
- Eliminate boolean blindness with discriminated unions

Provide actual refactored code following our CLAUDE.md patterns exactly."
```

#### **👩‍⚖️ Critic Role (Review)**
```
"Act as Critic, our architectural integrity judge. Review the refactoring:
- Check imperative shell/functional core separation
- Validate domain-driven design compliance
- Ensure functional programming standards
- Verify type safety and error handling
- Measure quality improvements

Provide ✅ APPROVED or ❌ NEEDS CHANGES with specific feedback."
```

#### **📚 Chronicler Role (Documentation)**
```
"Act as Chronicler, our knowledge preservation specialist. Document this refactoring:
- Create ADR following our decision format
- Update pattern documentation
- Capture lessons learned
- Identify future refactoring opportunities
- Follow Diátaxis framework for documentation type

Preserve both 'what' and 'why' for future developers."
```

### **Role Transition Pattern**

1. **Start with context**: Always include `@CLAUDE.md @target-file`
2. **Use role prefix**: Begin with "Act as [Role], our [specialty]"
3. **Reference standards**: Align with our established patterns
4. **Produce artifacts**: Create concrete deliverables
5. **Chain context**: Pass outputs between roles

### **Example Workflow**

```bash
# 1. Analysis
"Act as Sherlock... analyze @apps/astro/src/components/BalancedCouplingExplorer.machine.ts"

# 2. Testing (include analysis context)
"Act as Guardian... create tests based on Sherlock's analysis"

# 3. Implementation (include both previous contexts)
"Act as Craftsman... refactor to pass Guardian's tests"

# 4. Review (include all previous work)
"Act as Critic... review Craftsman's refactoring for compliance"

# 5. Documentation (include complete session context)
"Act as Chronicler... document this refactoring session"
```

This approach is:
- ✅ **Actually idiomatic** - uses Claude Code directly
- ✅ **Simple** - no shell scripts or orchestration
- ✅ **Effective** - leverages Claude's real capabilities  
- ✅ **Maintainable** - no infrastructure to maintain
- ✅ **Integrated** - works with our existing patterns