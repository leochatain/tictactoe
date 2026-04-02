import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface Section {
  id: string;
  content: ReactNode;
}

interface ScrollytellingLayoutProps {
  sections: Section[];
  visualization: (sectionId: string, isActive: boolean) => ReactNode;
}

export function ScrollytellingLayout({
  sections,
  visualization,
}: ScrollytellingLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? '');
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (
              !bestEntry ||
              entry.intersectionRatio > bestEntry.intersectionRatio
            ) {
              bestEntry = entry;
            }
          }
        }
        if (bestEntry) {
          const id = bestEntry.target.getAttribute('data-section');
          if (id) setActiveSection(id);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const el of sectionRefs.current.values()) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto p-4">
      {/* Left panel — sticky visualization (hidden on mobile, shown on lg+) */}
      <div className="hidden lg:block w-1/2 shrink-0">
        <div className="sticky top-20 min-h-[70vh]">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`absolute inset-0 flex items-start justify-center transition-opacity duration-500 ${
                activeSection === section.id
                  ? 'opacity-100'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              {visualization(section.id, activeSection === section.id)}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — scrollable text */}
      <div className="lg:w-1/2 flex flex-col">
        {sections.map((section) => (
          <div
            key={section.id}
            data-section={section.id}
            ref={(el) => {
              if (el) sectionRefs.current.set(section.id, el);
              else sectionRefs.current.delete(section.id);
            }}
            className="min-h-[80vh] py-12"
          >
            {section.content}
            {/* Inline visualization on mobile */}
            <div className="lg:hidden mt-8">
              {visualization(section.id, true)}
            </div>
          </div>
        ))}
        {/* Extra space at the bottom so the last section can scroll into view */}
        <div className="hidden lg:block h-[30vh]" />
      </div>
    </div>
  );
}
