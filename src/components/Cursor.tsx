import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** Miękki kursor-kulka, który powiększa się nad linkami i przyciskami. */
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const size = useMotionValue(14);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });
  const ss = useSpring(size, { stiffness: 400, damping: 28 });

  useEffect(() => {
    document.documentElement.classList.add("has-custom-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const overLink = (e.target as Element | null)?.closest("[data-cursor='link']");
      size.set(overLink ? 44 : 14);
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [x, y, size]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full bg-white mix-blend-difference"
      style={{ x: sx, y: sy, width: ss, height: ss, translateX: "-50%", translateY: "-50%" }}
    />
  );
}
