import type { Locale } from "@/lib/i18n/config";
import { hintTextClass } from "@/lib/i18n/locale-classes";

export type MobileProcessStep = {
  number: string;
  title: string;
  description?: string;
};

type MobileProcessStepsProps = {
  locale: Locale;
  steps: MobileProcessStep[];
  className?: string;
};

/** Compact vertical numbered steps — mobile only (hidden lg+). */
export function MobileProcessSteps({ locale, steps, className = "" }: MobileProcessStepsProps) {
  const hintClass = hintTextClass(locale);

  return (
    <ol className={`mobile-process-steps lg:hidden ${className}`.trim()}>
      {steps.map((step) => (
        <li key={step.number + step.title} className="mobile-process-steps__item">
          <span className="mobile-process-steps__number" dir="ltr">
            {step.number}
          </span>
          <div className="mobile-process-steps__body">
            <p className="mobile-process-steps__title" dir="auto">
              {step.title}
            </p>
            {step.description ? (
              <p className={`mobile-process-steps__desc ${hintClass}`} dir="auto">
                {step.description}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
