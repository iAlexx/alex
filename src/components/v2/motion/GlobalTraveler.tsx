"use client";

/** Global spine traveler — one scrubbed progress point (Phase 7.4R). */
export function GlobalTraveler() {
  return (
    <div aria-hidden className="global-traveler" data-global-traveler>
      <span className="global-traveler__core" />
      <span className="global-traveler__glow" />
      <span className="global-traveler__trail" />
    </div>
  );
}
