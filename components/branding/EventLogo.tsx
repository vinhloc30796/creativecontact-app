import React, { useRef, useEffect, useState } from "react";

interface EventLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  eventSlug: string;
  eventTitle: string;
  className?: string;
}

const EventLogo = ({
  eventSlug,
  eventTitle,
  className,
  ...props
}: EventLogoProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(`/${eventSlug}-event-logo.svg`);
        const svgText = await response.text();
        if (divRef.current) {
          divRef.current.innerHTML = svgText;
          // Apply props to the loaded SVG
          const svgElement = divRef.current.firstElementChild as SVGElement;
          if (svgElement) {
            Object.entries(props).forEach(([key, value]) => {
              svgElement.setAttribute(key, String(value));
            });
            if (className) svgElement.setAttribute("class", className);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading SVG:", error);
        setLoading(false);
      }
    };

    loadSvg();
  }, [eventSlug, props, className]);

  if (loading) {
    return (
      <h2 className="text-center text-2xl font-bold text-primary animate-pulse" {...props}>
        {eventTitle}
      </h2>
    );
  }

  return <div ref={divRef} />;
};

export default EventLogo;