'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import { HeroPromptSection, CustomWorkspaceSection, UserPlansSection } from '@/components/home';

const SECTIONS = [
  { id: 'hero-section', title: 'AI Assistant' },
  { id: 'workspace-section', title: 'Custom Workspace' },
  { id: 'plans-section', title: 'Your Plan' },
];

export default function LandingPortalPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);

  const handleLaunchChat = (promptText?: string, modeOverride?: string) => {
    const text = (promptText || '').trim();
    const mode = modeOverride || 'default';

    if (mode === 'compare') {
      router.push(`/arena${text ? `?q=${encodeURIComponent(text)}` : ''}`);
      return;
    }
    if (mode === 'voice') {
      router.push(`/voice${text ? `?q=${encodeURIComponent(text)}` : ''}`);
      return;
    }

    const reasoningParam = mode === 'reasoning' ? '&reasoning=true' : '';

    if (text) {
      router.push(`/chat?q=${encodeURIComponent(text)}${reasoningParam}`);
    } else {
      router.push('/chat');
    }
  };

  const scrollToSection = useCallback((sectionId: string, index: number) => {
    setActiveSection(index);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Monitor which section is centered in viewport during continuous smooth scrolling
  useEffect(() => {
    const sectionIds = SECTIONS.map((s) => s.id);

    const updateActiveSectionOnScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.5;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // If scrolled to the bottom, activate last section
      if (window.scrollY + winHeight >= docHeight - 60) {
        setActiveSection(SECTIONS.length - 1);
        return;
      }

      // If at the very top, activate first section
      if (window.scrollY < 120) {
        setActiveSection(0);
        return;
      }

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(i);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', updateActiveSectionOnScroll, { passive: true });
    updateActiveSectionOnScroll();

    // IntersectionObserver focused around center of viewport
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id, index) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(index);
              }
            });
          },
          {
            root: null,
            rootMargin: '-30% 0px -30% 0px',
            threshold: 0.2,
          }
        );
        observer.observe(el);
        observers.push(observer);
      }
    });

    return () => {
      window.removeEventListener('scroll', updateActiveSectionOnScroll);
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div className="bg-black min-h-screen w-full max-w-full overflow-x-hidden text-white relative flex flex-col items-center selection:bg-white selection:text-black">
      {/* Background Matrix - Fluid full-bleed layer behind the notch and navigation */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden max-w-full opacity-60">
        <BackgroundRippleEffect rows={12} cols={24} cellSize={48} />
      </div>

      {/* Subtle Aurora Ambient Radial Lights */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden max-w-full"
      >
        <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/8 blur-[130px]" />
      </div>

      {/* Main Continuous Scrolling Container
          - All sections have uniform bounds, matching viewport scale, and symmetrical center alignment
          - Smooth springy settling animation when scrolling into center view ("حس جا خوردن")
      */}
      <div className="w-full max-w-full overflow-x-hidden flex flex-col items-center pt-12 sm:pt-16 pb-20 sm:pb-28 px-3 sm:px-6">
        
        {/* Section 1: AI Assistant & Prompt Section */}
        <section
          id="hero-section"
          className="w-full max-w-4xl min-h-[68vh] sm:min-h-[76vh] flex items-center justify-center py-6 sm:py-10 scroll-mt-24"
        >
          <motion.div
            animate={
              activeSection === 0
                ? { scale: 1, opacity: 1, y: 0 }
                : { scale: 0.94, opacity: 0.45, y: activeSection > 0 ? -24 : 24 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              mass: 0.75,
            }}
            className="w-full flex flex-col items-center justify-center"
          >
            <HeroPromptSection onLaunchChat={handleLaunchChat} />
          </motion.div>
        </section>

        {/* Section 2: Custom Workspace Section */}
        <section
          id="workspace-section"
          className="w-full max-w-4xl min-h-[68vh] sm:min-h-[76vh] flex items-center justify-center py-6 sm:py-10 scroll-mt-24"
        >
          <motion.div
            animate={
              activeSection === 1
                ? { scale: 1, opacity: 1, y: 0 }
                : { scale: 0.94, opacity: 0.45, y: activeSection > 1 ? -24 : 24 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              mass: 0.75,
            }}
            className="w-full flex flex-col items-center justify-center"
          >
            <CustomWorkspaceSection />
          </motion.div>
        </section>

        {/* Section 3: User Plans Section */}
        <section
          id="plans-section"
          className="w-full max-w-4xl min-h-[68vh] sm:min-h-[76vh] flex items-center justify-center py-6 sm:py-10 scroll-mt-24"
        >
          <motion.div
            animate={
              activeSection === 2
                ? { scale: 1, opacity: 1, y: 0 }
                : { scale: 0.94, opacity: 0.45, y: activeSection > 2 ? -24 : 24 }
            }
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              mass: 0.75,
            }}
            className="w-full flex flex-col items-center justify-center"
          >
            <UserPlansSection />
          </motion.div>
        </section>
      </div>

      {/* 3-Pill Vertical Jelly Indicator matching the uploaded reference graphic:
          - 3 vertical rounded capsules
          - Inactive pills: compact dark-grey capsules (14px)
          - Active pill: tall bright-white capsule (38px-40px) with soft bloom
          - Spring/jelly transition stretches and compresses smoothly between sections
      */}
      <aside
        aria-label="Section Indicator"
        className="fixed right-3.5 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center select-none pointer-events-auto"
      >
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          {SECTIONS.map((sec, idx) => {
            const isActive = activeSection === idx;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollToSection(sec.id, idx)}
                aria-label={`Scroll to ${sec.title}`}
                className="group relative flex items-center justify-center p-1.5 cursor-pointer focus:outline-none"
              >
                {/* Floating tooltip displaying section name on hover */}
                <span className="hidden sm:block absolute right-9 px-2.5 py-1 rounded-full bg-zinc-900/90 text-zinc-300 text-[11px] font-sans border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl backdrop-blur-md scale-95 group-hover:scale-100">
                  {sec.title}
                </span>

                {/* Animated Pill: Slender capsule matching reference image */}
                <motion.span
                  className="block rounded-full w-[6.5px] sm:w-[7.5px]"
                  animate={{
                    height: isActive ? 40 : 15,
                    backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.22)',
                    boxShadow: isActive
                      ? '0 0 16px rgba(255, 255, 255, 0.7)'
                      : '0 0 0px rgba(0, 0, 0, 0)',
                  }}
                  whileHover={
                    !isActive
                      ? { backgroundColor: 'rgba(255, 255, 255, 0.45)' }
                      : undefined
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 340,
                    damping: 22,
                    mass: 0.65,
                  }}
                />
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}



