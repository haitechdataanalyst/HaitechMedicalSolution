# ActionsBlock Refactoring - Thought Process

## Problem

ActionsBlock violated Single Responsibility Principle by containing:
- Strauss-specific category detection and grit styling logic
- Inline specifications table rendering (duplicating SpecificationsTable)
- Three different variant selection UIs tightly coupled together
- Cart logic mixed with variant selection state

## Solution

### Component Decomposition

| Component | Responsibility |
|-----------|---------------|
| `VariantSelector` | Orchestrates which variant UI to render based on product type |
| `StraussGritSelector` | Strauss diamond grit badge UI only |
| `StraussProductBlock` | Combines grit selector + inline specs for Strauss products |
| `LegacyVariantSelector` | Salli colors and other legacy variant products |
| `InlineSpecificationsTable` | Compact specs table reusable anywhere |
| `ActionsBlock` | Cart actions and quote modal only |

### Why This Approach

**Extracted `variant-utils.ts`**
- Category detection (`isStraussGritProduct`, `isLegacyVariantProduct`) is pure logic
- Shared across components without prop drilling
- Easy to test in isolation

**VariantSelector as orchestrator**
- One component decides which selector renders
- ActionsBlock doesn't need to know product types
- New product types = new selector, no ActionsBlock changes

**StraussProductBlock composite**
- Keeps Strauss-specific specs+selector coupling intentional
- Single import for full Strauss experience
- Individual pieces still reusable

**InlineSpecificationsTable**
- Removed duplicate table rendering from ActionsBlock
- Compact variant separate from full SpecificationsTable block
- Clear naming shows intent

## Result

ActionsBlock: 362 → 123 lines  
Single responsibility: add to cart + quote modal  
New components fully reusable and testable
