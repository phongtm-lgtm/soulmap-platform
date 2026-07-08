/**
 * Minimal ambient background for the AI Chat page — warm ivory, an extremely
 * subtle radial gradient, faint paper texture and a few tiny floating
 * particles. Deliberately free of illustrations (no tree, mountains,
 * landscape) so it never competes with the conversation.
 */
export default function ChatBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[#F8F6F1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(200,161,90,0.05),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(36,83,62,0.04),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <span className="absolute left-[18%] top-[22%] h-1 w-1 rounded-full bg-[#C8A15A]/25 animate-float-slow" />
      <span className="absolute left-[68%] top-[14%] h-1.5 w-1.5 rounded-full bg-[#24533E]/12 animate-float" />
      <span className="absolute left-[82%] top-[62%] h-1 w-1 rounded-full bg-[#C8A15A]/20 animate-drift" />
      <span className="absolute left-[38%] top-[78%] h-1 w-1 rounded-full bg-[#24533E]/10 animate-float-slow" />
    </div>
  );
}
