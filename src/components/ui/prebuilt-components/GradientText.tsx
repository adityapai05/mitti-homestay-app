import React, { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  showBorder = false,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  const gradientSpan = (
    <span
      className={`inline-block text-transparent bg-cover animate-gradient ${className}`}
      style={{
        ...gradientStyle,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundSize: "300% 100%",
      }}
    >
      {children}
    </span>
  );

  if (!showBorder) return gradientSpan;

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-[1.25rem] backdrop-blur overflow-hidden ${className}`}
    >
      <span
        className="absolute inset-0 bg-cover z-0 pointer-events-none animate-gradient"
        style={{
          ...gradientStyle,
          backgroundSize: "300% 100%",
        }}
      >
        <span
          className="absolute inset-0 bg-black rounded-[1.25rem] z-[-1]"
          style={{
            width: "calc(100% - 2px)",
            height: "calc(100% - 2px)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        ></span>
      </span>
      <span className="relative z-10">{gradientSpan}</span>
    </span>
  );
}
