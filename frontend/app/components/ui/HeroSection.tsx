"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCTA: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  className,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });

      // Animate subtitle
      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      });

      // Animate CTAs
      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.6,
        ease: "power3.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      className={cn(
        "relative h-screen flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg-primary via-dark-bg-secondary to-dark-bg-tertiary" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-neon rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-electric rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          ref={titleRef}
          className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl mb-6"
        >
          <span className="text-white">{title}</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl text-dark-text-secondary mb-12 max-w-3xl mx-auto"
        >
          {subtitle}
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={() => (window.location.href = primaryCTA.href)}
          >
            {primaryCTA.label}
          </Button>

          {secondaryCTA && (
            <Button
              variant="accent"
              size="lg"
              onClick={() => (window.location.href = secondaryCTA.href)}
            >
              {secondaryCTA.label}
            </Button>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-dark-text-secondary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-neon rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
