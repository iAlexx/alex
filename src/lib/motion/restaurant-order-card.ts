/** Positions for the order card relative to the workflow track container. */
export interface OrderCardPositions {
  xs: number[];
  y: number;
}

/**
 * Measure stage-center X offsets and Y placement inside the workflow track.
 * Stage nodes live inside the workflow list — offsets are summed against the track.
 */
export function measureOrderCardPositions(
  track: HTMLElement,
  workflowList: HTMLElement,
  stageNodes: HTMLElement[],
  orderCard: HTMLElement,
): OrderCardPositions {
  const cardWidth = orderCard.offsetWidth;
  const cardHeight = orderCard.offsetHeight;
  const trackWidth = track.offsetWidth;
  const maxX = Math.max(0, trackWidth - cardWidth);
  const listOffsetX = workflowList.offsetLeft;

  const xs = stageNodes.map((node) => {
    const center = listOffsetX + node.offsetLeft + node.offsetWidth / 2;
    const x = center - cardWidth / 2;
    return Math.max(0, Math.min(x, maxX));
  });

  const y = Math.max(0, workflowList.offsetTop - cardHeight - 8);

  return { xs, y };
}
