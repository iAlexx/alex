interface CodexBuilderThresholdProps {
  originLabel: string;
}

export function CodexBuilderThreshold({ originLabel }: CodexBuilderThresholdProps) {
  return (
    <div className="codex-builder-threshold" aria-hidden="true">
      <svg viewBox="0 0 760 760" preserveAspectRatio="xMidYMid meet" focusable="false">
        <defs>
          <linearGradient id="threshold-front" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#303744" />
            <stop offset="0.24" stopColor="#141a24" />
            <stop offset="0.7" stopColor="#0a0e16" />
            <stop offset="1" stopColor="#202733" />
          </linearGradient>
          <linearGradient id="threshold-side" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#070a10" />
            <stop offset="0.55" stopColor="#171d28" />
            <stop offset="1" stopColor="#3b4350" />
          </linearGradient>
          <linearGradient id="threshold-bevel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#788393" stopOpacity="0.08" />
            <stop offset="0.5" stopColor="#dce3ed" stopOpacity="0.58" />
            <stop offset="1" stopColor="#5b6575" stopOpacity="0.04" />
          </linearGradient>
          <filter id="threshold-shadow" x="-25%" y="-25%" width="150%" height="160%">
            <feDropShadow
              dx="0"
              dy="20"
              stdDeviation="14"
              floodColor="#00040a"
              floodOpacity="0.72"
            />
          </filter>
        </defs>

        <g className="threshold-object" filter="url(#threshold-shadow)">
          <path
            className="threshold-recess"
            d="M527 102 689 136 689 625 602 674 602 206 527 188Z"
          />
          <path className="threshold-lintel-side" d="M198 112 527 102 602 132 276 145Z" />
          <path className="threshold-lintel-front" d="M198 112 527 102 527 188 222 202Z" />
          <path className="threshold-upright-side" d="M527 102 602 132 602 674 527 640Z" />
          <path className="threshold-upright-front" d="M462 178 527 188 527 640 462 615Z" />
          <path className="threshold-sill-side" d="M128 615 527 640 602 674 188 658Z" />
          <path className="threshold-sill-front" d="M128 568 462 584 527 640 128 615Z" />
          <path
            className="threshold-bevel threshold-bevel--lintel"
            d="M202 115 526 105 526 113 203 123Z"
          />
          <path
            className="threshold-bevel threshold-bevel--upright"
            d="M516 190 526 191 526 632 516 627Z"
          />
          <path
            className="threshold-bevel threshold-bevel--sill"
            d="M136 571 460 587 469 595 137 579Z"
          />

          <g className="threshold-seams">
            <path className="threshold-seam threshold-seam--brands" d="M228 136 312 132" />
            <path className="threshold-seam threshold-seam--systems" d="M330 130 414 126" />
            <path className="threshold-seam threshold-seam--intelligence" d="M482 236 482 326" />
            <path className="threshold-seam threshold-seam--security" d="M482 345 482 435" />
            <path className="threshold-seam threshold-seam--brands" d="M243 592 319 596" />
            <path className="threshold-seam threshold-seam--systems" d="M319 596 382 600" />
            <path className="threshold-seam threshold-seam--intelligence" d="M382 600 432 603" />
            <path className="threshold-seam threshold-seam--security" d="M432 603 476 606" />
          </g>

          <g className="threshold-junction">
            <path d="M466 596 488 607 478 627 455 616Z" />
            <path className="threshold-junction__inset" d="M467 603 480 609 474 620 461 614Z" />
            <path className="threshold-junction__line" d="M460 608 416 606" />
          </g>
        </g>
      </svg>
      <span className="codex-builder-threshold__label" dir="ltr">
        {originLabel}
      </span>
    </div>
  );
}
