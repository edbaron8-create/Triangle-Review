/** Marks a Triangle Council member. Compact = just the ▲ glyph. */
export default function CouncilBadge({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span title="Triangle Council member" className="text-xs text-violet-600" aria-label="Triangle Council member">
        ▲
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
      <span aria-hidden>▲</span> Council
    </span>
  );
}
