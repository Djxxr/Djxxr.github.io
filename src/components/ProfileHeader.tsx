import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { FiMapPin } from "react-icons/fi";
import { profile } from "../config";
import { fadeUp } from "../lib/motion";

gsap.registerPlugin(SplitText, useGSAP);

export default function ProfileHeader({ reduced }: { reduced: boolean }) {
  const nameRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (reduced || !nameRef.current) return;
      const split = SplitText.create(nameRef.current, { type: "chars" });
      gsap.from(split.chars, {
        opacity: 0,
        filter: "blur(12px)",
        yPercent: 40,
        scale: 0.8,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.045,
        delay: 0.25,
      });
      return () => split.revert();
    },
    { dependencies: [reduced] },
  );

  return (
    <header className="flex flex-col items-center text-center">
      <motion.div variants={fadeUp} className="relative mb-6">
        <Avatar />
      </motion.div>

      <h1
        ref={nameRef}
        className="text-[2.6rem] leading-none font-semibold tracking-[-0.04em] sm:text-5xl"
      >
        {profile.name}
      </h1>

      <motion.p
        variants={fadeUp}
        className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-balance text-[var(--fg-muted)]"
      >
        {profile.bio || "Tu pojawi się krótki opis — uzupełnij go w pliku config.ts."}
      </motion.p>

      {profile.location && (
        <motion.p
          variants={fadeUp}
          className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-faint)]"
        >
          <FiMapPin className="size-3.5" />
          {profile.location}
        </motion.p>
      )}
    </header>
  );
}

function Avatar() {
  return (
    <div className="relative size-28 sm:size-32">
      {/* Obracająca się, rozmyta tęczowa poświata */}
      <div
        className="absolute -inset-3 rounded-full opacity-70 blur-xl"
        style={{
          background: "conic-gradient(from 0deg, #a78bfa, #f0abfc, #7dd3fc, #a7f3d0, #a78bfa)",
          animation: "spin-slow 8s linear infinite",
        }}
      />
      {/* Ostra obwódka */}
      <div
        className="absolute -inset-[3px] rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #a78bfa, #f0abfc, #7dd3fc, #a7f3d0, #a78bfa)",
          animation: "spin-slow 8s linear infinite",
        }}
      />
      <div className="relative size-full overflow-hidden rounded-full border-[3px] border-[var(--bg)] bg-[var(--bg)]">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="size-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="grid size-full place-items-center bg-gradient-to-br from-violet-300 via-fuchsia-200 to-sky-200 text-5xl font-semibold text-white dark:from-violet-600/80 dark:via-indigo-700/80 dark:to-sky-700/80">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
