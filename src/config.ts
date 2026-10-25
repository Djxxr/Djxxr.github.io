// ─────────────────────────────────────────────────────────────
//  Jedyny plik, który trzeba edytować, żeby zmienić treść strony.
//  Puste pole ("") = element się nie wyświetla albo pokazuje placeholder.
// ─────────────────────────────────────────────────────────────

export type Platform =
  | "twitch"
  | "youtube"
  | "tiktok"
  | "instagram"
  | "discord"
  | "steam"
  | "x"
  | "spotify"
  | "github"
  | "kick"
  | "website";

export interface LinkItem {
  platform: Platform;
  /** Nazwa wyświetlana na karcie, np. "Twitch". */
  label: string;
  /** Drugi wiersz, np. "@djxxr" albo "Streamy codziennie o 20:00". */
  handle: string;
  /** Pełny adres. Puste = karta pokazuje się jako „wkrótce”. */
  url: string;
}

export const profile = {
  name: "djxxr",
  /** Krótki opis pod nickiem. */
  bio: "",
  /** Ścieżka do avatara w folderze public/, np. "/avatar.jpg", albo pełny URL. Puste = inicjał. */
  avatar: "",
  /** Lokalizacja / dopisek pod bio, np. "Polska". */
  location: "",
};

/**
 * Status na żywo z Discorda (przez Lanyard).
 * 1. Dołącz do serwera: https://discord.gg/lanyard
 * 2. Wklej tutaj swoje Discord ID (Ustawienia → Zaawansowane → Tryb dewelopera,
 *    potem prawy klik na siebie → „Kopiuj ID użytkownika”).
 * Puste = karta statusu się nie wyświetla.
 */
export const discordUserId = "";

export const links: LinkItem[] = [
  { platform: "twitch", label: "Twitch", handle: "", url: "" },
  { platform: "youtube", label: "YouTube", handle: "", url: "" },
  { platform: "tiktok", label: "TikTok", handle: "", url: "" },
  { platform: "instagram", label: "Instagram", handle: "", url: "" },
  { platform: "discord", label: "Discord", handle: "", url: "" },
  { platform: "steam", label: "Steam", handle: "", url: "" },
];
