import type { IconType } from "react-icons";
import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiKick,
  SiSpotify,
  SiSteam,
  SiTiktok,
  SiTwitch,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { FiGlobe } from "react-icons/fi";
import type { Platform } from "../config";

interface PlatformMeta {
  icon: IconType;
  /** Kolor marki – używany do poświaty i akcentów karty. */
  color: string;
}

export const platforms: Record<Platform, PlatformMeta> = {
  twitch: { icon: SiTwitch, color: "#9146ff" },
  youtube: { icon: SiYoutube, color: "#ff2d2d" },
  tiktok: { icon: SiTiktok, color: "#25f4ee" },
  instagram: { icon: SiInstagram, color: "#e1306c" },
  discord: { icon: SiDiscord, color: "#5865f2" },
  steam: { icon: SiSteam, color: "#66c0f4" },
  x: { icon: SiX, color: "#8b8b9a" },
  spotify: { icon: SiSpotify, color: "#1ed760" },
  github: { icon: SiGithub, color: "#8b8b9a" },
  kick: { icon: SiKick, color: "#53fc18" },
  website: { icon: FiGlobe, color: "#7c5cff" },
};
