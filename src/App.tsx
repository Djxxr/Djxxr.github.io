import { lazy, Suspense } from "react";
import { motion } from "motion/react";
import { FiLock } from "react-icons/fi";
import { links, profile } from "./config";
import { useTheme } from "./lib/theme";
import { useFinePointer, useReducedMotion, useSmoothScroll } from "./lib/hooks";
import { fadeUp, stagger } from "./lib/motion";
import ProfileHeader from "./components/ProfileHeader";
import LinkCard from "./components/LinkCard";
import DiscordStatus from "./components/DiscordStatus";
import ThemeToggle from "./components/ThemeToggle";
import ShareButton from "./components/ShareButton";
import Cursor from "./components/Cursor";

// Three.js jest ciężkie – ładujemy je osobno, a do tego czasu widać statyczny gradient.
const ShaderBackground = lazy(() => import("./components/ShaderBackground"));

const hasWebGL = (() => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
})();

export default function App() {
  const { theme, toggle } = useTheme();
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const interactive = finePointer && !reduced;

  useSmoothScroll(!reduced);

  return (
    <>
      <div className="fallback-gradient fixed inset-0 z-0" aria-hidden />
      {hasWebGL && (
        <Suspense fallback={null}>
          <ShaderBackground theme={theme} still={reduced} />
        </Suspense>
      )}
      <div className="grain" aria-hidden />
      {interactive && <Cursor />}

      <main className="relative z-10 flex min-h-dvh items-start justify-center px-4 py-6 sm:items-center sm:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: "spring", stiffness: 120, damping: 22, mass: 1 }}
          className="glass-strong w-full max-w-[460px] overflow-hidden rounded-[32px]"
        >
          {/* Pasek okna w stylu Arc */}
          <div className="flex items-center gap-3 px-4 pt-3.5 pb-2">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="mx-auto flex items-center gap-1.5 rounded-full bg-[var(--glass-edge)] px-3 py-1 font-mono text-[11px] text-[var(--fg-muted)]">
              <FiLock className="size-3" />
              {profile.name}.github.io
            </div>
            <div className="flex items-center">
              <ShareButton />
              <ThemeToggle theme={theme} onToggle={toggle} />
            </div>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-3 px-5 pt-8 pb-6 sm:px-7"
          >
            <ProfileHeader reduced={reduced} />

            <div className="mt-6 flex flex-col gap-3">
              <DiscordStatus />
              {links.map((item) => (
                <LinkCard key={item.platform + item.label} item={item} interactive={interactive} />
              ))}
            </div>

            <motion.footer
              variants={fadeUp}
              className="mt-5 text-center text-[12px] text-[var(--fg-faint)]"
            >
              © {new Date().getFullYear()} {profile.name}
            </motion.footer>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
