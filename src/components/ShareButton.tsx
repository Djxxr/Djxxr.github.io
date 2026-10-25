import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FiCheck, FiShare } from "react-icons/fi";

/** Na telefonie otwiera systemowe „Udostępnij”, na komputerze kopiuje link. */
export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <motion.button
      type="button"
      onClick={share}
      whileTap={{ scale: 0.9 }}
      data-cursor="link"
      aria-label="Udostępnij stronę"
      className="grid size-8 place-items-center rounded-full text-[var(--fg-muted)] transition-colors hover:bg-[var(--glass-edge)] hover:text-[var(--fg)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "ok" : "share"}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          {copied ? <FiCheck className="size-4 text-emerald-500" /> : <FiShare className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
