/**
 * Shared domain types for Triangle Reviewer.
 * These are the single source of truth — import from here, do not redefine.
 */

/**
 * Roles are assigned on the backend (in `lib/data.ts` until a real admin
 * surface exists): the Council is a chosen group of members whose scores form
 * their own component, and the Zealot is the single chosen member who hands
 * down a criteria-free verdict.
 */
export type TrianglerRole = "member" | "council" | "zealot";

/** A community member who submits and/or reviews triangles. */
export interface Triangler {
  id: string;
  handle: string;
  name: string;
  bio: string;
  role: TrianglerRole;
  /** Hue (0–360) used to render this user's deterministic avatar. */
  avatarHue: number;
  /** ISO date the user joined. */
  joined: string;
}

/** The three axes behind every 30-point score, each 0–10. */
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

export const AXIS_MAX = 10;
/** Uploader, community, and council components are each out of 30. */
export const COMPONENT_MAX = 30;
/** The Zealot's verdict is out of 10, absent of specific criteria. */
export const ZEALOT_MAX = 10;
/** Final score: uploader 30 + community 30 + council 30 + zealot 10. */
export const TOTAL_MAX = 100;

interface ReviewBase {
  id: string;
  triangleId: string;
  authorId: string;
  /**
   * The author's role at hydration time, joined in by the data layer so
   * scoring can bucket reviews without extra lookups.
   */
  authorRole?: TrianglerRole;
  comment: string;
  /** ISO datetime. */
  createdAt: string;
}

/** A standard review: three axes, 0–10 each, 30 points total. */
export interface AxesReview extends ReviewBase {
  kind: "axes";
  ratings: Ratings;
}

/** The Zealot's verdict: a single 0–10 number, no criteria. */
export interface ZealotReview extends ReviewBase {
  kind: "zealot";
  score: number;
}

export type Review = AxesReview | ZealotReview;

/** A single user-submitted triangle post. */
export interface Triangle {
  id: string;
  title: string;
  description: string;
  location: string;
  /** URL of the uploaded photo (served from /uploads/...). */
  imageUrl: string;
  authorId: string;
  /** ISO datetime. */
  createdAt: string;
  reviews: Review[];
}

/**
 * A triangle's aggregate score out of 100, built from four components.
 * A component is `null` until someone has scored it.
 */
export interface Score {
  /** Sum of the available components, 0–100. */
  total: number;
  /** The uploader's own score, out of 30. */
  uploader: number | null;
  /** Average of community members' scores, out of 30. */
  community: number | null;
  communityCount: number;
  /** Average of Council members' scores, out of 30. */
  council: number | null;
  councilCount: number;
  /** The Zealot's verdict, out of 10. */
  zealot: number | null;
  /** Total number of reviews of any kind. */
  count: number;
}

/** An entry in a user's home feed, with the reason it was included. */
export interface FeedItem {
  triangle: Triangle;
  reason: "following" | "top";
}
