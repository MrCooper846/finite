export function formatShortDate(value?: string): string {
  if (!value) {
    return "Never checked";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export function formatRelativeCheckDate(value?: string): string {
  if (!value) {
    return "Never checked";
  }

  const checkedDate = new Date(value);
  const today = startOfToday();
  const checkedDay = new Date(checkedDate);
  checkedDay.setHours(0, 0, 0, 0);

  const daysAgo = Math.floor(
    (today.getTime() - checkedDay.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysAgo <= 0) {
    return "Checked today";
  }

  if (daysAgo === 1) {
    return "Checked yesterday";
  }

  return `Checked ${daysAgo} days ago`;
}
