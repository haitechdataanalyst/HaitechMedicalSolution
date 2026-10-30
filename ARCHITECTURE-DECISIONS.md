# Architecture decisions: codebase-deepening pass (2026-10-30)

Applied the `codebase-design` approach (deep modules, small interfaces, locality). One branch per step, stacked,
each step one commit, so any step can be reverted alone with `git revert <sha>`.

| Step | Branch | Commit |
|------|--------|--------|
| 1. `specRows()` helper | `refactor/product-block-readers` | `d6ecf3d` |
| 2. dashboard repository | `refactor/dashboard-repository` | `98cb170` |
| 3. category-tree walker (+ product-seo `specRows`) | `refactor/catalog-modules` | see `git log` |

Undo everything: `git switch release/all-changes` and delete the three branches.

## Decisions made

1. **Merged the wrong thing first, then corrected.** First proposal was one `presentProduct()` over
   `product-presentation`, `-badges`, `-highlights`. Rejected after reading them: each serves a different caller
   (ProductDetail, TrustBadges, Flamingo page) and none is used together, so merging would widen the interface.
   Fixed the real duplication instead: the `rows ?? specs` legacy alias, copied in 8 places, now only in
   `lib/product-blocks.ts`.
2. **`lib/compare-group.ts` / `compare-group.resolve.ts` left split.** `CompareProvider` is a client component that
   imports only the pure rule; merging would bundle `categories.json` and the hubs into it. The split is real.
3. **Dashboard revenue not reconciled.** `dashboard` counts all active orders; `revenue.repository` counts paid
   orders only. Different definitions, pre-existing. Queries moved verbatim into `dashboard.repository.js`, so
   numbers are unchanged. Whether they should agree is a business call, left open.
4. **Dashboard service uses the project's `createXService` DI factory** (like `return.service.js`), with a fake-repo
   unit test. Public named exports unchanged, so the controller is untouched.
5. **`catalog.ts`: kept the public interface (18 importers) and did not split the file.** It is already deep
   (DB-first, JSON fallback, category reconciliation). Only the genuinely duplicated parent-chain walk was extracted
   (`lib/category-tree.ts`), tested against the old loop on every real category.
6. **Added a depth cap (20) to the category walk.** Old loops would hang on a parent cycle in bad data; valid data
   behaves identically. This is the one intentional behaviour change.
7. **Frames / Medesy not moved behind the product adapter.** That touches the Headlights ID mismatch (roadmap
   phase 5), a separate, riskier change.
8. **Tests:** frontend has no test runner, so the new test uses Node's built-in `node --test` with native type
   stripping (`node --test tests/category-tree.test.ts`), no new dependency. `tests/` excluded from `tsconfig.json`
   because the `.ts` import extension Node needs is not allowed by the app's tsc settings.
9. **User's uncommitted work was never committed or reverted.** Only files I changed were staged.

## Verification

- `tsc --noEmit` and eslint on touched files: clean after every step.
- `next build`: passes, all routes generated (after step 3).
- Backend: 85 tests, 14 fail; the same 14 fail on the base branch (health/admin HTTP tests need a live server, DB
  and Redis). The 3 new dashboard tests pass.
- Not run: `scripts/seo-audit.mjs` (needs a running server); no browser check.

## Open / not done

- Revenue definition mismatch (decision 3).
- Phase 5 headlights/frames ID handling (decision 7).
- `payment.service.js` still bypasses the repository layer (known, documented in the roadmap).
