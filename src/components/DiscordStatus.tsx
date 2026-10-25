import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SiDiscord, SiSpotify } from "react-icons/si";
import { discordUserId } from "../config";
import { fadeUp, iosSpring } from "../lib/motion";

type Status = "online" | "idle" | "dnd" | "offline";

interface Activity {
  name: string;
  type: number;
  details?: string;
  state?: string;
}

interface Presence {
  discord_status: Status;
  activities: Activity[];
  listening_to_spotify: boolean;
  spotify: { song: string; artist: string } | null;
}

const STATUS: Record<Status, { label: string; color: string }> = {
  online: { label: "Online", color: "#22c55e" },
  idle: { label: "Zaraz wracam", color: "#f59e0b" },
  dnd: { label: "Nie przeszkadzać", color: "#ef4444" },
  offline: { label: "Offline", color: "#94a3b8" },
};

/** Subskrypcja statusu przez WebSocket Lanyard, z automatycznym ponownym łączeniem. */
function useLanyard(userId: string) {
  const [presence, setPresence] = useState<Presence | null>(null);

  useEffect(() => {
    if (!userId) return;
    let ws: WebSocket;
    let heartbeat: number;
    let retry: number;
    let closed = false;

    const connect = () => {
      ws = new WebSocket("wss://api.lanyard.rest/socket");
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.op === 1) {
          heartbeat = window.setInterval(() => ws.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
          ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
        } else if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
          setPresence(msg.d);
        }
      };
      ws.onclose = () => {
        clearInterval(heartbeat);
        if (!closed) retry = window.setTimeout(connect, 3000);
      };
    };

    connect();
    return () => {
      closed = true;
      clearInterval(heartbeat);
      clearTimeout(retry);
      ws?.close();
    };
  }, [userId]);

  return presence;
}

export default function DiscordStatus() {
  const presence = useLanyard(discordUserId);
  if (!discordUserId) return null;

  const status = STATUS[presence?.discord_status ?? "offline"];
  const game = presence?.activities.find((a) => a.type === 0);
  const spotify = presence?.listening_to_spotify ? presence.spotify : null;

  let line: { icon: "game" | "spotify" | null; text: string } = { icon: null, text: status.label };
  if (game) line = { icon: "game", text: `Gra w ${game.name}` };
  else if (spotify) line = { icon: "spotify", text: `${spotify.song} — ${spotify.artist}` };

  return (
    <motion.div variants={fadeUp} className="glass flex items-center gap-3 rounded-[22px] px-4 py-3">
      <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-[#5865f2] text-white">
        <SiDiscord className="size-[18px]" />
        <span
          className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-[2.5px] border-[var(--bg)] transition-colors duration-500"
          style={{ background: status.color }}
        >
          {presence?.discord_status === "online" && (
            <span
              className="absolute inset-0 animate-ping rounded-full opacity-60"
              style={{ background: status.color }}
            />
          )}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-[0.08em] text-[var(--fg-faint)] uppercase">
          {presence ? "Teraz" : "Łączenie…"}
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={line.text}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={iosSpring}
            className="flex items-center gap-1.5 truncate text-[14px] font-medium"
          >
            {line.icon === "spotify" && <SiSpotify className="size-3.5 shrink-0 text-[#1ed760]" />}
            <span className="truncate">{line.text}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
