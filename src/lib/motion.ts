import type { Transition, Variants } from "motion/react";

/** Sprężyna w stylu iOS – szybka, miękka, bez „bujania”. */
export const iosSpring: Transition = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 };

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: iosSpring },
};
