import { Fragment } from "react";
import type { WorkflowStageCopy } from "@/content/translations/types";
import {
  JourneyRail,
  JourneyRailNode,
  JourneyRailSegment,
  JourneyRailTrack,
} from "@/components/v2/journey-rail/JourneyRail";

interface SystemsWorkflowBandProps {
  title: string;
  note: string;
  stages: WorkflowStageCopy[];
}

/** Restaurant operational rail — five connected stages. */
export function SystemsWorkflowBand({ title, note, stages }: SystemsWorkflowBandProps) {
  return (
    <JourneyRail
      world="systems"
      layout="operational-horizontal"
      ariaLabel={title}
      className="mt-8 w-full"
      spineAnchor="workflow"
      dir="ltr"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--accent-system)]">{title}</h3>
        <p className="text-xs text-mist">{note}</p>
      </div>

      <JourneyRailTrack className="relative mt-8">
        <span aria-hidden className="order-token" data-order-token />
        {stages.map((stage, index) => (
          <Fragment key={stage.id}>
            <JourneyRailNode
              number={String(index + 1).padStart(2, "0")}
              title={stage.label}
              description={stage.hint}
              titleDir="auto"
              variant="operational"
            />
            {index < stages.length - 1 ? (
              <JourneyRailSegment orientation="horizontal" tone="branch" />
            ) : null}
          </Fragment>
        ))}
      </JourneyRailTrack>
    </JourneyRail>
  );
}
