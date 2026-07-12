import type { Score, Triangle } from "@/lib/types";

/**
 * In-memory mock data + accessor helpers.
 *
 * This is the ONLY module that knows where data comes from. When a real
 * database lands, replace the internals here while keeping these helper
 * signatures stable — the rest of the app should not change.
 */

const triangles: Triangle[] = [
  {
    id: "1",
    title: "The Flatiron Gable",
    description:
      "A perfectly isosceles gable end spotted on a downtown warehouse. Crisp lines, great symmetry.",
    location: "Portland, OR",
    imageUrl: "https://placehold.co/800x600/f59e0b/ffffff?text=Triangle+%231",
    submittedBy: "acute_angie",
    reviews: [
      { id: "r1", author: "obtuse_owen", rating: 5, comment: "Textbook isosceles. Chef's kiss." },
      { id: "r2", author: "right_riya", rating: 4, comment: "Lovely, but the shadow crops the apex." },
    ],
  },
  {
    id: "2",
    title: "Yield Sign, Full Sun",
    description:
      "Classic downward-pointing road triangle. Bold red border, unbeatable contrast.",
    location: "Austin, TX",
    imageUrl: "https://placehold.co/800x600/b45309/ffffff?text=Triangle+%232",
    submittedBy: "right_riya",
    reviews: [
      { id: "r3", author: "acute_angie", rating: 5, comment: "An equilateral icon. Timeless." },
      { id: "r4", author: "scalene_sam", rating: 5, comment: "The GOAT of street triangles." },
      { id: "r5", author: "obtuse_owen", rating: 4, comment: "Slightly weathered but still sharp." },
    ],
  },
  {
    id: "3",
    title: "Mountain Silhouette at Dusk",
    description:
      "Nature's own triangle. Near-perfect slopes against a purple sky.",
    location: "Boulder, CO",
    imageUrl: "https://placehold.co/800x600/78350f/ffffff?text=Triangle+%233",
    submittedBy: "scalene_sam",
    reviews: [
      { id: "r6", author: "right_riya", rating: 3, comment: "Beautiful, but is a mountain really a triangle?" },
    ],
  },
  {
    id: "4",
    title: "The Grilled Cheese Diagonal",
    description:
      "A sandwich cut corner-to-corner. Debatable geometry, undeniable appeal.",
    location: "Chicago, IL",
    imageUrl: "https://placehold.co/800x600/d97706/ffffff?text=Triangle+%234",
    submittedBy: "obtuse_owen",
    reviews: [
      { id: "r7", author: "acute_angie", rating: 4, comment: "Edible triangles are underrated." },
      { id: "r8", author: "scalene_sam", rating: 2, comment: "The crust ruins the hypotenuse." },
    ],
  },
];

/** Compute a triangle's aggregate score from its reviews. */
export function scoreOf(triangle: Triangle): Score {
  const count = triangle.reviews.length;
  if (count === 0) return { average: 0, count: 0 };
  const total = triangle.reviews.reduce((sum, r) => sum + r.rating, 0);
  return { average: total / count, count };
}

/** All triangles, newest-submitted first (feed order). */
export function getTriangles(): Triangle[] {
  return triangles;
}

/** A single triangle by id, or undefined if not found. */
export function getTriangleById(id: string): Triangle | undefined {
  return triangles.find((t) => t.id === id);
}

/** The highest-scoring triangles, for the Top Triangles highlight. */
export function getTopTriangles(limit = 3): Triangle[] {
  return [...triangles]
    .sort((a, b) => scoreOf(b).average - scoreOf(a).average)
    .slice(0, limit);
}
