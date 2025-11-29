import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface InteractiveImageRevealProps {
  externalImage: string;
  internalImage: string;
  containerHeight?: string; // e.g., "300vh"
}

export function InteractiveImageReveal({
  externalImage,
  internalImage,
  containerHeight = "300vh",
}: InteractiveImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress relative to this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Clip-path transition from 0% to 100% reveal
  // We start revealing from bottom to top (inset(0 0 100% 0) is fully clipped from bottom)
  // or we can do a simple opacity fade.
  // The user asked for "smooth transition from 0% revealed to 100% revealed"
  // A clip path "wiping" effect is very Mac Pro style. Let's try a vertical wipe.
  
  // inset(top right bottom left)
  // 100% bottom inset means the image is hidden (clipped away from bottom)
  // 0% bottom inset means the image is fully visible
  const clipPathVal = useTransform(
    scrollYProgress,
    [0.2, 0.8], // Start animating at 20% scroll, finish at 80%
    ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]
  );
  
  // Also fade in the internal image slightly for smoothness
  const opacityVal = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full"
      style={{ height: containerHeight }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-[400px] md:max-w-[500px] aspect-[3/5] flex items-center justify-center">
          
          {/* Base Image (External Device) - Stays visible */}
          <div className="absolute inset-0 z-10">
            <img 
              src={externalImage} 
              alt="External Device" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Overlay Image (Internal Components) - Clips in over the top */}
          <motion.div 
            className="absolute inset-0 z-20"
            style={{ 
              clipPath: clipPathVal,
              opacity: opacityVal
            }}
          >
            <img 
              src={internalImage} 
              alt="Internal Components" 
              className="w-full h-full object-contain"
            />
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
