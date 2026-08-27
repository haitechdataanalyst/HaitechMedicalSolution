// Barrel re-export — every consumer imports from "@/lib/api" (unchanged
// import path) while the implementation is split into one file per domain,
// mirroring the backend's controllers/services/repositories domain split.
// See [[feedback_architecture_policy]] Phase 6.
export * from "./core";
export * from "./user";
export * from "./orders";
export * from "./payments";
export * from "./cart";
export * from "./wishlist";
export * from "./reviews";
export * from "./shipments";
export * from "./notifications";
export * from "./coupons";
export * from "./dashboard";
export * from "./products";
export * from "./inventory";
