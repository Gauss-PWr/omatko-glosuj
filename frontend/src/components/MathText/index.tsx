import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import "./mathText.css";

interface MathTextProps {
  text: string;
}

const MathText = ({ text }: MathTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const inlineMathRegex = /\$([^\$]+)\$/g;
    const displayMathRegex = /\$\$([^\$]+)\$\$/g;

    let processedText = text;

    // Process display math first (to avoid conflicts with inline)
    processedText = processedText.replace(displayMathRegex, (match, math) => {
      try {
        return `<div class="math-display">${katex.renderToString(math.trim(), {
          displayMode: true,
          throwOnError: false,
        })}</div>`;
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        return match;
      }
    });

    // Process inline math
    processedText = processedText.replace(inlineMathRegex, (match, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false,
          throwOnError: false,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        return match;
      }
    });

    containerRef.current.innerHTML = processedText;
  }, [text]);

  return <div ref={containerRef} />;
};

export default MathText;
