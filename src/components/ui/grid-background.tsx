import type { ComponentProps } from "react";

export function GridBackground(props: ComponentProps<"div">) {
  // thickness of lines in px
  const lineThickness = 2;

  // spacing between minor lines in px
  const minorSize = 18;

  // how many minor lines before a major line
  const majorMultiplier = 20;
  // spacing between major lines in px
  const majorSize = minorSize * majorMultiplier;

  const minorColor = "oklch(92.9% 0.013 255.508 / 0.5)";
  const majorColor = "oklch(86.9% 0.022 252.894 / 0.5)";

  return (
    <div
      {...props}
      className="absolute bg-slate-50 inset-0"
      style={{
        backgroundImage: `
          /* minor horizontal */
          repeating-linear-gradient(
            to right,
            ${minorColor} 0,
            ${minorColor} ${lineThickness}px,
            transparent ${lineThickness}px,
            transparent ${minorSize}px
          ),
          /* minor vertical */
          repeating-linear-gradient(
            to bottom,
            ${minorColor} 0,
            ${minorColor} ${lineThickness}px,
            transparent ${lineThickness}px,
            transparent ${minorSize}px
          ),
          /* major horizontal */
          repeating-linear-gradient(
            to right,
            ${majorColor} 0,
            ${majorColor} ${lineThickness}px,
            transparent ${lineThickness}px,
            transparent ${majorSize}px
          ),
          /* major vertical */
          repeating-linear-gradient(
            to bottom,
            ${majorColor} 0,
            ${majorColor} ${lineThickness}px,
            transparent ${lineThickness}px,
            transparent ${majorSize}px
          )
        `,
        backgroundPosition: `
          ${minorSize / 2}px ${minorSize / 2}px, /* minor horizontal */
          ${minorSize / 2}px ${minorSize / 2}px, /* minor vertical */
          ${minorSize / 2}px ${minorSize / 2}px, /* major horizontal */
          ${minorSize / 2}px ${minorSize / 2}px  /* major vertical */
        `,
      }}
    />
  );
}
