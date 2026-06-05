import { Platform } from "../domain/creator";
import {
  buildProfileUrl,
  isHandlePlatform,
  normaliseHandle,
} from "./profileLinks";

export type CreatorValidationInput = {
  displayName: string;
  platform: Platform;
  handle: string;
  profileUrl: string;
};

export type CreatorValidationResult = {
  errors: {
    displayName?: string;
    handle?: string;
    profileUrl?: string;
  };
  normalisedHandle?: string;
  normalisedProfileUrl?: string;
};

export function normaliseProfileUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function validateCreatorInput(
  input: CreatorValidationInput,
): CreatorValidationResult {
  const errors: CreatorValidationResult["errors"] = {};
  const supportsHandle = isHandlePlatform(input.platform);
  const normalisedHandle = normaliseHandle(input.platform, input.handle);
  const normalisedProfileUrl = normaliseProfileUrl(input.profileUrl);
  const generatedProfileUrl = buildProfileUrl(input.platform, normalisedHandle);

  if (!input.displayName.trim()) {
    errors.displayName = "Display name is required.";
  }

  if (input.profileUrl.trim() && !isValidHttpUrl(normalisedProfileUrl)) {
    errors.profileUrl = "This URL does not look right.";
  }

  if (supportsHandle && !normalisedProfileUrl && !generatedProfileUrl) {
    errors.handle = "Handle is required unless you add a custom profile URL.";
  }

  if (!supportsHandle && !normalisedProfileUrl) {
    errors.profileUrl = "Profile URL is required.";
  }

  return {
    errors,
    normalisedHandle: supportsHandle && normalisedHandle
      ? normalisedHandle
      : undefined,
    normalisedProfileUrl: normalisedProfileUrl || generatedProfileUrl,
  };
}

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
