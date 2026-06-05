import { Platform } from "../domain/creator";

const HANDLE_PLATFORMS: Platform[] = [
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "reddit",
  "reddit_community",
];

const HANDLE_HELP_TEXT: Record<Platform, string> = {
  instagram: "Enter the username only, e.g. stp.review. No @ or link needed.",
  tiktok: "Enter the username only, e.g. khaby.lame. No @ or link needed.",
  youtube: "Enter the channel handle only, e.g. mkbhd. No @ or link needed.",
  x: "Enter the username only. No @ or link needed.",
  reddit: "Enter the username only. No u/ or link needed.",
  reddit_community: "Enter the forum name only. No r/ or link needed.",
  other: "Paste the full profile URL.",
};

const HANDLE_PLACEHOLDERS: Record<Platform, string> = {
  instagram: "stp.review",
  tiktok: "khaby.lame",
  youtube: "mkbhd",
  x: "username",
  reddit: "username",
  reddit_community: "askreddit",
  other: "https://example.com/profile",
};

const RESERVED_PATHS: Partial<Record<Platform, string[]>> = {
  instagram: [
    "accounts",
    "direct",
    "explore",
    "p",
    "reel",
    "reels",
    "stories",
    "tv",
  ],
  x: [
    "compose",
    "explore",
    "home",
    "i",
    "intent",
    "messages",
    "notifications",
    "search",
    "settings",
    "share",
  ],
};

export function buildProfileUrl(platform: Platform, handle: string): string {
  const normalisedHandle = normaliseHandle(platform, handle);

  if (!normalisedHandle) {
    return "";
  }

  switch (platform) {
    case "instagram":
      return `https://www.instagram.com/${normalisedHandle}`;
    case "tiktok":
      return `https://www.tiktok.com/@${normalisedHandle}`;
    case "youtube":
      return `https://www.youtube.com/@${normalisedHandle}`;
    case "x":
      return `https://x.com/${normalisedHandle}`;
    case "reddit":
      return `https://www.reddit.com/user/${normalisedHandle}`;
    case "reddit_community":
      return `https://www.reddit.com/r/${normalisedHandle}`;
    case "other":
      return "";
  }
}

export function normaliseHandle(platform: Platform, value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const extractedHandle = extractHandleFromUrl(platform, trimmed);
  const candidate = extractedHandle || trimmed;

  return cleanHandle(platform, candidate);
}

export function formatHandle(platform: Platform, handle?: string): string {
  const clean = handle?.trim().replace(/^@+/, "");

  if (!clean) {
    return "";
  }

  if (platform === "reddit") {
    return `u/${clean.replace(/^u\//i, "")}`;
  }

  if (platform === "reddit_community") {
    return `r/${clean.replace(/^r\//i, "")}`;
  }

  return `@${clean}`;
}

export function getHandleHelperText(platform: Platform): string {
  return HANDLE_HELP_TEXT[platform];
}

export function getHandlePlaceholder(platform: Platform): string {
  return HANDLE_PLACEHOLDERS[platform];
}

export function isHandlePlatform(platform: Platform): boolean {
  return HANDLE_PLATFORMS.includes(platform);
}

export function cleanProfileUrlForDisplay(profileUrl: string): string {
  try {
    const url = new URL(addProtocolIfNeeded(profileUrl));
    const pathname = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${pathname || ""}`;
  } catch {
    return profileUrl.trim();
  }
}

function extractHandleFromUrl(platform: Platform, value: string): string {
  const url = parseUrl(value);

  if (!url) {
    return "";
  }

  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  const segments = url.pathname.split("/").filter(Boolean);
  const firstSegment = decodeURIComponent(segments[0] ?? "");
  const secondSegment = decodeURIComponent(segments[1] ?? "");

  if (
    platform === "instagram" &&
    host.endsWith("instagram.com") &&
    firstSegment &&
    !isReservedPath(platform, firstSegment)
  ) {
    return firstSegment;
  }

  if (
    platform === "tiktok" &&
    host.endsWith("tiktok.com") &&
    firstSegment.startsWith("@")
  ) {
    return firstSegment;
  }

  if (
    platform === "youtube" &&
    host.endsWith("youtube.com") &&
    firstSegment.startsWith("@")
  ) {
    return firstSegment;
  }

  if (
    platform === "x" &&
    (host.endsWith("x.com") || host.endsWith("twitter.com")) &&
    firstSegment &&
    !isReservedPath(platform, firstSegment)
  ) {
    return firstSegment;
  }

  if (
    platform === "reddit" &&
    host.endsWith("reddit.com") &&
    ["user", "u"].includes(firstSegment.toLowerCase()) &&
    secondSegment
  ) {
    return secondSegment;
  }

  if (
    platform === "reddit_community" &&
    host.endsWith("reddit.com") &&
    firstSegment.toLowerCase() === "r" &&
    secondSegment
  ) {
    return secondSegment;
  }

  return "";
}

function cleanHandle(platform: Platform, value: string): string {
  let handle = value.trim();

  if (platform === "reddit") {
    handle = handle.replace(/^\/?(user|u)\//i, "");
  }

  if (platform === "reddit_community") {
    handle = handle.replace(/^\/?r\//i, "");
  }

  handle = handle
    .replace(/^@+/, "")
    .replace(/^\/+/, "")
    .split(/[/?#\s]/)[0]
    .trim();

  return handle;
}

function parseUrl(value: string): URL | undefined {
  try {
    return new URL(addProtocolIfNeeded(value));
  } catch {
    return undefined;
  }
}

function addProtocolIfNeeded(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function isReservedPath(platform: Platform, path: string): boolean {
  return Boolean(
    RESERVED_PATHS[platform]?.includes(path.trim().toLowerCase()),
  );
}
