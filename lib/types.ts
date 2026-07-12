/**
 * Shared domain types for Triangle Reviewer.
 * These are the single source of truth — import from here, do not redefine.
 */

/** A community member who submits and/or reviews triangles. */
export interface Triangler {
  id: string;
  handle: string;
}

/** A review left by a Triangler on a Triangle. */
export interface Review {
  id: string;
  author: string;
  /** 1–5 stars. */
  rating: number;
  comment: string;
}

/** A single user-submitted triangle post. */
export interface Triangle {
  id: string;
  title: string;
  description: string;
  location: string;
  /** Photo URL. Currently a placeholder; real uploads land later. */
  imageUrl: string;
  submittedBy: string;
  reviews: Review[];
}

/** Aggregate rating for a triangle, derived from its reviews. */
export interface Score {
  average: number;
  count: number;
}
