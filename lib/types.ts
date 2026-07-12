/**
 * Shared domain types for Triangle Reviewer.
 * These are the single source of truth — import from here, do not redefine.
 */

/** A community member who submits and/or reviews triangles. */
export interface Triangler {
  id: string;
  handle: string;
  name: string;
  bio: string;
  /** Members of the Triangle Council carry extra weight when rating. */
  isCouncil: boolean;
  /** Ids of Trianglers this user follows. */
  following: string[];
  /** Hue (0–360) used to render this user's deterministic avatar. */
  avatarHue: number;
  /** ISO date the user joined. */
  joined: string;
}

/** The three axes every triangle is rated on, each 0–10. */
export interface Ratings {
  aesthetic: number;
  tacticality: number;
  triangularity: number;
}

export const RATING_AXES = [
  { key: "aesthetic", label: "Aesthetic Quality", short: "Aesthetic" },
  { key: "tacticality", label: "Tacticality", short: "Tactical" },
  { key: "triangularity", label: "Triangularity", short: "Triangular" },
] as const satisfies ReadonlyArray<{ key: keyof Ratings; label: string; short: string }>;

/** Max points per axis and for a full review. */
export const AXIS_MAX = 10;
export const TOTAL_MAX = 30;

/** A review left by a Triangler on a Triangle. */
export interface Review {
  id: string;
  triangleId: string;
  authorId: string;
  ratings: Ratings;
  comment: string;
  /** ISO datetime. */
  createdAt: string;
}

/** Scene identifiers for the mock SVG "photos" (real uploads land later). */
export type TriangleScene =
  | "mountain"
  | "sign"
  | "roof"
  | "sandwich"
  | "pyramid"
  | "sail"
  | "pizza"
  | "tent"
  | "chip"
  | "stairs";

/** Mock photo spec, rendered as an inline SVG until real uploads exist. */
export interface TriangleImageSpec {
  scene: TriangleScene;
  /** Gradient background stops. */
  from: string;
  to: string;
  /** Primary color of the triangle subject. */
  accent: string;
}

/** A single user-submitted triangle post. */
export interface Triangle {
  id: string;
  title: string;
  description: string;
  location: string;
  image: TriangleImageSpec;
  authorId: string;
  /** ISO datetime. */
  createdAt: string;
  reviews: Review[];
}

/** Weighted per-axis averages, each 0–10. */
export type AxisScores = Ratings;

/** Aggregate rating for a triangle, derived from its reviews. */
export interface Score {
  /** Weighted total out of 30. */
  total: number;
  /** Weighted average per axis, each out of 10. */
  axes: AxisScores;
  /** Number of reviews. */
  count: number;
  /** How many of those reviews came from Triangle Council members. */
  councilCount: number;
}

/** An entry in a user's home feed, with the reason it was included. */
export interface FeedItem {
  triangle: Triangle;
  reason: "following" | "top";
}
