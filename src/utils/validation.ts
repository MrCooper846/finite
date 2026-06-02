export type CreatorValidationInput = {
  displayName: string;
  profileUrl: string;
};

export type CreatorValidationResult = {
  errors: {
    displayName?: string;
    profileUrl?: string;
  };
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
  const normalisedProfileUrl = normaliseProfileUrl(input.profileUrl);

  if (!input.displayName.trim()) {
    errors.displayName = "Display name is required.";
  }

  if (!input.profileUrl.trim()) {
    errors.profileUrl = "Profile URL is required.";
  } else if (!isValidHttpUrl(normalisedProfileUrl)) {
    errors.profileUrl = "This URL does not look right.";
  }

  return {
    errors,
    normalisedProfileUrl,
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
