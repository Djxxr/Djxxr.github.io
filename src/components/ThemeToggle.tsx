import { AnimatePresence, motion } from "motion/react";
import { FiMoon, FiSun } from "react-icons/fi";
import type { Theme } from "../lib/theme";

export default function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const dark = theme === "dark";
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      data-cursor="link"
      aria-label={dark ? "Włącz jasny motyw" : "Włącz ciemny motyw"}
      className="grid size-8 place-items-center overflow-hidden rounded-full text-[var(--fg-muted)] transition-colors hover:bg-[var(--glass-edge)] hover:text-[var(--fg)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {dark ? <FiMoon className="size-4" /> : <FiSun className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
