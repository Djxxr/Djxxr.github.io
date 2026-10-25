import { useRef, type PointerEvent } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { FiArrowUpRight } from "react-icons/fi";
import type { LinkItem } from "../config";
import { platforms } from "../lib/platforms";
import { fadeUp } from "../lib/motion";

const tiltSpring = { stiffness: 220, damping: 22, mass: 0.6 };

export default function LinkCard({ item, interactive }: { item: LinkItem; interactive: boolean }) {
  const { icon: Icon, color } = platforms[item.platform];
  const ready = item.url.trim() !== "";
  const ref = useRef<HTMLAnchorElement>(null);

  // Pozycja kursora na karcie, 0..1
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), tiltSpring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), tiltSpring);
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 30 });

  const spotX = useTransform(px, (v) => `${v * 100}%`);
  const spotY = useTransform(py, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${spotX} ${spotY}, ${color}33, transparent 70%)`;

  const onMove = (e: PointerEvent) => {
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const onEnter = () => interactive && glowOpacity.set(1);
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
    glowOpacity.set(0);
  };

  return (
    <motion.div variants={fadeUp} style={{ perspective: 900 }}>
      <motion.a
        ref={ref}
        href={ready ? item.url : undefined}
        target={ready ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-disabled={!ready}
        data-cursor={ready ? "link" : undefined}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        whileTap={ready ? { scale: 0.96 } : undefined}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={interactive ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className={`glass group relative flex items-center gap-4 overflow-hidden rounded-[22px] p-3 pr-5 outline-none select-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
          ready ? "" : "opacity-60"
        }`}
      >
        {/* „Latarka” podążająca za kursorem */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: spotlight, opacity: glowOpacity }}
        />

        {/* Ikona platformy */}
        <span
          className="relative grid size-12 shrink-0 place-items-center rounded-[15px] text-white shadow-lg transition-transform duration-500 ease-[var(--ease-ios)] group-hover:scale-105"
          style={{
            background: `linear-gradient(145deg, ${color}, color-mix(in oklab, ${color} 70%, black))`,
            boxShadow: `0 8px 20px -6px ${color}88, inset 0 1px 0 rgb(255 255 255 / .35)`,
            transform: interactive ? "translateZ(30px)" : undefined,
          }}
        >
          <Icon className="size-[22px]" />
        </span>

        <span className="relative min-w-0 flex-1" style={{ transform: interactive ? "translateZ(20px)" : undefined }}>
          <span className="block text-[16px] leading-tight font-semibold tracking-[-0.01em]">{item.label}</span>
          <span className="mt-0.5 block truncate text-[13px] text-[var(--fg-muted)]">
            {item.handle || (ready ? item.url.replace(/^https?:\/\/(www\.)?/, "") : "Wkrótce")}
          </span>
        </span>

        <span
          className="relative grid size-8 shrink-0 place-items-center rounded-full bg-[var(--glass-edge)] text-[var(--fg-muted)] transition-all duration-500 ease-[var(--ease-ios)] group-hover:rotate-45 group-hover:bg-[var(--fg)] group-hover:text-[var(--bg)]"
          style={{ transform: interactive ? "translateZ(25px)" : undefined }}
        >
          {ready ? (
            <FiArrowUpRight className="size-4" />
          ) : (
            <span className="size-1.5 rounded-full bg-current" />
          )}
        </span>
      </motion.a>
    </motion.div>
  );
}
