import type React from "react";
import Image from "next/image";
import type { HeroSectionProps } from "@/types/auth";
import { Button } from "@/components/common/Button";

const Hero: React.FC<HeroSectionProps> = ({
  title,
  description,
  imageUrl,
  alt,
}) => {
  return (
    /* Content */
    <div className="flex w-full flex-col justify-start rounded bg-gradient-to-b from-[#F9FAFB] to-[#EDF0F3] align-middle shadow-[0_1px_2px_rgba(0,0,0,0.05)] md:rounded-md md:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] lg:py-[9px] lg:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] relative overflow-hidden min-h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Section Hero */}
      <section className="flex h-fit w-full flex-col py-[104px] md:py-[91px] lg:py-0 relative z-10">
        {/* Wrapper */}
        <div className="mx-auto flex h-fit w-full max-w-[1440px] flex-col items-center justify-center gap-12 px-3 md:gap-8 md:px-4 lg:flex-row lg:p-24">
          {/* Hero Message */}
          <div className="flex h-fit w-full flex-col justify-start gap-8 align-middle md:gap-16 lg:max-w-[488px]">
            {/* Text Content - Right above buttons */}
            <div className="flex h-fit w-full flex-col gap-4 md:gap-6">
              {/* TITLE - This should be visible */}
              <h1
                className="h-fit w-full text-4xl font-bold text-white md:text-5xl lg:text-6xl"
                style={{
                  textShadow:
                    "2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 8px rgba(0, 0, 0, 0.6)",
                }}
              >
                {title || "Turn your exams into success stories."}
              </h1>
              {/* DESCRIPTION - Fixed color to white */}
              <p
                className="text-lg font-normal text-white/90 md:text-xl"
                style={{
                  textShadow:
                    "1px 1px 2px rgba(0, 0, 0, 0.8), 0 0 4px rgba(0, 0, 0, 0.6)",
                }}
              >
                {description ||
                  "AI-powered assessment platform for students, helping you prepare, test and succeed."}
              </p>
            </div>
            <div className="flex w-full max-w-[458px] gap-4 md:gap-8 lg:max-w-[383px]">
              <Button variant="secondary" fullWidth className="flex-1">
                Sign up &#39;— it&#39;s free
              </Button>
              <Button variant="primary" fullWidth className="flex-1">
                Learn More
              </Button>
            </div>
          </div>

          {/* Spacer to maintain layout balance */}
          <div className="relative h-[264px] w-[319px] md:h-[526px] md:w-[704px] lg:w-[696px] opacity-0">
            {/* This invisible div maintains the original layout spacing */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
