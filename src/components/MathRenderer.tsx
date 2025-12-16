import React, { useRef, useEffect } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Basic regex to find $$...$$ or $...$ and render them
      // This is a simplified parser for the sake of the MVP
      const renderedContent = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
        try {
          return katex.renderToString(formula, { displayMode: true });
        } catch (e) {
          return match;
        }
      }).replace(/\$([\s\S]*?)\$/g, (match, formula) => {
        try {
          return katex.renderToString(formula, { displayMode: false });
        } catch (e) {
          return match;
        }
      });

      containerRef.current.innerHTML = renderedContent;
    }
  }, [content]);

  return <div ref={containerRef} className="prose max-w-none dark:prose-invert" />;
};
