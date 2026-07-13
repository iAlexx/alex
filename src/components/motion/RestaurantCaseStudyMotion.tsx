"use client";

import { useRef, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { MOTION_DISTANCE, MOTION_DURATION, MOTION_EASE, MOTION_MEDIA } from "./motion-config";

interface RestaurantCaseStudyMotionProps {
  locale: Locale;
  enabled: boolean;
  children: ReactNode;
}

/**
 * Scroll reveals for the Restaurant Platform case study only. Scoped to the article;
 * animates key moments — hero, facts, preview shell, lifecycle, modules, Arabic-first, CTA.
 */
export function RestaurantCaseStudyMotion({
  locale,
  enabled,
  children,
}: RestaurantCaseStudyMotionProps) {
  const articleRef = useRef<HTMLElement>(null);
  const isArabic = locale === "ar";
  const previewFromX = isArabic ? -MOTION_DISTANCE.previewX : MOTION_DISTANCE.previewX;

  useGSAP(
    () => {
      if (!enabled) {
        return;
      }

      const article = articleRef.current;
      if (!article) {
        return;
      }

      const hero = article.querySelector("[data-motion='project-hero']");
      const heroBlocks = hero ? gsap.utils.toArray<HTMLElement>("[data-motion-block]", hero) : [];
      const facts = article.querySelector("[data-motion='project-facts']");
      const previewShell = article.querySelector("[data-motion='preview-shell']");
      const keySections = gsap.utils.toArray<HTMLElement>("[data-motion='key-section']", article);
      const capabilities = article.querySelector("[data-motion='project-capabilities']");
      const capabilityItems = capabilities
        ? gsap.utils.toArray<HTMLElement>("li", capabilities)
        : [];
      const visitCta = article.querySelector("[data-motion='visit-cta']");

      const mm = gsap.matchMedia();
      mm.add(
        {
          reduced: MOTION_MEDIA.reduced,
          desktop: MOTION_MEDIA.desktop,
          mobile: MOTION_MEDIA.mobile,
        },
        (context) => {
          const { reduced, desktop, mobile } = context.conditions as {
            reduced: boolean;
            desktop: boolean;
            mobile: boolean;
          };

          const reveal = {
            immediateRender: false as const,
          };
          const y = desktop ? MOTION_DISTANCE.desktopY : MOTION_DISTANCE.mobileY;
          const duration = mobile ? MOTION_DURATION.revealMobile : MOTION_DURATION.reveal;

          if (reduced) {
            const targets = [hero, facts, previewShell, ...keySections, capabilities].filter(
              Boolean,
            );
            gsap.from(targets, {
              opacity: 0.9,
              duration: MOTION_DURATION.reduced,
              stagger: 0.05,
              ease: MOTION_EASE.soft,
              scrollTrigger: { trigger: article, start: "top 95%", once: true },
              ...reveal,
            });
            return;
          }

          if (heroBlocks.length > 0) {
            gsap.from(heroBlocks, {
              opacity: 0,
              y,
              stagger: 0.07,
              duration,
              ease: MOTION_EASE.reveal,
              scrollTrigger: { trigger: hero, start: "top 88%", once: true },
              ...reveal,
            });
          }

          if (facts) {
            gsap.from(facts, {
              opacity: 0,
              y: MOTION_DISTANCE.mobileY,
              duration,
              ease: MOTION_EASE.reveal,
              scrollTrigger: { trigger: facts, start: "top 90%", once: true },
              ...reveal,
            });
          }

          if (previewShell) {
            gsap.from(previewShell, {
              opacity: 0,
              x: desktop ? previewFromX : 0,
              y: desktop ? 0 : MOTION_DISTANCE.mobileY,
              scale: MOTION_DISTANCE.previewScaleFrom,
              duration: desktop ? 0.85 : duration,
              ease: MOTION_EASE.reveal,
              scrollTrigger: { trigger: previewShell, start: "top 88%", once: true },
              ...reveal,
            });
          }

          keySections.forEach((section) => {
            const heading = section.querySelector("h2");
            const blocks = gsap.utils.toArray<HTMLElement>("[data-motion-block]", section);

            if (heading) {
              gsap.from(heading, {
                opacity: 0,
                y: MOTION_DISTANCE.mobileY,
                duration: MOTION_DURATION.revealMobile,
                ease: MOTION_EASE.reveal,
                scrollTrigger: { trigger: section, start: "top 88%", once: true },
                ...reveal,
              });
            }

            if (blocks.length > 0) {
              gsap.from(blocks, {
                opacity: 0,
                y: 14,
                stagger: 0.06,
                duration: MOTION_DURATION.revealMobile,
                ease: MOTION_EASE.reveal,
                scrollTrigger: { trigger: section, start: "top 85%", once: true },
                ...reveal,
              });
            }
          });

          if (capabilityItems.length > 0) {
            gsap.from(capabilityItems, {
              opacity: 0,
              y: 12,
              stagger: mobile ? 0.04 : 0.06,
              duration: MOTION_DURATION.revealMobile,
              ease: MOTION_EASE.reveal,
              scrollTrigger: { trigger: capabilities, start: "top 88%", once: true },
              ...reveal,
            });
          }

          if (visitCta) {
            gsap.from(visitCta, {
              opacity: 0,
              y: MOTION_DISTANCE.mobileY,
              duration,
              ease: MOTION_EASE.reveal,
              scrollTrigger: { trigger: visitCta, start: "top 92%", once: true },
              ...reveal,
            });
          }
        },
      );

      return () => mm.revert();
    },
    { scope: articleRef, dependencies: [enabled, locale] },
  );

  useGSAP(
    () => {
      if (!enabled) {
        return;
      }

      const article = articleRef.current;
      if (!article) {
        return;
      }

      let debounce: ReturnType<typeof setTimeout> | null = null;
      const previewShell = article.querySelector("[data-motion='preview-shell']");
      if (!previewShell) {
        return;
      }

      const observer = new ResizeObserver(() => {
        if (debounce) {
          clearTimeout(debounce);
        }
        debounce = setTimeout(() => ScrollTrigger.refresh(), 300);
      });

      observer.observe(previewShell);
      return () => {
        observer.disconnect();
        if (debounce) {
          clearTimeout(debounce);
        }
      };
    },
    { scope: articleRef, dependencies: [enabled] },
  );

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <article ref={articleRef} className="min-w-0 overflow-x-hidden">
      {children}
    </article>
  );
}
